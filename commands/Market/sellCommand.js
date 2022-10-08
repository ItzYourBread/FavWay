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
    category: "RolePlay",
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
          { name: 'Stone', value: 'stones' },
          { name: 'Iron Ore', value: 'ironOre'},
          { name: 'Iron', value: 'ironBrick' }
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
        choice = userData.resources.woods;
        amount2 = quantity * 3;
        amount3 = quantity * 5;
      }
      if (interaction.options.get('resource').value === "stones") {
        choice = userData.resources.stones;
        amount2 = quantity * 6;
        amount3 = quantity * 25;
      }
      if (interaction.options.get('resource').value === "ironOre") {
        choice = userData.resources.ironOres;
        amount2 = quantity * 12;
        amount3 = 100;
      }
      if (interaction.options.get('resource').value === "ironBrick") {
        choice = userData.resources.ironBricks;
        amount2 = quantity * 20;
        amount3 = 5;
      }

      
      if (interaction.options.get('resource').value === "woods") {
        itemEmoji = config.emojis.wood;
        itemName = "Wood";
      }
      if (interaction.options.get('resource').value === "stones") {
        itemEmoji = config.emojis.stone;
        itemName = "Stone"
      }
      if (interaction.options.get('resource').value === "ironOre") {
        itemEmoji = config.emojis.ironOre;
        itemName = "Iron Ore";
      }
      if (interaction.options.get('resource').value === "ironBrick") {
        itemEmoji = config.emojis.ironBrick;
        itemName = "Iron";
      }
        
        
        if (choice < quantity)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(`You don't have enough ${itemName} to sell, you only have ${choice}${itemEmoji}${itemName} in your inventory..!`)
                .setColor(config.colours.error)
                .setTimestamp(),
            ],
          });
        
          userData.coins += amount2; 
          userData.cents += amount3;
        if (interaction.options.get('resource').value === "woods") {
          userData.resources.woods -= quantity;
        }
        if (interaction.options.get('resource').value === "stones") {
          userData.resources.stones -= quantity;
        }
        if (interaction.options.get('resource').value === "ironOre") {
          userData.resources.ironOres -= quantity;
        }
        if (interaction.options.get('resource').value === "ironBricks") {
          userData.resources.ironBricks -= quantity;
        }
          userData.save();

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`You sold **${quantity.toLocaleString()}** ${itemEmoji}**${itemName}** and got ${config.emojis.currency} **${amount2}** and here is your cents ${config.emojis.currencyCents} **${amount3}**`)
              .setColor(config.colours.success)
              .setTimestamp(),
          ],
        });
        
        const logChannel = client.channels.cache.get(config.logs.sellLog)
        
        const logger = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Sell Resources SubCommand]** run by **${interaction.user.tag}**`)
            .addFields(
                {
                  name: "Value:", value: `sold **${quantity}** ${itemEmoji}**${itemName}**`
                },
                { name: "Guild:", value: `${guild.name}` }
            )
            .setTimestamp();
        
        logChannel.send({ embeds: [logger] });
       }
    }
}