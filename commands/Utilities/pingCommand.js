const Discord = require("discord.js");
const config = require("../../config.json")

module.exports = {
    name: "ping",
    category: "info",
    description: "Shows the bot's latency",
    type: Discord.ApplicationCommandType.ChatInput,
    Admin: false,
    
    run: async (client, interaction, args, message) => {
        const { guild } = interaction;
        
        var ping = Date.now() - interaction.createdTimestamp;
        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: `${config.bot.name}`})
            .setColor(config.colours.embed)
            .setDescription(`Latency: **${ping}**ms \nAPI Latency: **${Math.round(client.ws.ping)}**ms`)
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
            .setTimestamp();
        interaction.reply({ embeds: [embed] });

        const logChannel = client.channels.cache.get(config.logs.utilitiesLog)
        
        const logger = new Discord.EmbedBuilder()
            .setColor(config.colours.logger)
            .setTitle("Command log")
            .setDescription(`[Ping Command] run by **${interaction.user.tag}**`)
            .addFields(
                { name: "Guild:", value: `${guild.name}` }
            )
            .setTimestamp();
        
        logChannel.send({ embeds: [logger] });
    }
}