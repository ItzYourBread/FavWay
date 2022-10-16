const { Client, EmbedBuilder } = require('discord.js');
const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const config = require("../../config.json");
const emojis = require("../../api/emojis.json");
const tips = require('../../tips.json');
const wait = require('node:timers/promises').setTimeout;
const voucher_codes = require("voucher-code-generator");
const schema = require("../../database/game/receiptWithdraw");
const moment = require("moment");

module.exports = {
    name: "withdraw",
    description: "withdraw some coins from your bank",
    botPerm: [""],
    options: [{
      name: "amount",
      description: `How much you want to withdraw from the bank? example: amount or max`,
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
      }],
    category: "RolePlay",
    
    run: async (client, interaction) => {

    const user = interaction.member.user;
    const { guild } = interaction;
        
    let amount = interaction.options.getString("amount");

        
    let codes = [];

    let time = Date.now() + 86400000 * 4;
        

      const withdrawCode = voucher_codes.generate({
        pattern: "#######",
      });

      const code = withdrawCode.toString().toUpperCase();

      const find = await schema.findOne({
        code: code,
      });

      if (!find) {
        schema.create({
          code: code,
          expiresAt: time
        });

        codes.push(`${code}`);
      }
        
    let userData =
      (await Profile.findOne({ id: user.id })) ||
      (await new Profile({ id: user.id }).save());
    embed = new EmbedBuilder();

    if (amount === 'max' ) {
            amount = userData.bank;
        }
        
    if (userData.bank < amount) 
    
    return interaction.reply({
        embeds: [
            embed
            .setTitle(`Not enough balance`)
            .setDescription(`You only have ${config.emojis.currency}\`${userData.bank.toLocaleString()}\` in your bank account.`)
            .setColor(config.colours.error)
            .setTimestamp()
        ],
        ephemeral: true,
      });

    userData.commandRans += 1;
    userData.bank -= amount;
    userData.coins += amount;
    userData.save();
        
    let receipt = new EmbedBuilder()
    .setTitle("Receipt of withdrawn")
    .setDescription(`You withdrawn ${config.emojis.currency}\`${amount.toLocaleString()}\` from the your bank account\n\n**Receipt ID:**\n\`${codes}\` `)
    .setColor(config.colours.receipt)
    .setFooter({ text: `Expires - ${moment(time).format("dddd, MMMM Do YYYY")}` })
    .setTimestamp();

    await interaction.user.send({ content: "Receipt for proof", embeds: [receipt] });
        
    await interaction.reply({
      embeds: [
        embed
          .setDescription(`You have withdrawn ${config.emojis.currency}\`${amount.toLocaleString()}\` from your bank account and you will receive a message in DMs soon`)
          .setColor(config.colours.embed)
          .setTimestamp()
      ],
    });
        const logChannel = client.channels.cache.get(config.logs.withdrawLog)
        
        const logger = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Withdraw Command]** run by **${interaction.user.tag}**`)
            .addFields(
                { name: "Value", value: `Withdrawn: ${config.emojis.currency}\`${amount.toLocaleString()}\` from the bank account` },
                { name: "Guild:", value: `${guild.name}` }
            )
            .setTimestamp();
        
        logChannel.send({ embeds: [logger] });
  },
};
