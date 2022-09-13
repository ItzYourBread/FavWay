const { ActionRowBuilder, EmbedBuilder, SelectMenuBuilder, ComponentType, Client } = require('discord.js');
const { ApplicationCommandOptionType } = require("discord.js");
const { User } = require("../../database/game/profile");
const Discord = require("discord.js");
const config = require("../../config.json");
const emojis = require("../../api/emojis.json");
const tips = require('../../tips.json');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: "break",
    description: "SubCommand of work",
    botPerm: [""],
    category: "Work",
    options: [{
      name: 'tree',
      description: 'break some trees and get woods, require: axe',
      type: ApplicationCommandOptionType.Subcommand,
    }],
    
    run: async (client, interaction) => {
        
    }
};