import { Constants } from "eris";

export default {
  data: {
    name: "prestige",
    description: "Prestige a player",
    options: [
      {
        name: "view",
        description: "Look at your prestige!",
        type:1,
        options: [{
          name: "user",
          description: "Please enter a user.",
          type: Constants.ApplicationCommandOptionTypes.USER,
          required: false
        }]
      },
      {
        name: "reward",
        description: "Explore prestige reward and know!",
        type:1,
      }
    ],
  },
  run: async (client, interaction) => {

    if (interaction.data.options[0].name === "view") {
      console.log("View works!!");
    } else if (interaction.data.options[0].name === "reward") {
      console.log("Reward works!!");
    }
  }
}