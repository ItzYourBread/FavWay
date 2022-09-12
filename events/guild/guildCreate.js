const config = require("../../config.json");
const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'guildCreate',
    
    async execute(client, guild) {

    const joinMessage = new EmbedBuilder()
        .setTitle("Hello")
        .setDescription("hello two")
    
    guild.systemChannel.send({ embeds: [joinMessage] });
    }
};