const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../config.json");
const { printly, c } = require("printly.js");

module.exports = {
    name: 'guildCreate',
    
    async execute(guild, client) {

        const joinEmbed = new EmbedBuilder()
         .setTitle("Thanks for Inviting me")
         .setDescription("Message")
         .setColor(config.colours.embed)

    guild.systemChannel.send({ embeds: [joinEmbed] })
    }
};