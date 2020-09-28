/*
 * @Author: BanderDragon 
 * @Date: 2020-04-14
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-28 21:46:35
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
    cooldown: 5,
    async execute(message, args) {
        const data = [];
        const { commands } = message.client;
        var prefix = config.prefix;
        if(message.guild) {
            prefix = await library.System.getPrefix(message.guild.id);
        }

        if (!args.length) {
            data.push('You can get general help by visiting my webpage, at **https://mrdata.thebotfactory.net**\n');
            data.push('**Here\'s a list of all my commands:**');
            data.push('\t\t!' + commands.map(command => command.name).join(',\n\t\t!'));
            data.push(`\nYou can send \`${prefix}${this.name} [command name]\` to get info on a specific command!`);

            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands! - https://mrdata.thebotfactory.net');
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
