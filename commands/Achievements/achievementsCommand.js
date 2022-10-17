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
      .setTitle("Achievements Page 1")
      .setColor(config.colours.embed)
      .setDescription(`Here you can see your achievements`)
      .setTimestamp();

    if (user && userData.achievements.tinyPlayer) {
      page1.addFields(
        {
          name: `TinyPlayer`,
          value: `Completed ⭐️`
        }
      )
    } else {
      page1.addFields(
        {
          name: `TinyPlayer`,
          value: `Incompleted 500/${userData.commandRans}`
        }
      )
    };

    

    await interaction.editReply({ embeds: [page1] })
  }
}