const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const { ms } = require("printly.js");
const config = require("../../config.json");
const moment = require("moment");
require('moment-duration-format');


module.exports = {
    name: "daily",
    description: "Get your daily reward",
    botPerm: [""],
    category: "Reward",
    
    run: async (client, interaction) => {

      const { guild } = interaction;
      const user = interaction.member.user;

      const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })
        
      const duration = moment
        .duration(userData.cooldowns.daily - Date.now())
        .format("h[h] m[m], s[s]");

      if (userData.cooldowns.daily > Date.now())
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
            .setTitle("Please be patient")
            .setColor(config.colours.reward)
            .setDescription(`You already claimed your daily reward today!\nPlease wait **${duration}** for next daily reward.`)
            .setTimestamp(),
          ],
        });

      let amount = Math.floor((Math.random() * 150) + 115);

      userData.coins += amount;
      userData.cooldowns.daily = new Date().setUTCHours(0,0,0,0);
      userData.save();

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
          .setTitle("Daily Reward Claimed")
          .setColor(config.colours.reward)
          .setDescription(`Awesome you claimed your daily reward\n\n**Coins:** ${config.emojis.currency}**${amount}**\n\nYour next daily reward will ready in\n**23h 59m 55s**`)
          .setTimestamp(),
        ],
      });
    }
}