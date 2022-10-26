const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { ApplicationCommandOptionType } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const config = require("../../config.json");
const { ms } = require("printly.js");
const wait = require('node:timers/promises').setTimeout;
const useList = require("../../inventory/useList.json");

const checkItem = function (items, search) {
  if(items[0]){
    return items[0][search];
  }
  return null;
};

module.exports = {
  name: "use",
  description: "Use items which you bought or in your inventory.",
  category: "RolePlay",
  options: [{
    name: "item",
    type: ApplicationCommandOptionType.String,
    description: "The item to use.",
    required: true,
    choices: useList
  }, {
    name: "quantity",
    type: ApplicationCommandOptionType.Number,
    description: "The quantity of the item to use.",
    required: false
  }],

  run: async (client, interaction) => {
    
    const { guild, user } = interaction;
    const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

    const quantity = interaction.options.getNumber("quantity") || 1;
    const list = interaction.options.getString("item", null);
    const useLists = useList.find((item)=> {if(item.value === list){return item;}});

    let value = checkItem([useLists], "value");
    let name = checkItem([useLists], "name");
    let emoji = checkItem([useLists], "emoji");
    let dbLine = checkItem([useLists], "dbLine");
    let boost = checkItem([useLists], "boost");
    let benefit = checkItem([useLists], "benefit");

    let confirmation = new EmbedBuilder()
    .setTitle("Confirm")
    .setColor(config.colours.success)
    .setDescription(`You want to use **${quantity} ${config.emojis[emoji]}${name}.**\n**Benefit:** ${benefit}.\n**Expire:** 15 minutes.\n\nAre you sure?`)
    .setTimestamp();

    const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("useButton")
          .setLabel(`Confirm (${quantity})`)
          .setStyle(ButtonStyle.Success)
      );

    const message = await interaction.reply({ embeds: [confirmation], components: [buttons] });

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
      
      if (i.customId === 'useButton') {
        await i.deferUpdate();

        userData[dbLine][value] -= quantity;
        userData.boost[value] = Date.now() + ms(boost);
        userData.save();
        
        await i.editReply({ 
          content: `${config.emojis[emoji]}${name} has been used!`, 
          ephemeral: true 
        });
      }
    });
  }
}