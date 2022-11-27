import { User } from '../database/profile.js';
import { colour } from 'printly.js';
import config from '../config.json' assert { type: 'json' };

export function loadAchievements(client, message) {
  setInterval(() => {
    client.users.map(async (member) => {
      const userData = await User.findOne({ id: member.id });
      if (userData) {
        if (!userData.achievements.regularUser && userData.commandRans == 500) {
          const dmChannel = await client.getDMChannel(member.id);
          await client.createMessage(dmChannel.id, {
            embeds: [
              {
                title: 'Achievement Unlocked!',
                color: Number(config.colours.achievement),
                fields: [
                  {
                    name: 'Regular User',
                    value: `500/500 Run Commands\n\`[■■■■■■■■■■■■■■■■■]\`\n\n**Rewards:**\n${config.emojis.coin}20,000\nRegular User(title)`,
                    inline: false,
                  },
                ],
                timestamp: new Date(),
              },
            ],
          });
          userData.coins += 20000;
          userData.achievements.regularUser = true;
          userData.save();
        }
      }
    });
  }, 5000);
  console.log(colour.cyanBright('[Auto] achievements.js is loaded'));
}
