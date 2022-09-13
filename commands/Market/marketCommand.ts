const Discord = require("discord.js");
const { ActionRowBuilder, EmbedBuilder, SelectMenuBuilder, ComponentType, Client } = require('discord.js');
const config = require("../../config.json");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: "market",
    description: "View our Shop!",
    category: "RolePlay",
    
    run: async (client, interaction) => {

    const { guild } = interaction; 
    const user = interaction.member.user

    let resources = new EmbedBuilder()
     .setTitle("Resource's market")
     .setDescription("Buy and sell resources from resource's market")
     .setColor(config.colours.embed)
     .addFields(
         { name: `${config.emojis.wood}Wood 20x`, 
           value: `Selling at: 100CN\nBuying at: 70CN`,
           inline: false
         },
         {
           name: `${config.emojis.stone}Stone 20x`,
           value: `Selling at: 150CN\nBuying at: 125CN`,
           inline: false
         }
     )
     .setTimestamp();

    let market = new EmbedBuilder()
     .setTitle(`${config.bot.name}’s Market`)
     .setDescription("Welcome to our Market")
     .setImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0ucjTwQuNXyh_8g2kO_0stJHKlNClq9UUSg&usqp=CAU")
     .setColor(config.colours.embed)
     .setTimestamp();

    const row = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('market')
					.setPlaceholder('Travel to markets')
					.addOptions(
						{
							label: 'Rescoures Market',
							description: 'Visit Rescoures market',
							value: 'resources',
						},
                        {
                            label: 'Back to Market menu',
                            description: 'Go back to market menu',
                            value: 'market',
                        },
					),
			);
        
    let message = await interaction.reply({ embeds: [market], components: [row], fetchReply: true });

        const logChannel = client.channels.cache.get(config.logs.marketLog)
        
        const logger = new Discord.EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`[Market Command] run by **${interaction.user.tag}**`)
            .addFields(
                { name: "Guild:", value: `${guild.name}` }
            )
            .setTimestamp();

        let viewMarket = new Discord.EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`[Market Command] viewing market again **${interaction.user.tag}**`)
            .addFields(
                { name: "Guild:", value: `${guild.name}` }
            )
            .setTimestamp();

        let viewRes = new Discord.EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`[Market Command] viewing resources market **${interaction.user.tag}**`)
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
        case "resources":  
           await interaction.deferUpdate();
           await wait(100);
           await interaction.editReply({ embeds: [resources], components: [row] })
           await logChannel.send({ embeds: [viewRes] });
            break;
        case "market":  
           await interaction.deferUpdate();
           await wait(100);
           await interaction.editReply({ embeds: [market], components: [row] })
           await logChannel.send({ embeds: [viewMarket] });
            break;
    };                
});        
    }
}