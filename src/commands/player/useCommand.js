import { Constants } from 'eris';
import { User } from '../../database/profile.js';
import config from '../../config.json' assert { type: 'json' };
import useList from '../../data/inventory/useList.json' assert { type: 'json' };
import { ms } from 'printly.js';

export function checkItem(items, search) {
    if (items[0]) {
        return items[0][search];
    }
    return null;
}

export default {
    data: {
        name: 'use',
        description: 'Use items which is in your inventory.',
        options: [
            {
                name: 'item',
                description: 'Which item do you want to use?',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: true,
                focused: true,
                choices: useList,
            },
            {
                name: 'quantity',
                description: 'How many??',
                type: Constants.ApplicationCommandOptionTypes.NUMBER,
                required: false,
            },
        ],
    },
    run: async (client, interaction) => {
        const user = interaction.member;
        const userData =
            (await User.findOne({ id: user.id })) || new User({ id: user.id });

        const list = interaction.data.options[0].value;
        const quantity =
            interaction.data.options && interaction.data.options[1]
                ? interaction.data.options[1].value
                : 1;

        const useLists = useList.find((item) => {
            if (item.value === list) {
                return item;
            }
        });

        let value = checkItem([useLists], 'value');
        let name = checkItem([useLists], 'name');
        let emoji = checkItem([useLists], 'emoji');
        let dbLine = checkItem([useLists], 'dbLine');
        let boost = checkItem([useLists], 'boost');
        let benefit = checkItem([useLists], 'benefit');

        if (user && userData[dbLine][value] < 1) {
            return interaction.createMessage({
                embeds: [
                    {
                        color: Number(config.colours.error),
                        description: `You don't have **${config.emojis[emoji]}${name}**, make sure you have own the item before using it!`,
                        timestamp: new Date(),
                    },
                ],
                flags: 64,
            });
        }

        if (
            user &&
            userData[dbLine][value] > 1 &&
            userData[dbLine][value] < quantity
        ) {
            return interaction.createMessage({
                embeds: [
                    {
                        color: Number(config.colours.error),
                        description: `You don't have **${quantity} ${emoji}${name}** in your inventory, You only have **${userData[dbLine][value]} ${emoji}${name}**`,
                        timestamp: new Date(),
                    },
                ],
                flags: 64,
            });
        }

        let confirmation = {
            color: Number(config.colours.success),
            description: `You want to use **${quantity} ${config.emojis[emoji]}${name}.**\n**Benefit:** ${benefit}.\n**Expire:** 15 minutes.\n\nAre you sure?`,
            timestamp: new Date(),
        };

        let buttons = {
            type: 1,
            components: [
                {
                    type: 2,
                    label: `Confirm (${quantity})`,
                    style: 3,
                    custom_id: 'useConfirmButton',
                },
            ],
        };

        await interaction.createMessage({
            embeds: [confirmation],
            components: [buttons],
        });

        client.on('interactionCreate', async (i) => {
            if (i.member.id !== interaction.member.id)
                return i.createMessage({
                    content: "It's not your buttons",
                    flags: 64,
                });
            if (
                i.data.component_type === 2 &&
                i.data.custom_id === 'useConfirmButton'
            ) {
                await i.deferUpdate();

                userData[dbLine][value] -= quantity;
                userData.boost[value] = Date.now() + quantity * ms(boost);
                userData.save();

                await i.editOriginalMessage({
                    embeds: [
                        {
                            color: Number(config.colours.success),
                            description: `You used **${quantity} ${config.emojis[emoji]}${name}**.`,
                            timestamp: new Date(),
                        },
                    ],
                    components: [],
                });
            }
        });
    },
};
