const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { ApplicationCommandOptionType } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const config = require("../../config.json");
const emojis = require("../../api/emojis.json");
const tips = require("../../tips.json");
const { ms } = require("printly.js");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  name: "buy",
  description: "Buy an item from the shop.",
  category: "market",
  options: [{
    name: "resources_shop",
    description: "Select the item you want to buy.",
    type: ApplicationCommandOptionType.String,
    choices: [
      { name: "Wood", value: "woods" }
    ]
  }],

  run: async (client, interaction) => {
    
  }
}