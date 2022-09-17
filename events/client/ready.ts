const { GatewayIntentBits, ActivityType } = require("discord.js");
const { Client } = require("discord.js");
const User = require("../../database/premium/user");
const { printly, colour } = require("printly.js");

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
        
    printly.timeout(colour.yellow(`\n[Premium System] Loading...`), 
        2000);
        
    printly.timeout(colour.green(`[Premium System] Successfully Loaded`),
        3000);
        
        
    printly.timeout(colour.yellow(`\n[Discord API] Connecting...`), 
        4000);
        
    printly.timeout(colour.green(`[Discord API] Successfully connected to ${client.user.tag}`), 
        5000);
        
	},
};