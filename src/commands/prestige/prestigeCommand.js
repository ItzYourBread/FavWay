import { Constants } from 'eris';
import { User } from '../../database/profile.js';
import config from '../../config.json' assert { type: 'json' };
import prestigeReward from '../../data/prestigeReward.json' assert { type: 'json' };

export default {
    data: {
        name: 'prestige',
        description: 'Prestige a player',
        options: [
            {
                name: 'view',
                description: 'Look at your prestige!',
                type: 1,
                options: [
                    {
                        name: 'user',
                        description: 'Please enter a user.',
                        type: Constants.ApplicationCommandOptionTypes.USER,
                        required: false,
                    },
                ],
            },
            {
                name: 'reward',
                description: 'Explore prestige reward and know!',
                type: 1,
            },
        ],
    },
    run: async (client, interaction) => {
        if (interaction.data.options[0].name === 'view') {
            const user_id =
                interaction.data.options[0].options &&
                interaction.data.options[0].options[0]
                    ? interaction.data.options[0].options[0].value
                    : interaction.member.id;
            const user = await client.users.get(user_id);
            const userData =
                (await User.findOne({ id: user_id })) ||
                new User({ id: user_id });

            let prestigeTier = '';
            if (userData.prestige >= 100) {
                prestigeTier = `Silver`;
            } else if (userData.prestige >= 200) {
                prestigeTier = `Gold `;
            } else {
                prestigeTier = `Bronze`;
            }

            let getXp = userData.prestige * 100;
            let divide = (getXp /= 17);
            let xpBar =
                '■'.repeat(Math.floor(userData.xp / divide)) +
                '□'.repeat(17 - Math.floor(userData.xp / divide));

            let view = {
                title: `${user.username}'s Prestige`,
                color: Number(config.colours.embed),
                fields: [
                    {
                        name: 'Prestige',
                        value: `[${userData.prestige}]`,
                        inline: true,
                    },
                    {
                        name: 'Tier',
                        value: `${prestigeTier}`,
                        inline: true,
                    },
                    {
                        name: 'Progress',
                        value: `${userData.xp}/${
                            userData.prestige * 100
                        } to reach prestige ${
                            userData.prestige + 1
                        }\n\`[${xpBar}]\` `,
                        inline: true,
                    },
                ],
                timestamp: new Date(),
            };
            await interaction.createMessage({ embeds: [view] });
        } else if (interaction.data.options[0].name === 'reward') {
            const user_id = interaction.member.id;
            const userData =
                (await User.findOne({ id: user_id })) ||
                new User({ id: user_id });

            var rewardList = '';
            prestigeReward.map((el) => {
                rewardList += `**${el.tier}**\n ** ** \ ** ** \`reward:\` ${el.reward}\n\n`;
            });

            let reward = {
                title: 'Prestige Reward',
                color: Number(config.colours.embed),
                description: `Earn prestige and know about it!\n\n${rewardList}`,
                footer: {
                    text: `Your current prestige level is ${userData.prestige}`,
                },
                timestamp: new Date(),
            };
            await interaction.createMessage({ embeds: [reward] });
        }
    },
};
