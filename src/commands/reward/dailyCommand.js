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

    if (user && userData.cooldowns.daily > Date.now()) {
      return interaction.createMessage({
        embeds: [{
          title: "Already claimed!",
          color: Number(config.colours.error),
          description: `You have already claimed this daily reward today!\nWait ${duration} for next daily reward.`,
          timestamp: new Date()
        }],
      });
    }
    
    if (Date.now() - userData.cooldowns.daily > 172800000) {
      userData.streaks.daily -= userData.streaks.daily;
    }
    
    function DateUTC() {
      const d = new Date, z = d.getTimezoneOffset();
      d.setDate(d.getDate()+1); d.setHours(0); d.setSeconds(0); 
      d.setMilliseconds(0); d.setMinutes(0+z);
      return d.getTime()-Date.now();
    }
    let result = DateUTC();

    let amount = 350;
    let streak = userData.streaks.daily + 1;
    const streakBonus = Math.round((0.7 * amount) * streak);
    if (streak > 1) {
      amount = amount + streakBonus;
    }

    userData.coins += amount;
    userData.streaks.daily += 1;
    userData.cooldowns.daily = Date.now() + result;
    userData.save();
    
    let reward = {
      title: "Daily claimed!",
      color: 0xcec6ff,
      description: `${config.emojis.coin}${amount.toLocaleString()} has been added to your balance!`,
      fields: [
        {
          name: `Streak`,
          value: `${userData.streaks.daily.toLocaleString()}`,
          inline: true
        },
        {
          name: `Prestige`,
          value: `[${userData.prestige}]`,
          inline: true
        },
      ],
      timestamp: new Date()
    }

    await interaction.createMessage({ embeds: [reward] });
  }
}