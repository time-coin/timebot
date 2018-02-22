const Commando = require("discord.js-commando");

const auction = require("../../includes/auction.js");

const parseAmount = function(value) {
  return parseFloat(value.replace(/,/g, ".").replace(/[^0-9\.]/g, ""));
};

const validate = async (value, msg, args) => {
  const state = await auction.getState(msg);
  const minimum = parseFloat(state.amount) + 0.001;
  const new_bid = parseAmount(value);
  if (parseFloat(new_bid) >= parseFloat(minimum)) {
    return true;
  } else {
    return `Please enter an amount of ${minimum.toFixed(3)} BTC or more`;
  }
};

module.exports = class bid extends Commando.Command {
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
    const isActive = await auction.isAuctionActive(msg);
    if (!isActive) {
      return msg.reply("There is currently no active auction.");
    } else {
      let amount = parseAmount(args.amount);
      let state = await auction.getState(msg);
      state = {
        amount: amount,
        bids: [
          ...state.bids,
          {
            user: `${msg.message.member.user.username}#${
              msg.message.member.user.discriminator
            }`,
            amount: amount
          }
        ]
      };
      await auction.setState(msg, state);
      return msg.reply("Current bid: **" + amount.toFixed(3) + " BTC**");
    }
  }
};
