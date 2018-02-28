const Commando = require("discord.js-commando");

const redis = require("../../includes/redis.js");

const auction = require("../../includes/auction.js");

module.exports = class startAuction extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "startauction",
      aliases: [],
      group: "auction",
      memberName: "startauction",
      description: "This enables the auction.",
      details: "This enables the auction."
    });
  }

  hasPermission(msg) {
    return auction.hasPermissionAdmin(msg);
  }

  async run(msg, args) {
    if (!auction.isAuctionChannel(msg)) {
      return false;
    }
    redis.set(redis.getKeyFromMsg(msg, "active"), true);
    return msg.reply(
      "Auction started. Bids can be placed using !bid <amount>. The starting bid is **" +
        auction.defaultState.amount.toFixed(2) +
        " BTC**. Please enter at least 0.01 more to bid."
    );
  }
};
