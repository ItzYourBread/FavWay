import { colour } from "printly.js";
import config from "../config.json" assert { type: "json" };

export function error(client) {
  client.on("error", async (err) => {
    if (err.code === 1006) return;
    else console.error(error);
    client.createMessage("1040195665818566666", {
      embeds: [{
        title: "Error",
        color: Number(config.colours.error),
        description: `\```js\n${error}``\` `,
        timestamp: new Date()
      }],
    });
  });
  console.log(colour.cyanBright("[Event] error.js is loaded"));
}