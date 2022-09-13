const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'guildCreate',
    
    async execute(guild, client) {

    guild.systemChannel.send({ content: "Hola im here and joined"})
    }
};