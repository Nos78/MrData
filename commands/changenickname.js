/*
 * @Author: BanderDragon 
 * @Date: 2019-05-11 00:51:12
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-28 22:57:11
 */

const library = require('../library');

module.exports = {
    name: 'changenickname',
    description: `Use this command to change your nickname. Privileged users can change other user's nicknames, but this will fail if that user has higher discord privileges than me.`,
    aliases: ['nick', 'changenick'],
    usage: '`!changenickname <newnickname>`\nAdmin only: `!changenickname <@user> <newnickname>`',
    args: true,
    version: '1.1.0',
    guildOnly: true,
    category: 'admin',
    execute(message, args) {
        var userToChange = null;
        var newNickname = "";

        if (!message.guild.me.hasPermission('MANAGE_NICKNAMES'))
            return message.channel.send(`Sorry, ${message.author}, I do not have permission to change your nickname.`);

        switch(args.length) {
            case 0:
                return message.channel.send(`${message.author}, too few arguments specified.`);

            case 1:
                userToChange = message.author.id;
                newNickname = library.collateArgs(0, args);
                break;

            case 2:
                // This version of the command is privileged only...
                if (library.Admin.hasPrivilegedRole(message.member, message.guild.id)) {
                    // Go for it...
                    userToChange = message.mentions.members.first().id;
                    newNickname = library.collateArgs(1, args);
                } else {
                    return message.channel.send(`${message.author}, you are not privileged to change other user's nicknames.`);
                }
                break;
        }
        message.guild.members.cache.get(userToChange).setNickname(newNickname);
        return message.channel.send(`${message.author}, that nickname has been successfully updated.`);
    },
}
