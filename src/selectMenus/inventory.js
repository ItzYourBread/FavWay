import config from "../config.json" assert { type: "json" };
import resource from "../inventory/resources.json" assert { type: "json" };
import item from "../inventory/items.json" assert { type: "json" };
import food from "../inventory/foods.json" assert { type: "json" };
import crop from "../inventory/crops.json" assert { type: "json" };
import { User } from "../database/profile.js";

export function inventory(client) {

  var Resources = "";
  var Items = "";
  var Foods = "";
  var Crops = "";
  
  client.on("interactionCreate", async (interaction) => {
    const user = interaction.member;
    const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });

    if (userData.settings.compactMode) {
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
    }
    if (!userData.settings.compactMode) {
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
    
    if (!Resources) {
      Resources = `You don't have any resources!`;
    }
    let resources = {
      title: `${user.username}'s Inventory`,
      color: 0xcec6ff,
      description: `${Resources}`,
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
    
    
    if (interaction.data.component_type === 3 && interaction.data.custom_id === "inventorySelectMenu") {
      if (interaction.member.id !== interaction.member.id)
        return interaction.createMessage({
          content: "These select menu aren't for you",
          flags: 64
        });
      await interaction.deferUpdate();
      if (interaction.data.values[0] === "resources") {
        await interaction.editOriginalMessage({ embeds: [resources] });
      } if (interaction.data.values[0] === "items") {
        await interaction.editOriginalMessage({ embeds: [items] });
      } if (interaction.data.values[0] === "foods") {
        await interaction.editOriginalMessage({ embeds: [foods] });
      } if (interaction.data.values[0] === "crops") {
        await interaction.editOriginalMessage({ embeds: [crops] });
      }
    }
  });
}