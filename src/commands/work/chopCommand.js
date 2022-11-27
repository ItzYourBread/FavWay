import { User } from '../../database/profile.js';
import config from '../../config.json' assert { type: 'json' };
import { ms } from 'printly.js';
import moment from 'moment';
import 'moment-duration-format';

export default {
    data: {
        name: 'chop',
        description: 'Chop some trees today!',
    },
    run: async (client, interaction) => {
        const user = interaction.member;
        const userData =
            (await User.findOne({ id: user.id })) || new User({ id: user.id });

        const duration = moment
            .duration(userData.cooldowns.chop - Date.now())
            .format('m[m], s[s]');

        if (user && userData.cooldowns.chop > Date.now()) {
            return interaction.createMessage({
                content: `You can chop again in ${duration}`,
                flags: 64,
            });
        }

        if (user && userData.items.axes < 1) {
            return interaction.createMessage({
                content: "You don't have any axes to chop!",
                flags: 64,
            });
        }

        let woodAmount = 0;
        let chopCooldown = ms('3m');
        let woodBoost = 0;
        if (userData.boost.cakeNormal > Date.now()) {
            woodBoost += 75;
        }
        woodAmount += Math.floor(Math.random() * 18) + 1 + woodBoost;

        userData.resources.woods += woodAmount;
        userData.health.axe += 1;
        userData.cooldowns.chop = Date.now() + chopCooldown;
        if (userData.health.axe == 20) {
            userData.health.axe -= 20;
            userData.items.axe -= 1;
        }
        userData.save();
        await interaction.createMessage({
            content: `You got ${woodAmount} ${config.emojis.wood}**Wood** from chopping Happy work!`,
        });
    },
};
