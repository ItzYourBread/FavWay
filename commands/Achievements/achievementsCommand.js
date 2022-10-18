const Discord = require("discord.js");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const config = require("../../config.json");

module.exports = {
  name: "achievements",
  description: "View your achievements",
  category: "achievements",
  options: [{
    name: 'user',
    description: 'Please enter a user.',
    type: ApplicationCommandOptionType.User,
    required: false
  }],

  run: async (client, interaction) => {
    
    await interaction.deferReply();
    let reply = '';
    
    const { guild } = interaction;
    const user = interaction.options.getUser("user") || interaction.user;
    
    const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

    userData.commandRans += 1;
    userData.save();
    
    const page1 = new EmbedBuilder()
      .setTitle(`${user.username}'s Achievements Progress`)
      .setColor(config.colours.embed)
      .setDescription(`Here you can see your achievements`)
      .setTimestamp();

    if (user && userData.achievements.tinyPlayer) {
      page1.addFields(
        {
          name: `Run commands 500 times!`,
          value: `Completed 500/500\n**Rewards:**\n${config.emojis.currency}2,000\n${config.emojis.currencyCents}700\nTinyPlayer(Title)`,
          inline: true
        }
      )
    } else {
      page1.addFields(
        {
          name: `Run commands 500 times!`,
          value: `In progress ${userData.commandRans}/500\n**Rewards:**\n${config.emojis.currency}2,000\n${config.emojis.currencyCents}700\nTinyPlayer(Title)`,
          inline: true
        }
      )
    };

    if (user && userData.achievements.firstCraft) {
      page1.addFields(
        {
          name: `Craft an item!`,
          value: `Completed 1/1\n**Rewards:**\n${config.emojis.currency}3,500\n${config.emojis.ironBrick}15`,
          inline: true
        }
      )
    } else {
      page1.addFields(
        {
          name: `Craft an item!`,
          value: `In progress ${userData.craftCount}/1\n**Rewards:**\n${config.emojis.currency}3,500\n${config.emojis.ironBrick}15`,
          inline: true
        }
      )
    };

    

    await interaction.editReply({ embeds: [page1] })
  }
}