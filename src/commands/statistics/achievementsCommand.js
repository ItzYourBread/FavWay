import { User } from "../../database/profile.js";
import config from "../../config.json" assert { type: "json" };

export default {
  data: {
    name: "achievements",
    description: "View your achievements progress"
  },
  run: async (client, interaction) => {
    
    const user = interaction.member;
    const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });

    const regularUserProgressSize = Math.floor(userData.commandRans / 29);
    
    let regularUserBarLength = '■'.repeat(regularUserProgressSize) + '□'.repeat(17 - regularUserProgressSize);
    let regularUserProgress = userData.commandRans;

    if (user && userData.achievements.regularUser) {
      regularUserBarLength = `■■■■■■■■■■■■■■■■■`;
      regularUserProgress = `500`;
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