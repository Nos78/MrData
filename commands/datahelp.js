/*
 * @Author: BanderDragon 
 * @Date: 2020-04-14
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-10-09 04:35:20
 */

const logger = require('winston');

const config = require('../config.json');
const library = require('../library');

module.exports = {
    name: 'datahelp',
    description: 'List all of my commands, or get info about a specific command.',
    aliases: ['commands', 'helpdata'],
    usage: '[command name]',
    category: 'help',
    version: '2.2.1',
    cooldown: 5,
    async execute(message, args) {
		//msg = library.Helper.sendStandardWaitMessage(message.channel);
        const data = [];
        const { commands } = message.client;
        var prefix = config.prefix;
        if(message.guild) {
            prefix = await library.System.getPrefix(message.guild.id);
        }

        if (!args.length) {
            var listOfCategories = [...new Set(commands.map(item => item.category).sort())];
            data.push('You can get general help by visiting my webpage, at **https://mrdata.thebotfactory.net**\n');
            data.push('**Here\'s a list of all my commands:**');
            for(var i=0; i < listOfCategories.length; i++) {
                data.push(`\n\t**${listOfCategories[i]}**`);
                var filteredCommands = commands.filter(command => command.category === listOfCategories[i]);
                data.push('\t\t!' + filteredCommands.map(command => command.name).join(',\n\t\t!'));
            }
            data.push(`\nYou can send \`${prefix}${this.name} [command name]\` to get info on a specific command!`);
            
            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply(`${message.author}, I've sent you a DM with all my commands! - https://mrdata.thebotfactory.net`);
                    //library.Helper.editWaitSuccessMessage(msg, `${message.author}, I've sent you a DM with all my commands! - https://mrdata.thebotfactory.net`);
                })
                .catch(error => {
                    logger.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        if(prefix) {
            global.library.Commands.commandHelp(command, prefix, data, message.client);
        } else {
            global.library.Commands.commandHelp(command, config.prefix, data, message.client);
            }

        message.channel.send(data, { split: true });
	},
};
