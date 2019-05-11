/**
 * @Author: BanderDragon
 * @Date:   2019-05-11T00:51:12+01:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: changenickname.js
 * @Last modified by:   BanderDragon
 * @Last modified time: 2019-05-11T01:35:09+01:00
 */

const library = require('../library');
const logger = require('winston');
const config = require('../config.json');

module.exports = {
    name: 'changenickname',
    description: `Use this command to change your nickname.  Privleged users can change other user's nicknames.`,
    aliases: ['nick', 'changenick'],
    usage: '`!changenickname <newnickname>`\nAdmin only: `!changenickname <@user> <newnickname>`',
    args: true,
    guildOnly: true,
    execute(message, args) {
        var userToChange = null;
        var newNickname = "";

        if (!message.guild.me.hasPermission('MANAGE_NICKNAMES'))
            return message.channel.send(`Sorry, ${message.author}, I do not have permission to change your nickname.`);

        switch(args.length) {
            case 0:
                return message.channel.send(`${message.author}, too few arguments specified.`);

            case 1:
                userToChange = message.author;
                newNickname = library.collateArgs(0, args);
                break;

            case 2:
                // This version of the command is privleged only...
                if(library.Admin.isPrivlegedRole(message.author.id)) {
                    // Go for it...
                    userToChange = message.mentions.members.first();
                    newNickname = library.collateArgs(1, args);
                } else {
                    return message.channel.send(`${message.author}, you are not privleged to change other user's nicknames.`);
                }
                break;
        }
        userToChange.setNickname(newNickname);
}
    },
}
