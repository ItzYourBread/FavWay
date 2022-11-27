import { User } from '../../database/profile.js';
import config from '../../config.json' assert { type: 'json' };
import { Constants } from 'eris';
import { setTimeout as wait } from 'node:timers/promises';
import random from 'random-number-csprng';

const slots = [
  '<:slotsgem:1039472492915458050>',
  '<:slotsheart:1039468987119058946>',
  '<:slotsmilkbucket:1039473781435007016>',
];
const moving = '<a:slotsmoving:1039479281379721256>';

export default {
  data: {
    name: 'slots',
    description: "Let's play with slots machine today!",
    options: [
      {
        name: 'bet',
        description: 'Please enter your bet.',
        type: Constants.ApplicationCommandOptionTypes.INTEGER,
        required: true,
      },
    ],
  },
  run: async (client, interaction) => {
    const user = interaction.member;
    const userData = (await User.findOne({ id: user.id })) || new User({ id: user.id });

    const bet = interaction.data.options[0].value;

    if (bet > 150000) {
      return interaction.createMessage({
        content: "You can't bet more than 150,000.",
        flags: 64,
      });
    }

    if (userData.coins < bet) {
      return interaction.createMessage({
        content: `You don't have ${bet.toLocaleString()} in your balance, You only have ${userData.coins.toLocaleString()}.`,
        flags: 64,
      });
    }

    await interaction.createMessage({
      embeds: [
        {
          title: `Slots`,
          color: Number(config.colours.embed),
          description: `|⎯⎯⎯⎯|\n| ${moving + moving + moving}  |\n|⎯⎯⎯⎯|`,
          timestamp: new Date(),
        },
      ],
    });

    let rSlots = [];
    let rand = (await random(1, 1000)) / 10;
    let amount = 0;
    let gems = 0;
    if (rand <= 10) {
      amount = bet; // 10% and 1x
      rSlots.push(slots[2]);
      rSlots.push(slots[2]);
      rSlots.push(slots[2]);
    } else if (rand <= 15) {
      amount = bet * 2; // 5% and 3x
      rSlots.push(slots[1]);
      rSlots.push(slots[1]);
      rSlots.push(slots[1]);
    } else if (rand <= 18.8) {
      amount = bet * 3; // 1% and 5x
      gems = 50;
      rSlots.push(slots[0]);
      rSlots.push(slots[0]);
      rSlots.push(slots[0]);
    } else {
      var slot1 = Math.floor(Math.random() * (slots.length - 1));
      var slot2 = Math.floor(Math.random() * (slots.length - 1));
      var slot3 = Math.floor(Math.random() * (slots.length - 1));
      if (slot3 == slot1) slot2 = (slot1 + Math.ceil(Math.random() * (slots.length - 2))) % (slots.length - 1);
      if (slot2 == slots.length - 2) slot2++;
      rSlots.push(slots[slot1]);
      rSlots.push(slots[slot2]);
      rSlots.push(slots[slot3]);
    }

    let winMessage;
    if (amount == 0) {
      winMessage = `Sad to say you lost! :(`;
      userData.coins -= bet;
      userData.save();
    }
    if (amount > 1) {
      winMessage = `You won **${config.emojis.coin}${amount}**! :D`;
      userData.gems += gems;
      userData.coins += amount;
      userData.coins += bet;
      userData.save();
    }

    await wait(2500);
    await interaction.editOriginalMessage({
      embeds: [
        {
          title: `Slots`,
          color: Number(config.colours.embed),
          description: `|⎯⎯⎯⎯|\n| ${rSlots[0] + moving + moving}  |\n|⎯⎯⎯⎯|`,
          timestamp: new Date(),
        },
      ],
    });
    await wait(1200);
    await interaction.editOriginalMessage({
      embeds: [
        {
          title: `Slots`,
          color: Number(config.colours.embed),
          description: `|⎯⎯⎯⎯|\n| ${rSlots[0] + moving + rSlots[2]}  |\n|⎯⎯⎯⎯|`,
          timestamp: new Date(),
        },
      ],
    });
    await wait(2000);
    await interaction.editOriginalMessage({
      embeds: [
        {
          title: `Slots`,
          color: Number(config.colours.embed),
          description: `|⎯⎯⎯⎯|\n| ${rSlots[0] + rSlots[1] + rSlots[2]}  |\n|⎯⎯⎯⎯|\n${winMessage}`,
          timestamp: new Date(),
        },
      ],
    });
  },
};
