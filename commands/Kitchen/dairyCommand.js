const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { ApplicationCommandOptionType } = require("discord.js");
const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const config = require("../../config.json");
const { ms } = require("printly.js");
const wait = require('node:timers/promises').setTimeout;
const dairyList = require("../../kitchen/dairy.json");

module.exports = {
  name: "dairy",
  description: "Make dairy today!",
  category: "Kitchen",
  options: [{
    name: "item",
    description: "choice a item which you want to make.",
    type: ApplicationCommandOptionType.String,
    required: true,
    choices: dairyList
  }],

  run: async (client, interaction) => {
    const { user, guild } = interaction;
    const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })
    const selected = dairyList.find((el) => { if (el.value === interaction.options.getString("item", null)) { return el; } });

    userData.commandRans += 1;
    userData.save();

    if (user && !userData.property.dairy) {
      const BuyCancel = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('buy')
            .setLabel('Buy (25,000)')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId(`cancel`)
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger)
        );

      const buyDairy = new EmbedBuilder()
        .setTitle(`Dairy missing`)
        .setColor(config.colours.error)
        .setDescription(`Looks like you don't have **Dairy** own!`)
        .setTimestamp();

      var message = await interaction.reply({ embeds: [buyDairy], components: [BuyCancel] });
    }

    if (user && userData.property.dairy) {
      
      const make = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('make1')
            .setLabel(`Make 1`)
            .setStyle(ButtonStyle.Success),
        );
      
      if (selected.value === "creams") {
        var message = await interaction.reply({
          embeds: [
            new EmbedBuilder()
            .setTitle(`Dairy`)
            .setColor(config.colours.embed)
            .setDescription(`**${config.emojis.cream}Cream**\n\n**Recipe:**\n${userData.foods.milkBuckets}/1 **${config.emojis.milkBucket}Milk Bucket**`)
            .setTimestamp()
          ],
          components: [make],
        });
      }
      if (selected.value === "butters") {
        var message = await interaction.reply({
          embeds: [
            new EmbedBuilder()
           .setTitle(`Dairy`)
           .setColor(config.colours.embed)
           .setDescription(`**${config.emojis.butter}Butter**\n\n**Recipe:**\n${userData.foods.milkBuckets}/2 **${config.emojis.milkBucket}Milk Bucket**`)
           .setTimestamp()
          ],
          components: [make],
        });
      }
    }

    const collector = message.createMessageComponentCollector({
      filter: fn => fn,
      componentType: ComponentType.Button,
      time: 20000
    });

    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id)
        return i.reply({
          content: `These Buttons aren't for you!`,
          ephemeral: true
        });

      if (i.customId === 'buy') {
        await i.deferUpdate();
        if (user && userData.coins < 25000) {
          return i.followUp({
            content: `You don't have enough coins to buy Dairy`,
            ephemeral: true,
          });
        }

        userData.coins -= 25000;
        userData.property.dairy = true;
        userData.save();

        await i.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Dairy Bought")
              .setColor(config.colours.success)
              .setDescription("You bought **Dairy**!\nRun the command again to see the Dairy.")
              .setTimestamp()
          ],
          components: [],
        });
      }
      if (i.customId === 'cancel') {
        await i.deferUpdate();
        await i.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Buying cancelled")
              .setColor(config.colours.error)
              .setDescription(`Buying **Dairy** has been cancelled!`)
              .setTimestamp(),
          ],
          components: [],
        });
      }
      if (i.customId === 'make1') {
        await i.deferUpdate();
        if (selected.value === 'creams') {
          if (user && userData.foods.milkBuckets < 1) {
            return i.followUp({
              content: `You don't have enough Milk Bucket to make a Cream`,
              ephemeral: true,
            });
          }
          await i.editReply({
            embeds: [
              new EmbedBuilder()
              .setTitle("Dairy")
              .setColor(config.colours.success)
              .setDescription(`**${config.emojis.cream}Cream** is making\nYou have to wait 25 seconds for the ${config.emojis.cream}**Cream**`)
            ],
            components: [],
          });
          await wait(25000);

          userData.foods.milkBuckets -= 1;
          userData.foods.creams += 1;
          userData.items.buckets += 1;
          userData.save();
          
          await i.editReply({
            embeds: [
              new EmbedBuilder()
               .setTitle("Creams")
               .setColor(config.colours.success)
               .setDescription(`You have made **${config.emojis.cream}Cream**!`)
               .setTimestamp(),
            ],
            components: [],
          });
        }
        if (selected.value === 'butters') {
          if (user && userData.foods.milkBuckets < 2) {
            return i.followUp({
              content: `You don't have enough Milk Buckets to make a Butter`,
              ephemeral: true,
            });
          }

          await i.editReply({
            embeds: [
              new EmbedBuilder()
              .setTitle("Dairy")
              .setColor(config.colours.success)
              .setDescription(`**${config.emojis.butter}Butter** is making\nYou have to wait 60 seconds for the ${config.emojis.butter}**Butter**`)
              .setTimestamp(),
            ],
            components: [],
          });

          await wait(60000);

          userData.foods.milkBuckets -= 2;
          userData.foods.butters += 1;
          userData.items.buckets += 2;
          userData.save();

          await i.editReply({
            embeds: [
              new EmbedBuilder()
              .setTitle("Dairy")
              .setColor(config.colours.success)
              .setDescription(`You have made **${config.emojis.butter}Butter**!`)
              .setTimestamp(),
            ],
          });
        }
      }
   });
  }
}