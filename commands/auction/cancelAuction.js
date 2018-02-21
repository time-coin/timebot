const Commando = require("discord.js-commando");

const default_auction = { amount: 1, bids: [] };

const redis_client = require("redis").createClient({
  host: process.env.REDIS_URL
});

const getRedisKey = function(msg) {
  return `${msg.message.channel.id}auction`;
};


module.exports = class cancelAuction extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "cancelauction",
      aliases: [],
      group: "auction",
      memberName: "cancelauction",
      description: "This cancels the current auction.",
      details: "This cancels the current auction.",
    });
  }

  async run(msg, args) {
    redis_client.del(getRedisKey(msg));
    return msg.reply(`Auction cancelled.`);
  }
};
