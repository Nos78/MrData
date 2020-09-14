/*
 * @Author: BanderDragon 
 * @Date: 2020-09-09 02:55:51 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-13 20:04:53
 */
const library = require('../library');
const process = require('process');

module.exports = {
	name: 'shutdown',
	description: `Shuts down @BOTNAME - this command can only be performed by my owner.`,
	cooldown: 30,
	args: false,
	guildOnly: true,
	async execute(message, args) {
		if(library.Admin.isBotOwner(message.author.id)) {
			try {
				await library.Helper.sendSuccessMessage(`${message.author}, shut down of my critical systems has been activated.`, message.channel);
				process.exit();
			} catch (e) {
				library.Helper.sendErrorMessage(`${message.author}, shut down failed: ERROR ${e.message}.`, message.channel);
			}
		} else {
			library.Helper.sendErrorMessage(`Sorry, ${message.author}, this command can only be performed by my owner.`, message.channel);
		}
	}
};
