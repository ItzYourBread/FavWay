import { readdirSync } from "fs";
import path from "path";
import { colour } from "printly.js";

const commands = [];
export { commands }

const commandsPath = path.join('./src/commands');
const commandsImport = path.join('..', 'commands');

export function loadCommands(client) {
  client.on("ready", async () => {
    const commandFolders = readdirSync(`${commandsPath}`);
    for (const folder of commandFolders) {
      const commandFiles = readdirSync(`${commandsPath}/${folder}`)
        .filter((file) => file.endsWith(".js"));
      for (const file of commandFiles) {
        const slashCommandObject = await import(`${commandsImport}/${folder}/${file}`);
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
}