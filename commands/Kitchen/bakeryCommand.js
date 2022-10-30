const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { ApplicationCommandOptionType } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const config = require("../../config.json");
const { ms } = require("printly.js");
const wait = require('node:timers/promises').setTimeout;
const bakeryList = require("../../kitchen/bakery.json");

module.exports = {
  name: "bakery",
  description: "Make some bakery foods and items.",
  category: "Kitchen",
  options: [{
    name: "item",
    description: "The item to make.",
    type: ApplicationCommandOptionType.String,
    required: true,
    choices: bakeryList
  }],

  run: async (client, interaction) => {

    const { user, guild } = interaction;
    const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })
    const selected = bakeryList.find((el) => { if (el.value === interaction.options.getString("item", null)) { return el; } });

    userData.commandRans += 1;
    userData.save();

    if (user && !userData.property.bakery) {
      const BuyCancel = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('buy')
            .setLabel('Buy (25,000)')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId(`cancel`)
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger)
        );

      const buyBakery = new EmbedBuilder()
        .setTitle("Missing Bakery")
        .setColor(config.colours.error)
        .setDescription(`Looks like you don't have **Bakery** own`)
        .setTimestamp();

      var message = await interaction.reply({ embeds: [buyBakery], components: [BuyCancel] });
    }
    
  }
}