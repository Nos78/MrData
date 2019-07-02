/**
 * @Author: BanderDragon
 * @Date:   2019-05-16T22:04:42+01:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: sendmessage.js
 * @Last modified by:   BanderDragon
 * @Last modified time: 2019-05-16T23:02:45+01:00
 */

const library = require('../library');

module.exports = {
    name: 'sendmessage',
    description: `Use this command to send a message as the bot.  Your message will be deleted.  Only administrators can use this command.`,
    aliases: ['send', 'sendmsg'],
    usage: '<message>`',
    args: true,
    guildOnly: true,
    execute(message, args) {
        if (library.Admin.isAdmin(message.author.id, message.guild.id, message.client)) {
            var msgToSend = library.collateArgs(0, args);
            message.channel.send(msgToSend);
            message.delete();
        }
    },
}
