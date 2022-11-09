import config from "../../config.json" assert { type: "json" };
import { User } from "../../database/profile.js";
import resource from "../../shopList/resources.json" assert { type: "json" };
import item from "../../shopList/items.json" assert { type: "json" };
import food from "../../shopList/foods.json" assert { type: "json" };
import crop from "../../shopList/crops.json" assert { type: "json" };
import { setTimeout as wait } from "node:timers/promises";

export default {
  data: {
    name: "shop",
    description: "Let's do some buying today!"
  },
  run: async (client, interaction) => {

    const user = interaction.member;
    const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });

    var resourceList = "";
    var itemList = "";
    var foodList = "";
    var cropList = "";

    if (user && userData.settings.compactMode) {
      resource.map(el => {
        resourceList += `${config.emojis[el.emoji]}**${el.name}** : ${config.emojis.coin}${Number(el.price).toLocaleString()}\n`;
      });
      item.map(el => {
        itemList += `${config.emojis[el.emoji]}**${el.name}** : ${config.emojis.coin}${Number(el.price).toLocaleString()}\n`;
      });
      food.map(el => {
        foodList += `${config.emojis[el.emoji]}**${el.name}** : ${config.emojis.coin}${Number(el.price).toLocaleString()}\n`;
      });
      crop.map(el => {
        cropList += `${config.emojis[el.emoji]}**${el.name}** : ${config.emojis.coin}${Number(el.price).toLocaleString()}\n`;
      });
    }
    if (user && !userData.settings.compactMode) {
      resource.map(el => {
        resourceList += `${config.emojis[el.emoji]}**${el.name}** : ${config.emojis.coin}${Number(el.price).toLocaleString()}\n${el.category}\n\n`;
      });
      item.map(el => {
        itemList += `${config.emojis[el.emoji]}**${el.name}** : ${config.emojis.coin}${Number(el.price).toLocaleString()}\n${el.category}\n\n`;
      });
      food.map(el => {
        foodList += `${config.emojis[el.emoji]}**${el.name}** : ${config.emojis.coin}${Number(el.price).toLocaleString()}\n${el.category}\n\n`;
      });
      crop.map(el => {
        cropList += `${config.emojis[el.emoji]}**${el.name}** : ${config.emojis.coin}${Number(el.price).toLocaleString()}\n${el.category}\n\n`;
      });
    }

    
    let resources = {
      title: "Resources's Shop",
      color: 0xcec6ff,
      description: `${resourceList}`,
      timestamp: new Date()
    }

  
    let items = {
      title: "Item's Shop",
      color: 0xcec6ff,
      description: `${itemList}`,
      timestamp: new Date()
    }

   
    let foods = {
      title: "Food's Shop",
      color: 0xcec6ff,
      description: `${foodList}`,
      timestamp: new Date()
    }

   
    let crops = {
      title: "Crop's Shop",
      color: 0xcec6ff,
      description: `${cropList}`,
      timestamp: new Date()
    }


    let menu = {
      type: 1,
      components: [{
        type: 3,
        custom_id: "shopSelectMenu",
        options: [
          {
            label: "Resources's Shop",
            description: "Here you can find all the resources from the Resource's Shop.",
            value: "resources"
          },
          {
            label: "Item's Shop",
            description: "Here you can find all the items from the Item's Shop.",
            value: "items"
          },
          {
            label: "Food's Shop",
            description: "Here you can find all the foods from the Food's Shop.",
            value: "foods"
          },
          {
            label: "Crop's Shop",
            description: "Here you can find all the crops from the Crop's Shop.",
            value: "crops"
          }
        ],
        placeholder: "Explore more shops!",
        min_values: 1,
        max_values: 1
      }]
    }

    const message = await interaction.createMessage({ embeds: [resources], components: [menu] });

    client.on("interactionCreate", async (i) => {
      if (i.data.component_type === 3 && i.data.custom_id === "shopSelectMenu") {
      if (i.member.id !== interaction.member.id)
        return i.createMessage({
          content: "These select menu aren't for you",
          flags: 64
        });
        await i.deferUpdate();
        if (i.data.values[0] === "resources") {
          await wait(100);
          await i.editOriginalMessage({ embeds: [resources] });
        } if (i.data.values[0] === "items") {
          await wait(100);
          await i.editOriginalMessage({ embeds: [items] });
        } if (i.data.values[0] === "foods") {
          await wait(100);
          await i.editOriginalMessage({ embeds: [foods] });
        } if (i.data.values[0] === "crops") {
          await wait(100);
          await i.editOriginalMessage({ embeds: [crops] });
        }
      }
    });
  }
}