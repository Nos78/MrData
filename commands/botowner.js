const library = require('../library');

module.exports = {
	name: 'botowner',
	description: `Returns the ID of my owner on this server`,
	cooldown: 30,
	args: false,
	guildOnly: true,
	execute(message, args) {
    message.channel.send(`According to my records, my current owner for this server is ${library.Admin.owner(message.guild.id, message.client)}`);
	},
};
