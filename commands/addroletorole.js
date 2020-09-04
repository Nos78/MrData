/*
 * @Author: BanderDragon 
 * @Date: 2019-05-10 19:54:25 
 * @Last Modified by:   BanderDragon 
 * @Last Modified time: 2020-08-29 03:15:52 
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
                    let members = [];
                    if(member.roles.has(roleA.id)) {
                        member.addRole(roleB.id);
                        members.push(library.Discord.getDisplayName(member));
                    }
                });
            }
        }
    }
}
