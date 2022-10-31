import { Constants } from "eris";

export default {
  data: {
    name: "ping",
    description: "Ping pong",
    type: Constants.ApplicationCommandTypes.CHAT_INPUT
  },
  run: async (client, interaction) => {

    var ping = Date.now() - interaction.createdAt;

    await interaction.createMessage({ content: `Pong! \`${ping}ms\` ` });
  }
}