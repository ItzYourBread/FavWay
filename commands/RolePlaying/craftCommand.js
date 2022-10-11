const { ActionRowBuilder, EmbedBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle, ComponentType, Client } = require('discord.js');
const { ApplicationCommandOptionType } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const moment = require("moment");
const config = require("../../config.json");
const emojis = require("../../api/emojis.json");
const tips = require('../../tips.json');
const { ms } = require('printly.js');
const wait = require('node:timers/promises').setTimeout; 
require('moment-duration-format');

module.exports = {
    name: "craft",
    description: "Craft something by using your inventory resources.",
    botPerm: [""],
    category: "Work",
    
    run: async (client, interaction) => {

      const { guild } = interaction;
      const user = interaction.member.user;
        
      const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

      let craft = new EmbedBuilder()
      .setTitle("**--Welcome to Crafting Menu--**")
      .setColor(config.colours.embed)
      .setDescription(`Use select menu for crafting item which you wants.!`)
      .setTimestamp();

      let craftFurnace = new EmbedBuilder()
      .setTitle("Craft Furnace")
      .setColor(config.colours.embed)
      .setDescription(`Fuck Repices`)
      .setTimestamp();

      let craftForge = new EmbedBuilder()
      .setTitle("Craft Forge")
      .setColor(config.colours.embed)
      .setDescription(`Fuck Repices`)
      .setTimestamp();


      const selectMenu = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('craftMenu')
					.setPlaceholder('craft and save money...!!')
					.addOptions(
            {
              label: 'Furnace',
              description: 'Melt your ores into nuggets',
              value: 'furnace'
            },
            {
              label: 'Forge',
              description: 'Process and clean your metals into brick',
              value: 'forge'
            },
            {
              label: 'Go Back',
              description: 'Go to back to craft menu',
              value: 'menu'
            }
					),
			);

      const furnaceButton = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('furnaceButton')
					.setLabel('Craft')
					.setStyle(ButtonStyle.Success),
			);

      const forgeButton = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('forgeButton')
					.setLabel('Craft')
					.setStyle(ButtonStyle.Success),
			);

      let message = await interaction.reply({ embeds: [craft], components: [selectMenu], fetchReply: true });
    

const collectorMenu = message.createMessageComponentCollector({ 
            filter: fn => fn,
            componentType: ComponentType.SelectMenu, 
            time: 20000
        });

collectorMenu.on('collect', i => {
	if (i.user.id === interaction.user.id) 
		return i.reply({ content: `These menu aren't for you!`, ephemeral: true });
});
        
        
client.on('interactionCreate', async (interaction, client) => {
    if (!interaction.isSelectMenu()) return;
            
    switch (interaction.values[0]) {
        case "menu":  
           await interaction.update({ embeds: [craft], components: [selectMenu] })
            break;
        case "furnace":  
           await interaction.update({ embeds: [craftFurnace], components: [selectMenu, furnaceButton] })
            break;
        case "forge":  
           await interaction.update({ embeds: [craftForge], components: [selectMenu, forgeButton] })
            break;
    };                
});

      
const collectorButton = message.createMessageComponentCollector({ 
            filter: fn => fn,
            componentType: ComponentType.Button, 
            time: 20000
        });

collectorButton.on('collect', i => {
	if (i.user.id === interaction.user.id) 
		return i.reply({ content: `These menu aren't for you!`, ephemeral: true });
});
    }
}