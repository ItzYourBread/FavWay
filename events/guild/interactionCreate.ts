const config = require("../../config.json");
const User = require("../../database/premium/user");
const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { printly, c } = require("printly.js");

module.exports = {
    name: 'interactionCreate',
    
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;
        
        const command = client.slash.get(interaction.commandName);
        if (!command) return interaction.reply({ content: `Oh no its a huge problem notify our devolopers\n${config.links.server}`, ephemeral: true});
        
        if (command.admin) {
            if (interaction.user.id !== "602101253178392576") {
                return interaction.reply({ content: `This command only can be use by ${config.bot.name} Admin(s)`, ephemeral: true });
            }
        }
        
        if (command.userPerms) {
            if (!client.guilds.cache.get(interaction.guild.id).members.cache.get(interaction.member.id).permissions.has(command.userPerms || [])) {
                if (command.noUserPermsMessage) {
                    return interaction.reply(command.noUserPermsMessage)
                } else if (!command.noUserPermsMessage) {
                    return interaction.reply(`You need the \`${command.userPerms}\` permission to use this command!`)
                }
            }
        }

        if (command.botPerms) {
            if (!client.guilds.cache.get(interaction.guild.id).members.cache.get(client.user.id).permissions.has(command.botPerms || [])) {
                if (command.noBotPermsMessage) {
                    return interaction.reply(command.noBotPermsMessage)
                } else if (!command.noBotPermsMessage) {
                    return interaction.reply(`I need the \`${command.userPerms}\` permission to execute this command!`)
                }
            }
        }
        
        const args = [];
        
        for (let option of interaction.options.data) {
            if (option.type === 'SUB_COMMAND') {
                if (option.name) args.push(option.name);
                option.options?.forEach(x => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        
        if (command) {
  let user = client.userSettings.get(interaction.user.id);
  // If there is no user, create it in the Database as "newUser"
  if (!user) {
    const findUser = await User.findOne({ Id: interaction.user.id });
    if (!findUser) {
      const newUser = await User.create({ Id: interaction.user.id });
      client.userSettings.set(interaction.user.id, newUser);
      user = newUser;
    } else return;
  }

  if (command.premium && user && !user.isPremium) {
    interaction.reply(`You are not premium user`);
  } else {
        
        try {
            command.run(client, interaction, args)
        } catch (e) {
            interaction.reply({ content: e.message });
        }
    }
}}
}


