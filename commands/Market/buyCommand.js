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
      name: 'woodworking',
      description: 'Buy stuffs from Woodworking workshop',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
        name: 'item',
        description: 'What type of stuff do you want to but?',
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: 'Wood', value: 'woods' }
        ], 
      }, {
          name: 'quantity',
          description: 'Please enter your item quantity to buy it.',
          type: ApplicationCommandOptionType.Number,
          required: false
      }],
    }, {
      name: 'tools',
      description: 'Buy some tools to start your journey with FavWay!',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
        name: 'tool',
        description: 'What tool do you want to buy?',
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: 'Axe', value: 'axe' },
          { name: 'Pickaxe', value: 'pickaxe' }
        ],
      }], 
    }, {
      name: 'foundry',
      description: 'Buy foundry items from Foundry Workshop.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
        name: 'item',
        description: 'What foundry item do you want?',
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: 'Furnace', value: 'furnace' },
          { name: 'Iron', value: 'ironBrick' }
        ],
      }, {
        name: 'quantity',
        description: 'Please enter your item quatity.',
        type: ApplicationCommandOptionType.Number,
        required: false
      }],
    }],
    
    run: async (client, interaction, args) => {
      
      if (interaction.options.getSubcommand() === "woodworking") {

      const quantity = interaction.options.getNumber('quantity') || '20';

      const { guild } = interaction;
      const user = interaction.member.user;
        
      const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

        
      if (interaction.options.get('item').value === "woods") {
        amount2 = quantity * 5;
      }

      if (interaction.options.get('item').value === "woods") {
        itemEmoji = config.emojis.wood;
        itemName = "Wood";
      }
        
        if (userData.coins < amount2)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(`Sorry you dont have enough money to buy **${itemName}**`)
                .setColor(config.colours.error)
                .setTimestamp(),
            ],
          });
        
          userData.coins -= amount2; 
        if (interaction.options.get('item').value === "woods") {
          userData.resources.woods += quantity;
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
            .setDescription(`**[Buy Workworking SubCommand]** run by **${interaction.user.tag}**`)
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

      if (interaction.options.get('tool').value === 'axe') {
        price = 90;
        itemName = "Axe";
        choice = userData.axe.stone
      }
      if (interaction.options.get('tool').value === 'pickaxe') {
        price = 120;
        itemName = "Pickaxe";
        choice = userData.pickaxe.stone;
      }

      if (user && choice) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
            .setTitle("Error: you already have")
            .setColor(config.colours.error)
            .setDescription(`Woohoo... You already have **${itemName}**\nYou don't need to buy anymore.`)
            .setTimestamp(),
          ],
        });
      }
        
        if (userData.coins < price)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(`Sorry you dont have enough money to buy **${itemName}**`)
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
              .setDescription(`You bought ${itemName} for ${config.emojis.currency} **${price}**`)
              .setColor(config.colours.success)
              .setTimestamp(),
          ],
        });

        const logChannel = client.channels.cache.get(config.logs.buyLog)
        
        const logger = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Buy Tools SubCommand]** run by **${interaction.user.tag}**`)
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
        
    } else if (interaction.options.getSubcommand() === "foundry") {

      const quantity = interaction.options.getNumber('quantity') || '20';
        
      const { guild } = interaction;
      const user = interaction.member.user;
        
      const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

      if (interaction.options.get('item').value === 'furnace') {
        price = 5999;
        itemName = "Furance";
        choice = userData.items.furance;
      }
      if (interaction.options.get('item').value === 'ironBrick') {
        price = quantity * 22;
        itemName = "Iron";
        itemEmoji = config.emojis.ironBrick;
      }

      if (user && choice) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
            .setTitle("Error: you already have")
            .setColor(config.colours.error)
            .setDescription(`Woohoo... You already have **${itemName}**\nYou don't need to buy anymore.`)
            .setTimestamp(),
          ],
        });
      }
        
        if (userData.coins < price )
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(`Sorry you dont have enough money to buy **${itemName}**`)
                .setColor(config.colours.error)
                .setTimestamp(),
            ],
          });

        if (interaction.options.get('item').value === "furnace") {
          userData.items.furnace = true;
          userData.coins -= price;
        }
        if (interaction.options.get('item').value === "ironBrick") {
          userData.resources.ironBrick = quantity;
          userData.coins -= price;
        }
          userData.save();

        const success = new EmbedBuilder()
         .setColor(config.colours.success)
         .setTimestamp();
        
        if (interaction.options.get('item').value === "furnace") {
          success.setDescription(`You bought **${itemName}** for ${config.emojis.currency} **${price}**`)
        } else {
          success.setDescription(`You bought **${quantity}** ${itemEmoji}**${itemName}** for ${config.emojis.currency} **${price}**`)
        }

        interaction.reply({ embeds: [success] });

        const logChannel = client.channels.cache.get(config.logs.buyLog)
        
        const logger = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Buy Foundry SubCommand]** run by **${interaction.user.tag}**`)
            .addFields(
                {
                  name: "Value:", value: `Bought **${itemName}**`
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