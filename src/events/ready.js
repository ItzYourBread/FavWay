import Eris from 'eris';
import { colour } from "printly.js";
import config from "../config.json" assert { type: "json" };

import { loadAchievements } from "../handlers/achievements.js";
import { loadQuest } from "../handlers/quest.js";

let statusMessageID = "1037785678542557264";

export function ready(client, message) {
  client.on("ready", async () => {
    client.editStatus("online", { name: "FavWay", type: 0 });
    console.log(colour.greenBright(`[Discord API] ${client.user.username} is now connected to Discord!`));

    if (config.webhooks.status.mode) {
      setInterval(() => {
        let status = {
          color: Number(config.colours.embed),
          fields: [
            {
              name: "Status",
              value: `**FavWay** is now online!`,
              inline: true
            }
          ],
          timestamp: new Date()
        }
          client.editWebhookMessage(
            config.webhooks.status.id, 
            config.webhooks.status.token, 
            statusMessageID, 
            { embeds: [status] }
          );
        console.log("refreshing");
      }, 10000);
    }
    
    loadAchievements(client);
    loadQuest(client);
  });
  console.log(colour.cyanBright("[Event] ready.js is loaded"));
}