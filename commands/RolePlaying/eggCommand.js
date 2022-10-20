const { EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const { Profile } = require("../../database/game/profile");
const { printly, ms } = require("printly.js");
const config = require("../../config.json");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
  name: "egg",
  description: "Collect Egg from Your Chicken",
  category: "RolePlay",

  run: async (client, interaction) => {
    let randomEgg;
    const { user } = interaction;
    const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })
    userData.commandRans += 1;
    userData.save();
    
    if (!userData.property.zoo) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error: Zoo required!")
            .setColor(config.colours.embed)
            .setDescription(`Looks like you don't have your own zoo`)
            .setTimestamp(),
        ],
      });
    }
    if (userData.animal.chicken < 5) {
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error: Ckickens 🐓 required!")
            .setColor(config.colours.error)
            .setDescription(`Looks like you don't have Hunt chickens 🐓🐓🐓\nYou need minimum 5 chickens`)
            .setTimestamp(),
        ],
      });
    }
    if (!userData.items.baskets) {
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error: basket required!")
            .setColor(config.colours.error)
            .setDescription(`You don't have basket to collect chickens eggs`)
            .setTimestamp(),
        ],
      });
    }
    if (userData.health.baskets < 1) {
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error: basket required!")
            .setColor(config.colours.error)
            .setDescription(`Your basket end his life to collect chickens eggs buy new`)
            .setTimestamp(),
        ],
      });
    }

    if (userData.animal.chicken > 5) {
      randomEgg = Math.floor(Math.random() * 10);
    } if (userData.animal.chicken > 10) {
      randomEgg = Math.floor(Math.random() * 15);
    } if (userData.animal.chicken > 20) {
      randomEgg = Math.floor(Math.random() * 35)
    } else {
      randomEgg = Math.floor(Math.random() * 5);
    }

    userData.foods.eggs += randomEgg;
    userData.cooldowns.egg = Data.now() + ms("10s"); // userData.items.baskets and userData.health.baskets ok
    userData.save();
    return await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Eggs Collected")
          .setColor(config.colours.error)
          .setDescription(`You Collected **${randomEgg}** Eggs you now have **${userData.foods.eggs}**Eggs`)
          .setTimestamp(),
      ],
    });
  }
}