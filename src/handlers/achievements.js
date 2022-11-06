import { User } from "../database/profile.js";
import { colour } from "printly.js";
import config from "../config.json" assert { type: "json" };
import { setTimeout as wait } from "node:timers/promises";

export function loadAchievements(client, message) {
  setInterval(() => {
    client.users.map(async (member) => {
      const userData = await User.findOne({ id: member.id });
      if (userData) {
        if (!userData.achievements.regularUser && userData.commandRans == 309) {
          const dmChannel = await client.getDMChannel(member.id);
          await client.createMessage(dmChannel.id, { content: "Testing 69 achievement haha" });
        }
      }
    });
  }, 3000);
  console.log(colour.cyanBright("[Auto] achievements.js is loaded"));
}