const Discord = require("discord.js");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
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
        { name: 'RolePlay', value: 'roleplay' }
      ]
    }],

    run: async (client, interaction, args) => {

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

      if (interaction.options.get('type').value === "roleplay") {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
            .setTitle("RolePlay Commands")
            .setColor(config.colours.embed)
            .setDescription(`Hello Nothing to see here`)
            .setTimestamp(),
          ],
        });
      };
      
    }
}