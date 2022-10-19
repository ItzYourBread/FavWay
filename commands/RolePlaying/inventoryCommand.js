const { ActionRowBuilder, SelectMenuBuilder, ComponentType, Client } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const config = require("../../config.json");
const emojis = require("../../api/emojis.json");
const tips = require('../../tips.json');
const wait = require('node:timers/promises').setTimeout;
const { resource } = require("../../inventory.json");

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
    var inventoryRes =  `You don't have any resources!`;
    const user = interaction.options.getUser('user') || interaction.user;
    const { guild } = interaction;

    const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

    userData.commandRans += 1;
    userData.save();
    
    resource.map(el => { 
      if (user && userData.resources[el.value] && userData.resources[el.value] > 1) {
      inventoryRes += `${config.emojis[el.emoji]}**${el.name}** — ${userData.resources[el.value]}\n${el.category}\n\n`;
      }
    });
    
    let resources = new EmbedBuilder()
      .setTitle(`${user.username}'s Inventory`)
      .setColor(config.colours.embed)
      .setThumbnail(user.displayAvatarURL())
      .setDescription(inventoryRes)
      .setTimestamp();

    if (userData.axe.stone || userData.pickaxe.stone || userData.axe.iron || userData.pickaxe.iron) {
      toolsMessage = "Nice tools";
    } else {
      toolsMessage = "You don't have any tools";
    }
    let tools = new EmbedBuilder()
      .setTitle(`${user.username}'s Inventory`)
      .setDescription(`${toolsMessage}`)
      .setColor(config.colours.embed)
      .setThumbnail(user.displayAvatarURL())
      .setTimestamp()
    if (userData.axe.iron) {
      tools.addFields({ name: `Iron Axe`, value: `own` })
    }
    if (userData.pickaxe.iron) {
      tools.addFields({ name: `Iron Pickaxe`, value: `own` })
    }
    if (userData.axe.stone) {
      tools.addFields({ name: `Stone Axe`, value: `own` })
    }
    if (userData.pickaxe.stone) {
      tools.addFields({ name: `Stone Pickaxe`, value: `own` })
    }


    if (userData.items.furnace || userData.items.forge) {
      toolsMessage = "Nice items";
    } else {
      toolsMessage = "You don't have any items";
    }
    let items = new EmbedBuilder()
      .setTitle(`${user.username}'s Inventory`)
      .setDescription(`${toolsMessage}`)
      .setColor(config.colours.embed)
      .setThumbnail(user.displayAvatarURL())
      .setTimestamp()
    if (userData.items.furnace) {
      items.addFields({ name: `${config.emojis.idleFurnace}Furnace`, value: `own` })
    }
    if (userData.items.forge) {
      items.addFields({ name: `${config.emojis.forge}Forge`, value: `own` })
    }


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
              label: 'Tools',
              description: 'View your tools',
              value: 'tools',
            },
            {
              label: 'Items',
              description: 'View your items',
              value: 'items'
            }
          ),
      );


    let message = await interaction.editReply({ embeds: [resources], components: [row], fetchReply: true });
items = "";
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

    collector.on('collect', i => {
      if (i.user.id === interaction.user.id)
        return i.reply({ content: `These menu aren't for you!`, ephemeral: true });
    });


    client.on('interactionCreate', async (interaction, client) => {
      if (!interaction.isSelectMenu()) return;

      switch (interaction.values[0]) {
        case "items":
          await interaction.update({ embeds: [items], components: [row] })
          break;
        case "tools":
          await interaction.update({ embeds: [tools], components: [row] })
          break;
        case "resources":
          await interaction.update({ embeds: [resources], components: [row] })
          break;
      };
    });
  }
}
