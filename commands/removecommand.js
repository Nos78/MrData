/*
 * @Author: BanderDragon 
 * @Date: 2020-09-10 16:10:02 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-10 17:34:19
 */

const library = require('../library');
const config = require('../config.json');

module.exports = {
	name: 'removecommand',
	description: `Removes a given command from my command cache - this command can only be performed by my owner. It will not remove the script file from disk, meaning it will be available again when @BOTNAME restarts.`,
    cooldown: 30,
    aliases: ['remove'],
    usage: `<command name> - removes the given command name, e.g. *${config.prefix}remove power* will invalidate the cache for the power script, preventing the command from being run until the next restart.`,
	args: true,
	guildOnly: true,
	execute(message, args) {
        if(library.Admin.isBotOwner(message.author.id)) {
            let msg = library.Helper.sendStandardWaitMessage(message.channel);
            if(args[0] && args[0].length > 0) {
                var cmdName = args[0];
                var result = library.Commands.removeCommand(cmdName, message.client);
                if(result == true) {
                    library.Helper.editWaitSuccessMessage(msg, `${message.author}, command ${cmdName} has been successfully removed.`);
                } else {
                    library.Helper.editWaitErrorMessage(msg, `${message.author}, removing the command ${cmdName} was unsuccessful, ${result}.`);
                }
            } else {
                library.Helper.editWaitErrorMessage(msg, `${message.author}, command ${this.name} requires a valid command name to remove.`);
            }
        } else {
            library.Helper.sendErrorMessage(`Sorry, ${message.author}, but this command can only be performed by my creator.`, message.channel);
        }
    },
};
