import config from "../../config.json" assert { type: "json" };
import tutorialCommandsList from "../../data/commandList.json" assert { type: "json" };

export default {
  data: {
    name: "help",
    description: "Help subcommands!",
    options: [
      {
        name: "commands",
        description: "Get full list of commands!",
        type: 1
      },
      {
        name: "tutorial",
        description: "Get tutorial of all commands!",
        type: 1,
        options: [{
          name: "command",
          description: "Select a command which you need tutorial of that command! (e.g. 'ping')",
          type: 3,
          required: true,
          choices: tutorialCommandsList
        }],
      }
    ],
  },
  run: async (client, interaction) => {

    if (interaction.data.options[0].name === "commands") {
      let commands = {
        title: "Commands List",
        color: Number(config.colours.embed),
        description: `Help! here is our list of commands, if you still need help join our [discord server](https://discord.gg/Ea4jrSSrjM) and be part of our community today.`,
        fields: [
          {
            name: 'Utilities',
            value: '`help commands`, `help tutorial`, `ping`, `stats`',
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
          },
          {
            name: 'Prestige',
            value: '`prestige view`, `prestige reward`',
            inline: false
          }
        ],
        timestamp: new Date()
      }
        await interaction.createMessage({ embeds: [commands] });
      
    } else if (interaction.data.options[0].name === "tutorial") {
      
      let choice = interaction.data.options[0].options[0].value;
      const tutorialList = tutorialCommandsList.find((items) => { if (items.value === choice) { return items; } });
      
      let tutorial = {
        title: "Tutorial",
        color: Number(config.colours.embed),
        description: `**Name:** ${tutorialList.command}\n**Type:** ${tutorialList.type}\n**Usage:** ${tutorialList.tutorial}`,
        timestamp: new Date()
      }
        await interaction.createMessage({ embeds: [tutorial] });
    }
  }
}