const Commando = require("discord.js-commando");

const redis_client = require("redis").createClient({
  host: process.env.REDIS_URL
});

const getRedisKey = function(msg) {
  return `${msg.message.channel.id}auction`;
};

const getAuction = async function(msg) {
  let auction = new Promise((resolve, reject) => {
    redis_client.get(getRedisKey(msg), (error, result) => {
      console.log(typeof result);
      console.log(result);
      if (error) {
        reject(error);
      }
      if (result === null) {
        resolve({ amount: 1, bids: [] });
      }

      resolve(JSON.parse(result));
    });
  });
  return auction.catch(function(error) {
    console.log(error);
  });
};

const parseAmount = function(value) {
  return parseFloat(value.replace(/,/g, ".").replace(/[^0-9\.]/g, ""));
};

const validate = async function(value, msg, args) {
  const auction = await getAuction(msg);
  const minimum = (parseFloat(auction.amount) + 0.001);
  const new_bid = parseAmount(value);
  if (parseFloat(new_bid) >= parseFloat(minimum)) {
    return true;
  } else {
    return `Please enter an amount of ${minimum.toFixed(3)} BTC or more`;
  }
};

module.exports = class BidCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "bid",
      aliases: [],
      group: "auction",
      memberName: "bid",
      description: "Allows you to bid in the curent auction.",
      details: "This allows you to place bids on the current auction.",
      examples: ["!bid 1.1 BTC"],
      args: [
        {
          key: "amount",
          label: "amount",
          prompt: "Please enter your bid in BTC. for example: !bid 1.1 BTC",
          type: "string",
          infinite: false,
          validate: validate
        }
      ]
    });
  }

  async run(msg, args) {
    let amount = parseAmount(args.amount);
    let auction = await getAuction(msg);
    auction = {
      amount: amount,
      bids: [
        ...auction.bids,
        {
          user: `${msg.message.member.user.username}#${
            msg.message.member.user.discriminator
          }`,
          amount: amount
        }
      ]
    };
    redis_client.set(getRedisKey(msg), JSON.stringify(auction));
    return msg.reply("Current bid: **" + amount.toFixed(3) + " BTC**");
  }
};
