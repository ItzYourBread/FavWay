import { User } from "../../database/profile.js";
import config from "../../config.json" assert { type: "json" };
import { Constants } from "eris";
import { setTimeout as wait } from "node:timers/promises";

const slots = ["<:emoji_20:1039281159345029200>", "<:emoji_20:1039281175950278786>"];
const loading = "<a:emoji_19:1039281105955721227><a:emoji_19:1039281105955721227><a:emoji_19:1039281105955721227>";

export default {
  data: {
    name: "slots",
    description: "Let's play with slots machine today!",
    options: [{
      name: "bet",
      description: "Please enter your bet, 200 to 20,000",
      type: Constants.ApplicationCommandOptionTypes.INTEGER,
      required: true
    }],
  },
  run: async (client, interaction) => {

    const user = interaction.member;
    const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });

    const bet = interaction.data.options[0].value;

    if (bet < 200 || bet > 20000 ) {
      return interaction.createMessage({
        content: `You only can bet 200 to 20,000!`,
        flags: 64
      });
    }

    if (userData.coins < bet) {
      return interaction.createMessage({
        content: `You don't have ${bet.toLocaleString()} in your balance, You only have ${userData.coins.toLocaleString()}.`,
        flags: 64
      });
    }

    await interaction.createMessage({
      embeds: [{
        title: `Slots`,
        color: Number(config.colours.embed),
        description: `|⎯⎯⎯⎯|\n|${loading} |\n|⎯⎯⎯⎯|`,
        timestamp: new Date()
      }],
    });
    
    let number = [];
    let amount = "";
    let win;
    for (let i = 0; i < 3; i++) { number[i] = Math.floor(Math.random() * slots.length); }

    if (number[0] == number[1] && number[1] == number[2])  {
        amount = bet * 0.9;
        win = true;
    } else if (number[0] == number[1] || number[0] == number[2] || number[1] == number[2]) { 
        amount = bet * 0.5;
        win = true;
    }
    
    if (win) {
      await wait(3500);
      await interaction.editOriginalMessage({
        embeds: [{
          title: `Slots`,
          color: Number(config.colours.success),
          description: `|⎯⎯⎯⎯|\n|${slots[number[0]]}${slots[number[1]]}${slots[number[2]]} |\n|⎯⎯⎯⎯|\nYou won **${config.emojis.coin}${amount.toLocaleString()}** and now you have **${config.emojis.coin}${userData.coins}**`,
          timetamp: new Date()
        }],
      });
    } else {
      await wait(3400);
      await interaction.editOriginalMessage({
        embeds: [{
          title: `Slots`,
          color: Number(config.colours.error),
          description: `|⎯⎯⎯⎯|\n|${slots[number[0]]}${slots[number[1]]}${slots[number[2]]} |\n|⎯⎯⎯⎯|\nSad to say but you lost **${config.emojis.coin}${amount.toLocaleString()}** :(`,
          timeStamp: new Date()
        }],
      });
    }
  }
}