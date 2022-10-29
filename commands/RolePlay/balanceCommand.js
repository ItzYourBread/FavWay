const { ActionRowBuilder, EmbedBuilder, SelectMenuBuilder, ComponentType, Client } = require('discord.js');
const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const fetch = require("node-fetch");
const config = require("../../config.json");
const tips = require('../../tips.json');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: "balance",
    description: "Check your balance",
    botPerm: [""],
    category: "RolePlay",
    options: [{
      name: 'user',
      description: 'please select a user which you want to see',
      type: Discord.ApplicationCommandOptionType.User,
      require: false,
    }],
    
    run: async (client, interaction) => {

        const { guild } = interaction;
        const user = interaction.options.getUser("user") || interaction.user;

        const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

        userData.commandRans += 1;
        userData.save();

        if (user && userData.coins >= 50000000) {
          status = "50 Millions OMG";
        } else if (user && userData.coins >= 30000000) {
          status = "30 Millions shit!";
        } else if (user && userData.coins >= 10000000) {
          status = "10 Millions noiceee..!";
        } else if (user && userData.coins >= 500000) {
          status = "Hmm kinda rich";
        } else if (user && userData.coins >= 100000) {
          status = "Good coins!"
        } else {
          status = "Ehh what a poor guy";
        }
        
        const balance = new EmbedBuilder()
        .setTitle(`${user.username}'s Balance`)
        .setDescription(`**Coin:** ${config.emojis.currency} ${userData.coins.toLocaleString()}\n**Gem:** ${config.emojis.gem} ${userData.gems.toLocaleString()}`)
        .setColor(config.colours.embed)
        .setFooter({ text: `${status}`})
        
        await interaction.reply({ embeds: [balance] });
        const logChannel = client.channels.cache.get(config.logs.roleplayLog)
        
        const logger = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Balance Command]** run by **${interaction.user.tag}**`)
            .addFields(
                { name: "Value:", value: `**Pocket:** ${userData.coins.toLocaleString()}\n**Bank:** ${userData.bank.toLocaleString()}\n\n` },
                { name: "Guild:", value: `${guild.name}` }
            )
            .setTimestamp();
        
        logChannel.send({ embeds: [logger] }); 
    }
};
