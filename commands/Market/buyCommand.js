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
    name: "buy",
    description: "SubCommand of But",
    botPerm: [""],
    category: "RolePlay",
    options: [{
      name: 'resources',
      description: 'Buy resources from market which you needed!',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
        name: 'resource',
        description: 'what type of resource do you want to but?',
        type: Discord.ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: 'Wood', value: 'woods' },
          { name: 'Stone', value: 'stones' }
        ], 
      }, {
          name: 'quantity',
          description: 'please enter your resources quantity to sell it!',
          type: Discord.ApplicationCommandOptionType.Number,
          required: false,
      }],
    }],
    
    run: async (client, interaction) => {
      
      if (interaction.options.getSubcommand() === "resources") {

      const quantity = interaction.options.getNumber('quantity') || '20';
      const res = interaction.options.get('resource').value;

      const { guild } = interaction;
      const user = interaction.member.user;
        
      const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

        
      if (interaction.options.get('resource').value === "woods") {
        amount2 = quantity * 5;
      }
      if (interaction.options.get('resource').value === "stones") {
        amount2 = quantity * 7;
      }
        
        if (userData.coins < amount2)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(`Sorry you dont have enough money to buy **${res}**`)
                .setColor(config.colours.error)
                .setTimestamp(),
            ],
          });
        
        userData.coins -= amount2; 
        if (interaction.options.get('resource').value === "woods") {
        userData.resources.woods += quantity;
        }
        if (interaction.options.get('resource').value === "stones") {
        userData.resources.stones += quantity;
        }
        userData.save();

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`You bought ${quantity.toLocaleString()} **${res}**`)
              .setColor(config.colours.success)
              .setTimestamp(),
          ],
        });
      }
   }
}