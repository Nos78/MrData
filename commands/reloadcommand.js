/*
 * @Author: BanderDragon 
 * @Date: 2020-09-09 03:26:15 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-10 17:00:57
 */
const library = require('../library');
const config = require('../config.json');

module.exports = {
	name: 'reloadcommand',
	description: `Reloads a given command into my command cache - this command can only be performed by my owner.`,
    cooldown: 30,
    aliases: ['reload'],
    usage: `<command name> - reloads the given command name, e.g. *${config.prefix}reload power* will invalidate the cache for the power script, and reload power.js from file storage.`,
	args: true,
	guildOnly: true,
	execute(message, args) {
        if(library.Admin.isBotOwner(message.author.id)) {
            let msg = library.Helper.sendStandardWaitMessage(message.channel);
            if(args[0] && args[0].length > 0) {
                var cmdName = args[0];
                try {
                    var result = library.Commands.reloadCommand(cmdName, message.client);
                    if(result && result != false) {
                        library.Helper.editWaitSuccessMessage(msg, `${message.author}, command **${cmdName}** has been successfully reloaded.`);
                    } else {
                        library.Helper.editWaitErrorMessage(msg, `${message.author}, reloading command **${cmdName}** was unsuccessful.`);
                    }
                } catch (error) {
                    library.Helper.editWaitErrorMessage(msg, `${message.author}, reloading command **${cmdName}** was unsuccessful:\n\n\`\`\`${error}\`\`\``);
                }
            } else {
                library.Helper.editWaitErrorMessage(msg, `${message.author}, the ${this.name} command requires a valid name in order to reload it.`);
            }
        } else {
            library.Helper.sendErrorMessage(`Sorry, ${message.author}, but this command can only be performed by my owner`, message.channel);
        }
    },
};
