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

    userData.commandRans += 1;
    userData.save();

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
      .setDescription(`**${userData.resources.ironOres}/300** ${config.emojis.ironOre}**Iron Ore**.\n**${userData.resources.ironNuggets}/150** ${config.emojis.ironNugget}**Iron Nugget**.`)
      .setTimestamp();

    let craftBucket = new EmbedBuilder()
      .setTitle("Craft Bucket")
      .setColor(config.colours.embed)
      .setDescription(`**${userData.resources.ironNuggets}/5** ${config.emojis.ironNugget}**Iron Nugget**.`)
      .setTimestamp();

    let craftCutter = new EmbedBuilder()
      .setTitle("Craft Cutter")
      .setColor(config.colours.embed)
      .setDescription(`**${userData.resources.woods}/2** ${config.emojis.wood}**Wood**.\n**${userData.resources.ironBricks}/1** ${config.emojis.ironBrick}**Iron Brick**`)
      .setTimestamp();

    let craftBasket = new EmbedBuilder()
      .setTitle("Craft Basket")
      .setColor(config.colours.embed)
      .setDescription(`**${userData.resources.woods}/5** ${config.emojis.wood}**Wood**.`)
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
              label: 'Bucket',
              description: 'Craft buckets for collecting liquid things',
              value: 'bucket'
            },
            {
              label: 'Cutter',
              description: 'Craft cutter for collecting wools and many more.',
              value: 'cutter'
            },
            {
              label: 'Basket',
              description: 'Craft basket to collect stuffs.',
              value: 'basket'
            },
            {
              label: 'Go Back',
              description: 'Go to back to craft menu.',
              value: 'menu'
            }
          ),
      );

    let furnaceButton = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('furnaceButton')
          .setLabel('Craft')
          .setStyle(ButtonStyle.Success),
      );

    let forgeButton = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('forgeButton')
          .setLabel('Craft')
          .setStyle(ButtonStyle.Success),
      );

    let bucketButton = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('bucketButton')
          .setLabel('Craft')
          .setStyle(ButtonStyle.Success),
      );

    let cutterButton = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('cutterButton')
          .setLabel('Craft')
          .setStyle(ButtonStyle.Success),
      );
    
    let basketButton = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('basketButton')
          .setLabel('Craft')
          .setStyle(ButtonStyle.Success),
      );
    
    await interaction.reply({ embeds: [craft], components: [selectMenu], fetchReply: true });

    client.on('interactionCreate', async (interaction, client) => {
      if (!interaction.isSelectMenu()) return;

      switch (interaction.values[0]) {
        case "menu":
          await interaction.deferUpdate();
          await interaction.editReply({ embeds: [craft], components: [selectMenu] })
          break;
        case "furnace":
          await interaction.deferUpdate();
          await interaction.editReply({ embeds: [craftFurnace], components: [selectMenu, furnaceButton] })
          break;
        case "forge":
          await interaction.deferUpdate();
          await interaction.editReply({ embeds: [craftForge], components: [selectMenu, forgeButton] })
          break;
        case "bucket":
          await interaction.deferUpdate();
          await interaction.editReply({ embeds: [craftBucket], components: [selectMenu, bucketButton] })
          break;
        case "cutter":
          await interaction.deferUpdate();
          await interaction.editReply({ embeds: [craftCutter], components: [selectMenu, cutterButton] })
          break;
        case "basket":
          await interaction.deferUpdate();
          await interaction.editReply({ embeds: [craftBasket], components: [selectMenu, basketButton] })
          break;
      }
    });

    client.on('interactionCreate', async (i, client) => {
      if (!i.isButton()) return;

      if (i.customId === 'furnaceButton') {

        if (user && userData.items.furnace) {
          return i.update({
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
          return i.update({
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
        userData.craftCount += 1;
        userData.resources.stones -= 100;
        userData.resources.woods -= 50;
        userData.resources.ironOres -= 2;
        userData.save();

        await i.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Crafted Furnace")
              .setColor(config.colours.success)
              .setDescription(`You successfully crafted **Furnace**.`)
              .setTimestamp(),
          ],
        });
      } else if (i.customId === 'forgeButton') {

        if (user && userData.items.forge) {
          return i.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("You already have!")
                .setColor(config.colours.embed)
                .setDescription(`Looks like you already have **Forge**,\nYou don't have to craft one more.`)
                .setTimestamp(),
            ],
            ephemeral: true
          });
        }

        if (userData.resources.ironOres < 300 || userData.resources.ironNuggets < 150) {
          return i.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Craft Error")
                .setColor(config.colours.error)
                .setDescription(`Sorry you don't have enough resources to craft **Forge**`)
                .setTimestamp(),
            ],
            ephemeral: true
          });
        }

        userData.items.forge = true;
        userData.craftCount += 1;
        userData.resources.ironOres -= 300;
        userData.resources.ironNuggets -= 150;
        userData.save();

        await i.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Crafted Forge")
              .setColor(config.colours.success)
              .setDescription(`You successfully crafted **Forge**.`)
              .setTimestamp(),
          ],
        });
      } else if (i.customId === "bucketButton") {

        if (userData.resources.ironNuggets < 5) {
          return i.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Craft error")
                .setColor(config.colours.error)
                .setDescription(`Sorry you don't have enough resources to craft **Bucket**`)
                .setTimestamp(), 
            ],
            ephemeral: true
          });
        }

        userData.resources.ironNuggets -= 5;
        userData.craftCount += 1;
        userData.items.buckets += 1;
        userData.save();

        await i.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Crafted Bucket")
              .setColor(config.colours.success)
              .setDescription(`You successfully crafted a **Bucket**.`)
              .setTimestamp(),
          ],
        });
      } else if (i.customId === "cutterButton") {

        if (user && userData.items.cutter) {
          return i.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Craft error")
                .setColor(config.colours.error)
                .setDescription(`Looks like you already have **Cutter**,\nYou don't have to craft one more.`)
                .setTimestamp(),
            ],
            ephemeral: true
          });
        }
        if (userData.resources.ironBricks < 1 || userData.resources.woods < 2) {
          return i.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Craft error")
                .setColor(config.colours.error)
                .setDescription(`Sorry you don't have enough resources to craft **Cutter**`)
                .setTimestamp(),
            ],
            ephemeral: true
          });
        }
        userData.resources.woods -= 2;
        userData.resources.ironBricks -= 1;
        userData.craftCount += 1;
        userData.health.cutters = 10;
        userData.items.cutter = true;
        userData.save();

        await i.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Crafted Cutter")
              .setColor(config.colours.success)
              .setDescription(`You successfully crafted a **Cutter**.`)
              .setTimestamp(),
          ],
        });
      } else if (i.customId === "basketButton") {

        if (user && userData.items.basket) {
          return i.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Craft error")
                .setColor(config.colours.error)
                .setDescription(`Looks like you already have **Basket**,\nYou don't have to craft one more.`)
                .setTimestamp(),
            ],
            ephemeral: true
          });
        }
        if (userData.resources.woods < 5) {
          return i.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Craft error")
                .setColor(config.colours.error)
                .setDescription(`Sorry you don't have enough resources to craft **Basket**`)
                .setTimestamp(),
            ],
            ephemeral: true
          });
        }
        
        userData.resources.woods -= 5;
        userData.craftCount += 1;
        userData.health.buckets += 15;
        userData.items.basket = true;
        userData.save();

        await i.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Crafted Basket")
              .setColor(config.colours.success)
              .setDescription(`You successfully crafted a **Basket**.`)
              .setTimestamp(),
          ],
        });
          }
    });
}
}