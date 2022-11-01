import { Constants } from "eris";
import config from "../../config.json" assert { type: "json" };

export default {
  data: {
    name: "stats",
    description: "Get FavWay stats",
  },
  run: async (client, interaction) => {
    
    const { guild } = interaction;

    let loading = {
      title: "Loading",
      color: 0xcec6ff,
      description: "You have to wait some minutes we are collecting data for you!\nPlease wait...",
      timestamp: new Date()
    }
    await interaction.createMessage({ embeds: [loading] });

    let stats = {
      color: 0xcec6ff,
      fields: [
        {
          name: "General",
          value: `**Servers:** ${client.guilds.size}\n**Users:** ${client.guilds.get(id).members.map((m) => m.id).size.toLocaleString()}`,
          inline: false
        }
      ],
      timestamp: new Date()
    }
    await interaction.editOriginalMessage({ embeds: [stats] });
  }
}