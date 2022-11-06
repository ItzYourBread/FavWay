import { User } from "../../database/profile.js";
import config from "../../config.json" assert { type: "json" };
import resource from "../../inventory/resources.json" assert { type: "json" };
import item from "../../inventory/items.json" assert { type: "json" };
import food from "../../inventory/foods.json" assert { type: "json" };
import crop from "../../inventory/crops.json" assert { type: "json" };
import { setTimeout as wait } from "node:timers/promises";

export default {
  data: {
    name: "inventory",
    description: "Your awesome inventory!"
  },
  run: async (client, interaction) => {

    const user = interaction.member;
    const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });

    var Rescoures = "";
    var Items = "";
    var Foods = "";
    var Crops = "";

    if (user && userData.settings.compactMode) {
      resource.map(el => {
        if (user && userData.resources[el.value] && userData.resources[el.value] >= 1) {
          Rescoures += `${config.emojis[el.emoji]}**${el.name}** : ${userData.resources[el.value].toLocaleString()}\n`;
        }
      });
      item.map(el => {
        if (user && userData.items[el.value] && userData.items[el.value] >= 1) {
          Items += `${config.emojis[el.emoji]}**${el.name}** : ${userData.items[el.value].toLocaleString()}\n`;
        }
      });
      food.map(el => {
        if (user && userData.foods[el.value] && userData.foods[el.value] >= 1) {
          Foods += `${config.emojis[el.emoji]}**${el.name}** : ${userData.foods[el.value].toLocaleString()}\n`;
        }
      });
      crop.map(el => {
        if (user && userData.crops[el.value] && userData.crops[el.value] >= 1) {
          Crops += `${config.emojis[el.emoji]}**${el.name}** : ${userData.crops[el.value].toLocaleString()}\n`;
        }
      });
    }
    if (user && !userData.settings.compactMode) {
      resource.map(el => {
       if (user && userData.resources[el.value] && userData.resources[el.value] >= 1) {
          Rescoures += `${config.emojis[el.emoji]}**${el.name}** : ${userData.resources[el.value].toLocaleString()}\n${el.category}\n\n`;
        }
      });
      item.map(el => {
        if (user && userData.items[el.value] && userData.items[el.value] >= 1) {
          Items += `${config.emojis[el.emoji]}**${el.name}** : ${userData.items[el.value].toLocaleString()}\n${el.category}\n\n`;
        }
      });
      food.map(el => {
        if (user && userData.foods[el.value] && userData.foods[el.value] >= 1) {
          Foods += `${config.emojis[el.emoji]}**${el.name}** : ${userData.foods[el.value].toLocaleString()}\n${el.category}\n\n`;
        }
      });
      crop.map(el => {
        if (user && userData.crops[el.value] && userData.crops[el.value] >= 1) {
          Crops += `${config.emojis[el.emoji]}**${el.name}** : ${userData.crops[el.value].toLocaleString()}\n${el.category}\n\n`;
        }
      });
    }

    
    if (!Rescoures) {
      Rescoures = `You don't have any resources!`;
    }
    let resources = {
      title: `${user.username}'s Inventory`,
      color: 0xcec6ff,
      description: `${Rescoures}`,
      timestamp: new Date()
    }

    if (!Items) {
      Items = `You don't have any items!`;
    }
    let items = {
      title: `${user.username}'s Inventory`,
      color: 0xcec6ff,
      description: `${Items}`,
      timestamp: new Date()
    }

    
    if (!Foods) {
      Foods = `You don't have any foods!`;
    }
    let foods = {
      title: `${user.username}'s Inventory`,
      color: 0xcec6ff,
      description: `${Foods}`,
      timestamp: new Date()
    }

   
    if (!Crops) {
      Crops = `You don't have any crops!`;
    }
    let crops = {
      title: `${user.username}'s Inventory`,
      color: 0xcec6ff,
      description: `${Crops}`,
      timestamp: new Date()
    }


    let menu = {
      type: 1,
      components: [{
        type: 3,
        custom_id: "inventorySelectMenu",
        options: [
          {
            label: "Resources",
            description: "View your resources.",
            value: "resources"
          },
          {
            label: "Items",
            description: "View your items.",
            value: "items"
          },
          {
            label: "Foods",
            description: "View your foods.",
            value: "foods"
          },
          {
            label: "Crops",
            description: "View your crops.",
            value: "crops"
          }
        ],
        min_values: 1,
        max_values: 1
      }]
    }

    await interaction.createMessage({ embeds: [resources], components: [menu] });

    client.on("interactionCreate", async (i) => {
      if (i.data.component_type === 3 && i.data.custom_id === "inventorySelectMenu") {
      if (i.member.id !== interaction.member.id)
        return i.createMessage({
          content: "This is not your menu!.",
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