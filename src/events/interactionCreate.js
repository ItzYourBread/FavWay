import { commands } from "../handlers/commands.js";
import { CommandInteraction } from "eris";
import { colour } from "printly.js";

export function interactionCreate(client, interaction) {
  client.on("interactionCreate", async (interaction) => {
    if (interaction instanceof CommandInteraction) {
      for (let slashCommand of commands) {
        if (slashCommand.name === interaction.data.name) {
          await slashCommand.run(client, interaction)
            break
        }
      }
    }
  });
  console.log(colour.cyanBright("[Event] interactionCreate.js is loaded"));
}