const library = require('../library');

module.exports = {
	name: 'isowner',
	description: `Are you my owner? This command will let you know!`,
	cooldown: 30,
	args: false,
	execute(message, args) {
    let owner = "is not";
    if(library.Admin.isOwner(message.author.id, message.guild.id, message.client)) {
      owner = "is"
    }
    message.channel.send(`According to my records, ${sender} ${owner} recorded as being my owner.`);
	},
};
