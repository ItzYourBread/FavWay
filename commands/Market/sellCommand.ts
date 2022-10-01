const { ActionRowBuilder, EmbedBuilder, SelectMenuBuilder, ComponentType, Client } = require('discord.js');
const { ApplicationCommandOptionType } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const moment = require("moment");
const config = require("../../config.json");
const emojis = require("../../api/emojis.json");
const tips = require('../../tips.json');
const { ms } = require('printly.js');
const wait = require('node:timers/promises').setTimeout; 
require('moment-duration-format');

module.exports = {
    name: "sell",
    description: "SubCommand of Sell",
    botPerm: [""],
    category: "Work",
    options: [{
      name: 'resources',
      description: 'Sell your resources to market and get some coins',
      type: ApplicationCommandOptionType.Subcommand,
    }],
    
    run: async (client, interaction) => {
      if (interaction.options.getSubcommand() === "resources") {
    
       }
    }
}