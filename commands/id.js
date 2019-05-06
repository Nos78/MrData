/**
 * @Author: BanderDragon
 * @Date:   2019-05-05T18:00:48+01:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: id.js
 * @Last modified by:   BanderDragon
 * @Last modified time: 2019-05-05T18:45:40+01:00
 */

 const config = require('../config.json');

 module.exports = {
 	name: 'id',
 	description: 'Returns the discord Id of the specified user.  If no parameter is specified, it returns the sender\'s Id',
 	cooldown: 60,
 	args: false,
  usage: '<@memberName>',
 	async execute(message, args) {
    var findThisUser = null;
    var desc = "";

    switch (args.length) {
      case 0:
        // No args specified, use the senders discord id.
        findThisUser = message.author.id;
        desc = `${message.author}, your id is `;
        break;
      case 1:
        member = message.mentions.members.first();
        desc = `${message.author}, the id of ${member.displayname} is `;
        findThisUser = member.id;
        break;
     }
     if(findThisUser) {
       desc = desc + findThisUser;
       message.channel.send({embed: {
         color:config.standardMessageColor,
         description: `${desc}`
       }});
     }
 	},
 };
