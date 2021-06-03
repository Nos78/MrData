/*
 * @Author: BanderDragon 
 * @Date: 2019-05-10 19:54:25
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-29 03:33:51
 */

 const library = require('../library');

module.exports = {
    name: 'listrole',
    description: `This command lists all the users who are members of the specified role.`,
    aliases: ['listr'],
    usage: '<role>',
    guildOnly: true,
    category: 'utility',
    version: '0.0.2',

    execute(message, args) {
        if (args.length < 1) {
            return message.channel.send("Not enough parameters!  Please use `!listrole <role>`");
            } else {
                let role = message.guild.roles.cache.find(role => role.name === args[0]);
                if(role == null) {
                    return message.channel.send(`Please specify a valid role - ${role} does not exist.  Please use \`!listrole <role>\``);
                }
                let countTotal = 0;
                let msgResponse = `${role.name}, on guild ${message.guild.name}, has the following members:\n`;
                message.guild.members.cache.forEach(function(member) {
                    if(member.roles.cache.has(role.id)) {
                       msgResponse = msgResponse + member.displayName + `\n`;
                       countTotal++;
                    }
                });
                msgResponse = msgResponse + `\nA total of ${countTotal} members`
                message.channel.send(`${msgResponse}`);
            
        }
    }
}
