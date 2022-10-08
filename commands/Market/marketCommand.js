const Discord = require("discord.js");
const { ActionRowBuilder, EmbedBuilder, SelectMenuBuilder, ComponentType, Client } = require('discord.js');
const config = require("../../config.json");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: "market",
    description: "View our Shops and Markets!",
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
           value: `**Selling at:** ${config.emojis.currency} **100**\n**Buying at:** ${config.emojis.currency} **70**`,
           inline: false
         },
         {
           name: `${config.emojis.stone}Stone 20x`,
           value: `**Selling at:** ${config.emojis.currency} **150**\n**Buying at:** ${config.emojis.currency} **125**`,
           inline: false
         },
         {
           name: `${config.emojis.ironOre}Iron Ore 20x`,
           value: `**Selling at:** ${config.emojis.currency} **300**\n**Buying at:** ${config.emojis.currency} **260**`
         },
         {
           name: `${config.emojis.ironBrick}Iron 20x`,
           value: `**Selling at:** ${config.emojis.currency} **450**\n**Buying at:** ${config.emojis.currency} **410**`
         }
     )
     .setTimestamp();
      
    let tools = new EmbedBuilder()
     .setTitle("Tools Shop")
     .setDescription(`Buy tools to start your journey with ${config.bot.name}`)
     .setColor(config.colours.embed)
     .addFields(
         { name: `Axe`, 
           value: `**Price:** ${config.emojis.currency} **90**`,
           inline: false
         },
         {
           name: `Pickaxe`,
           value: `**Price:** ${config.emojis.currency} **120**`,
           inline: false
         }
     )
     .setTimestamp();

    let foundry = new EmbedBuilder()
     .setTitle("Foundry Workshop")
     .setDescription(`Buy foundry items to start your journey with ${config.bot.name}`)
     .setColor(config.colours.embed)
     .addFields(
       {
         name: 'Furnace',
         value: `**Price:** ${config.emojis.currency} **5999**`,
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
					.setPlaceholder('Travel to markets, shops and many more.')
					.addOptions(
						{
							label: 'Resources Market.',
							description: 'Visit Resources Market.',
							value: 'resources',
						},
            {
              label: 'Tools Shop',
              description: 'Visit Tools Shop.',
              value: 'tools',
            },
            {
              label: 'Foundry Workshop',
              description: 'Visit Foundry Workshop',
              value: 'foundry',
            },
            {
              label: 'Go Back.',
              description: 'Go back to main menu of the market.',
              value: 'market',
            }
					),
			);
        
    let message = await interaction.reply({ embeds: [market], components: [row], fetchReply: true });

        const logChannel = client.channels.cache.get(config.logs.marketLog)
        
        const logger = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Market Command]** run by **${interaction.user.tag}**`)
            .addFields(
                { name: "Guild:", value: `${guild.name}` }
            )
            .setTimestamp();

        let viewMarket = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Market Command]* viewing market again **${interaction.user.tag}**`)
            .addFields(
                { name: "Guild:", value: `${guild.name}` }
            )
            .setTimestamp();

        let viewRes = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Market Command]** viewing resources market **${interaction.user.tag}**`)
            .addFields(
                { name: "Guild:", value: `${guild.name}` }
            )
            .setTimestamp();

        let viewTools = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Market Command]** viewing tools shop **${interaction.user.tag}**`)
            .addFields(
                { name: "Guild:", value: `${guild.name}` }
            )
            .setTimestamp();
      
        let viewFoundry = new EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`**[Market Command]** viewing foundry workshop **${interaction.user.tag}**`)
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
        case "tools":  
           await interaction.deferUpdate();
           await wait(100);
           await interaction.editReply({ embeds: [tools], components: [row] })
           await logChannel.send({ embeds: [viewTools] });
            break;
        case "foundry":  
           await interaction.deferUpdate();
           await wait(100);
           await interaction.editReply({ embeds: [foundry], components: [row] })
           await logChannel.send({ embeds: [viewFoundry] });
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