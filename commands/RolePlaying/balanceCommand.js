const { ActionRowBuilder, EmbedBuilder, SelectMenuBuilder, ComponentType, Client } = require('discord.js');
const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const fetch = require("node-fetch");
const config = require("../../config.json");
const randoms = require("../../api/balanceText.json")
const tips = require('../../tips.json');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: "balance",
    description: "Check your balance",
    botPerm: [""],
    category: "RolePlay",
    
    run: async (client, interaction) => {

        const { guild } = interaction;
        const user = interaction.member.user
        
        const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id }) 
        
        let random = randoms.random[Math.floor((Math.random() * randoms.random.length))];
        
        const balance = new EmbedBuilder()
        .setTitle(`${user.username}'s Balance`)
        .setDescription(`**Pocket:** ${config.emojis.currency} ${userData.coins.toLocaleString()}\n**Bank:** ${config.emojis.currency} ${userData.bank.toLocaleString()}\n**Cents:** ${config.emojis.currencyCents} ${userData.cents.toLocaleString()}`)
        .setColor(config.colours.embed)
        .setFooter({ text: `${random}`})
        
        await interaction.reply({ embeds: [balance] });
        const logChannel = client.channels.cache.get(config.logs.roleplayLog)
        
        const logger = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Balance Command]** run by **${interaction.user.tag}**`)
            .addFields(
                { name: "Value:", value: `**Pocket:** ${userData.coins.toLocaleString()}\n**Bank:** ${userData.bank.toLocaleString()}\n**Cents:** ${userData.cents.toLocaleString()}\n\n` },
                { name: "Guild:", value: `${guild.name}` }
            )
            .setTimestamp();
        
        logChannel.send({ embeds: [logger] }); 
    }
};
