const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ComponentType, Client } = require('discord.js');
const { ApplicationCommandOptionType } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const moment = require("moment");
const config = require("../../config.json");
const emojis = require("../../api/emojis.json");
const tips = require("../../tips.json");
const { ms } = require("printly.js");
const { animals } = require("../../animals.json");
const wait = require('node:timers/promises').setTimeout;
require('moment-duration-format');

module.exports = {
  name: "zoo",
  description: "just a zoo for your animals",
  category: "animals",
  options: [{
    name: 'user',
    description: 'Please select a user.',
    type: ApplicationCommandOptionType.User,
    required: false
  }],

  run: async (client, interaction) => {

    await interaction.deferReply();
    let reply = '';

    const user = interaction.options.getUser('user') || interaction.user;
    const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

    if (user && !userData.property.zoo) {
      const buyZoo = new EmbedBuilder()
        .setTitle("Buy Zoo")
        .setColor(config.colours.embed)
        .setDescription(`Looks like you don't have your own zoo\nDo you like to buy one?`)
        .setTimestamp();

      const buttonsBuy = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('buy')
            .setLabel('Buy (15,000)')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger),
        );

      var message = await interaction.editReply({ embeds: [buyZoo], components: [buttonsBuy] });

      const collector = message.createMessageComponentCollector({
        filter: fn => fn,
        // componentType: ComponentType.SelectMenu, 
        time: 20000
      });

      collector.on('collect', async (i) => {
        if (i.user.id === interaction.user.id) {
          if (!i.isButton()) return;
          if (i.customId === "buy") {
            if (user && userData.coins < 15000) {
              return i.reply({
                embeds: [
                  new EmbedBuilder() // work
                    .setTitle("Poor guy")
                    .setTimestamp(),
                ], ephemeral: true
              });
            };
            if (user && userData.coins > 15000) {
              await i.reply({
                embeds: [
                  new EmbedBuilder()
                    .setTitle("Successfully Bought Zoo")
                    .setTimestamp(),
                ],
              });

              userData.coins -= 15000;
              userData.property.zoo = true;
              userData.save();
            };
          }
          if (i.customId === "cancel") {
            return i.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Cancelled..!")
                  .setTimestamp()

              ], ephemeral: true
            });
          }
        }
      })

    };

    if (user && userData.animal[el.value] && userData.animal[el.value] > 1) {
      zooText = "You have alots of animals in your zoo!"
    }

    if (user && userData.property.zoo) {
      const zoo = new EmbedBuilder()
        .setTitle(`${user.username}'s Zoo`)
        .setColor(config.colours.embed)
        .setDescription(`${zooText}`)
        .setTimestamp();
      animals.find(el => {
        if (user && userData.animal[el.value] && userData.animal[el.value] > 1) {
          zoo.addFields(
            {
              name: `${el.name} ${el.emoji}`,
              value: `${userData.animal[el.value]}`,
              inline: true
            }
          )
        }
      });

      await interaction.editReply({ embeds: [zoo] });
    };

  }
}