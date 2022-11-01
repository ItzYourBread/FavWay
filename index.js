import { Client, Constants, CommandInteraction } from "eris";
import Eris from "eris";
import config from "./config.json" assert { type: 'json' };
import { readdirSync } from "fs";
import { colour } from "printly.js";

import dotenv from "dotenv";
dotenv.config();

import { ready } from "./events/ready.js";

import { loadCommands, commands } from "./handlers/commands.js";

console.log(colour.blueBright("[System] Index loading..."));

const client = new Client(process.env.TOKEN, {
  intents: [
    "guilds",
    "guildMessages",
    "guildMembers",
    "messageContent",
    "directMessages",
    "guildEmojis"
  ],
  partials: [
    "message",
    "channel",
    "user"
  ]
});

/* 
client.on("ready", async () => {
 const commandFolders = readdirSync("./commands");
    for (const folder of commandFolders) {
        const commandFiles = readdirSync(`./commands/${folder}`)
        .filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
            const slashCommandObject = await import(`./commands/${folder}/${file}`);

          if (slashCommandObject.default.data.name) {
                console.log(colour.cyanBright(`[Command] ${slashCommandObject.default.data.name} is loaded`));
          }

    // await client.createGuildCommand(process.env.SLASH_COMMANDS_GUILD, slashCommandObject.default.data)
    // Use code underneath for global slash commands
    await client.createCommand(slashCommandObject.default.data)
    commands.push({ name: slashCommandObject.default.data.name, run: slashCommandObject.default.run });
        }
    }
});
*/

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

export default client;

// Events loader
ready(client);

// handlers loader
loadCommands(client);

// Database
import "./handlers/mongoose.js";


process.on("unhandledRejection", (reason, promise) => {
  console.log("[FATAL] Possibly Unhandled Rejection at: Promise ", promise, " reason: ", reason.message);
});

client.connect();
console.log(colour.blueBright("[System] Index loaded"));