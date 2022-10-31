import { Client, Constants, CommandInteraction } from "eris";
import Eris from "eris";
import config from "./config.json" assert { type: 'json' };
import { readdirSync } from "fs";

import dotenv from "dotenv";
dotenv.config();


console.log("[System] Index loading...");

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

const commands = [];

client.on("ready", async () => {
 const commandFolders = readdirSync("./commands");
    for (const folder of commandFolders) {
        const commandFiles = readdirSync(`./commands/${folder}`)
        .filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
            const slashCommandObject = await import(`./commands/${folder}/${file}`);


    // await client.createGuildCommand(process.env.SLASH_COMMANDS_GUILD, slashCommandObject.default.data)
    // Use code underneath for global slash commands
    await client.createCommand(slashCommandObject.default.data)
    commands.push({ name: slashCommandObject.default.data.name, run: slashCommandObject.default.run })
  }
  console.log("[Discord API] Loaded application (/) commands!")
    }
});

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

import "./handlers/mongoose.js";


process.on("unhandledRejection", (reason, promise) => {
  console.log("[FATAL] Possibly Unhandled Rejection at: Promise ", promise, " reason: ", reason.message);
});

client.connect();
console.log("[System] Index loaded");