import { User } from "../../database/profile.js";
import config from "../../config.json" assert { type: "json" };

export default {
  data: {
    name: "balance",
    description: "Check your balance",
  },
  run: async (client, interaction) => {
    
    const user = interaction.member;
    const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });

    userData.commandRans += 1;
    userData.save();
    
    let balance = {
      title: `${user.username}'s Balance`,
      color: 0xcec6ff,
      description: `**Coin:** ${config.emojis.coin}${userData.coins.toLocaleString()}\n**Gem:** ${config.emojis.gem}${userData.gems.toLocaleString()}`,
      timestamp: new Date()
    }
    
    await interaction.createMessage({ embeds: [balance] });
  }
}