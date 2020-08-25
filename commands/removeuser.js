/*
 * @Author: BanderDragon 
 * @Date: 2020-08-25 02:55:21 
 * @Last Modified by:   BanderDragon 
 * @Last Modified time: 2020-08-25 02:55:21 
 */

const db = require('../db');
const config = require('../config.json');
const library = require('../library');

module.exports = {
    name: 'removeuser',
    description: 'Removes a user from your guild database.  You can only remove a user when they are no longer a member of your server.  Unfortunately, that means that their name or nickname is no longer accessible.  The only way to delete this user from your data is to use their discord user ID number.  Fortunately, this is easily accessible, and you can copy the number from any of the statistics leaderboards - Example: User 1234567890 has left the building.\n\nWARNING: Make sure the ID number is entered correctly, else you may end up removing someone that you did not intend!',
    aliases: ['deleteuser'],
    args: false,
    usage: 'removeuser <user ID> - where <user ID> is the discord user ID of the user you want to delete; this is a long number and can be found on the leaderboard(s).',
    cooldown: 3,
    guildOnly: true,
    execute(message, args) {

        if (library.Admin.isAdmin(message.author.id, message.guild.id, message.client)) {
            // Only admin can do this!
            switch (args.length) {
                case 1:
                    if (!isNaN(args[0])) {
                        let memberId = args[0];
                        let member = library.Admin.getMember(memberId, message.guild.id, message.client);
                        if (member) {
                            message.channel.send({
                                embed: {
                                    color: config.powerDestroyedColor,
                                    description: `${message.author}, you cannot remove ${member.name} they are still a member of the server.`
                                }
                            });
                        } else {
                            // Not a member, we can get deleted!
                            let retVal = db.scores.removeUserFromGuild(memberId, message.guild.id);
                            message.channel.send({
                                embed: {
                                    color: config.resourcesminedColor,
                                    description: `${message.author}, user ${memberId} was removed - ${retVal} records where deleted.`
                                }
                            });
                        }
                    } else {
                        message.channel.send({
                            embed: {
                                color: config.powerDestroyedColor,
                                description: `${message.author}, this command requires a user ID in the form of a number - see datahelp removeuser for more information.`
                            }
                        });
                    }
                break;
            }
        } else {
            message.channel.send({
                embed: {
                    color: config.powerDestroyedColor,
                    description: `${message.author}, this command can only be run by an administrator.`
                }
            });
        }
    } // execute
} // module.exports
