const { Client, EmbedBuilder } = require('discord.js');
const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const config = require("../../config.json");
const emojis = require("../../api/emojis.json");
const tips = require('../../tips.json');
const wait = require('node:timers/promises').setTimeout;
const moment = require("moment");

module.exports = {
    name: "deposit",
    description: "Deposit your coins to the bank",
    botPerm: [""],
    options: [{
      name: "amount",
      description: `How much you want to deposit to the bank? example: amount or max`,
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
      }],
    category: "RolePlay",
    
    run: async (client, interaction) => {

    const { guild } = interaction;
    const user = interaction.member.user;
          
    let amount = interaction.options.getString("amount");
        
    let userData =
      (await Profile.findOne({ id: user.id })) ||
      (await new Profile({ id: user.id }).save());
    embed = new EmbedBuilder();

    if (amount === 'max' ) {
            amount = userData.coins;
        }

    if (userData.coins < amount)
        
      return interaction.reply({
        embeds: [
            embed
            .setTitle(`Not enough balance`)
            .setDescription(`You only have ${confif.emojis.currency}\`${userData.coins.toLocaleString()}\` in your pocket.`)
            .setColor(config.colours.error)
            .setTimestamp()
        ],
        ephemeral: true,
      });

    userData.commandRans += 1;
    userData.coins -= amount;
    userData.bank += amount;
    userData.save();
        
    await interaction.reply({
      embeds: [
        embed
          .setDescription(`You have deposited ${config.emojis.currency}\`${amount.toLocaleString()}\` to your bank account`)
          .setColor(config.colours.embed)
          .setTimestamp()
      ],
    });
        const logChannel = client.channels.cache.get(config.logs.depositLog)
        
        const logger = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Deposit Command]** run by **${interaction.user.tag}**`)
            .addFields(
                { name: "Value", value: `Deposited: \`${amount.toLocaleString()}\`${config.emojis.currency} to the bank account` },
                { name: "Guild:", value: `${guild.name}` }
            )
            .setTimestamp();
        
        logChannel.send({ embeds: [logger] }); 
  },
};
