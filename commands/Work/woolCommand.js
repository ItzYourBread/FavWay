const { EmbedBuilder } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const User = require("../../database/premium/user");
const Discord = require("discord.js");
const config = require("../../config.json");
const emojis = require("../../api/emojis.json");
const tips = require('../../tips.json');
const wait = require('node:timers/promises').setTimeout;
const { ms } = require("printly.js");
const moment = require("moment");
require('moment-duration-format');

module.exports = {
  name: "wool",
  description: "Get some wools today!",
  category: "RolePlay",
  run: async (client, interaction) => {

    await interaction.deferReply();
    
    const { user } = interaction;
    const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })
    let premium = await User.findOne({
      Id: interaction.user.id,
    });
    
    let random = Math.floor(Math.random() * 24);
    
    if (userData.items.cutters >= 1) {
      userData.health.cutters += 1;
      userData.resources.wools += random;
      if (user && premium.isPremium) {
        userData.cooldowns.wool = Date.now() + ms("3h");
      } else {
        userData.cooldowns.wool = Date.now() + ms("7h");
      }
      if (userData.health.cutter == 25) {
        userData.items.cutters -= 1;
        useeData.health.cutter -= 25;
      }
      userData.save();
      
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
          .setTitle(`Sheep without fur haha`)
          .setColor(config.colours.embed)
          .setDescription(`You cuts the sheep fur and you get **${random} ${config.emojis.wool}Wool**.`)
          .setTimestamp(),
        ],
      });
    } else {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
         .setTitle(`You don't have cutter`)
         .setColor(config.colours.error)
         .setDescription(`You don't have cutter to cut sheep fur and get wool!\nType: \`/shop\` to buy a cutter.`)
         .setTimestamp(),
        ],
      });
    }
  }
}