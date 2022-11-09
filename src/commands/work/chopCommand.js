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
          color: Number(config.colours.error),
          description: `You can chop again in \`${duration}\` `,
          timestamp: new Date()
        }],
      });
    }
    
    if (user && userData.items.axes < 1) {
      return interaction.createMessage({
        embeds: [{
          title: "Missing Axe!",
          color: Number(config.colours.error),
          description: "You need an axe to chop trees!",
          timestamp: new Date()
        }],
      });
    }

    let amount = "20";
    if (userData.boost.cakeNormal > Date.now()) {
      amount += 150;
    }
    console.log(amount)
  }
}