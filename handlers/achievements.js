const Discord = require("discord.js");
const { Client, EmbedBuilder } = require("discord.js");
const config = require("../config.json");
const { Profile } = require("../database/game/profile");
const { printly, ms, colour } = require("printly.js");
const wait = require('node:timers/promises').setTimeout;


module.exports = async (client, message) => {
  setInterval(() => {
    client.users.cache.map(async (member) => {
      const user = await Profile.findOne({ id: member.id });
      if (user) {
        if (!user.achievements.tinyPlayer && user.commandRans == 500) {
          await member.send({
            embeds: [
              new EmbedBuilder()
                .setTitle("Achievements Unlocked..!")
                .setColor(config.colours.embed)
                .setDescription(`Congo for unlocking a achievements!`)
                .setTimestamp(),
            ],
          });
          user.coins += 2000;
          user.cents += 700;
          user.achievements.tinyPlayer = true;
          user.save();
        }
      }
    });
  }, 5000);

  setInterval(() => {
    client.users.cache.map(async (member) => {
      const user = await Profile.findOne({ id: member.id });
      if (user) {
        if (!user.achievements.firstCraft && user.craftCount == 1) {
          await member.send({
            embeds: [
              new EmbedBuilder()
                .setTitle("Achievements Unlocked..!")
                .setColor(config.colours.embed)
                .setDescription(`Congo for unlocking a achievements!`)
                .setTimestamp(),
            ],
          });
          user.coins += 3500;
          user.resources.ironBricks += 15;
          user.achievements.firstCraft = true;
          user.save();
        }
      }
    });
  }, 5000);
  printly(colour.greenBright("\n[Auto] Achievements Successfully Loaded"));
}