/*
 * @Author: BanderDragon
 * @Date: 2020-08-25 02:54:25 
 * @Last Modified by:   BanderDragon
 * @Last Modified time: 2020-08-25 02:54:25 
 */

const config = require('../config.json');
const library = require('../library');

module.exports = {
  name: 'id',
  description: 'Returns the discord Id of the specified user.  If no parameter is specified, it returns the sender\'s Id',
  cooldown: 60,
  args: false,
  usage: '<@memberName>',
  async execute(message, args) {
    var findThisUser = null;
    var desc = "";
    let member = null;
    let displayName = null;

    switch (args.length) {
      case 0:
        // No args specified, use the senders discord id.
        findThisUser = message.author.id;
        desc = `${message.author}, your id is `;
      break;

      case 1:
        member = message.mentions.members.first();
        displayName = library.Helper.displayName(member);

        desc = `${message.author}, the id of ${displayName} is `;
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
