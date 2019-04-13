const library = require('../library');

module.exports = {
	name: 'owner',
	cooldown: 30,
	args: false,
	description: `Indicates who I consider to be my owner on this server.`,
	execute(message, args) {
    message.channel.send(`According to my records, the current owner of ${message.guild.name} is ${library.Admin.owner(message.guild.id, message.client)}`);
	},
};
