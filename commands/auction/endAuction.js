const Commando = require("discord.js-commando");

const redis = require("../../includes/redis.js");

const auction = require("../../includes/auction.js");

module.exports = class cancelAuction extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "endauction",
      aliases: ["stopauction", "cancelauction"],
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
    if (!auction.isAuctionChannel(msg)) {
      return false;
    }
    const isActive = await auction.isAuctionActive(msg);
    if (!isActive) {
      msg.reply("There is currently no active auction.");
    } else {
      let state = auction.defaultState;
      try {
        state = await auction.getState(msg);
      } catch (error) {}
      auction.setState(msg, auction.defaultState);
      redis.set(redis.getKeyFromMsg(msg, "active"), false);
      if (!state.bids.length) {
        return msg.reply("Auction ended. There were no bids.");
      } else {
        let winner = state.bids.pop();
        return msg.reply(
          "Auction ended. The winner is **" +
            winner.user +
            "** at **" +
            winner.amount.toFixed(3) +
            " BTC**. Please remember that the TIME team will NOT private message you to collect your BTC. Please make sure you are talking to the right person before sending BTC"
        );
      }
    }
  }
};
