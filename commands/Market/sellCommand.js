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
    name: "sell",
    description: "SubCommand of Sell",
    botPerm: [""],
    category: "Work",
    options: [{
      name: 'resources',
      description: 'Sell your resources to market and get some coins',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
        name: 'resource',
        description: 'what type of resource do you like to sell?',
        type: Discord.ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: 'Wood', value: 'woods' },
          { name: 'Stone', value: 'stones' }
        ], 
      }, {
          name: 'amount',
          description: 'please enter your resources amount to sell it!',
          type: Discord.ApplicationCommandOptionType.Number,
          required: true,
      }],
    }],
    
    run: async (client, interaction) => {
      
      if (interaction.options.getSubcommand() === "resources") {
        
      const amount = interaction.options.getNumber('amount');
      const res = interaction.options.get('resource').value;

      const { guild } = interaction;
      const user = interaction.member.user;
        
      const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })
        
      let amount2 = amount * 5;

        if (userData.woods < amount)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription("You don't have enough resources to sell in market")
                .setColor(config.colours.error)
                .setTimestamp(),
            ],
          });
        
        userData.coins += amount2;
        userData.woods -= amount;
        userData.save();

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`You sold ${amount} ${res} and got ${amount2}CN`)
              .setColor(config.colours.success)
              .setTimestamp(),
          ],
        });
        
       }
    }
}