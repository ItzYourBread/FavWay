const { EmbedBuilder } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const config = require("../../config.json");
const emojis = require("../../api/emojis.json");
const tips = require('../../tips.json');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  name: "wool",
  description: "Get some wools today!",
  category: "RolePlay",

  run: async (client, interaction) => {
    console.log("Working")
  }
}