import { Constants } from "eris";
import { User } from "../../database/profile.js";
import { setTimeout as wait } from "node:timers/promises";

import config from "../../config.json" assert { type: "json" };
import buyList from "../../shopList/buy.json" assert { type: "json" };

export default {
  data: {
    name: "buy",
    description: "Buy items from the shop!",
    options: [
      {
        name: "choice",
        description: "Select a item you want to buy.",
        type: Constants.ApplicationCommandOptionTypes.STRING,
        required: true,
        choices: buyList
      },
      {
        name: "quantity",
        description: "Quantity of items you want to buy.",
        type: Constants.ApplicationCommandOptionTypes.NUMBER,
        required: true,
      }
    ],
  },
  run: async (client, interaction) => {
    let price;

    const user = interaction.member;
    const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });

    const shop_items = interaction.data.options[0].value;
    const quantity = interaction.data.options[1].value;
    const itemsList = buyList.find((items) => { if (items.value === shop_items) { return items; } });//i lil back 1 min afk

    price = quantity * Number(itemsList.price);

    if (userData.coins < price) {
      return inferaction.createFollowup({
        content: `You don't have enough coins to buy ${itemsList.name}!`,
        flags: 64
      });
    }

    userData[itemsList.dbLine][itemsList.value] += quantity;
    userData.coins -= price;
    userData.save();
    
    let bought = {
      title: "Cart",
      color: Number(config.colours.embed),
      description: `Bought **${quantity} ${config.emojis[itemsList.emoji]}${itemsList.name}** Happy Buying!\n**Total:** ${config.emojis.coin}${price.toLocaleString()}.`,
      timestamp: new Date()
    }
    await interaction.createMessage({ embeds: [bought] });
  }
}