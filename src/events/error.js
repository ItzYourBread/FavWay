import { colour } from "printly.js";

export function error(client) {
  client.on("error", async (err) => {
    if (err.code === 1006) return;
    else console.error(error);
  });
  console.log(colour.cyanBright("[Event] error.js is loaded"));
}