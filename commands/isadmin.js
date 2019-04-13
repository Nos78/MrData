const library = require('../library');

module.exports = {
	name: 'isadmin',
	description: `Are you an admin of this server? This command will let you know!`,
	cooldown: 30,
	args: false,
	guildOnly: true,
	execute(message, args) {
    let admin = "is not";
    if(library.Admin.isAdmin(message.author.id, message.guild.id, message.client)) {
      admin = "is"
    }
    message.channel.send(`According to my records, ${message.author} ${admin} recorded as an admin of ${message.guild.name}.`);
	},
};
