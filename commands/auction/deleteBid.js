const Commando = require("discord.js-commando");

const redis = require("../../includes/redis.js");

const auction = require("../../includes/auction.js");

module.exports = class deleteAuction extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "deletebid",
      aliases: ["deletebid", "delbid"],
      group: "auction",
      memberName: "deletebid",
      details:
        "This deletes the current high bid and resets to the previous high.",
      description:
        "This deletes the current high bid and resets to the previous high."
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
    let state = await auction.getState(msg);
    let old_high_bid = state.bids.pop();
    let new_last_bid = state.bids.pop();
    state.bids = [...state.bids, new_last_bid];
    state.amount = new_last_bid.amount;
    auction.setState(msg, state);
    return msg.reply(
      "The last high bid has been removed. The new high bid is ** " +
        new_last_bid.amount.toFixed(3) +
        " BTC**  by **" +
        new_last_bid.user +
        "**"
    );
  }
};
