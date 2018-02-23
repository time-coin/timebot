const redis = require("./redis.js");

module.exports = {
  isAuctionActive: async msg => {
    let result = await redis.get(redis.getKeyFromMsg(msg, "active"));
    if (result === null || result === "false" || result === false) {
      return false;
    }
    return true;
  },
  getState: async msg => {
    return await redis.getObject(redis.getKeyFromMsg(msg, "auction"), {
      amount: 1,
      bids: []
    });
  },
  setState: async (msg, state) => {
    return await redis.setObject(redis.getKeyFromMsg(msg, "auction"), state);
  },
  hasPermissionAdmin: msg => {
    return (
      msg.message.member._roles.indexOf(
        msg.message.guild.roles.find("name", "Auctioneer").id
      ) !== -1
    );
  }
  },
  hasPermissionBid: msg => {
    return (
      msg.message.member._roles.indexOf(
        msg.message.guild.roles.find("name", "Auction").id
      ) !== -1
    );
  }
};
