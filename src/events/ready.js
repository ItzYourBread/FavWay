import Eris from 'eris';
import { colour } from "printly.js";

export function ready(client) {
  client.on("ready", async () => {
    client.editStatus("idle", { name: "FavWay", type: 0 });
    console.log(colour.greenBright(`[Discord API] ${client.user.username} is now connected to Discord!`));
  });
  console.log(colour.cyanBright("[Event] ready.js is loaded"));
}