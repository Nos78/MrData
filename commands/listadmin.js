/**
 * @Author: BanderDragon
 * @Date:   2019-05-10T19:54:25+01:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: privilegedrole.js
 * @Last modified by:
 * @Last modified time: 2019-05-20T19:03:58+01:00
 */

const library = require('../library');

module.exports = {
    name: 'listadmin',
    description: `This command lists all the users who are considered administrators of this guild.`,
    aliases: ['lista'],
    guildOnly: true,
    execute(message, args) {
        let countTotal = 0;
        let msgResponse = `${role.name}, on guild ${message.guild.name}, has the following members:\n`;
        message.guild.members.forEach(function(member) {
            if (library.Admin.isAdmin(member.id, message.guild.id, message.client)) {
               msgResponse = msgResponse + member.displayName + `\n`;
               countTotal++;
            }
        });
        msgResponse = msgResponse + `\nA total of ${countTotal} members`
        message.channel.send(msgResponse);
            
    }
}

