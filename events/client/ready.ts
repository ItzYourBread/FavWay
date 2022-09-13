const { GatewayIntentBits, ActivityType } = require("discord.js");
const { Client } = require("discord.js");
const User = require("../../database/premium/user");
const chalk = require("chalk");
const ms = require("ms");

module.exports = {
	name: 'ready',
	once: true,
	async execute(client, message) {
        
      client.user.setPresence({
      activities: [{ 
      name: `https://voatt.cf`, 
      type: ActivityType.Playing }],
      status: 'online',
});
      // premium system
      const users = await User.find();
  for (let user of users) {
    client.userSettings.set(user.Id, user);
  }
        
  require('../../handlers/clientPremium.ts')(client)
    setTimeout(async function() {
        console.log(chalk.yellow(`\n[Premium System] Loading...`))
    }, ms("0.3s"));
    setTimeout(async function() {
        console.log(chalk.green(`[Premium System] Successfully Loaded`))
    }, ms("0.6s"));
        
        
	setTimeout(async function() {
        console.log(chalk.yellow(`\n[Discord API] Connecting...`))
    }, ms("0.7s"));
    setTimeout(async function() {
        console.log(chalk.green(`[Discord API] Successfully connected to ${client.user.tag}`))
    }, ms("1.5s"));
        
	},
};