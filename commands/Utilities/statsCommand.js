const { EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const { Profile } = require("../../database/game/profile");
const { printly, ms } = require("printly.js");
const config = require("../../config.json");
const osu = require('node-os-utils');
const si = require('systeminformation');
const cpu = osu.cpu;
const drive = osu.drive;
const mem = osu.mem;
const os = osu.os;
const moment = require("moment");
require("moment-duration-format");

module.exports = {
  name: "stats",
  description: "Check out FavWay Statistics.",
  botPerm: [""],
  category: "Utilities",

  run: async (client, interaction) => {

    const { user } = interaction;
    const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

    userData.commandRans += 1;
    userData.save();

    if (!client.shard >= 1) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Unable to run")
        ],
      });
    }

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Loading...")
          .setColor(config.colours.embed)
          .setDescription(`Please wait we are collecting **${config.bot.name}** data for you.`)
          .setTimestamp(),
      ],
    });

    let runs = 0;
    let coins = 0;
    let crafts = 0;

    const guildstotal = await client.shard.fetchClientValues('guilds.cache.size');
    const userstotal = await client.shard.fetchClientValues('users.cache.size');
    const channelstotal = await client.shard.fetchClientValues('channels.cache.size');

    const uptimeDuration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

    const cpuCount = cpu.count();
    let cpuUsagePercentage;
    let driveInfo;
    let memInfo;
    let osInfo;
    let processor;
    await cpu.usage().then(cpuPercentage => {
      cpuUsagePercentage = cpuPercentage;
    });
    await drive.info().then(info => {
      driveInfo = info;
    }).catch(err => {
      driveInfo = {
        totalGb: err.name,
        usedGb: err.name,
        freeGb: err.name,
        usedPercentage: err.name,
        freePercentage: err.name,
      };
    });
    await mem.info().then(info => {
      memInfo = info;
    });
    await os.oos().then(info => {
      osInfo = info;
    });
    await si.cpu()
      .then(data => processor = data)
      .catch(error => console.error(error));

    const users = await Profile.find();
    for (let member of users) {
      runs += member.commandRans;
      coins += member.coins;
      crafts += member.craftCount;
    }
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`**${config.bot.name}** Statistics`)
          .setColor(config.colours.embed)
          .setDescription(`Here is **${config.bot.name}** full statistics.`)
          .setFields(
            {
              name: 'General',
              value: `** **\ **Shards:** ${client.shard.count}\n  **Servers:** ${guildstotal.toLocaleString()}\n  **Users:** ${userstotal.toLocaleString()}\n  **Channels:** ${channelstotal.toLocaleString()}\n** **`,
              inline: false
            },
            {
              name: 'System',
              value: `** **\ **CPU Core:** ${cpuCount}\n  **CPU Usage:** ${cpuUsagePercentage.toFixed(2)}%\n  **Drive Usage:** ${driveInfo.usedGb}GB (${driveInfo.usedPercentage}%)\n  **Memory Usage:** ${(memInfo.usedMemMb / 1000).toFixed(2)}GB (${(100 - memInfo.freeMemPercentage).toFixed(2)}%)\n  **Operating System:** ${osInfo}\n  **Processor:** ${processor.manufacturer}\n  **Uptime:** ${uptimeDuration}\n** **`,
              inline: false
            },
            {
              name: "FavWay",
              value: `** **\ **Commands ran:** ${runs.toLocaleString()}\n  **Total FWC:** ${coins.toLocaleString()}\n  **Total Crafts:** ${crafts.toLocaleString()}\n** **`,
              inline: false
            }
          )
          .setTimestamp(),
      ],
    });
  }
}