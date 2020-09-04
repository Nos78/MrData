/**
 * @Date:   2020-03-29T16:40:39+01:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: datahelp.js
 * @Last modified time: 2020-03-29T19:18:54+01:00
 */

const logger = require('winston');

const config = require('../config.json');
const library = require('../library');

module.exports = {
	name: 'datahelp',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands', 'helpdata'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
    const data = [];
    const { commands } = message.client;
    const prefix = library.System.getPrefix(message.guild.id);

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

    data.push(`**Name:** ${command.name}`);

    if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
    if (command.description) data.push(`**Description:** ${command.description}`);
    if (command.usage) data.push(`**Usage:** ${config.prefix}${command.name} ${command.usage}`);

    data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

    message.channel.send(data, { split: true });
	},
};
