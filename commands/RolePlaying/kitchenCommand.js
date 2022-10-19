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
  name: "kitchen",
  description: "Let's make some foods today!",
  category: "RolePlay",

  run: async (client, interaction) => {

    const { user } = interaction;

    const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

    let main = new EmbedBuilder()
    .setTitle("Kitchen Menu")
    .setColor(config.colours.embed)
    .setDescription(`${user.username} Here you can make foods for the day!`)
    .setTimestamp();

    let cake = new EmbedBuilder()
    .setTitle("Cake Recipe")
    .setColor(config.colours.embed)
    .setDescription(`**${userData.foods.eggs}/10** ${config.emojis.egg}**Egg**\n**\n**${userData.foods.milkBuckets}/2** ${config.emojis.milkBucket}**Milk Bucket**`)
    .setTimestamp();

    const menu = new ActionRowBuilder()
    .addComponents(
      new SelectMenuBuilder()
      .setCustomId("recipes")
      .setPlaceholder("Select a recipe")
      .addOptions(
        {
          label: "Cake",
          description: "Bake a cake",
          value: "cake"
        }
      )
    )

    const cakeButton = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId("makeCake")
      .setLabel("Bake")
      .setStyle(ButtonStyle.Primary)
    );

    userData.commandRans += 1;
    userData.save();

    let message = await interaction.reply({ embeds: [main], components: [menu] });

    const collector = message.createMessageComponentCollector({
      filter: fn => fn,
      // componentType: ComponentType.SelectMenu, 
      time: 20000
    });

    collector.on('collect', i => {
      if (i.user.id === interaction.user.id)
        return i.reply({ content: `These menu aren't for you!`, ephemeral: true });
    });


    client.on('interactionCreate', async (interaction, client) => {
      if (!interaction.isSelectMenu()) return;

      switch (interaction.values[0]) {
        case "menu":
          await interaction.update({ embeds: [craft], components: [menu] })
          break;
        case "furnace":
          await interaction.update({ embeds: [cake], components: [menu, cakeButton] })
          break;
      }
    });
    
client.on('interactionCreate', async (interaction, client) => {
  if (!interaction.isButton()) return;
  
  if (interaction.customId === "makeCake") {
    
    if (userData && userData.foods.milkBuckets < 2) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("The Baking Cake fail!")
            .setColor(config.colours.error)
            .setDescription(`You don't have enough ingredients to make cake`)
            .setTimestamp(),
        ],
      });
    }

    userData.foods.milkBuckets -= 2;
    userData.foods.cakeNormal += 1;
    userData.items.buckets += 2;
    userData.bakeCount += 1;
    userData.save();
    if (userData.foods.cakeNormal == 1) {
      isFirst = "first ";
    }

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Cake Successfully Baked")
          .setColor(config.colours.success)
          .setDescription(`OMG!! You baked your ${isFirst}cake! 🎂`)
          .setTimestamp(),
      ],
    });
   }
  });
}
}