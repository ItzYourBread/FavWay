const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const config = require("../../config.json");
const { EmbedBuilder } = require("discord.js");
const User = require("../../database/premium/user");
const { ms } = require("printly.js");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
  name: "chop",
  description: "Let's collect some woods today!",
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
        .duration(userData.cooldowns.chop - Date.now())
        .format("m[m], s[s]");

    if (userData.cooldowns.chop > Date.now()) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
          .setColor(config.colours.error)
          .setDescription(`You can chop trees again in \`${duration}\` please be patient.\n\nFor premium user cooldown is \`20s\` `)
          .setTimestamp(),
        ],
      });
    }
    
    if (user && userData.axe.iron >= 1) {
      
    let amount = Math.floor(Math.random() * 40) + 15;
      userData.resources.woods += amount;
      userData.health.axe.iron += 1;
      if (user && premium.isPremium) {
        userData.cooldowns.chop = Date.now() + ms("20s");
      } else {
        userData.cooldowns.chop = Date.now() + ms("3m");
      }
      if (userData.health.axe.iron == 25) {
        userData.health.axe.iron -= 25;
        userData.axe.iron -= 1;
      }
      userData.save();
      
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
         .setTitle("Chopped!!")
         .setColor(config.colours.success)
         .setDescription(`${user.username} has chopped a trees and got **${amount} ${config.emojis.wood}Woods**`)
         .setTimestamp(),
        ],
      });
    } else if (user && userData.axe.stone >= 1) {
      
      let amount = Math.floor(Math.random() * 13) + 3;
      userData.resources.woods += amount;
      userData.health.axe.stone += 1;
      if (user && premium.isPremium) {
        userData.cooldowns.chop = Date.now() + ms("20s");
      } else {
        userData.cooldowns.chop = Date.now() + ms("1m");
      }
      if (userData.health.axe.stone == 15) {
        userData.health.axe.stone -= 15;
        userData.axe.iron -= 1;
      }
      userData.save();
      
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
          .setTitle("Chopped!!")
          .setColor(config.colours.success)
          .setDescription(`${user.username} has chopped a trees and got **${amount} ${config.emojis.wood}Woods**`)
          .setTimestamp(),
        ],
      });
    } else { 
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
         .setTitle("You don't have a axe!")
         .setColor(config.colours.error)
         .setDescription(`You need axe to chop trees!\nType \`/market\` to buy a axe.`)
         .setTimestamp(),
        ],
      });
    }
  }
}