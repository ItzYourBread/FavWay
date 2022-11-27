import { User } from '../../database/profile.js';
import config from '../../config.json' assert { type: 'json' };
import { Constants } from 'eris';

export default {
    data: {
        name: 'balance',
        description: 'Check your balance',
        options: [
            {
                name: 'user',
                description: 'Please enter a user.',
                type: Constants.ApplicationCommandOptionTypes.USER,
                required: false,
            },
        ],
    },
    run: async (client, interaction) => {
        const user_id =
            interaction.data.options && interaction.data.options[0]
                ? interaction.data.options[0].value
                : interaction.member.id;
        const user = await client.users.get(user_id);
        const userData =
            (await User.findOne({ id: user_id })) || new User({ id: user_id });

        let balance = {
            title: `${user.username}'s Balance`,
            color: Number(config.colours.embed),
            description: `**Coin:** ${
                config.emojis.coin
            }${userData.coins.toLocaleString()}\n**Gem:** ${
                config.emojis.gem
            }${userData.gems.toLocaleString()}`,
            timestamp: new Date(),
        };

        await interaction.createMessage({ embeds: [balance] });
    },
};
