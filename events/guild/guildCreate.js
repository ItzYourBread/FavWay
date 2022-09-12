const config = require("../../config.json");
const Discord = require("discord.js");

module.exports = {
    name: 'guildCreate',
    
    async execute(client, guild) {
        
    guild.systemChannel.send('Thanks for inviting me to your server <3');

    const logChannel = client.channels.cache.get(config.channelID.joinLog)
        
    const logger = new Discord.EmbedBuilder()
        .setColor(config.colours.logger)
        .setTitle(`Joined ${guild.name}`)
        .setDescription(`**Voatt** has been invited in ${guild.name}`)
        .setTimestamp();
        
        logChannel.send({ embeds: [logger] });
        
    }
};