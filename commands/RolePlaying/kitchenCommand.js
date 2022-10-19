const { ActionRowBuilder, SelectMenuBuilder, ComponentType, Client } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const config = require("../../config.json");
const emojis = require("../../api/emojis.json");
const tips = require('../../tips.json');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  name: "kitchen",
  description: "Let's make some foods today!",
  category: "RolePlay",
  // we can do select menus?
  run: async (client, interaction) => {
   console.log("Working")
  }
}