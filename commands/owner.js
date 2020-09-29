/*
 * @Author: BanderDragon 
 * @Date: 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-29 03:16:54
 */
const library = require('../library');

module.exports = {
	name: 'guildowner',
	aliases: ['serverowner','owner'],
	cooldown: 30,
	args: false,
	description: `Returns the user who is recorded as being the owner of @SERVERNAME. This is usually the person who created the server, unless ownership has been transferred.`,
	guildOnly: true,
	version: '0.0.0',
	category: 'utility',
	execute(message, args) {
		var owner = library.Admin.owner(message.guild.id, message.client);
    	message.channel.send(`According to my records, the current owner of ${message.guild.name} is ${owner.displayName} - pulling up their details for you:`);
	
		const ownerID = library.Admin.owner(message.guild.id, message.client);
		msg = library.Helper.sendStandardWaitMessage(message.channel);
		message.client.fetchUser(ownerID)
			.then(function (creatorUser) {
				var embedMsg = global.library.Helper.userCard(creatorUser, message.channel, message.client, owner);
				library.Helper.editMessageEmbed(msg, embedMsg);
		}.bind(this));
	}
};
