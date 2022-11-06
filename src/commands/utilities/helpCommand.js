import config from "../../config.json" assert { type: "json" };

export default {
  data: {
    name: "help",
    description: "Help subcommands!"
  },
  run: async (client, interaction) => {
   
      let commands = {
        title: "Commands List",
        color: Number(config.colours.embed),
        description: `Help! here is our list of commands, if you still need help join our [discord server](https://discord.gg/Ea4jrSSrjM) and be part of our community today.`,
        fields: [
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
            name: `Player`,
            value: '`settings`',
            inline: false
          },
          {
            name: 'Statistics',
            value: '`inventory`, `balance`, `zoo`, `profile`',
            inline: false
          },
          {
            name: 'Market',
            value: '`shop`, `buy`, `sell`',
            inline: false
          },
          {
            name: 'Work',
            value: '`chop`, `mine`, `hunt`, `fish`',
            inline: false
          }
        ],
        timestamp: new Date()
      }
        await interaction.createMessage({ embeds: [commands] });
  }
}