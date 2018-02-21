const Commando = require("discord.js-commando");

const redis_client = require("redis").createClient({
  host: process.env.REDIS_URL
});

const getRedisKey = function(msg) {
  return `${msg.message.channel.id}auctionactive`;
};


module.exports = class startAuction extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "startauction",
      aliases: [],
      group: "auction",
      memberName: "startauction",
      description: "This enables the auction.",
      details: "This enables the auction.",
    });
  }

  async run(msg, args) {
    redis_client.set(getRedisKey(msg), true);
    return msg.reply(`Auction started. Bids can be placed using !bid <amount>`);
  }
};
