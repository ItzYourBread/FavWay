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
      name: `https://favway.cf`, 
      type: ActivityType.Playing }],
      status: 'online',
});
      // premium system
      const users = await User.find();
  for (let user of users) {
    client.userSettings.set(user.Id, user);
  }
        
  require('../../handlers/clientPremium.js')(client);
  require('../../handlers/achievements.js')(client);
                                             
    printly.timeout(colour.yellow(`\n[Discord API] Connecting...`), 
        4000);
        
    printly.timeout(colour.green(`[Discord API] Successfully connected to ${client.user.tag}`), 
        5000);
        
	},
};