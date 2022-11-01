import { Constants } from "eris";
import { User } from "../../database/profile.js";
import { ms } from "printly.js";
import moment from "moment";
import config from "../../config.json" assert { type: "json" };

export default {
  data: {
    name: "daily",
    description: "Get your daily reward!"
  },
  run: async (client, interaction) => {

    const user = interaction.member;
    const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });

    let amount = Math.floor(Math.random() * 400) + 170;
    console.log(amount);

    if (user && userData.cooldowns.daily > Date.now()) {
      return interaction.createMessage({
        embeds: [{
          title: "You have already redeemed your daily reward today!",
          color: 0xff8d8d
        }],
      });
    }

    userData.coins += amount;
    userData.cooldowns.daily = Date.now() + ms("20s");
    userData.save();
    
    let reward = {
      title: "Daily claimed!",
      color: 0xcec6ff,
      description: `${config.emojis.coin}\`${amount}\` `,
      timestamp: new Date()
    }

    await interaction.createMessage({ embeds: [reward] });
  }
}