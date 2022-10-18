const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const moment = require("moment");
const config = require("../../config.json");
const { animals } = require("../../animals.json");

module.exports = {
  name: "hunt",
  description: "Hunt some animals that can help you in your journey!",
  category: "animal",

  run: async (client, interaction) => {
    await interaction.deferReply();
    const { user, guild } = interaction;
    const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })
    
    let random = Math.floor(Math.random() * 14);
    
    const animal = animals[Math.floor(Math.random() * animals.length)]
    
    if (user && !userData.property.zoo) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
          .setTitle("Error: zoo required")
          .setColor(config.colours.error)
          .setDescription(`You don't have zoo\nYou need to buy zoo before you hunt.`)
          .setTimestamp(),
        ]
      });
    }

    if (user && userData.property.zoo) {
      
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
          .setTitle("Hunting...")
          .setColor(config.colours.work)
          .setDescription(`You hunted a ${animal.name} ${animal.emoji}`)
          .setTimestamp(),
        ],
      });
      if(userData.animal[animal.value]){
        userData.animal[animal.value] += random;
      }else{
        userData.animal[animal.value] += random;
      }
      userData.save();
    }


  }
}
