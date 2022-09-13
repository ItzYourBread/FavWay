const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'guildCreate',
    
    async execute(guild, client) {

        const joinEmbed = new EmbedBuilder()
         .setTitle("Thanks for Inviting me")
         .setDescription("Message")

    guild.systemChannel.send({ embeds: [joinEmbed] })
    }
};