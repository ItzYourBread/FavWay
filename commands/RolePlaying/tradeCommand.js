const Discord = require("discord.js");
const config = require("../../config.json");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const { ms } = require("printly.js");
const { animals } = require("../../animals.json");

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
    choices: animals,
  }],

  run: async (client, interaction) => {
    await interaction.deferReply();
    const user1 = interaction.user;
    const quantity = interaction.options.getNumber('quantity');
    const user2 = interaction.options.getUser('user');
    const animal = animals.find(el => el.value === interaction.options.get('animal').value);
    const UserData1 = await Profile.findOne({ id: user1.id }); // You
    const UserData2 = await Profile.findOne({ id: user2.id }); // Other
    if (UserData1 && UserData2 && animal) {
      if (UserData1.property.zoo && UserData1.animal[animal.value] && UserData1.animal[animal.value] > 0) {
        if (UserData1.animal[animal.value] >= quantity) {
          UserData1.animal[animal.value] -= quantity;
          UserData2.animal[animal.value] += quantity;
          UserData1.save();
          UserData2.save();
          user2.send({
            content: `Hello ${user2.tag} You Recerver ${quantity} ${animal.emoji}${animal.name} Form ${user1.tag}!`
          })
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Trade Successful!")
                .setColor(config.colours.success)
                .setDescription(`You give **${quantity} ${animal.emoji}${animal.name}**`)
                .setTimestamp(),
            ],
          });
        } else {
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Error: animals required")
                .setColor(config.colours.error)
                .setDescription(`You don't have **${quantity} ${animal.emoji}${animal.name}** to trade.`)
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
              .setDescription(`You don't have zoo or animals\nYou need to buy zoo or hunt ${animal.name} before you trade.`)
              .setTimestamp(),
          ]
        });
      }
    } else {

    }
  }
}