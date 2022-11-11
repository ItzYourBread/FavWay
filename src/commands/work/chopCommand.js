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
        content: "You don't have any axes to chop!",
        flags: 64
      });
    }

    let woodAmount = 20;
    let chopCooldown = ms("3m");
    if (userData.boost.cakeNormal > Date.now()) {
      woodAmount += 150;
    }

    userData.resources.woods += woodAmount;
    userData.health.axe += 1;
    userData.cooldowns.chop = Date.now() + chopCooldown;
    if (userData.health.axe == 20) {
      userData.health.axe -= 20;
      userData.items.axe -= 1;
    }
    userData.save();
    await interaction.createMessage({
      content: `You got ${woodAmount} from chopping Happy work!`
    });
  }
}