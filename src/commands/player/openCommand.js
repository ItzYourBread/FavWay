import { Constants } from "eris";
import { User } from "../../database/profile.js";
import config from "../../config.json" assert { type: "json" };
import { setTimeout as wait } from "node:timers/promises";
import crateList from "../../data/crateList.json" assert { type: "json" };
import random from "random-number-csprng";

export function checkItem(items, search) {
  if(items[0]){
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
            focused: true,
            choices: crateList
          },
          {
            name: "quantity",
            description: "How many crates do you want to open?",
            type: Constants.ApplicationCommandOptionTypes.NUMBER,
            required: false
          }
        ]
      }
    ],
  },
  run: async (client, interaction) => {
    if (interaction.data.options[0].name === "crate") {

      const choice = interaction.data.options[0].options[0].value;
      const user = interaction.member;
      const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });
      
      const crate = crateList.find((item)=> {if(item.value === choice){return item;}});
      let name = checkItem([crate], "name");
      let value = checkItem([crate], "value");

      if (userData.items[crate.value] < 1) {
        return interaction.createMessage({
          content: `You don't have ${name}, make sure you have that crate own before opening!`,
          flags: 64
        });
      }

      let opening = {
        title: `Opening ${name}`,
        color: Number(config.colours.embed),
        description: `Running!!`,
        timestamp: new Date()
      }
      await interaction.createMessage({ embeds: [opening] });

      let items = "";
      let coins = 0;
      let gems = 0;
      let apples = 0;
      let normalCakes = 0;
      let rand = await random(1,1000)/10;
      if (choice === "dailyCrate") {
        if (rand <= 20) {
          // amount of items for database
          coins = Math.floor(Math.random() * 700) + 1;
          normalCakes = Math.floor(Math.random() * 5) + 1;
          apples = Math.floor(Math.random() * 9) + 1;
          // items to show in embed
          items += `+${coins} ${config.emojis.coin}**Coin**\n`;
          items += `+${normalCakes} ${config.emojis.cakeNormal}**Cake**\n`;
          items += `+${apples} ${config.emojis.apple}**Apple**\n`;
          // adding to user database
          userData.coins += coins;
          userData.foods.cakeNormal += normalCakes;
          userData.foods.apple += apples;
          userData.items[crate.value] -= 1;
          userData.save();
        } else if (rand <= 30) {
          // amount of items for database
          coins = Math.floor(Math.random() * 530) + 1;
          normalCakes = Math.floor(Math.random() * 3) + 1;
          // items to show in embed
          items += `+${coins} ${config.emojis.coin}**Coin**\n`;
          items += `+${normalCakes} ${config.emojis.cakeNormal}**Cake**\n`;
          // adding to user database
          userData.coins += 530;
          userData.foods.cakeNormal += normalCakes;
          userData.save();
        } else {
          // items to show in embed
          items += `+250 ${config.emojis.coin}**Coin**\n`;
          items += `+3 ${config.emojis.apple}**Apple**\n`;
          // adding to user database
          userData.coins += 250;
          userData.foods.apples += 3;
          userData.save();
        }
      }

      let opened = {
        title: `Opened ${name}`,
        color: Number(config.colours.embed),
        description: `${items}`,
        timestamp: new Date()
      }
      await wait(2000);
      await interaction.editOriginalMessage({ embeds: [opened] });
    }
  }
}