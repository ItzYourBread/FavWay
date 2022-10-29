const Discord = require("discord.js");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { ActionRowBuilder, SelectMenuBuilder, ButtonStyle, ButtonBuilder, ComponentType, Client } = require("discord.js");
const config = require("../../config.json");
const { Profile } = require("../../database/game/profile");

module.exports = {
    name: 'help',
    description: 'Get help from FavWay and List of Commands',
    category: 'Utility',
    options: [{
      name: 'type',
      description: 'What type of help do you want?',
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: 'Support', value: 'support' },
        { name: 'Command List', value: 'commands' }
      ]
    }],

    run: async (client, interaction) => {

      const { user, guild } = interaction;

      const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

      userData.commandRans += 1;
      userData.save();

      if (interaction.options.get("type").value === 'support') {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
            .setTitle('FavWay Support')
            .setColor(config.colours.embed)
            .setDescription('FavWay Support')
            .setTimestamp(),
          ],
        });
      }

      if (interaction.options.get("type").value === 'commands') {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
            .setTitle('FavWay Commands')
            .setColor(config.colours.embed)
            .setDescription('FavWay list of commands! To use type `/<command name>` for example `/ping` if you still need help join our [Discord server](https://discord.gg/Ea4jrSSrjM).')
            .addFields(
              {
                name: 'Utilities',
                value: '`help`, `ping`, `stats`',
                inline: false
              },
              {
                name: 'Reward',
                value: '`daily`',
                inline: false
              },
              {
                name: 'Statistics',
                value: '`inventory`, `zoo`, `profile`',
                inline: false
              },
              {
                name: 'Currency',
                value: '`balance`, `deposit`, `withdraw`',
                inline: false
              },
              {
                name: 'Market',
                value: '`sbop`, `buy`, `sell`',
                inline: false
              },
              {
                name: 'Work',
                value: '`chop`, `mine`, `hunt`, `fish`',
                inline: false
              }
            )
            .setTimestamp(),
          ],
        });
      }

      const logChannel = client.channels.cache.get(config.logs.roleplayLog)
        
        const logger = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Help Command]** run by **${interaction.user.tag}**`)
            .addFields(
                { name: "Guild:", value: `${guild.name}` }
            )
            .setTimestamp();
        
        logChannel.send({ embeds: [logger] }); 
      
    }
}