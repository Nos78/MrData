/*
 * @Author: BanderDragon 
 * @Date: 2019-05-10 19:54:25
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-29 03:31:45
 */
const library = require('../library');

module.exports = {
    name: 'listadmin',
    description: `This command lists all the users who are considered administrators of this guild.`,
    aliases: ['lista'],
    category: 'admin',
    version: '0.0.3',
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

