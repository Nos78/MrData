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
    name: 'addroletorole',
    description: `This command is used by Admins to add a members of role A to role B.`,
    aliases: ['artr'],
    usage: '<role A> <role B>',
    guildOnly: true,
    execute(message, args) {

        if (library.Admin.isAdmin(message.author.id, message.guild.id, message.client)) {
            if (args.length < 2) {
                return message.channel.send("Not enough parameters!  Please use `!artr <from role A> <to role B>`");
            } else {
                let roleA = message.guild.roles.find("name", args[0]);
                let roleB = message.guild.roles.find("name", args[1]);
                if(roleA == null) {
                  return message.channel.send(`Please specify valid roles!  ${roleA} does not exist.  Please use \`!artr <from role A> <to role B>\``);
                }
                if(roleB == null) {
                  return message.channel.send(`Please specify valid roles!  ${roleB} does not exist.  Please use \`!artr <from role A> <to role B>\``);
                }

                message.guild.members.forEach(function(member) {
                    if(member.roles.has(roleA.id)) {
                        member.addRole(roleB.id);
                    }
                });
            }
        }
    }
}
