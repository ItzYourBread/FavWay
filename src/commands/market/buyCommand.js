import { Constants } from "eris";
import { User } from "../../database/profile.js";
import { setTimeout as wait } from "node:timers/promises";

import config from "../../config.json" assert { type: "json" };
import buyList from "../../shopList/buy.json" assert { type: "json" };

export function checkItem(items, search) {
  if (items[0]) {
    return items[0][search];
  }
  if (items[1]) {
    return items[1][search];
  }
  return null;
};

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
        required: false,
      }
    ],
  },
  run: async (client, interaction) => {
    await interaction.defer();

    const user = interaction.member;
    const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });

    const shop_items = interaction.data.options[0] ? interaction.data.options[0].value : null;
    const quantity = interaction.data.options[1] ? interaction.data.options[1].value : 1;
    const itemsList = buyList.find((items) => { if (items.value === shop_items) { return items; } });

    let price = quantity * Number(checkItem([itemsList], "price"));
    let value = checkItem([itemsList], "value");
    let name = checkItem([itemsList], "name");
    let emoji = checkItem([itemsList], "emoji");
    let dbLine = checkItem([itemsList], "dbLine");

    let cart = {
      title: "Cart",
      color: Number(config.colours.embed),
      description: `Added **${quantity} ${config.emojis[emoji]}${name}** to your cart\n**Total:** ${config.emojis.coin}${price.toLocaleString()}\nClick Pay button to pay.`,
      timestamp: new Date()
    }
    let ShopCartButtons = {
      type: 1,
      components: [
        {
          type: 2,
          label: `Pay ${price.toLocaleString()}`,
          style: 3,
          custom_id: "ShopCartPay"
        },
        {
          type: 2,
          label: `Cancel`,
          style: 4,
          custom_id: "ShopCartCancel"
        }
      ]
    }
    await interaction.createMessage({ embeds: [cart], components: [ShopCartButtons] });

    client.on("interactionCreate", async (i) => {
      if (i.member.id !== interaction.member.id)
        return i.createMessage({
          content: `These buttons aren't for you`,
          flags: 64
        });
      if (i.data.component_type === 2 && i.data.custom_id === "ShopCartPay") {
        i.deferUpdate();
        if (userData.coin < price) {
          return i.createMessage({
            content: `You don't have enough coins`,
            flags: 64
          });
        }

        userData[dbLine][value] += quantity;
        userData.coin -= price;
        userData.save();
        
        await i.editOriginalMessage({
          embeds: [{
            title: "Bought!",
            color: Number(config.colours.success),
            description: `You successfully bought **${quantity} ${config.emojis[emoji]}${name}**\n**Cost:** ${config.emojis.coin}${price.toLocaleString()}`,
            timestamp: new Date()
          }],
          components: []
        });
      }
    });
  }
}