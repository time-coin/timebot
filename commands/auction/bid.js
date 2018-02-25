const Commando = require("discord.js-commando");

const auction = require("../../includes/auction.js");

const parseAmount = function(value) {
  return parseFloat(value.replace(/,/g, ".").replace(/[^0-9\.]/g, ""));
};

module.exports = class bid extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "bid",
      aliases: [],
      group: "auction",
      memberName: "bid",
      description: "Allows you to bid in the curent auction.",
      details: "This allows you to place bids on the current auction.",
      examples: ["!bid 1.1 BTC"],
      args: [
        {
          key: "amount",
          label: "amount",
          prompt: "Please enter your bid in BTC. for example: !bid 1.1 BTC",
          type: "string",
          infinite: false
        }
      ]
    });
  }

  async run(msg, args) {
    let state = await auction.getState(msg);
    const minimum = parseFloat(state.amount) + 0.001;
    const new_bid = parseAmount(args.amount);
    let error = false;
    let error_message = "";
    const isActive = await auction.isAuctionActive(msg);
    if (!isActive) {
      msg.reply("There is currently no active auction.");
      error = true;
    }
    if (!error && !(parseFloat(new_bid) >= parseFloat(minimum))) {
      msg.reply(`Please enter an amount of ${minimum.toFixed(3)} BTC or more`);
      error = true;
    }
    if (!error && !auction.isAuctionChannel(msg)) {
      error_message = "Please contain all bids to the #auction-bids channel";
      error = true;
    }
   
    if (error) {
      if (error_message !== "") {
        msg.message.author.sendMessage(error_message);
        msg.message.delete();
      }
    } else {
      state = {
        amount: new_bid,
        bids: [
          ...state.bids,
          {
            user: `${msg.message.member.user.username}#${
              msg.message.member.user.discriminator
            }`,
            amount: new_bid
          }
        ]
      };
      await auction.setState(msg, state);
      return msg.reply("Current bid: **" + new_bid.toFixed(3) + " BTC**");
    }
  }

  hasPermission(msg) {
    return auction.hasPermissionBid(msg) || auction.hasPermissionAdmin(msg);
  }
};
