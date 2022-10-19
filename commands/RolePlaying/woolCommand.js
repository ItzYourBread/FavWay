const { EmbedBuilder } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const config = require("../../config.json");
const emojis = require("../../api/emojis.json");
const tips = require('../../tips.json');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  name: "wool",
  description: "Get some wools today!",
  category: "RolePlay",
  run: async (client, interaction) => {
    const { user } = interaction;
    const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id });
    let haveCutter = "Ops looks like your cutter got broken"

    if (user && !userData.property.zoo) {
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
    
    if (user && !userData.items.cutter && userData.resources.wools) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Sheep got naked!!")
            .setColor(config.colours.success)
            .setDescription(`You have **${userData.resources.wools} ${config.emojis.wool}Wool**\nYour previous ${config.emojis.cutter}cutter is got broken please craft another one!`)
            .setTimestamp(),
        ]
      })
    }
    if (user && !userData.items.cutter) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error: Cutters required!")
            .setColor(config.colours.embed)
            .setDescription(`Looks like you don't have craft **${config.emojis.cutter}Cutter**`)
            .setTimestamp(),
        ],
      });
    }

    if (user && !userData.animal.sheep && userData.animal.sheep < 1) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error: sheep 🐑 required!")
            .setColor(config.colours.embed)
            .setDescription(`Looks like you don't have sheeps`)
            .setTimestamp(),
        ],
      });
    }
    if (userData.health.cutters > 0) {
      userData.health.cutters -= 1;
      userData.resources.wools += Math.floor(Math.random() * 8);
      if (userData.health.cutters == 0) {
        userData.items.cutter = false;
      } else {
        haveCutter = `and cutter health is **${userData.health.cutters}/10.**`;
      }
      userData.save();
    }

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Sheep got naked!!")
          .setColor(config.colours.success)
          .setDescription(`You have collect wool now you have **${userData.resources.wools} ${config.emojis.wool}Wool**\n${haveCutter}`)
          .setTimestamp(),
      ]
    })
  }
}