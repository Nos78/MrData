/*
 * @Author: BanderDragon 
 * @Date: 2020-09-10 15:33:21 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-14 15:38:59
 */

const library = require('../library');
const config = require('../config.json');
const db = require('../db');

const markdown = library.Discord.markdown;

module.exports = {
    name: 'guildsettings',
    description: `Outputs the current settings for the guild as a JSON object.  Descriptions of each field is provided by using the parameter "desc" or "true" after the command name.`,
    aliases: ['settings'],
    args: false,
    usage: '<guild id> <description>, optionally give a description of each setting field, and also optionally output the settings for a different discord guild/server.',
    guildOnly: true,
    async execute(message, args) {
        var msg = library.Helper.sendStandardWaitMessage(message.channel);
        var guildId = message.guild.id;
        var searchGuild = message.guild;
        var outputDesc = false;

        if (args.length > 0) {
            var length = Math.min(2, args.length);
            for (var i = 0; i < length; i++) {
                // Collate the arguments, try to cater for being in the wrong order
                var paramToCheck = args[i].toLowerCase();
                if(args[i] == "desc" || args[i] == "true" || args[i] == "description") {
                    outputDesc = true;
                }
                else if(args[i] != "false") {
                    guildId = library.Helper.parseIdNumber(args[i]);
                }
            }
            searchGuild = message.client.guilds.get(guildId);
            if(!searchGuild) {
                return library.Helper.editWaitErrorMessage(msg, `${message.author}, I was unable to access the discord guild with the id number ${guildId}`);
            }
        }
        if(outputDesc) {
            var descriptionJson = library.Settings.guildSettingsDescription(message.client, searchGuild);
            library.Helper.sendMessage(`${message.author}, I store the settings for each discord guild (server) as a JSON object.  I have a cached copy in memory, as well as storing the object in my database against the guild id.\n\nHere is the descriptive text for the current settings object I am using:\n\n${markdown.codeBlock.multi}${JSON.stringify(descriptionJson, null, 2)}${markdown.codeBlock.multi}`, message.channel, config.standardMessageColor);
        }
        library.System.getGuildSettings(guildId)
            .then(settings => {
                library.Helper.editWaitSuccessMessage(msg, `${message.author}, the settings for ${searchGuild.name} are \n\n${markdown.codeBlock.multi}json\n${JSON.stringify(settings, null, 2)}${markdown.codeBlock.multi}`);
            })
            .catch(error => {
                library.Helper.editWaitErrorMessage(msg, `${message.author}, I was unable to retrieve the settings for ${searchGuild.name}. An error occured:\n\n${markdown.codeBlock.multi}${JSON.stringify(error, null, 2)}${markdown.codeBlock.multi}`);
            });
    }
}
