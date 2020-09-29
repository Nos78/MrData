/*
 * @Author: BanderDragon 
 * @Date: 2020-08-25 02:55:43 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-29 03:37:58
 */

const library = require('../library');

module.exports = {
    name: 'privilegedrole',
    description: `This command is used by Admins to add a role to the guild privileged roles list.`,
    aliases: ['priv'],
    args: true,
    version: '0.1.1',
    guildOnly: true,
    execute(message, args) {

        if (library.Admin.isAdmin(message.author.id, message.guild.id, message.client)) {
            if (args.length == 0) {
                return message.channel.send("No role specified!  Please use `!priv <role>`");
            } else {
                var roleStr = args[0];
                for (var i = 1; i < args.length; i++) {
                    roleStr = roleStr + " " + args[i];
                }

                var roles = library.Admin.readRoles(message.guild.id);
                var role = message.guild.roles.find("name", roleStr);
                if (role != null) {
                    var roleId = role.id;
                    if (roles.length > 0) {
                        if (roles.find(role => role === roleId)) {
                            return message.channel.send(`${message.author}, the role *${roleStr}* already exists in the privileged list.`);
                        }
                    }
                    roles.push(roleId);

                    if (library.Admin.writeRoles(roles, message.guild.id) == false) {
                        return message.channel.send(`${message.author}, unable to save the role *${roleStr}* to the privileged list.`);
                    } else {
                        return message.channel.send(`${message.author}, the role *${roleStr}* has been successfully added to the privileged list.`);
                    }
                } else {
                    return message.channel.send(`${message.author}, the role you specified does not exist.`);
                }
            }
        }
    },
}
