const { EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const { Profile } = require("../../database/game/profile");
const { printly, ms } = require("printly.js");
const config = require("../../config.json");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
  name: "stats",
  description: "Check out FavWay Statistics.",
  botPerm: [""],
  category: "Utilities",

  run: async (client, interaction) => {
    let runs = 0;
    const { user } = interaction;

    const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

    userData.commandRans += 1;
    userData.save();

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Loading...")
          .setColor(config.colours.embed)
          .setDescription(`Please wait we are collecting **${config.bot.name}** data for you.`)
          .setTimestamp(),
      ],
    });

    const guildstotal = await client.shard.fetchClientValues('guilds.cache.size')
    const userstotal = await client.shard.fetchClientValues('users.cache.size')
    const channelstotal = await client.shard.fetchClientValues('channels.cache.size')

    const uptimeDuration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

    const users = await Profile.find();
    for(let member of users){
      runs += member.commandRans;
      console.log(`UserRun:${member.commandRans}`);
    }
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`**${config.bot.name}** Statistics`)
          .setColor(config.colours.embed)
          .setDescription(`Here is **${config.bot.name}** full statistics of this month.`)
          .setFields(
            {
              name: 'General',
              value: `**Servers:** ${guildstotal.toLocaleString()}\n**Users:** ${userstotal.toLocaleString()}\n**Channels:** ${channelstotal.toLocaleString()}`,
              inline: false
            },
            {
              name: 'System',
              value: `**Uptime:** ${uptimeDuration}`,
              inline: false
            },
            {
              name: "FavWay",
              value: `**Commands ran:** ${runs.toLocaleString()}`,
              inline: false
            }
          )
          .setTimestamp(),
      ],
    });
  }
}