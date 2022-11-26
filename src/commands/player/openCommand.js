import { Constants } from "eris";
import { User } from "../../database/profile.js";
import config from "../../config.json" assert { type: "json" };
import { setTimeout as wait } from "node:timers/promises";
import random from "random-number-csprng";
import { RandomArray, RandomNumber } from "stubby.ts";

// crates
import crateList from "../../data/crateList.json" assert { type: "json" };
import DailyCrateJson from "../../data/crates/daily.json" assert { type: "json" };


export function checkItem(items, search) {
  if (items[0]) {
    return items[0][search];
  }
  return null;
}

export default {
  data: {
    name: "open",
    description: "Open SubCommand",
    options: [
      {
        name: "crate",
        description: "Let's open some crates today!",
        type: 1,
        options: [
          {
            name: "crate",
            description: "What crate do you want to open?",
            type: Constants.ApplicationCommandOptionTypes.STRING,
            required: true,
            choices: crateList
          },
        ]
      }
    ],
  },
  run: async (client, interaction) => {
    if (interaction.data.options[0].name === "crate") {

      const choice = interaction.data.options[0].options[0].value;
      const user = interaction.member;
      const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });

      const crate = crateList.find((item) => { if (item.value === choice) { return item; } });
      let name = checkItem([crate], "name");
      let value = checkItem([crate], "value");

      /* if (userData.items[crate.value] < 1) {
        return interaction.createMessage({
          content: `You don't have ${name}, make sure you have that crate own before opening!`,
          flags: 64
        });
      } */

      let opening = {
        title: `Opening ${name}`,
        color: Number(config.colours.embed),
        description: `Running!!`,
        timestamp: new Date()
      }
      await interaction.createMessage({ embeds: [opening] });

      let item = "";
      let coins = 0;
      if (choice === "dailyCrate") {
        let randomItem = RandomArray(DailyCrateJson);
        let randomAmount = RandomNumber(randomItem.min, randomItem.max);
        item += `+${randomAmount} **${config.emojis[randomItem.emoji]}${randomItem.name}**`
      }
      
      let opened = {
        title: `Opened ${name}`,
        color: Number(config.colours.embed),
        description: `${item}`,
        timestamp: new Date()
      }
      await wait(2000);
      await interaction.editOriginalMessage({ embeds: [opened] });
      item = "";
    }
  }
}