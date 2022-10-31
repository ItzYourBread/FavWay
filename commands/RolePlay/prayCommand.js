const config = require("../../config.json");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const { ms } = require("printly.js");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
  name: "pray",
  description: "Pray for luck or send pray to others",
  category: "roleplay",
  options: [{
    name: "user",
    description: "Select a user",
    type: ApplicationCommandOptionType.User,
    required: false
  }],
  run: async (client, interaction) => {
    const user = interaction.options.getUser("user") || interaction.user;
    const random = Math.floor(Math.random() * 3);
    const userData = await Profile.findOne({ id: user.id}) || new Profile({ id: user.id })
    const duration = moment
        .duration(userData.cooldowns.pray - Date.now())
        .format("m[m], s[s]");
      
    if(user && userData.cooldowns.pray > Date.now()) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
          .setTitle("Please be Pa")
          .setDescription(`You have to wait ${duration} before pray again!`)
          .setColor(config.colours.error)
          .setTimestamp(),
        ],
      });
    }
    
    userData.luck += 1;
    userData.cooldowns.pray = Date.now() + ms("15s");
    userData.save();

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
        .setDescription(`Prayed for luck! Now you have ${userData.luck} luck!`)
        .setColor(config.colours.embed)
        .setTimestamp(),
      ],
    });
  }
}