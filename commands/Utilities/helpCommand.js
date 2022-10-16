const Discord = require("discord.js");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { ActionRowBuilder, SelectMenuBuilder, ComponentType, Client } = require("discord.js");
const config = require("../../config.json");
const { Profile } = require("../../database/game/profile");

module.exports = {
    name: 'help',
    description: 'Get help from FavWay and List of Commands',
    category: 'Utility',
    options: [{
      name: 'type',
      description: 'What type of help do you want?',
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: 'Support', value: 'support' },
        { name: 'Command List', value: 'commands' }
      ]
    }],

    run: async (client, interaction) => {

      const { user, guild } = interaction;

      const userData = await Profile.findOne({ id: user.id }) || new Profile({ id: user.id })

      userData.commandRans += 1;
      userData.save();

      if (interaction.options.get('type').value === "support") {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
            .setTitle("FavWay Support")
            .setColor(config.colours.embed)
            .setDescription(`Text here **ARIF**`)
            .setTimestamp(),
          ],
        });
      };

      if (interaction.options.get('type').value === "commands") {

        const utilities = new EmbedBuilder()
        .setTitle(`Utilities Commands`)
        .setColor(config.colours.embed)
        .setDescription(`Here is the full list of Utilities Commands`)
        .addFields(
          {
            name: `/ping`,
            value: `Check ${config.bot.name}’s ping.`,
            inline: true
          },
          {
            name: `/help`,
            value: `Get help from ${config.bot.name}.`,
            inline: true
          },
          {
            name: `/stats`,
            value: `Get the current status of ${config.bot.name}.`,
            inline: true,
          }
       )
        .setTimestamp();

        const roleplay = new EmbedBuilder()
        .setTitle(`RolePlay Commands`)
        .setColor(config.colours.embed)
        .setDescription(`Here is the full list of RolePlay Commands`)
        .addFields(
          {
            name: `/balance`,
            value: `Get a look of your balance or others.`,
            inline: true
          },
          {
            name: `/deposit`,
            value: `Deposit your money into bank so no one can rob you.`,
            inline: true
          },
          {
            name: `/withdraw`,
            value: `Withdraw your money if you don'tbave any fear of robbers.`,
            inline: true
          },
          {
            name: `/profile`,
            value: `View your or others profile.`,
            inline: true,
          }
        )
        .setTimestamp();

        
      const row = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('help')
					.setPlaceholder('Select for more')
					.addOptions(
						{
							label: 'Utilities',
							description: 'View Utilities Commands',
							value: 'utilities',
						},
            {
              label: 'RolePlay',
              description: 'View RolePlay Commands',
              value: 'roleplay',
            }
				 ),
			);

        let message = await interaction.reply({ embeds: [utilities], components: [row] });

        
const collector = message.createMessageComponentCollector({ 
            filter: fn => fn,
            componentType: ComponentType.SelectMenu, 
            time: 20000
        });

collector.on('collect', i => {
	if (i.user.id === interaction.user.id) 
		return i.reply({ content: `These menu aren't for you!`, ephemeral: true });
});
        
        
client.on('interactionCreate', async (interaction, client) => {
    if (!interaction.isSelectMenu()) return;
            
    switch (interaction.values[0]) {
        case "utilities":  
           await interaction.update({ embeds: [utilities], components: [row] })
            break;
        case "roleplay":  
           await interaction.update({ embeds: [roleplay], components: [row] })
            break;
    };                
});
        
      };
      
    }
}