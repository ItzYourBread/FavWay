import config from '../../config.json' assert { type: 'json' };
import { setTimeout as wait } from 'node:timers/promises';

export default {
    data: {
        name: 'help',
        description: 'Helpline!',
    },
    run: async (client, interaction) => {
        let commands = {
            title: 'FavWay Commands',
            color: Number(config.colours.embed),
            fields: [
                {
                    name: '🐣__Animal__',
                    value: 'Comming soon...',
                    inline: false,
                },
                {
                    name: '🎗__Social__',
                    value: '`profile`',
                    inline: false,
                },
                {
                    name: '🎲__Gamble__',
                    value: '`slots`',
                    inline: false,
                },
                {
                    name: '💰__Currency__',
                    value: '`balance`, `inventory`, `daily`, `use`, `open`, `quest`',
                    inline: false,
                },
                {
                    name: '🛒__Market__',
                    value: '`shop`',
                },
                {
                    name: '👷‍♂️__Work__',
                    value: '`chop`, `mine`',
                    inline: false,
                },
                {
                    name: '🎙__Utilities__',
                    value: '`help`, `ping`, `settings`',
                    inline: false,
                },
            ],
            timestamp: new Date(),
        };
        let rules = {
            title: 'FavWay Rules',
            color: Number(config.colours.embed),
            description: `\n
      Not following these rules result in a permanent or temporary ban and account reset!\n
      \n1. using multiple accounts for any reason is a violation of the rules.
      \n2. do not use any exploits or any bug to gain unfair advantage of the bot.
      \n3. do not trade items for actual money for FavWay items.
      \n`,
            timestamp: new Date(),
        };

        let helpMenu = {
            type: 1,
            components: [
                {
                    type: 3,
                    custom_id: 'helpMenu',
                    options: [
                        {
                            label: 'What are the commands?',
                            value: 'commandsList',
                        },
                        {
                            label: 'What are the rules?',
                            value: 'rulesList',
                        },
                    ],
                    placeholder: 'Frequently Asked Questions.',
                    min_values: 1,
                    max_values: 1,
                },
            ],
        };

        let helpButtons = {
            type: 1,
            components: [
                {
                    type: 2,
                    label: 'Support',
                    style: 5,
                    url: 'https://discord.gg/Ea4jrSSrjM',
                },
            ],
        };
        await interaction.createMessage({
            embeds: [commands],
            components: [helpMenu, helpButtons],
        });

        client.on('interactionCreate', async (i) => {
            if (
                i.data.component_type === 3 &&
                i.data.custom_id === 'helpMenu'
            ) {
                if (i.member.id !== interaction.member.id)
                    return i.createMessage({
                        content: "These select menu aren't for you",
                        flags: 64,
                    });
                await i.deferUpdate();
                switch (i.data.values[0]) {
                    case 'commandsList':
                        await i.editOriginalMessage({ embeds: [commands] });
                        break;
                    case 'rulesList':
                        await i.editOriginalMessage({ embeds: [rules] });
                        break;
                    default:
                        return;
                }
            }
        });
    },
};
