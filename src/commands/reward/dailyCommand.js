import { User } from "../../database/profile.js";
import { ms } from "printly.js";
import config from "../../config.json" assert { type: "json" };

export default {
  data: {
    name: "daily",
    description: "Get your daily reward!"
  },
  run: async (client, interaction) => {

    const user = interaction.member;
    const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });

    if (user && userData.cooldowns.daily > Date.now()) {
      return interaction.createMessage({
        embeds: [{
          title: "Already claimed!",
          color: Number(config.colours.error),
          description: `You have already claimed today daily reward!\nYour next daily <t:${Math.floor(userData.cooldowns.daily / 1000) + 3600}:R>`,
          timestamp: new Date()
        }],
        flags: 64
      });
    } 

    let streakReset = false;
    if (Date.now() - userData.cooldowns.daily > 172800000) { // 172800000 = 2 days
      userData.streaks.daily = 1;
      streakReset = true;
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
    if (userData.prestige >= 1) {
      prestigeBonus += Math.floor(Math.random() * 500) + 100;
    }

    userData.coins += amount + prestigeBonus;
    userData.foods.apples += 2;
    userData.items.dailyCrate += 1;
    userData.cooldowns.daily = dailyReset.setUTCHours(23,59,59,999);
    userData.save();
    
    let reward = {
      title: "Daily claimed!",
      color: 0xcec6ff,
      description: `+${amount.toLocaleString()} **${config.emojis.coin}Coin**\n+2 **${config.emojis.apple}Apple**`,
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

    await interaction.createMessage({ embeds: [reward] });

    if (streakReset) {
      await interaction.createFollowup({
        embeds: [{
          color: Number(config.colours.embed),
          description: `Your daily streak has been reset, seem you didn't claimed daily reward from <t:${Math.floor(userData.cooldowns.daily / 1000) + 3600}:R>`,
        }]
      });
    }
  }
}