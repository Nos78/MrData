/*
 * @Author: BanderDragon 
 * @Date: 2020-09-25 07:44:42 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-25 09:06:37
 */

 const config = require('../config.json');
const library = require('../library');
const logger = require('winston');

module.exports = {
    name: 'alliancecontributionstarget',
    description: 'Amends the alliance contributions target number',
    aliases: ['contributions', 'ac'], 
    cooldown: 60,
    args: false,
    category: 'scoring',
    guildOnly: true,
    usage: '',
    async execute(message, args) {
        var msg = library.Helper.sendStandardWaitMessage(message.channel);
        var target = library.Format.stripCommas(args[0]);
        if(isNaN(target)) {
            return library.Discord.editWaitErrorMessage(msg, `Sorry, ${message.author}, you need to specify a number for the alliance contributions target`)
        }
        library.System.getParameter(message.guild.id, 'contributions', message.client)
            .then(contributions => {
                contributions.target = target;
                library.System.saveParameter(message.guild.id, "contributions", contributions, message.client)
                    .then(record => {
                        if(record) {
                            var settings = record.settings;
                            if(settings) {
                                return library.Helper.editWaitSuccessMessage(msg, `Thank you, ${message.author}, your new alliance contributions target is ${library.Format.numberWithCommas(settings.contributions.target)}.`);
                            } else {
                                return library.Helper.editWaitErrorMessage(msg, `Sorry, ${message.author}, the settings for this alliance appear to have been wiped from my database:\n\n${library.Discord.markdown.multi}\n${JSON.stringify(record)}\n${library.Discord.markdown.multi}`);
                            }
                        } else {
                            return library.Helper.editWaitErrorMessage(msg, `Sorry, ${message.author}, there appears to be a problem whilst committing this value into my database.`);
                        }
                });
        });
    }
};
