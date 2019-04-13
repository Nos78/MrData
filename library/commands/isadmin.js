const library = require('../library');

module.exports = {
	name: 'isadmin',
	description: `Are you an admin of this server? This command will let you know!`,
	cooldown: 30,
	args: false,
	execute(message, args) {
    let admin = "is not";
    if(library.Admin.isAdmin(message.sender.id, message.guild.id, message.client)) {
      admin = "is"
    }
    message.channel.send(`According to my records, ${message.sender} ${admin} recorded as an admin of ${message.guild.name}.`);
	},
};
