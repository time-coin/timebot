const Discord = require("discord.js");
const Commando = require("discord.js-commando");
const client = new Commando.Client({ owner: process.env.DISCORD_BOT_OWNER });
const token = process.env.DISCORD_API_KEY;
const path = require("path");

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
