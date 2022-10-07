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
    name: "buy",
    description: "SubCommand of Buy",
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
          { name: 'Stone', value: 'stones' },
          { name: 'Iron Ore', value: 'ironOre' }
        ], 
      }, {
          name: 'quantity',
          description: 'please enter your resources quantity to sell it!',
          type: Discord.ApplicationCommandOptionType.Number,
          required: false,
      }],
    }, {
      name: 'tools',
      description: 'Buy some tools to start your journey with Voatt!',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
        name: 'tool',
        description: 'what tool do you want to buy?',
        type: Discord.ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: 'Axe', value: 'axe' },
          { name: 'Pickaxe', value: 'pickaxe' }
        ],
      }], 
    }],
    
    run: async (client, interaction, args) => {
      
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
      if (interaction.options.get('resource').value === "ironOre") {
        amount2 = quantity * 15;
      }

        
      if (interaction.options.get('resource').value === "woods") {
        itemEmoji = config.emojis.wood;
        itemName = "Wood";
      }
      if (interaction.options.get('resource').value === "stones") {
        itemEmoji = config.emojis.stone;
        itemName = "Stone";
      }
      if (interaction.options.get('resource').value === "ironOre") {
        itemEmoji = config.emojis.ironOre;
        itemName = "Iron Ore";
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
        if (interaction.options.get('resource').value === "ironOre") {
          userData.resources.ironOres += quantity;
        }
        userData.save();

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`You bought **${quantity.toLocaleString()}** ${itemEmoji}**${itemName}** at: ${config.emojis.currency} **${amount2}**`)
              .setColor(config.colours.success)
              .setTimestamp(),
          ],
        });

        const logChannel = client.channels.cache.get(config.logs.buyLog)
        
        const logger = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Buy Resources SubCommand]** run by **${interaction.user.tag}**`)
            .addFields(
                {
                  name: "Value:", value: `bought **${quantity}** ${itemEmoji}**${itemName}**`
                },
                { name: "Guild:", value: `${guild.name}` }
            )
            .setTimestamp();
        
        logChannel.send({ embeds: [logger] });
      
    } else if (interaction.options.getSubcommand() === "tools") {
        
      const tools = interaction.options.get('tool').value;

      const { guild } = interaction;
      const user = interaction.member.user;
        
      const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

      if (interaction.options.get('tool').value === 'axe')
        price = 90;
      if (interaction.options.get('tool').value === 'pickaxe')
        price = 120;

        
        if (userData.coins < price)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(`Sorry you dont have enough money to buy **${tools}**`)
                .setColor(config.colours.error)
                .setTimestamp(),
            ],
          });
        

        if (interaction.options.get('tool').value === "axe") {
        userData.axe.stone = true;
        userData.coins -= 90;
        }
        if (interaction.options.get('tool').value === "pickaxe") {
        userData.pickaxe.stone = true;
        userData.coins -= 120;
        }
        userData.save();

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`You bought ${tools} and paid ${config.emojis.currency} **${price}**`)
              .setColor(config.colours.success)
              .setTimestamp(),
          ],
        });

        const logChannel = client.channels.cache.get(config.logs.buyLog)
        
        const logger = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Tools SubCommand]** run by **${interaction.user.tag}**`)
            .addFields(
                {
                  name: "Value:", value: `Bought **${tools}**`
                },
                { 
                  name: "Guild:", value: `${guild.name}`
                }
            )
            .setTimestamp();
        
        logChannel.send({ embeds: [logger] });
      }
   }
}