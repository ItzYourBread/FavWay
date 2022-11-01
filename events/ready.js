import Eris from 'eris';

export function ready(client) {
  client.on("ready", async () => {
    console.log("ready");
  })
}