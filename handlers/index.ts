const fs = require("fs");
const { printly, colour } = require("printly.js");

const loadEvents = async function (client) {
    const eventFolders = fs.readdirSync("./events");
    for (const folder of eventFolders) {
        const eventFiles = fs
        .readdirSync(`./events/${folder}`)
        .filter((file) => file.endsWith(".ts"));
        
        for (const file of eventFiles) {
            const event = require(`../events/${folder}/${file}`);
            
            if (event.name) {
                printly(`[Event] ${file} is loaded `);
            } else {
                printly(colour.red(`❌ [Event] ${file} is not loaded something wrong there`));
                continue;
            }
            
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    }
}


 const loadCommands = async function (client) {
    let slash = []

    const commandFolders = fs.readdirSync("./commands");
    for (const folder of commandFolders) {
        const commandFiles = fs
        .readdirSync(`./commands/${folder}`)
        .filter((file) => file.endsWith(".ts"));
        
        for (const file of commandFiles) {
            const command = require(`../commands/${folder}/${file}`);
            
            if (command.name) {
                client.slash.set(command.name, command);
                slash.push(command)
                printly(`[Command] ${file} is loaded `);
            } else {
                printly(colour.red(`❌ [Command] ${file} is not loaded something wrong there`));
                continue;
            }
        }
    }

    client.on("ready", async() => {
        // Register Slash Commands for a single guild
        /* await client.guilds.cache
           .get(config.settings.guildID)
           .commands.set(slash); */

        // Register Slash Commands for all the guilds
        await client.application.commands.set(slash)
    })
}
const loadAdminCommands = async function (client) {
    let slash = []

    const commandFolders = fs.readdirSync("./adminCommands");
    for (const folder of commandFolders) {
        const commandFiles = fs
        .readdirSync(`./adminCommands/${folder}`)
        .filter((file) => file.endsWith(".ts"));
        
        for (const file of commandFiles) {
            const command = require(`../adminCommands/${folder}/${file}`);
            
            if (command.name) {
                client.slash.set(command.name, command);
                slash.push(command)
                printly(`[Admin Command] ${file} is loaded `);
            } else {
                printly(colour.red(`❌ [Admin Command] ${file} is not loaded something wrong there`));
                continue;
            }
        }
    }

    client.on("ready", async() => {
        // Register Slash Commands for a single guild
           await client.guilds.cache
           .get("962316688735498360")
           .commands.set(slash); 

        // Register Slash Commands for all the guilds
       // await client.application.commands.set(slash)
    })
}

module.exports = {
    loadEvents,
    loadCommands,
    loadAdminCommands
}