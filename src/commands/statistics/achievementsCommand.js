import { User } from "../../database/profile.js";
import config from "../../config.json" assert { type: "json" };
import { Constants } from "eris";

export default {
  data: {
    name: "achievements",
    description: "View your achievements progress",
    options: [{
      name: "user",
      description: "Please enter a user.",
      type: Constants.ApplicationCommandOptionTypes.USER,
      required: false
    }],
  },
  run: async (client, interaction) => {
    
    const user_id = interaction.data.options && interaction.data.options[0] ? interaction.data.options[0].value : interaction.member.id;
    const user = await client.users.get(user_id);
    const userData = await User.findOne({ id: user_id }) || new User({ id: user_id });

    let regularUserProgressSize;
    let regularUserBarLength;
    let regularUserProgress;
    
    if (user && userData.achievements.regularUser) {
      regularUserBarLength = `■■■■■■■■■■■■■■■■■`;
      regularUserProgress = `500`;
    } else {
      regularUserProgressSize = Math.floor(userData.commandRans / 29);
      regularUserProgress = userData.commandRans;
    }
   
    let achievements = {
      title: `${user.username}'s Achievements`,
      color: Number(config.colours.embed),
      fields: [
        {
          name: "Regular User",
          value: `${regularUserProgress}/500 Run Commands\n\`[${regularUserBarLength}]\`\n**Rewards:**\n${config.emojis.coin}20,000\nRegular User(title)`,
          inline: true
        }
      ],
      timestamp: new Date()
    }
    await interaction.createMessage({ embeds: [achievements] });
  }
}