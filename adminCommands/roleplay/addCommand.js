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
  name: 'add',
  description: 'adding stuffs and coins to user profile',
  category: 'Admin',
  admin: true,
  options: [{
    name: 'type',
    description: 'what type of thing you want add to the user?',
    type: Discord.ApplicationCommandOptionType.String,
    required: true,
    choices: [
      { name: 'Coin', value: 'coins' },
      { name: 'Cent', value: 'cents' },
    ],
    }, {
      name: "amount",
      description: `amount of codes`,
      type: Discord.ApplicationCommandOptionType.Number,
      required: true,
    }, {
      name: "user",
      description: `userrfrrrrr`,
      type: Discord.ApplicationCommandOptionType.User,
      required: false,
    },
  ],
    
    run: async (client, interaction, args) => {

      const { guild, member } = interaction;
        
      const amount = interaction.options.getNumber("amount");
      const target = interaction.options.getUser("user") || member;
      const choice = interaction.options.get("type").value;

      
      const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

      
        if (interaction.options.get('type').value === "coins") {
        userData.coins += amount;
        }
        if (interaction.options.get('type').value === "cents") {
        userData.cents += amount;
        }
        userData.save();

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`You add ${amount.toLocaleString()} ${choice} to ${target}`)
              .setColor(config.colours.success)
              .setTimestamp(),
          ],
        });
    }
};