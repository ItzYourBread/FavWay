const { ActionRowBuilder, EmbedBuilder, SelectMenuBuilder, ComponentType, Client } = require('discord.js');
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
      .setTitle("Craft Menu")
      .setColor(config.colours.embed)
      .setDescription(`**---Welcome to Crafting Menu---**\nUse select menu for crafting item which you wants.!`)
      .setTimestamp();

      const row = new ActionRowBuilder()
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

      interaction.reply({ embeds: [craft], components: [row], fetchReply: true });
    }
}