import { Constants } from "eris";
import config from "../../config.json" assert { type: "json" };
import moment from "moment";
import "moment-duration-format";

export default {
  data: {
    name: "stats",
    description: "Get FavWay stats",
  },
  run: async (client, interaction) => {

    const { guild, member } = interaction;

    let loading = {
      title: "Loading",
      color: Number(config.colours.embed),
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

    const uptime = moment
      .duration(client.uptime)
      .format(" D [days], H [hrs], m [mins], s [secs]");

    let stats = {
      color: Number(config.colours.embed),
      fields: [
        {
          name: "General",
          value: `** ** \ **Servers:** \`${guilds}\`\n  **Users:** \`${users}\`\n  **Channels:** \`${channels}\`\n ** ** `,
          inline: false
        },
        {
          name: "FavWay",
          value: `** ** \ Best info here \n** **`,
          inline: false
        },
        {
          name: "System",
          value: `** ** \ **Uptime:** \`${uptime}\`\n ** **`,
          inline: false
        }
      ],
      timestamp: new Date()
    }
    await interaction.editOriginalMessage({ embeds: [stats] });
  }
}