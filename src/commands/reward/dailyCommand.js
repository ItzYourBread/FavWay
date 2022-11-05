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
          title: "Already Claimed!",
          color: Number(config.colours.error),
          description: `You have already claimed this daily reward today!\nWait ${duration} for next daily reward.`,
          timestamp: new Date()
        }],
      });
    }

    let amount = "";

    if (userData.prestige >= 1000) {
      amount = "10000000";
    } if (userData.prestige >= 900) {
      amount = "9000000";
    } if (userData.prestige >= 800) {
      amount = "8000000";
    } if (userData.prestige >= 700) {
      amount = "7000000";
    } if (userData.prestige >= 600) {
      amount = "6000000";
    } if (userData.prestige >= 550) {
      amount = "5000000";
    } if (userData.prestige >= 500) {
      amount = "700000";
    } if (userData.prestige >= 450) {
      amount = "500000";
    } if (userData.prestige >= 400) {
      amount = "400000";
    } if (userData.prestige >= 350) {
      amount = "300000";
    } if (userData.prestige >= 300) {
      amount = "200000";
    } if (userData.prestige >= 250) {
      amount = "150000";
    } if (userData.prestige >= 200) {
      amount = "120000";
    } if (userData.prestige >= 150) {
      amount = "100000";
    } if (userData.prestige >= 100) {
      amount = "75000";
    } if (userData.prestige >= 50) {
      amount = "50000";
    } if (userData.prestige >= 25) {
      amount = "30000";
    } if (userData.prestige >= 10) {
      amount = "15000";
    } if (userData.prestige >= 5) {
      amount = Math.floor(Math.random() * 600) + 270;
    } else {
      amount = Math.floor(Math.random() * 400) + 170;
    }

    userData.coins += amount;
    userData.cooldowns.daily = Date.now() + ms("20s");
    userData.save();
    
    let reward = {
      title: "Daily claimed!",
      color: 0xcec6ff,
      description: `+ ${config.emojis.coin}${amount.toLocaleString()} has been added to your balance!`,
      fields: [
        {
          name: `Prestige`,
          value: `[${userData.prestige}]`,
          inline: false
        },
      ],
      timestamp: new Date()
    }

    await interaction.createMessage({ embeds: [reward] });
  }
}