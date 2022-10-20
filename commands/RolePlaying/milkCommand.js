const { EmbedBuilder } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const config = require("../../config.json");
const emojis = require("../../api/emojis.json");
const tips = require('../../tips.json');
const wait = require('node:timers/promises').setTimeout;
const { ms } = require("printly.js");
const moment = require("moment");
require('moment-duration-format');

module.exports = {
  name: "milk",
  description: "get some milk from the cows",
  category: "RolePlay",

  run: async (client, interaction) => {

    const { user } = interaction;
    const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })
    //check for zoo 
    if (userData && !userData.property.zoo) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error: Zoo required!")
            .setColor(config.colours.embed)
            .setDescription(`Looks like you don't have your own zoo`)
            .setTimestamp(),
        ],
      });
    }
    // check cow animal
    if (userData && userData.animal.cow < 1) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error: Cow 🐄 required!")
            .setColor(config.colours.embed)
            .setDescription(`Looks like you don't have Hunt Cow 🐄🐄🐄`)
            .setTimestamp(),
        ],
      });
    }
    const duration = moment
        .duration(userData.cooldowns.milk - Date.now())
        .format("m[m], s[s]");
    // check cooldown
    if (userData.cooldowns.milk > Date.now())
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Please be patient...")
            .setColor(config.colours.work)
            .setDescription(
              `⌛ You can get milk from cow again in **\`${duration}\`**`
            ),
        ],
      });
    // check bucket
    if (user && userData.items.buckets < 1) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error: buckets required!")
            .setColor(config.colours.error)
            .setDescription(`You don't have ant buckets to collect cow milk.`)
            .setTimestamp(),
        ],
      });
    }
    // milked
    if (userData && userData.animal.cow >= 1 && userData.items.buckets >= 1) {

      userData.cooldowns.milk = Date.now() + ms("3m");
      userData.foods.milkBuckets += 1;
      userData.items.buckets -= 1;
      userData.save();
      
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Cow is milked!")
            .setColor(config.colours.success)
            .setDescription(`You have collect cow milk.`)
            .setTimestamp(),
        ],
      });
    }
  }
}