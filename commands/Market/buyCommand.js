const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { ApplicationCommandOptionType } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const config = require("../../config.json");
const { ms } = require("printly.js");
const wait = require('node:timers/promises').setTimeout;
const resourcesList = require("../../shopList/resources.json");
const itemsList = require("../../shopList/items.json");
const foodsList = require("../../shopList/foods.json");

const checkItem = function (items, search){
  if(items[0]){
    return items[0][search];
  }
  if(items[1]){
    return items[1][search];
  }
  if(items[2]){
    return items[2][search];
  }
  return null;
};

module.exports = {
  name: "buy",
  description: "Buy an item from the shop.",
  category: "market",
  options: [{
    name: "resources_shop",
    description: "Select the item you want to buy.",
    type: ApplicationCommandOptionType.String,
    required: false,
    choices: resourcesList
 }, {
    name: "items_shop",
    description: "Select the item you want to buy.",
    type: ApplicationCommandOptionType.String,
    required: false,
    choices: itemsList
  }, {
    name: "foods_shop",
    description: "Select the food you want to buy.",
    type: ApplicationCommandOptionType.String,
    required: false,
    choices: foodsList
  }, {
    name: "quantity",
    description: "How many of the item you want to buy.",
    type: ApplicationCommandOptionType.Number,
    required: false
  }],

  run: async (client, interaction) => {

    await interaction.deferReply();
    
    const { user, guild } = interaction;
    const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

    const quantity = interaction.options.getNumber("quantity") || 1;
    const resources = interaction.options.getString("resources_shop", null);
    const item_resource = interaction.options.getString("items_shop", null);
    const food_resource = interaction.options.getString("foods_shop", null);
    const resource = resourcesList.find((item)=> {if(item.value === resources){return item;}});
    const foods_resource = foodsList.find((item)=> {if(item.value === food_resource){return item;}});
    const item_resources = itemsList.find((item)=> {if(item.value === item_resource){return item;}});

  
    let price = quantity * Number(checkItem([resource, item_resources, foods_resource], "price"));
    let value = checkItem([resource, item_resources, foods_resource], "value");
    let name = checkItem([resource, item_resources, foods_resource], "name");
    let emoji = checkItem([resource, item_resources, foods_resource], "emoji");
    let dbLine = checkItem([resource, item_resources, foods_resource], "dbLine");
    

    if (userData.coins < price) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
          .setColor(config.colours.error)
          .setDescription(`You don't have enough money to buy **${quantity} ${config.emojis[emoji]}${name}**.`)
          .setTimestamp(),
        ],
      });
    }

    const cart = new EmbedBuilder()
    .setTitle("Buying Confirmation")
    .setColor(config.colours.success)
    .setDescription(`Confirm to buy **${quantity} ${config.emojis[emoji]}${name}**\nTotal Cost: ${config.emojis.currency}${price.toLocaleString()}`)
    .setTimestamp();

    const buyButton = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("buyButton")
          .setLabel(`Confirm (${price})`)
          .setStyle(ButtonStyle.Success)
      );

    let message = await interaction.editReply({ embeds: [cart], components: [buyButton] });
    
    const collector = message.createMessageComponentCollector({
      filter: fn => fn,
      componentType: ComponentType.Button,
      time: 20000
    });
    
    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id)
      return i.reply({ 
        content: `These buttons aren't for you!`, 
        ephemeral: true 
      });
      
      if (i.customId === 'buyButton') {
        await i.deferUpdate();

        userData.coins -= price;
        userData[dbLine][value] += quantity;
        userData.save();
          
        await i.editReply({
          embeds: [
            new EmbedBuilder()
            .setTitle(`Confirmation Successful`)
            .setColor(config.colours.success)
            .setDescription(`${user.username} successfully purchased **${quantity} ${config.emojis[emoji]}${name}**.`)
            .setTimestamp(),
          ],
          components: [],
        });
      }
    });
  }
}