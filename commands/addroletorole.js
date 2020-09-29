/*
 * @Author: BanderDragon 
 * @Date: 2019-05-10 19:54:25 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-28 22:47:23
 */

const library = require('../library');

module.exports = {
    name: 'addroletorole',
    description: `This command is used by Admins to add a members of role A to role B.`,
    aliases: ['artr'],
    usage: '<role A> <role B>',
    category: 'admin',
    version: '2.0.3',
    guildOnly: true,
    execute(message, args) {
        let msg = library.Helper.sendStandardWaitMessage(message.channel);
        if (library.Admin.isAdmin(message.author.id, message.guild.id, message.client)) {
            if (args.length < 2) {
                return message.channel.send("Not enough parameters!  Please use `!artr <from role A> <to role B>`");
            } else {
                let roleA = message.guild.roles.find("name", library.Helper.parseName(args[0]));
                let roleB = message.guild.roles.find("name", library.Helper.parseName(args[1]));
                if(roleA == null) {
                    roleA = message.guild.roles.find("id", library.Helper.parseNumber(args[0]));
                    if(roleA == null) {
                        return library.Helper.editWaitErrorMessage(msg, `Please specify valid roles!  ${roleA} does not exist.  Please use \`!artr <from role A> <to role B>\``);
                    }
                }
                if(roleB == null) {
                    roleB = message.guild.roles.find("id", library.Helper.parseNumber(args[0]));
                    if(roleB == null) {
                        return library.Helper.editWaitErrorMessage(msg, `Please specify valid roles!  ${roleB} does not exist.  Please use \`!artr <from role A> <to role B>\``);
                    }
                }
                
                let members = [];
                message.guild.members.forEach(function(member) {
                    let members = [];
                    if(member.roles.has(roleA.id)) {
                        member.addRole(roleB.id);
                        members.push(library.Discord.getDisplayName(member));
                    }
                });

                if (members) {
                    // Notify the user that the command was successful
                    let text = `${message.author}, your command was successfully completed.\n\n`;
                    text += `The following members where copied from role ${roleA.name} to role ${roleB.name}:\n`;
                    members.forEach(member => text+=` + **${member}**\n`);
                    library.Helper.editWaitSuccessMessage(msg, text);
                }
            }
        }
    }
}
