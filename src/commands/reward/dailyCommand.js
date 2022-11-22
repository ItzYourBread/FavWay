import { User } from "../../database/profile.js";
import { ms } from "printly.js";
import config from "../../config.json" assert { type: "json" };
import moment from "moment";
import "moment-duration-format";

export default {
  data: {
    name: "daily",
    description: "Get your daily reward!"
  },
  run: async (client, interaction) => {

    const user = interaction.member;
    const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });

    const duration = moment
        .duration(userData.cooldowns.daily - Date.now())
        .format("h[h] m[m], s[s]");

    /* if (user && userData.cooldowns.daily > Date.now()) {
      return interaction.createMessage({
        embeds: [{
          title: "Already claimed!",
          color: Number(config.colours.error),
          description: `You have already claimed today daily reward!\nWait ${duration} for next daily reward.`,
          timestamp: new Date()
        }],
        flags: 64
      });
    } */

    let streakResetMessage = "";
    if (Date.now() - userData.cooldowns.daily > 172800000) { // 172800000 = 2 days
      userData.streaks.daily = 1;
      streakResetMessage += "Seens you didnt claimed your daily to daily, i reset your streak to 1 back!";
    } else {
      userData.streaks.daily += 1;
    }

    var dailyReset = new Date();

    let amount = 350;
    let prestigeBonus = 0;
    let streak = userData.streaks.daily + 1;
    const streakBonus = Math.round((0.7 * amount) * streak);
    if (streak > 1) {
      amount += amount + streakBonus;
    }
    if (userData.prestige > 1) {
      prestigeBonus += Math.floor(Math.random() * 500) + 100;
    }

    userData.coins += amount + prestigeBonus;
    userData.foods.apples += 2;
    userData.items.dailyCrate += 1;
    userData.cooldowns.daily = dailyReset.setUTCHours(23,59,59,999);;
    userData.save();
    
    let reward = {
      title: "Daily claimed!",
      color: 0xcec6ff,
      description: `+ ${amount.toLocaleString()} **${config.emojis.coin}Coin**\n+ 2 **${config.emojis.apple}Apple**`,
      fields: [
        {
          name: "Prestige bonus",
          value: `${prestigeBonus.toLocaleString()}`,
          inline: true
        },
        {
          name: `Streak`,
          value: `${userData.streaks.daily.toLocaleString()}`,
          inline: false
        },
        {
          name: `Next daily`,
          value: `<t:${Math.floor(userData.cooldowns.daily / 1000) + 3600}:R>`,
          inline: false
        },
      ],
      timestamp: new Date()
    }

    await interaction.createMessage({ content: `\ ${streakResetMessage}  \ `, embeds: [reward] });
  }
}