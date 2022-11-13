import { User } from "../../database/profile.js";
import config from "../../config.json" assert { type: "json" };
import { Constants } from "eris";

export default {
  data: {
    name: "profile",
    description: "Profile SubCommand!",
    options: [{
      name: "user",
      description: "Please select a user.",
      type: Constants.ApplicationCommandOptionTypes.USER,
      required: false
    }],
  },
  run: async (client, interaction) => {

    const user_id = interaction.data.options && interaction.data.options[0] ? interaction.data.options[0].value : interaction.member.id;
    const user = await client.users.get(user_id);
    const userData = await User.findOne({ id: user_id }) || new User({ id: user_id });

    let profile = {
      title: `${user.username}'s Profile`,
      color: Number(config.colours.embed),
      description: `Profile info here`,
      timestamp: new Date()
    }
      await interaction.createMessage({ embeds: [profile] });
  }
}