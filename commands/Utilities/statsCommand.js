const { EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const { Profile } = require("../../database/game/profile");
const { printly, ms } = require("printly.js");
const config = require("../../config.json");
//

module.exports = {
    name: "statistics",
    description: "Check out FavWay Statistics.",
    botPerm: [""],
    category: "Utilities",
    
    run: async (client, interaction) => {

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

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
          .setTitle(`**${config.bot.name}** Statistics`)
          .setColor(config.colours.embed)
          .setDescription(`Here is **${config.bot.name}** full statistics of this month.`)
          .setFields(
            {
              name: 'General',
              value: `**Servers:** ${guildstotal}\n**Users:** ${userstotal}\n**Channels:** ${channelstotal}`
            }
          )
          .setTimestamp(),
        ],
      });
    }
}