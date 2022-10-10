const { ActionRowBuilder, EmbedBuilder, SelectMenuBuilder, ComponentType, Client } = require('discord.js');
const { ApplicationCommandOptionType } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const moment = require("moment");
const config = require("../../config.json");
const emojis = require("../../api/emojis.json");
const tips = require("../../tips.json");
const { ms } = require("printly.js");
const wait = require('node:timers/promises').setTimeout; 
require('moment-duration-format');

module.exports = {
    name: "foundry",
    description: "SubCommand of Foundry",
    botPerm: [""],
    category: "Foundry",
    options: [{
      name: 'furnace',
      description: 'Melt your iron ore, copper ore and many more.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
        name: 'ore',
        description: 'What type of ore do you want to melt?',
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: 'Iron Ore', value: 'ironOre' }
        ],
      }, {
        name: 'quantity',
        description: 'How much do you want to melt?',
        type: ApplicationCommandOptionType.Number,
        required: false
      }],
    }, {
      name: 'forge',
      description: 'Process and clean your resources into brick.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
        name: 'nugget',
        description: 'Please choose your resources which can be convert into a brick.',
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: 'Iron Nugget', value: 'ironNugget' }
        ],
      }, {
        name: 'quantity',
        description: 'How much do you want to convert nuggets into brick???',
        type: ApplicationCommandOptionType.Number,
        required: false
      }],
    }],
    
    run: async (client, interaction) => {

  if (interaction.options.getSubcommand() === "furnace") {

    const quantity = interaction.options.getNumber('quantity') || '20';

    const { guild } = interaction;
    const user = interaction.member.user;
        
    const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

    if (interaction.options.get('ore').value === 'ironOre') {
      itemName = "Iron Ore";
      itemName2 = "Iron Nuggets";
      itemEmoji = config.emojis.ironOre;
      itemEmoji2 = config.emojis.ironNugget;
      choice = userData.resources.ironOres;
    }

    if (user && !userData.items.furnace) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
          .setTitle("Error: furnace required")
          .setColor(config.colours.error)
          .setDescription(`You don't have **Furnace** own,\nPlease buy a Furnace or craft a Furnace.`)
          .setTimestamp(),
        ],
      });
    }

    if (choice < quantity) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
          .setTitle("Not enough resources")
          .setColor(config.colours.error)
          .setDescription(`Sorry you dont have enough ${itemEmoji}**${itemName}** You only have **${choice}** ${itemEmoji}**${itemName}**`)
          .setTimestamp(),
        ],
      });
    }

    if (user && userData.items.furnace) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
          .setTitle("Melting...")
          .setColor(config.colours.work)
          .setDescription(`Please wait 30 seconds\nit's take time to be melt`)
          .setTimestamp(),
        ],
      });
      
      await wait(2000);
     
      let amount = quantity * 12;

      if (interaction.options.get('ore').value === 'ironOre') {
        userData.resources.ironOres -= quantity;
        userData.resources.ironNuggets += amount;
      }
        userData.save();
        
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
          .setTitle(`${itemName} Melted`)
          .setColor(config.colours.success)
          .setDescription(`${itemEmoji}**${itemName}** successfully melted it tooks 30 seconds\nHere is your **${amount}** ${itemEmoji2}**${itemName2}**`)
          .setTimestamp(),
        ],
      });
    }
  } else if (interaction.options.getSubcommand() === "forge") {
    
    const quantity = interaction.options.getNumber('quantity') || '20';

    const { guild } = interaction;
    const user = interaction.member.user;
        
    const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

    if (interaction.options.get('nugget').value === "ironNugget") {
      itemName = "Iron Nugget";
      itemEmoji = config.emojis.ironNugget;
      itemName2 = "Iron Brick";
      itemEmoji2 = config.emojis.ironBrick;
      choice = userData.resources.ironNuggets;
    }

    if (user && !userData.items.forge) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
          .setTitle("Error: forge required")
          .setColor(config.colours.error)
          .setDescription(`You don't have **Forge** own,\nPlease buy a Forge or craft a Forge.`)
          .setTimestamp(),
        ]
      });
    }

    if (choice < quantity) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
          .setTitle("Not enough resources")
          .setColor(config.colours.error)
          .setDescription(`Sorry you dont have enough ${itemEmoji}**${itemName}** You only have **${choice}** ${itemEmoji}**${itemName}**`)
          .setTimestamp(),
        ],
      });
    }

    if (user && userData.items.forge) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
          .setTitle("Processing...")
          .setColor(config.colours.work)
          .setDescription(`Oh yeah its doing you may have to wait longer\nAround **3-5** minutes because it will make the nuggets into brick`)
          .setTimestamp(),
        ],
      });

      await wait(ms('4m'));

      let amount = quantity * 8;

      if (interaction.options.get('nugget').value === 'ironNugget') {
        userData.resources.ironNuggets -= amount;
        userData.resources.ironBricks += quantity;
      }
        userData.save();

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
          .setTitle("Successfully Processed!")
          .setColor(config.colours.success)
          .setDescription(`Successfully processed and here is your **${quantity}** ${itemEmoji2}**${itemName2}**`)
          .setTimestamp(),
        ],
      });
        
    }
    
  }
      
    }
}