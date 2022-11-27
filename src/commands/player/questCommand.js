import { User } from '../../database/profile.js';
import config from '../../config.json' assert { type: 'json' };

export default {
  data: {
    name: 'quest',
    description: 'Complete your daily quest and get some reward!',
  },
  run: async (client, interaction) => {
    const user = interaction.member;
    const userData = (await User.findOne({ id: user.id })) || new User({ id: user.id });

    let quest = {
      title: `${user.username}'s Quest`,
      color: Number(config.colours.embed),
      description: `You don't have any quest today!`,
      timestamp: new Date(),
    };
    await interaction.createMessage({ embeds: [quest] });
  },
};
