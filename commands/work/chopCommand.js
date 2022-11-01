import { User } from "../../database/profile.js";
import config from "../../config.json" assert { type: "json" };

export default {
  data: {
    name: "chop",
    description: "Chop some trees today!",
  },
  run: async (client, interaction) => {

    const user = interaction.member;
    const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });

    let amount = "";

    if (user && userData.axe.iron >= 1) {
      
      if (user && userData.boost.cakeNormal > Date.now()) {
      amount = Math.floor(Math.random() * 110) + 65;
      } else {
      amount = Math.floor(Math.random() * 40) + 15;
      }
      
      userData.resources.woods += amount;
      userData.health.axe.iron += 1;
      if (userData.health.axe.iron == 25) {
        userData.health.axe.iron -= 25;
        userData.axe.iron -= 1;
      }
      userData.save();
      
      await interaction.createMessage({
        embeds: [{
          title: "Chopped!",
          color: 0x8dff99,
          description: `${user.username} has chopped a trees and got **${amount} ${config.emojis.wood}Woods**`,
          timestamp: new Date()
        }],
      });
    }
    
  }
}