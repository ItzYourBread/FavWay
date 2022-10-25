const { ActionRowBuilder, SelectMenuBuilder, ComponentType } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const config = require("../../config.json");
const wait = require('node:timers/promises').setTimeout;
const resource = require("../../shopList/resources.json");
const item = require("../../shopList/items.json");

module.exports = {
  name: "shop",
  description: "Buy some tiems from the shop!",
  category: "RolePlay",

  run: async (client, interaction) => {

    const { user, guild } = interaction;

    let resourceList = "";
    let itemList = "";

    resource.map(el => {
        resourceList += `${config.emojis[el.emoji]}**${el.name}** : ${config.emojis.currency}${el.price}\n${el.category}\n\n`;
    });
    let resources = new EmbedBuilder()
    .setTitle("Resources's Shop")
    .setColor(config.colours.embed)
    .setDescription(resourceList)
    .setTimestamp();


    item.map(el => {
        itemList += `${config.emojis[el.emoji]}**${el.name}** : ${config.emojis.currency}${el.price}\n${el.category}\n\n`;
    });
    let items = new EmbedBuilder()
    .setTitle("Items's Shop")
    .setColor(config.colours.embed)
    .setDescription(itemList)
    .setTimestamp();

    const row = new ActionRowBuilder()
    .addComponents(
      new SelectMenuBuilder()
      .setCustomId('menu')
      .setPlaceholder('Explore more shops today!')
      .addOptions(
        {
          label: "Resources Shop",
          description: "Get some resources from Resources Shop",
          value: "resourcesShop"
        },
        {
          label: "Items Shop",
          description: "Get some useful items from Items Shop",
          value: "itemsShop"
        }
      ),
    );

    let message = await interaction.reply({ embeds: [resources], components: [row] });

    const collector = message.createMessageComponentCollector({
      filter: fn => fn,
      componentType: ComponentType.SelectMenu,
      time: 20000
    });

    collector.on('collect', async i => {
      if (i.user.id === interaction.user.id) {
        if (i.customId === 'menu') {
          await i.deferUpdate();
          if (i.values[0] === 'resourcesShop') {
            await wait(100);
            await i.editReply({ embeds: [resources] });
          } if (i.values[0] === 'itemsShop') {
            await wait(100);
            await i.editReply({ embeds: [items] });
          } else {
            return i.reply({ content: `These menu aren't for you!`, ephemeral: true });
          }
        }
      }
    });
  }
}