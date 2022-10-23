const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const config = require("../../config.json");
const { EmbedBuilder } = require("discord.js");
const User = require("../../database/premium/user");
const { ms } = require("printly.js");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
  name: "mine",
  description: "Let's do mining today!",
  category: "Work",

  run: async (client, interaction) => {

    await interaction.deferReply();

    const { guild } = interaction;
    const user = interaction.member.user;
    const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id });
    let premium = await User.findOne({
      Id: interaction.user.id,
    });

    const duration = moment 
        .duration(userData.cooldowns.mine - Date.now())
        .format("m[m], s[s]");

    if (user && userData.cooldowns.mine > Date.now()) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
          .setColor(config.colours.error)
          .setDescription(`You can mine again in \`${duration}\` `)
          .setTimestamp(),
        ],
      });
    }

    if (user && userData.pickaxe.iron >= 1) {
      
    let amount = Math.floor(Math.random() * 40) + 15;
    let amount2 = Math.floor(Math.random() * 18) + 7;
      userData.resources.stones += amount;
      userData.resources.ironOres += amount2;
      userData.health.pickaxe.iron += 1;
      if (user && premium.isPremium) {
        userData.cooldowns.mine = Date.now() + ms("20s");
      } else {
        userData.cooldowns.mine = Date.now() + ms("3m");
      }
      if (userData.health.pickaxe.iron == 25) {
        userData.health.pickaxe.iron -= 25;
        userData.pickaxe.iron -= 1;
      }
      userData.save();
      
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
         .setTitle("Mined!!")
         .setColor(config.colours.success)
         .setDescription(`${user.username} found **${amount2} ${config.emojis.ironOre}Iron Ore** and **${amount} ${config.emojis.stone}Stone** from mining!`)
         .setTimestamp(),
        ],
      });
    } else if (user && userData.pickaxe.stone >= 1) {
      
      let amount = Math.floor(Math.random() * 13) + 3;
      userData.resources.stones += amount;
      userData.health.pickaxe.stone += 1;
      if (user && premium.isPremium) {
        userData.cooldowns.mine = Date.now() + ms("20s");
      } else {
        userData.cooldowns.mine = Date.now() + ms("1m");
      }
      if (userData.health.pickaxe.stone == 18) {
        userData.health.pickaxe.stone -= 18;
        userData.axe.stone -= 1;
      }
      userData.save();
      
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
          .setTitle("Mined!!")
          .setColor(config.colours.success)
          .setDescription(`${user.username} found **${amount} ${config.emojis.stone}Stone** from mining!`)
          .setTimestamp(),
        ],
      });
    } else { 
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
         .setTitle("You don't have pickaxe")
         .setColor(config.colours.error)
         .setDescription(`You need pickaxe for mining stones and ores\nType \`/market\` to buy a pickaxe!`)
         .setTimestamp(),
        ],
      });
    }
  }
}