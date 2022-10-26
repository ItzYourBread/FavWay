const { ActionRowBuilder, SelectMenuBuilder, ComponentType } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const config = require("../../config.json");
const wait = require('node:timers/promises').setTimeout;
const resource = require("../../inventory/resources.json");
const item = require("../../inventory/items.json");
const food = require("../../inventory/foods.json");

module.exports = {
  name: "inventory",
  description: "Check your Inventory",
  botPerm: [""],
  category: "RolePlay",
  options: [{
    name: 'user',
    description: 'Please enter a user to look their inventory.',
    type: Discord.ApplicationCommandOptionType.User,
    required: false
  }],

  run: async (client, interaction) => {
    await interaction.deferReply();
    var inventoryRes = "";
    var inventoryFoods = "";
    var inventoryItems = "";
    const user = interaction.options.getUser('user') || interaction.user;
    const { guild } = interaction;

    const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

    userData.commandRans += 1;
    userData.save();

    resource.map(el => {
      if (user && userData.resources[el.value] && userData.resources[el.value] >= 1) {
        inventoryRes += `${config.emojis[el.emoji]}**${el.name}** : ${userData.resources[el.value]}\n${el.category}\n\n`;
      }
    });
    if (!inventoryRes) {
      inventoryRes = `You don't have any resources!`;
    }
    let resources = new EmbedBuilder()
      .setTitle(`${user.username}'s Inventory`)
      .setColor(config.colours.embed)
      .setThumbnail(user.displayAvatarURL())
      .setDescription(inventoryRes)
      .setTimestamp();

    item.map(el => {
      if (user && userData.items[el.value] && userData.items[el.value] >= 1) {
        inventoryItems += `${config.emojis[el.emoji]}**${el.name}** — ${userData.items[el.value]}\n${el.category}\n\n`;
      }
    });
    if (!inventoryItems) {
      inventoryItems = `You don't have any items!`;
    }
    let items = new EmbedBuilder()
      .setTitle(`${user.username}'s Inventory`)
      .setDescription(inventoryItems)
      .setColor(config.colours.embed)
      .setThumbnail(user.displayAvatarURL())
      .setTimestamp()

    food.map(el => {
      if (user && userData.foods[el.value] && userData.foods[el.value] >= 1) {
        inventoryFoods += `${el.emoji}**${el.name}** — ${userData.foods[el.value]}\n${el.category}\n\n`;
      }
    });
    if (!inventoryFoods) {
      inventoryFoods = `You don't have any foods!`;
    }
    let foods = new EmbedBuilder()
      .setTitle(`${user.username}'s Inventory`)
      .setColor(config.colours.embed)
      .setThumbnail(user.displayAvatarURL())
      .setDescription(inventoryFoods)
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new SelectMenuBuilder()
          .setCustomId('inventory')
          .setPlaceholder('View items by category.')
          .addOptions(
            {
              label: 'Resources',
              description: 'View your resources',
              value: 'resources',
            },
            {
              label: 'Items',
              description: 'View your items',
              value: 'items'
            },
            {
              label: 'Foods',
              description: 'View your foods',
              value: 'foods',
            }
          ),
      );


    let message = await interaction.editReply({ embeds: [resources], components: [row], fetchReply: true });

    const logChannel = client.channels.cache.get(config.logs.roleplayLog)

    const logger = new EmbedBuilder()
      .setColor(config.colours.logger)
      .setTitle("Command log")
      .setDescription(`**[Inventory Command]** run by ${interaction.user.tag}`)
      .addFields(
        { name: "Guild:", value: `${guild.name}` }
      )
      .setTimestamp();

    logChannel.send({ embeds: [logger] });

    const collector = message.createMessageComponentCollector({
      filter: fn => fn,
      componentType: ComponentType.SelectMenu,
      time: 20000
    });

    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id)
      return i.reply({ 
        content: `These SelectMenu aren't for you!`, 
        ephemeral: true 
      });
      if (i.customId === 'inventory') {
        await i.deferUpdate();
        if (i.values[0] === 'resources') {
          await wait(100);
          await i.editReply({ embeds: [resources], components: [row], fetchReply: true });
        } if (i.values[0] === 'items') {
          await wait(100);
          await i.editReply({ embeds: [items], components: [row], fetchReply: true });
        } if (i.values[0] === 'foods') {
          await wait(100);
          await i.editReply({ embeds: [foods], components: [row], fetchReply: true });
        }
      }
    });
  }
}