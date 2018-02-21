const Discord = require("discord.js");
const Commando = require("discord.js-commando");
const client = new Commando.Client({ owner: process.env.DISCORD_BOT_OWNER });
const token = process.env.DISCORD_API_KEY;
const path = require("path");

var Rollbar = require("rollbar");
var rollbar = new Rollbar({process.env.ROLLBAR_ACCESS_TOKEN, captureUncaught: true, captureUnhandledRejections: true});

rollbar.log("Bot started");

client.registry
  // Registers your custom command groups
  .registerGroups([["math", "base", "Auction"]])

  // Registers all built-in groups, commands, and argument types
  .registerDefaults()

  // Registers all of your commands in the ./commands/ directory
  .registerCommandsIn(path.join(__dirname, "commands"));

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
  if (msg.content === "ping") {
    msg.reply("Pong!");
  }
});

client.login(token);

var port = process.env.PORT || 5000;

var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Hello World!');
  res.end();
}).listen(port);
