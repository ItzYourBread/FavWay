import { commands } from "../handlers/commands.js";
import { CommandInteraction, ComponentInteraction } from "eris";
import { colour, ms } from "printly.js";
import { User } from "../database/profile.js";
import config from "../config.json" assert { type: "json" };
import { Collection } from "eris";

export function interactionCreate(client, interaction) {
  client.on("interactionCreate", async (interaction) => {
    if (interaction instanceof CommandInteraction) {
      for (let slashCommand of commands) {
        if (slashCommand.name === interaction.data.name) {
          await slashCommand.run(client, interaction)
          const user = interaction.member;
          const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });
          userData.username = user.username;
          userData.commandRans += 1;
          userData.lastTime = Date.now();
          userData.save();
        }
      }
    }
  });
  console.log(colour.cyanBright("[Event] interactionCreate.js is loaded"));
}