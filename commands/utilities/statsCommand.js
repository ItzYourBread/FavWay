import { Constants } from "eris";
import config from "../../config.json" assert { type: "json" };

export default {
  data: {
    name: "stats",
    description: "Get FavWay stats",
  },
  run: async (client, interaction) => {

    const { guild, member } = interaction;

    let loading = {
      title: "Loading",
      color: 0xcec6ff,
      description: "You have to wait some minutes we are collecting data for you!\nPlease wait...",
      timestamp: new Date()
    }
    await interaction.createMessage({ embeds: [loading] });

    let users = 0;
    let channels = 0;
    let guilds = client.guilds.size;

    client.guilds.find((b) => {
      users = users + client.guilds.get(b.id).members.size;
    });

    client.guilds.find((b) => {
      channels = channels + client.guilds.get(b.id).channels.size;
    });

    let stats = {
      color: 0xcec6ff,
      fields: [
        {
          name: "General",
          value: `**Servers:** \`${guilds}\`\n**Users:** \`${users}\`\n**Channels:** \`${channels}\` `,
          inline: false
        }
      ],
      timestamp: new Date()
    }
    await interaction.editOriginalMessage({ embeds: [stats] });
  }
}