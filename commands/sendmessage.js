/*
 * @Author: BanderDragon 
 * @Date: 2019-05-16 22:04:42
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-29 03:44:04
 */

const library = require('../library');

module.exports = {
    name: 'sendmessage',
    description: `Use this command to send a message as the bot.  Your message will be deleted.  Only administrators can use this command.`,
    aliases: ['send', 'sendmsg'],
    usage: '<message>`',
    args: true,
    category: 'admin',
    version: '0.1.2',
    guildOnly: true,
    execute(message, args) {
        if (library.Admin.isAdmin(message.author.id, message.guild.id, message.client)) {
            var msgToSend = library.collateArgs(0, args);
            message.channel.send(msgToSend);
            message.delete();
        }
    },
}
