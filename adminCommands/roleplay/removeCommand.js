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
  name: 'remove',
  description: 'removing stuffs and coins from the profile',
  category: 'Admin',
  admin: true,
  options: [{
    name: 'type',
    description: 'what type of thing do you want to remove from the user?',
    type: Discord.ApplicationCommandOptionType.String,
    required: true,
    choices: [
      { name: 'Coin', value: 'coins' },
      { name: 'Cent', value: 'cents' },
      { name: 'Iron Brick', value: 'ironBrick' },
      { name: 'Iron Ore', value: 'ironOre' }
    ],
    }, {
      name: "amount",
      description: `how many?`,
      type: Discord.ApplicationCommandOptionType.Number,
      required: true,
    }, {
      name: "user",
      description: 'usersisj ssss',
      type: Discord.ApplicationCommandOptionType.User,
      required: false,
    },
  ],
    
    run: async (client, interaction, args) => {

      const { guild } = interaction;
        
      const amount = interaction.options.getNumber("amount");
      const user = interaction.options.getUser("user") || interaction.user;
      const choice = interaction.options.get("type").value;

      
      const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

      
        if (interaction.options.get('type').value === "coins") {
        userData.coins -= amount;
        }
        if (interaction.options.get('type').value === "cents") {
        userData.cents -= amount;
        }
        if (interaction.options.get('type').value === "ironOre") {
        userData.resources.ironOre -= amount;
        }
        if (interaction.options.get('type').value === "ironBrick") {
        userData.resources.ironBrick -= amount;
        }
        userData.save();

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`You removed ${amount.toLocaleString()} ${choice} from ${user}`)
              .setColor(config.colours.success)
              .setTimestamp(),
          ],
        });
    }
};