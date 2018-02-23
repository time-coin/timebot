const Commando = require("discord.js-commando");

const redis = require("../../includes/redis.js");

const auction = require("../../includes/auction.js");

module.exports = class cancelAuction extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "endauction",
      aliases: ['stopauction', 'cancelauction'],
      group: "auction",
      memberName: "endauction",
      description: "This cancels the current auction.",
      details: "This cancels the current auction."
    });
  }

  hasPermission(msg) {
    return auction.hasPermissionAdmin(msg);
  }

  async run(msg, args) {
    redis.delete(redis.getKeyFromMsg(msg, "auction"));
    redis.set(redis.getKeyFromMsg(msg, "active"), false);
    return msg.reply(`Auction ended.`);
  }

};
