import { User } from "../../database/profile.js";
import { Constants } from "eris";
import config from "../../config.json" assert { type: "json" };
import resource from "../../data/inventory/resources.json" assert { type: "json" };
import item from "../../data/inventory/items.json" assert { type: "json" };
import food from "../../data/inventory/foods.json" assert { type: "json" };
import crop from "../../data/inventory/crops.json" assert { type: "json" };
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
        Resources += `${config.emojis[el.emoji]}**${el.name}**: ${userData.resources[el.value].toLocaleString()}\n`;
      }
    });
    item.map(el => {
      if (user && userData.items[el.value] && userData.items[el.value] >= 1) {
        Items += `${config.emojis[el.emoji]}**${el.name}**: ${userData.items[el.value].toLocaleString()}\n`;
      }
    });
    food.map(el => {
      if (user && userData.foods[el.value] && userData.foods[el.value] >= 1) {
        Foods += `${config.emojis[el.emoji]}**${el.name}**: ${userData.foods[el.value].toLocaleString()}\n`;
      }
    });
    crop.map(el => {
      if (user && userData.crops[el.value] && userData.crops[el.value] >= 1) {
        Crops += `${config.emojis[el.emoji]}**${el.name}**: ${userData.crops[el.value].toLocaleString()}\n`;
      }
    });

    if (!Resources) {
      Resources = "empty";
    } 
    if (!Items) {
      Items = "empty";
    } 
    if (!Foods) {
      Foods = "empty";
    } 
    if (!Crops) {
      Crops = "empty";
    }

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
  }
}