import { User } from "../../database/profile.js";
import config from "../../config.json" assert { type: "json" };
import { ms } from "printly.js";
import moment from "moment";
import "moment-duration-format";

export default {
  data: {
    name: "mine",
    description: "Let's mine something today!"
  },
  run: async (client, interaction) => {

    const user = interaction.member;
    const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });

    let amount = "";
    let amount2 = "";

    const duration = moment 
        .duration(userData.cooldowns.mine - Date.now())
        .format("m[m], s[s]");

    if (user && userData.cooldowns.mine > Date.now()) {
      return interaction.createMessage({
        embeds: [{
          title: "take a break",
          color: 0xff8d8d,
          description: `You can mine again in \`${duration}\` `,
          timestamp: new Date(),
        }],
      });
    }

    if (user && userData.pickaxe.iron >= 1) {
      let amount = Math.floor(Math.random() * 40) + 15;
      let amount2 = Math.floor(Math.random() * 18) + 7;

      userData.cooldowns.mine = Date.now() + ms("3m");
      userData.resources.stones += amount;
      userData.resources.ironOres += amount2;
      userData.commandRans += 1;
      userData.health.pickaxe.iron += 1;
      
      if (userData.health.pickaxe.iron == 25) {
        userData.health.pickaxe.iron -= 25;
        userData.pickaxe.iron -= 1;
      }
      userData.save();

      await interaction.createMessage({
        embeds: [{
          color: 0x8dff99,
          description: `${user.username} found **${amount2} ${config.emojis.ironOre}Iron Ore** and **${amount} ${config.emojis.stone}Stone** from cave.`,
          timestamp: new Date()
        }],
      });
    } else if (user && userData.pickaxe.stone >= 1) {
      
      let amount = Math.floor(Math.random() * 13) + 3;

      userData.cooldowns.mine = Date.now() + ms("1m");
      userData.resources.stones += amount;
      userData.commandRans += 1;
      userData.health.pickaxe.stone += 1;
    
      if (userData.health.pickaxe.stone == 18) {
        userData.health.pickaxe.stone -= 18;
        userData.pickaxe.stone -= 1;
      }
      userData.save();

      await interaction.createMessage({
        embeds: [{
          color: 0x8dff99,
          description: `${user.username} found **${amount} ${config.emojis.stone}Stone** from cave.`,
          timestamp: new Date()
        }],
      });
    } else {
      userData.commandRans += 1;
      userData.save();
      await interaction.createMessage({
        embeds: [{
          title: "Missing Pickaxe!",
          color: 0xff8d8d,
          description: `You need pickaxe for mining stones and ores\nType \`/shop\` to buy a pickaxe!`,
          timestamp: new Date()
        }],
      });
    }
  }
}