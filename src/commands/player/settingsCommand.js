import { User } from "../../database/profile.js";
import config from "../../config.json" assert { type: "json" };

export default {
  data: {
    name: "settings",
    description: "User settings."
  },
  run: async (client, interaction) => {
    
    const user = interaction.member;
    const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });

    var value = "compactMode";
    var name = "Compact Mode"

    let compactMode = {
      title: "Compact mode",
      color: Number(config.colours.embed),
      description: "Compact mode is a way to show inventory and shop in a mini way!",
      timestamp: new Date()
    };

    let dmMode = {
      title: "DM Notification",
      color: Number(config.colours.embed),
      description: "DM Notifications is a way to get notify of crafting items time or expiration!",
      timestamp: new Date()
    };

    let menu = {
      type: 1,
      components: [{
        type: 3,
        custom_id: "menu",
        options: [
          {
            label: "Compact mode",
            description: "Compact mode is a way to show inventory and shop in a mini way!",
            value: "compactMode"
          },
          {
            label: "DM Notification",
            description: "DM Notifications is a way to get notify of crafting items time or expiration!",
            value: "dmMode"
          }
        ],
        min_values: 1,
        max_values: 1
      }]
    }

    let buttons = {
      type: 1,
      components: [
        {
          type: 2,
          label: "Enable",
          style: 3,
          custom_id: "enable"
        },
        {
          type: 2,
          label: "Disable",
          style: 4,
          custom_id: "disable"
        }
      ]
   }
    await interaction.createMessage({ embeds: [compactMode], components: [menu, buttons] });

    client.on("interactionCreate", async (i) => {
      if (i.member.id !== interaction.member.id)
        return i.createMessage({
          content: "This is not your menu and buttons!.",
          flags: 64
        });
      if (i.data.custom_id === "menu") {
        await i.deferUpdate();
        if (i.data.values[0] === "compactMode") {
          value = "compactMode";
          name = "Compact Mode";
          await i.editOriginalMessage({ embeds: [compactMode] });
        } if (i.data.values[0] === "dmMode") {
          value = "dmMode";
          name = "Dm Notification";
          await i.editOriginalMessage({ embeds: [dmMode] });
        }
      }
      if (i.data.custom_id === "enable") {
        await i.deferUpdate();
        userData.settings[value] = true;
        userData.save();
        return i.createFollowup({ content: `Successfully enabled ${name}`, flags: 64 });
      }
      if (i.data.custom_id === "disable") {
        await i.deferUpdate();
        userData.settings[value] = false;
        userData.save();
        return i.createFollowup({ content: `Successfully disabled ${name}`, flags: 64 });
      }
    });
  }
}