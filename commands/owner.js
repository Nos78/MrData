/*
 * @Author: BanderDragon 
 * @Date: 
 * @Last Modified by:   BanderDragon 
 * @Last Modified time: 2020-09-24 19:55:41 
 */
const library = require('../library');

module.exports = {
	name: 'guildowner',
	aliases: ['serverowner','owner'],
	cooldown: 30,
	args: false,
	description: `Returns the user who is recorded as being the owner of @SERVERNAME. This is usually the person who created the server, unless ownership has been transferred.`,
	guildOnly: true,
	category: 'utility',
	execute(message, args) {
    message.channel.send(`According to my records, the current owner of ${message.guild.name} is ${library.Admin.owner(message.guild.id, message.client)}`);
	},
};
