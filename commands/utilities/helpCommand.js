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
            { name: "Commands", value: "commands" }
          ]
        }],
    },
    run: async (client, interaction) => {

      if(interaction.data.options[0].value === "commands") {
      let help = {
        title: "Help",
        color: 0xcec6ff,
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
        ],
        timestamp: new Date()
      }
        await interaction.createMessage({ embeds: [help] });
       }
    }
}