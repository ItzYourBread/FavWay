const { ActionRowBuilder, EmbedBuilder, SelectMenuBuilder, ComponentType, Client } = require('discord.js');
const { Profile } = require("../../database/game/profile");
const Discord = require("discord.js");
const config = require("../../config.json");
const emojis = require("../../api/emojis.json");
const tips = require('../../tips.json');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: "inventory",
    description: "Check your Inventory",
    botPerm: [""],
    category: "RolePlay",
    
    run: async (client, interaction) => {
        
        const user = interaction.member.user
        const { guild } = interaction;
        
        const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })
        
        let tip = tips.tip[Math.floor((Math.random() * tips.tip.length))];
        
        let emoji = emojis.emoji[Math.floor((Math.random() * emojis.emoji.length))];

        let resources = new EmbedBuilder()
        .setTitle(`${user.username}'s Inventory`)
        .setDescription("Not Always Good")
        .addFields(
		{ name: `${config.emojis.wood}Wood`, value: `${userData.woods}` },
		{ name: `${config.emojis.stone}Stone`, value: `${userData.stones}` },
	)
        .setColor(config.colours.embed)
        .setThumbnail(user.displayAvatarURL())
        .setFooter({ text: `${emoji} You have good amount of resources`})
        .setTimestamp();

        let weapons = new EmbedBuilder()
        .setTitle(`${user.username}'s Inventory`)
        .setDescription("Nothing to seek here")
        .setColor(config.colours.embed)
        .setThumbnail(user.displayAvatarURL())
        .setFooter({ text: `${emoji} You have good amount of weapons`})
        .setTimestamp();
        
        
        const row = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('inventory')
					.setPlaceholder('View items by category.')
					.addOptions(
						{
							label: 'Resources',
							description: 'View your resources',
							value: 'resources',
						},
                        {
                            label: 'Weapons',
                            description: 'View your weapons',
                            value: 'weapons',
                        },
					),
			);
      
      
        let message = await interaction.reply({ embeds: [resources], components: [row], fetchReply: true });

        const logChannel = client.channels.cache.get(config.logs.roleplayLog)
        
        const logger = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Inventory Command]** run by ${interaction.user.tag}`)
            .addFields(
                { name: "Guild:", value: `${guild.name}` }
            )
            .setTimestamp();

        let viewRes = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Inventory Command]** viewing resources **${interaction.user.tag}**`)
            .addFields(
                { name: "Guild:", value: `${guild.name}` }
            )
            .setTimestamp();

        let viewWeapons = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Inventory Command]** viewing weapons **${interaction.user.tag}**`)
            .addFields(
                { name: "Guild:", value: `${guild.name}` }
            )
            .setTimestamp();
        
        logChannel.send({ embeds: [logger] });
        
        const collector = message.createMessageComponentCollector({ 
            filter: fn => fn,
            componentType: ComponentType.SelectMenu, 
            time: 2000 
        });

collector.on('collect', i => {
	if (i.user.id === interaction.user.id) 
		return i.reply({ content: `These menu aren't for you!`, ephemeral: true });
});
        
        
client.on('interactionCreate', async (interaction, client) => {
    if (!interaction.isSelectMenu()) return;
            
    switch (interaction.values[0]) {
        case "weapons":  
           await interaction.deferUpdate();
           await wait(100);
           await interaction.editReply({ embeds: [weapons], components: [row] })
           await logChannel.send({ embeds: [viewWeapons] });
            break;
        case "resources":  
           await interaction.deferUpdate();
           await wait(100);
           await interaction.editReply({ embeds: [resources], components: [row] })
           await logChannel.send({ embeds: [viewRes] });
            break;
    };                
});
    }
}
