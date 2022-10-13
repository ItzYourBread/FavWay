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

      if (userData.resources.woods) {
        woodsCount = userData.resources.woods;
      } else {
        woodsCount = 0;
      }

      if (userData.resources.stones) {
        stonesCount = userData.resources.stones;
      } else {
        stonesCount = 0;
      }

      if (userData.resources.ironOres) {
        ironOresCount = userData.resources.ironOres;
      } else {
        ironOresCount = 0;
      }

      if (userData.resources.ironNuggets) {
        ironNuggetsCount = userData.resources.ironNuggets;
      } else {
        ironNuggetsCount = 0;
      }

      if (userData.resources.ironBricks) {
        ironBricksCount = userData.resources.ironBricks;
      } else {
        ironBricksCount = 0;
      }

      let totalRes = `${woodsCount + stonesCount + ironOresCount + ironNuggetsCount + ironBricksCount}`;


      if (user && userData.axe.stone) {
        axeStone = 1;
      } else {
        axeStone = 0;
      }

      if (user && userData.axe.iron) {
        axeIron = 1;
      } else {
        axeIron = 0;
      }

      if (user && userData.pickaxe.stone) {
        pickaxeStone = 1;
      } else {
        pickaxeStone = 0;
      }

      if (user && userData.pickaxe.iron) {
        pickaxeIron = 1;
      } else {
        pickaxeIron = 0;
      }

      let totalTools = `${axeStone + axeIron + pickaxeStone + pickaxeIron}`;
      

      const profile = new EmbedBuilder()
      .setTitle(`${user.username}’s Profile`)
      .setThumbnail(user.displayAvatarURL())
      .setColor(config.colours.embed)
      .setDescription(`Code will be here`)
      .setTimestamp()
      
      if (user && userData.coins) {
        profile.addFields(
          { name: 'Pocket:', value: `${userData.coins.toLocaleString()}` }
        )
      };
      
      if (user && userData.bank) {
        profile.addFields(
          { name: 'Bank:', value: `${userData.bank.toLocaleString()}` }
        )
      };
  
      if (user && totalRes > 1) {
        profile.addFields(
          { name: 'Resources Count:', value: `${totalRes.toLocaleString()}` }
        )
      } else {
        profile.addFields(
          { name: 'Resources Count:', value: `User don't have any resources in their inventory.` }
        )
      };

      if (user && totalTools > 1) {
        profile.addFields(
          { name: 'Tools Count:', value: `${totalTools}`}
        )
      } else {
        profile.addFields(
          { name: 'Tools Count:', value: `User don't have any tools in their inventory.` }
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