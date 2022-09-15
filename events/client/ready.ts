const { GatewayIntentBits, ActivityType } = require("discord.js");
const { Client } = require("discord.js");
const User = require("../../database/premium/user");
const { printly, colour, pms } = require("printly.js");

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
        printly(colour.yellow(`\n[Premium System] Loading...`))
    }, pms("0.3s"));
    setTimeout(async function() {
        printly(colour.green(`[Premium System] Successfully Loaded`))
    }, pms("0.6s"));
        
        
	setTimeout(async function() {
        printly(colour.yellow(`\n[Discord API] Connecting...`))
    }, pms("0.7s"));
    setTimeout(async function() {
        printly(colour.green(`[Discord API] Successfully connected to ${client.user.tag}`))
    }, pms("1.5s"));
        
	},
};