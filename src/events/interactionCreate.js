import { commands } from "../handlers/commands.js";
import { CommandInteraction, ComponentInteraction } from "eris";
import { colour } from "printly.js";
import { User } from "../database/profile.js";
import config from "../config.json" assert { type: "json" };

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
  /*  if (interaction instanceof ComponentInteraction) {
      if (interaction.data.component_type === 3 && interaction.data.custom_id === "inventorySelectMenu") {
        if (interaction.member.id !== interaction.member.id) {
          return interaction.createMessage({
            content: "It's not your select menu!",
            flags: 64
          });
        }

        if (interaction.data.values[0] === "resources") {
          await interaction.editOriginalMessage({ embeds: [resources] });
        }
      }
    } */
  });
  console.log(colour.cyanBright("[Event] interactionCreate.js is loaded"));
}