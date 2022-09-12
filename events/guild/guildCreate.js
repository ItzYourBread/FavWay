module.exports = {
    name: 'guildCreate',
    
    async execute(guild) {
    
    const channel = guild.channels.cache.find(channel => channel.type === ChannelType.GuildText)
    
    channel.send("Thank you for inviting me!")
    }
};