const Commando = require("discord.js-commando");

const redis = require("../../includes/redis.js");

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
    redis.delete(redis.getKeyFromMsg(msg, "auction"));
    redis.set(redis.getKeyFromMsg(msg, "active"), false);
    return msg.reply(`Auction ended.`);
  }
};
