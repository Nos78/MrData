/*
 * @Author: BanderDragon 
 * @Date: 2020-09-10 15:33:21 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-14 15:37:36
 */

const library = require('../library');
const config = require('../config.json');
const db = require('../db');

module.exports = {
    name: 'sqlquery',
    description: `Perform a SQL query on @BOTNAME's database.  This command can be used by the bot own only.`,
    aliases: ['sql', 'query'],
    args: true,
    usage: '<query>, where query is a piece of sql code. No syntax checking is performed.',
    guildOnly: true,
    async execute(message, args) {
        let msg = library.Helper.sendStandardWaitMessage(message.channel);
        if (library.Admin.isBotOwner(message.author.id)) {
            if (!args.length > 0) {
                return library.Helper.editWaitErrorMessage(msg, `Insufficient parameters!  Please use ${library.System.getPrefix(message.guild.id)}${this.name} <SQL query code>`);
            } else {
                var queryString = global.library.collateArgs(0, args);
                var msgText = `${message.author}, `;
                db.any(queryString)
                .then(result => {
                    msgText += `the result of your SQL query is:\n\n${global.library.Discord.markdown.codeBlock.multi}sql\n${JSON.stringify(result, null, 4)}${global.library.Discord.markdown.codeBlock.multi}`;
                })
                .catch(error => {
                    msgText += `your query failed with the following error:\n\n${global.library.Discord.markdown.codeBlock.multi}${JSON.stringify(error)}${global.library.Discord.markdown.codeBlock.multi}`
                })
                .finally(() => {
                    library.Helper.editMessage(msg, msgText);
                });
            }
        } else {
            return library.Helper.editWaitErrorMessage(msg, `Sorry, ${message.author}, this command can only be used by my creator.`);
        }
    }
}
