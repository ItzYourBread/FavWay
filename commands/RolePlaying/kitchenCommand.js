const { ActionRowBuilder, SelectMenuBuilder, ComponentType, Client } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const config = require("../../config.json");
const emojis = require("../../api/emojis.json");
const tips = require('../../tips.json');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  name: "kitchen",
  description: "Let's make some foods today!",
  category: "RolePlay",

  run: async (client, interaction) => {

    const { user } = interaction;

    const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

    let isFirst = "";

    userData.commandRans += 1;
    userData.save();

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
}