const Discord = require("discord.js");
const config = require("../../config.json");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const { ms } = require("printly.js");

module.exports = {
  name: "trade",
  description: "Trade with others users",
  category: "roleplay",
  options: [{
    name: 'user',
    description: 'Please set the user which you want to trade with',
    type: ApplicationCommandOptionType.User,
    required: true,
  }, 
  {
    name: 'quantity',
    description: 'How much do you want to give them?',
    type: ApplicationCommandOptionType.Number,
    required: true,
  },
  {
    name: 'item',
    description: 'Select a item',
    type: ApplicationCommandOptionType.String,
    required: false,
    choices: [
      { name: 'Wood', value: 'woods' }
    ],
  }, 
  {
    name: 'animal',
    description: 'Select a animal',
    type: ApplicationCommandOptionType.String,
    required: false,
    choices: [
      { name: 'Cow', value: 'cow' }
    ],
  }],
  
  run: async (client, interaction) => {
    await interaction.deferReply();
    let reply = '';
    const user1 = interaction.user;
    const quantity = interaction.options.getNumber('quantity');
    const user2 = interaction.options.getUser('user');
    //const animal = interaction.options.getString('animal').value;
    
    const UserData1 = await Profile.findOne({id: user1.id}); // You
    const UserData2 = await Profile.findOne({id: user2.id}); // Other
    if (UserData1 && UserData2) {
      // what i have zoo ? 
      if(UserData1.property.zoo && UserData1.animal.cow > 0){
        if(UserData1.animal.cow >= quantity){
          UserData1.animal.cow -= quantity;
          UserData2.animal.cow += quantity;
          user2.send({
            content: `Hello ${user2.tag} You Recerver ${quantity} ${interaction.options.get('animal').value} Form ${user1.tag}!`
          })
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
              .setTitle("Trade Successful!")
              .setColor(config.colours.success)
              .setDescription(`Done`)
              .setTimestamp(),
            ],
          });
        } else {
          return interaction.editReply({
        embeds: [
          new EmbedBuilder()
          .setTitle("Error: animals required")
          .setColor(config.colours.error)
          .setDescription(`You don't have ${quantity} to trade.`)
          .setTimestamp(),
        ]
      });
        }
      } else {
        return interaction.editReply({
        embeds: [
          new EmbedBuilder()
          .setTitle("Error: zoo or animals required")
          .setColor(config.colours.error)
          .setDescription(`You don't have zoo or animals\nYou need to buy zoo or hunt animal before you trade.`)
          .setTimestamp(),
        ]
      });
      }
    } else {
      
    }
  }
} 