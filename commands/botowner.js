/*
 * @Author: BanderDragon 
 * @Date: 2020-04-14
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-28 22:55:40
 */
const library = require('../library');

module.exports = {
	name: 'botowner',
	description: `Returns the ID of my owner on this server`,
	cooldown: 30,
	category: 'utility',
	version: '1.0.2',
	args: false,
	guildOnly: true,
	execute(message, args) {
    message.channel.send(`According to the records, the bot owner for discord server *${global.library.Discord.getGuildName(message.guild)}* is ${library.Admin.owner(message.guild.id, message.client)}`);
	},
};
