const Discord = require("discord.js");
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const config = require("./config.json");
const handler = require("./handlers/index.js");
const { printly, colour } = require("printly.js"); 
require('dotenv').config();


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

printly("Loading Index...");

module.exports = client;

// global
client.discord = Discord;
client.slash = new Collection();
client.userSettings = new Collection();

// Handlers
handler.loadEvents(client);
handler.loadCommands(client);
handler.loadAdminCommands(client);

require("./handlers/mongoose.js")(client);
require("./server.js");

// error handling
process.on("unhandledRejection", (reason, promise) => {
     console.log("[FATAL] Possibly Unhandled Rejection at: Promise ", promise, " reason: ", reason.message);
 });

// client login
client.login(process.env.TOKEN);

printly(colour.green("Index Loaded 🟢"));