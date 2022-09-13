const Discord = require("discord.js");
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const config = require("./config.json");
const handler = require("./handlers/index.js");

const client = new Discord.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages
    ],
    partials: [ 
        Partials.Message, 
        Partials.Channel, 
        Partials.User 
    ],
})

console.log("Loading Index...")

module.exports = client;

// global
client.discord = Discord;
client.slash = new Collection();
client.userSettings = new Collection();

global.success = "<here is>"
global.error = "<HERE IS>"

// Handlers
handler.loadEvents(client);
handler.loadCommands(client);
handler.loadAdminCommands(client);

require("./handlers/mongoose.js")(client);

// error handling
process.on("unhandledRejection", (reason, promise) => {
     console.log("[FATAL] Possibly Unhandled Rejection at: Promise ", promise, " reason: ", reason.message);
 });

// client login
client.login("OTQzODU1NzcyNDE1MTkzMTE4.GdNmC6.rZeMVxNSLQ7f4EPBafLGkclH8zDE8On8TaDnoI");
console.log("Index Loaded 🟢")
