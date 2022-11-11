import { User } from "../../database/profile.js";
import { Constants } from "eris";
import config from "../../config.json" assert { type: "json" };
import resource from "../../inventory/resources.json" assert { type: "json" };
import item from "../../inventory/items.json" assert { type: "json" };
import food from "../../inventory/foods.json" assert { type: "json" };
import crop from "../../inventory/crops.json" assert { type: "json" };
import { setTimeout as wait } from "node:timers/promises";

export default {
  data: {
    name: "inventory",
    description: "Your awesome inventory!",
    options: [{
      name: "user",
      description: "Please enter a user.",
      type: Constants.ApplicationCommandOptionTypes.USER,
      required: false
    }]
  },
  run: async (client, interaction) => {

    const user_id = interaction.data.options && interaction.data.options[0] ? interaction.data.options[0].value : interaction.member.id;
    const user = await client.users.get(user_id);
    const userData = await User.findOne({ id: user_id }) || new User({ id: user_id });
    
    var Resources = "";
    var Items = "";
    var Foods = "";
    var Crops = "";

    resource.map(el => {
      if (user && userData.resources[el.value] && userData.resources[el.value] >= 1) {
        Resources += `${config.emojis[el.emoji]}**${el.name}** : ${userData.resources[el.value].toLocaleString()}\n`;
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

    let inventory = {
      title: `${user.username}'s Inventory`,
      color: Number(config.colours.embed),
      fields: [
        { 
          name: "Resources", 
          value: `${Resources}`, 
          inline: true 
        },
        { 
          name: "Items", 
          value: `${Items}`, 
          inline: true 
        },
        { 
          name: "Foods", 
          value: `${Foods}`, 
          inline: true 
        },
        { 
          name: "Crops", 
          value: `${Crops}`, 
          inline: true 
        }
      ],
      timestamp: new Date()
    }
    await interaction.createMessage({ embeds: [inventory] });
    
    /* if (!Rescoures) {
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
    } */


    /* let menu = {
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
    } */

    /* client.on("interactionCreate", async (i) => {
      if (i.data.component_type === 3 && i.data.custom_id === "inventorySelectMenu") {
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
    }); */
  }
}