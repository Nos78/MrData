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
    name: 'listrole',
    description: `This command lists all the users who are members of the specified role.`,
    aliases: ['listr'],
    usage: '<role>',
    guildOnly: true,
    execute(message, args) {
        if (args.length < 1) {
            return message.channel.send("Not enough parameters!  Please use `!listrole <role>`");
            } else {
                let role = message.guild.roles.find("name", args[0]);
                if(role == null) {
                    return message.channel.send(`Please specify a valid role - ${role} does not exist.  Please use \`!listrole <role>\``);
                }
                let countTotal = 0;
                let msgResponse = `${role.name}, on guild ${message.guild.name}, has the following members:\n`;
                message.guild.members.forEach(function(member) {
                    if(member.roles.has(role.id)) {
                       msgResponse = msgResponse + member.displayName + `\n`;
                       countTotal++;
                    }
                });
                msgResponse = msgResponse + `\nA total of ${countTotal} members`
                message.channel.send(msgResponse);
            
        }
    }
}
