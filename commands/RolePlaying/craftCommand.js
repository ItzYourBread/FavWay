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
      .setDescription(`**${userData.resources.stones}/100** ${config.emojis.stone}**Stone**.\n**${userData.resources.woods}/50** ${config.emojis.wood}**Wood**.\n**${userData.resources.ironOres}/2** ${config.emojis.ironOre}**Iron Ore**.`)
      .setTimestamp();

      let craftForge = new EmbedBuilder()
      .setTitle("Craft Forge")
      .setColor(config.colours.embed)
      .setDescription(`**${userData.resources.stones}/500** ${config.emojis.stone}**Stone**.\n**${userData.resources.ironOres}/50** ${config.emojis.ironOre}**Iron Ore**.\n**${userData.resources.ironNuggets}/100** ${config.emojis.ironNugget}**Iron Nugget**.`)
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
    

const collector = message.createMessageComponentCollector({ 
            filter: fn => fn,
            // componentType: ComponentType.SelectMenu, 
            time: 20000
        });

collector.on('collect', i => {
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
    }
});


client.on('interactionCreate', async (interaction, client) => {
	if (!interaction.isButton()) return;

  if (interaction.customId === 'furnaceButton') {

    if (user && userData.items.furnace) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
          .setTitle("You already have!")
          .setColor(config.colours.embed)
          .setDescription(`Looks like you already have **Furnace**,\nYou don't have to craft one more.`)
          .setTimestamp(),
        ],
        ephemeral: true
      });
    }

    if (userData.resources.stones < 100 || userData.resources.woods < 50 || userData.resources.ironOres < 2) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
          .setTitle("Craft Error")
          .setColor(config.colours.error)
          .setDescription(`Sorry you don't have enough resources to craft **Furnace**`)
          .setTimestamp(),
        ],
        ephemeral: true
      });
    }
    
    userData.items.furnace = true;
    userData.resources.stones -= 100;
    userData.resources.woods -= 50;
    userData.resources.ironOres -= 2;
    
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
        .setTitle("Crafted Furnace")
        .setColor(config.colours.success)
        .setDescription(`You successfully crafted **Furnace**.`)
        .setTimestamp(),
      ],
    });
  }

  if (interaction.customId === 'forgeButton') {
    await interaction.reply({ content: "Working fine"})
  }
  
});
    
    }
}