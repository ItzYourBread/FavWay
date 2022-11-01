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

    console.log(value, name, emoji, dbLine, boost, benefit);
  }
}