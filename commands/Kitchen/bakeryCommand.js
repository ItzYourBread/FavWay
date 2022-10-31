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
            .setLabel('Buy (27,000)')
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

    if (user && userData.property.bakery) {
      const make = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('make')
            .setLabel('Make 1')
            .setStyle(ButtonStyle.Success),
        );

      if (selected.value === "cakeNormal") {
        var message = await interaction.reply({
          embeds: [
            new EmbedBuilder()
            .setTitle("Bakery")
            .setColor(config.colours.embed)
            .setDescription(`${config.emojis.cakeNormal}**Cake**\n\n**Recipe:**\n${userData.foods.eggs}/8 ${config.emojis.egg}**Egg**\n${userData.foods.creams}/2 ${config.emojis.cream}**Cream**\n${userData.foods.sugars}/1 ${config.emojis.sugar}**Sugar**\n${userData.crops.wheats}/35 ${config.emojis.wheat}**Wheat**`)
            .setTimestamp(),
          ],
          components: [make],
        });
      }
    }

    const collector = message.createMessageComponentCollector({
      filter: fn => fn,
      componentType: ComponentType.Button,
      time: 20000
    });

    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id)
        return i.reply({
          content: `These Buttons aren't for you!`,
          ephemeral: true
        });

      if (i.customId === 'buy') {
        await i.deferUpdate();
        if (user && userData.coins < 27000) {
          return i.followUp({ 
            content: "You don't have enough coins to buy **Bakery**!", 
            ephemeral: true 
          });
        }

        userData.coins -= 27000;
        userData.property.bakery = true;
        userData.save();

        await i.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Bakery Bought")
              .setColor(config.colours.success)
              .setDescription("You bought **Bakery**!\nRun the command again to see the Bakery.")
              .setTimestamp()
          ],
          components: [],
        });
      }
      
      if (i.customId === 'cancel') {
        await i.deferUpdate();
        await i.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Buying cancelled")
              .setColor(config.colours.error)
              .setDescription(`Buying **Bakery** has been cancelled!`)
              .setTimestamp(),
          ],
          components: [],
        });
      }

    });
    
  }
}