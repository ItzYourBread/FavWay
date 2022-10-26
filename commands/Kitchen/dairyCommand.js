const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { ApplicationCommandOptionType } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const config = require("../../config.json");
const { ms } = require("printly.js");
const wait = require('node:timers/promises').setTimeout;
const dairyList = require("../../kitchen/dairy.json");

module.exports = {
  name: "dairy",
  description: "Make dairy today!",
  category: "Kitchen",
  options: [{
    name: "item",
    description: "choice a item which you want to make.",
    type: ApplicationCommandOptionType.String,
    required: true,
    choices: dairyList
  }],

  run: async (client, interaction) => {
    
  }
}