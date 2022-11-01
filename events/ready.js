import Eris from 'eris';
import { colour } from "printly.js";

export function ready(client) {
  client.on("ready", async () => {
  });
  console.log(colour.cyanBright("[Event] ready.js is loaded"));
}