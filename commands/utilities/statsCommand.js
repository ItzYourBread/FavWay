import { Constants } from "eris";
import config from "../../config.json" assert { type: "json" };

export default {
  data: {
    name: "stats",
    description: "Get FavWay stats",
  },
  run: async (client, interaction) => {
    
    const { user } = interaction;

    let loading = {
      title: "Loading",
      color: 0xcec6ff,
      description: "You have to wait some minutes we are collecting data for you!\nPlease wait...",
      timestamp: new Date()
    }
    await interaction.createMessage({ embeds: [loading] })

    let stats = {
      title: "Statistics",
      color: 0xcec6ff,
      description: "Here is the faveWay statistic!",
      fields: [
        {
          name: "General",
          value: "Eris testing!!",
          inline: false
        }
      ],
      timestamp: new Date()
    }
    await interaction.editOriginalMessage({ embeds: [stats] })
  }
}