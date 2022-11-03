import { Constants } from "eris";
import config from "../../config.json" assert { type: "json" };

export default {
  data: {
    name: "help",
    description: "Get a help from FavWay",
    options: [{
      name: "type",
      description: "What type of help do you need?",
      type: 3,
      required: true,
      choices: [
        { name: "Commands", value: "commands" },
        { name: "Support", value: "support" }
      ]
    }],
  },
  run: async (client, interaction) => {
    if (interaction.data.options[0].value === "commands") {
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
    } else if (interaction.data.options[0].value === "support") {
      
      let support = {
        title: "Support",
        color: Number(config.colours.embed),
        description: `Use the select menu to get support!`,
        timestamp: new Date()
      }

      await interaction.createMessage({ embeds: [support] });
    }
  }
}