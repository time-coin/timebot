const Commando = require("discord.js-commando");

const redis_client = require("redis").createClient({
  host: process.env.REDIS_URL
});

const getRedisKey = function(msg) {
  return `${msg.message.channel.id}auction`;
};

const getRedisKeyActive = function(msg) {
  return `${msg.message.channel.id}auctionactive`;
};

module.exports = class cancelAuction extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "endauction",
      aliases: [],
      group: "auction",
      memberName: "endauction",
      description: "This cancels the current auction.",
      details: "This cancels the current auction."
    });
  }

  async run(msg, args) {
    redis_client.del(getRedisKey(msg));
    redis_client.set(getRedisKeyActive(msg), false);
    return msg.reply(`Auction ended.`);
  }
};
