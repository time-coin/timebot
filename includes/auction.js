const redis = require("./redis.js");

const defaultState= {amount: 0.3, bids: []};

const isAuctionActive = async msg => {
  let result = await redis.get(redis.getKeyFromMsg(msg, "active"));
  if (result === null || result === "false" || result === false) {
    return false;
  }
  return true;
};
const getState =  async msg => {
  return await redis.getObject(redis.getKeyFromMsg(msg, "auction"), this.defaultState);
};
const setState = async (msg, state) => {
  return await redis.setObject(redis.getKeyFromMsg(msg, "auction"), state);
};
const hasPermissionAdmin = msg => {
  return (
    msg.message.member._roles.indexOf(
      msg.message.guild.roles.find("name", "Auctioneer").id
    ) !== -1
  );
};
const hasPermissionBid = msg => {
  return (
    msg.message.member._roles.indexOf(
      msg.message.guild.roles.find("name", "Auction").id
    ) !== -1
  );
};
const isAuctionChannel = msg => {
  return msg.message.channel.name === "auction-bids";
};

const self = (module.exports = {
  defaultState: defaultState,
  isAuctionActive: isAuctionActive,
  getState: getState,
  setState: setState,
  hasPermissionAdmin: hasPermissionAdmin,
  hasPermissionBid: hasPermissionBid,
  isAuctionChannel: isAuctionChannel
});
