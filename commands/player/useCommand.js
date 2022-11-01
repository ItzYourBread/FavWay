import { Constants } from "eris";
import { User } from "../../database/profile.js";

import config from "../../config.json" assert { type: "json" };
import useList from "../../inventory/useList.json" assert { type: "json" };


export function checkItem(items, search) {
  if(items[0]){
    return items[0][search];
  }
  return null;
}

export default {
  data: {
    name: "use",
    description: "Use items which is in your inventory.",
    options: [{
      name: "item",
      description: "Which item do you want to use?",
      type: Constants.ApplicationCommandOptionTypes.STRING,
      required: true,
      choices: useList
    }, {
      name: "quantity",
      description: "How many??",
      type: Constants.ApplicationCommandOptionTypes.NUMBER,
      required: false,
    }],
  },
  run: async (client, interaction) => {

    const user = interaction.member;

    const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });

    const list = interaction.data.options[0].value || null;
    const quantity = interaction.data.options[1].value || 1;
    const useLists = useList.find((item)=> {if(item.value === list){return item;}});

    let value = checkItem([useLists], "value");
    let name = checkItem([useLists], "name");
    let emoji = checkItem([useLists], "emoji");
    let dbLine = checkItem([useLists], "dbLine");
    let boost = checkItem([useLists], "boost");
    let benefit = checkItem([useLists], "benefit");

    let confirmation = {
      color: 0x00ff00,
      description: `You want to use **${quantity} ${config.emojis[emoji]}${name}.**\n**Benefit:** ${benefit}.\n**Expire:** 15 minutes.\n\nAre you sure?`,
      timestamp: new Date()
    }

    let buttons = {
      type: 1,
      components: [
        {
          type: 2,
          label: `Confirm (${quantity})`,
          style: 3,
          custom_id: "confirm",
        }
      ]
    }
    
    const message = await interaction.createMessage({ embeds: [confirmation], components: [buttons] });
  }
}