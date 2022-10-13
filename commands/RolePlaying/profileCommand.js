const Discord = require("discord.js");
const config = require("../../config.json");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const { ms } = require("printly.js");

module.exports = {
    name: "profile",
    description: "View user profile",
    category: "RolePlay",
    options: [{
      name: 'user',
      description: 'Please select a user to view their profile',
      type: ApplicationCommandOptionType.User,
      required: false
    }],

    run: async (client, interaction) => {
      
      const { guild } = interaction;
      const user = interaction.options.getUser('user') || interaction.user;

      const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id }) 

      const profile = new EmbedBuilder()
      .setTitle(`${user.username}’s Profile`)
      .setColor(config.colours.embed)
      .setDescription(`Code will be here`)
      .setTimestamp()
      
      if (user && userData.coins) {
        profile.addFields(
          { name: 'Pocket:', value: `${userData.coins.toLocaleString()}` }
        )
      }
      if (user && userData.bank) {
        profile.addFields(
          { name: 'Bank:', value: `${userData.bank.toLocaleString()}` }
        )
      }

      await interaction.reply({ embeds: [profile] });
      

      const logChannel = client.channels.cache.get(config.logs.roleplayLog)
        
        const logger = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Profile Command]** run by **${interaction.user.tag}**`)
            .addFields(
                { name: "Guild:", value: `${guild.name}` }
            )
            .setTimestamp();
        
        logChannel.send({ embeds: [logger] }); 
      
    }
};