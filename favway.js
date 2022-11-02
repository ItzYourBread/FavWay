import { Client, Constants, CommandInteraction } from "eris";
import config from "./config.json" assert { type: 'json' };
import { readdirSync } from "fs";
import { colour } from "printly.js";

import dotenv from "dotenv";
dotenv.config();

import { ready } from "./events/ready.js";
import { interactionCreate } from "./events/interactionCreate.js";

import { loadCommands } from "./handlers/commands.js";

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

export default client;

// Events loader
ready(client);
interactionCreate(client);

// handlers loader
loadCommands(client);

// Database
import "./handlers/mongoose.js";


process.on("unhandledRejection", (reason, promise) => {
  console.log("[FATAL] Possibly Unhandled Rejection at: Promise ", promise, " reason: ", reason.message);
});

client.connect();
console.log(colour.blueBright("[System] Index loaded"));