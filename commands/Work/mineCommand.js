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
    name: "mine",
    description: "SubCommand of Mine",
    botPerm: [""],
    category: "Work",
    options: [{
      name: 'rocks',
      description: 'mine some rocks and get stones, require: stone pickaxe',
      type: ApplicationCommandOptionType.Subcommand
    }, {
      name: 'ores',
      description: 'mine some ores and get many differents ores require: iron pickaxe',
      type: ApplicationCommandOptionType.Subcommand
    }],
    
    run: async (client, interaction) => {
      
  if (interaction.options.getSubcommand() === "rocks") {

    const { guild } = interaction;
    const user = interaction.member.user;
        
    const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id }) 

    if (user && !userData.pickaxe.stone || !userData.pickaxe.iron)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error: stone/iron pickaxe required")
            .setColor(config.colours.error)
            .setDescription("You dont have pickaxe to mine rocks"),
        ],
      });
    
    const duration = moment
        .duration(userData.cooldowns.minerock - Date.now())
        .format("m[m], s[s]");

    if (userData.cooldowns.minerock > Date.now())
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Please be patient...")
            .setColor(config.colours.work)
            .setDescription(
              `⌛ You can mine rocks again in **\`${duration}\`**`
            ),
        ],
      });

    if (user && userData.pickaxe.stone || userData.pickaxe.iron) 
    amount = Math.floor((Math.random() * 10) + 5);

    userData.resources.stones += amount;
    userData.commandRans += 1;
    userData.cooldowns.minerock = Date.now() + ms("2m");
    userData.save();

    if (user && userData.pickaxe.stone || userData.pickaxe.iron)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Working Hard..")
            .setDescription(`You got **${amount}** ${config.emojis.stone}**Stones** from mining some rocks`)
            .setColor(config.colours.work)
            .setTimestamp(),
        ],
      });

      const logChannel = client.channels.cache.get(config.logs.workLog)
        
      const logger = new EmbedBuilder()
       .setColor(config.colours.logger)
       .setTitle("Command log")
       .setDescription(`**[Mine Rocks SubCommand]** run by **${interaction.user.tag}**`)
       .addFields(
          { name: "Value", value: `Got ${amount} stones from rocks` },
          { name: "Guild:", value: `${guild.name}` }
        )
       .setTimestamp();
        
        logChannel.send({ embeds: [logger] }); 
        
      } else if (interaction.options.getSubcommand() === "ores") {
    
    const { guild } = interaction;
    const user = interaction.member.user;
        
    const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id }) 

    if (user && !userData.pickaxe.iron)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error: iron pickaxe required")
            .setColor(config.colours.error)
            .setDescription("You dont have pickaxe to mine rocks"),
        ],
      });
    
    const duration = moment
        .duration(userData.cooldowns.mineore - Date.now())
        .format("m[m], s[s]");

    if (userData.cooldowns.mineore > Date.now())
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Please be patient...")
            .setColor(config.colours.work)
            .setDescription(
              `⌛ You can mine rocks again in **\`${duration}\`**`
            ),
        ],
      });

    if (user && userData.pickaxe.iron) 
    amount = Math.floor((Math.random() * 18) + 7);

    userData.resources.ironOres += amount;
    userData.cooldowns.mineore = Date.now() + ms("3m");
    userData.save();

    if (user && userData.pickaxe.iron)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Working Hard..")
            .setDescription(`You got **${amount}** ${config.emojis.ironOre}**Iron Ores** from mining some Ores`)
            .setColor(config.colours.work)
            .setTimestamp(),
        ],
      });

      const logChannel = client.channels.cache.get(config.logs.workLog)
        
      const logger = new EmbedBuilder()
       .setColor(config.colours.logger)
       .setTitle("Command log")
       .setDescription(`**[Mine Ores SubCommand]** run by **${interaction.user.tag}**`)
       .addFields(
          { name: "Value", value: `Got ${amount} Iron Ores from ores` },
          { name: "Guild:", value: `${guild.name}` }
        )
       .setTimestamp();
        
        logChannel.send({ embeds: [logger] }); 
      }
    } 
};