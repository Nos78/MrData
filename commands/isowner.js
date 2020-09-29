/*
 * @Author: BanderDragon 
 * @Date:
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-29 03:25:56
 */
const library = require('../library');

module.exports = {
	name: 'isowner',
	description: `Are you my owner? This command will let you know!`,
	cooldown: 30,
	category: 'utility',
	args: false,
	guildOnly: true,
	version: '1.1.0',
	execute(message, args) {
    let owner = "is not";
    if(library.Admin.isOwner(message.author.id, message.guild.id, message.client)) {
      owner = "is"
    }
    message.channel.send(`According to my records, ${message.author} ${owner} recorded as being my owner.`);
	},
};
