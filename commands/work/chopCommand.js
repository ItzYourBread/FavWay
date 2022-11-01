import { User } from "../../database/profile.js";
import config from "../../config.json" assert { type: "json" };
import { ms } from "printly.js";
import moment from "moment";
import "moment-duration-format";

export default {
  data: {
    name: "chop",
    description: "Chop some trees today!",
  },
  run: async (client, interaction) => {

    const user = interaction.member;
    const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });

    let amount = "";

    const duration = moment 
        .duration(userData.cooldowns.chop - Date.now())
        .format("m[m], s[s]");

    if (user && userData.cooldowns.chop > Date.now()) {
      return interaction.createMessage({
        embeds: [{
          title: "take a break",
          color: 0xff8d8d,
          description: `You can chop again in \`${duration}\` `,
          timestamp: new Date()
        }],
      });
    }

    if (user && userData.axe.iron >= 1) {
      
      if (user && userData.boost.cakeNormal > Date.now()) {
      amount = Math.floor(Math.random() * 110) + 65;
      } else {
      amount = Math.floor(Math.random() * 40) + 15;
      }
      userData.cooldowns.chop = Date.now() + ms("3m");
      userData.resources.woods += amount;
      userData.health.axe.iron += 1;
      userData.commandRans += 1;
      if (userData.health.axe.iron == 25) {
        userData.health.axe.iron -= 25;
        userData.axe.iron -= 1;
      }
      userData.save();
      
      await interaction.createMessage({
        embeds: [{
          color: 0x8dff99,
          description: `${user.username} has chopped a trees and got **${amount} ${config.emojis.wood}Woods**.`,
          timestamp: new Date()
        }],
      });
    } else if (user && userData.axe.stone >= 1) {

      if (user && userData.boost.cakeNormal > Date.now()) {
        amount = Math.floor(Math.random() * 80) + 47;
      } else {
        amount = Math.floor(Math.random() * 13) + 3;
      }
      userData.cooldowns.chop = Date.now() + ms("3m");
      userData.resources.woods += amount;
      userData.health.axe.stone += 1;
      userData.commandRans += 1;
      if (userData.health.axe.stone == 15) {
        userData.health.axe.stone -= 15;
        userData.axe.iron -= 1;
      }
      userData.save();
      
      await interaction.createMessage({
        embeds: [{
          color: 0x8dff99,
          description: `${user.username} has chopped a trees and got **${amount} ${config.emojis.wood}Woods**.`,
          timestamp: new Date()
        }],
      });
    } else {
      userData.commandRans += 1;
      userData.save();
      await interaction.createMessage({
        embeds: [{
          title: "Missing Axe",
          color: 0xff8d8d,
          description: `You need axe to chop trees!\nType \`/shop\` to buy a axe!`,
          timestamp: new Date()
        }],
      })
    }
    
  }
}