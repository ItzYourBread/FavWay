import { User } from "../../database/profile.js";
import config from "../../config.json" assert { type: "json" };
import { Constants } from "eris";

export default {
  data: {
    name: "slots",
    description: "Let's play with slots machine today!",
    options: [{
      name: "bet",
      description: "Please enter your bet, 500 to 250,000",
      type: Constants.ApplicationCommandOptionTypes.INTEGER,
      required: true
    }],
  },
  run: async (client, interaction) => {

    const user = interaction.member;
    const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });

    let test = {
      description: `${slots} ${moving}`
    }
    await interaction.createMessage({ embeds: [test] });
  }
}