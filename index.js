const Discord = require("discord.js");
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const config = require("./config.json");
const handler = require("./handlers/index.ts");
const { colour } = require("printly.js"); 
require('dotenv').config();

function println() {
  return console.log.apply(console, arguments)
}

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

println("Loading Index...");

module.exports = client;

// global
client.discord = Discord;
client.slash = new Collection();
client.userSettings = new Collection();

// Handlers
handler.loadEvents(client);
handler.loadCommands(client);
handler.loadAdminCommands(client);

require("./handlers/mongoose.ts")(client);

// error handling
process.on("unhandledRejection", (reason, promise) => {
     println("[FATAL] Possibly Unhandled Rejection at: Promise ", promise, " reason: ", reason.message);
 });

// client login
client.login(process.env.TOKEN);

println(colour.green("Index Loaded 🟢"));