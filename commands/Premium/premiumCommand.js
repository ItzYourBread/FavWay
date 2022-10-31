const moment = require("moment");
const schema = require("../../database/premium/code");
const User = require("../../database/premium/user");
const { EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const config = require("../../config.json")

module.exports = {
  name: "premium",
  description: `get preium of sweet`,
  category: "Premium",
  type: Discord.ApplicationCommandType.ChatInput,
  admin: false,
  options: [{
  name: 'redeem',
  description: 'get premium by redeem a premium code',
  type: Discord.ApplicationCommandOptionType.Subcommand,
  options: [
    {
      name: "code",
      description: `Please enter your redeem code`,
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
      }],
  /*options: [{
  name: 'view',
  description: 'view your premium subscription and expri',
  type: 'SUB_COMMAND',
  }]*/
  }],
  run: async (client, interaction, args) => {
      
    if (interaction.options.getSubcommand() === "redeem") {
        
    let user = await User.findOne({
      Id: interaction.user.id, // if you are using slash commands, swap message with interaction.
    });

    // Check Users input for a valid code. Like `!redeem ABCD-EFGH-IJKL`
    let code = interaction.options.getString("code");

    // Return an error if the User does not include any Premium Code
    if (!code) {
      interaction.reply(`**Please specify the code you want to redeem!**`);
    }

    // Check if the code is valid within the database
    const premium = await schema.findOne({
      code: code.toUpperCase(),
    });

    // Set the expire date for the premium code
    if (premium) {
      const expires = moment(premium.expiresAt).format(
        "dddd, MMMM Do YYYY HH:mm:ss"
      );

    // If the user is already a premium user, we dont want to save that so we return it.
    if (user && user.isPremium) {
      return interaction.reply(`**> You already are a premium user**\n\`Expires date: ${expires}\``);
    }
        
      // Once the code is expired, we delete it from the database and from the users profile
      user.isPremium = true;
      user.premium.redeemedBy.push(interaction.user);
      user.premium.redeemedAt = Date.now();
      user.premium.expiresAt = premium.expiresAt;
      user.premium.plan = premium.plan;

      // Save the User within the Database
      user = await user.save({ new: true }).catch(() => {});
      client.userSettings.set(interaction.user.id, user);
      await premium.deleteOne().catch(() => {});

      // Send a success message once redeemed
      const redeemSuccessful = new EmbedBuilder()
      .setTitle("Successfully Redeemed")
      .setDescription(`Congratulations! You successfully redeemed the premium code, now ${interaction.user.username} is a premium user of ${config.bot.name}.\n\n\`Expires date: ${expires}\``)
      .setColor(config.colours.embed)
      .setTimestamp()
      .setFooter({ text: `Congratulations ${interaction.user.username}`})
      interaction.reply({ embeds: [redeemSuccessful] });

      // Error message if the code is not valid.
    } else {
      return interaction.reply({ content: `**The code is invalid. Please try again using valid one!**` });
    }
    // } else if (interaction.options.getSubcommand() === "view") {

    }
  },
};