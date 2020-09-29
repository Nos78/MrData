/*
 * @Author: BanderDragon 
 * @Date: 2020-09-25 07:44:42 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-28 22:48:14
 */

 const config = require('../config.json');
const library = require('../library');
const logger = require('winston');

module.exports = {
    name: 'alliancecontributions',
    description: 'Displays the current alliance contributions as a simple textual horizontal thermometer bar',
    aliases: ['contributions', 'ac'],
    cooldown: 60,
    args: false,
    category: 'scoring',
    version: '1.0.1',
    guildOnly: true,
    usage: '',
    async execute(message, args) {
        var msg = library.Helper.sendStandardWaitMessage(message.channel);
        if(args.length > 0) {
            // Parameter is specifed, set the current target value
            var current = library.Format.stripCommas(args[0]);
            if(isNaN(current)) {
                return library.Discord.editWaitErrorMessage(msg, `Sorry, ${message.author}, you need to specify a number to update the current alliance contributions value.`)
            }
            library.System.getParameter(message.guild.id, 'contributions', message.client)
                .then(contributions => {
                    if(contributions.target >= current) {
                        contributions.current = current;
                        library.System.saveParameter(message.guild.id, "contributions", contributions, message.client)
                            .then(record => {
                                if(record) {
                                    var settings = record.settings;
                                    if(settings) {
                                        return library.Helper.editWaitSuccessMessage(msg, `Thank you, ${message.author}, your current alliance contributions is now set to ${library.Format.numberWithCommas(settings.contributions.current)}, out of a possible ${library.Format.numberWithCommas(contributions.target)}.`);
                                    } else {
                                        return library.Helper.editWaitErrorMessage(msg, `Sorry, ${message.author}, something went wrong committing the value to my database:\n\n${library.Discord.markdown.multi}\n${JSON.stringify(record)}\n${library.Discord.markdown.multi}`);
                                    }
                                } else {
                                    return library.Helper.editWaitErrorMessage(msg, `Sorry, ${message.author}, there was a problem whilst committing this value into my database.`);
                                }
                        });
                    } else {
                        return library.Helper.editWaitErrorMessage(msg, `Sorry, ${message.author}, the value you specified is greater than the alliance contributions target of ${library.Format.numberWithCommas(contributions.target)}.`);
                    }
            });
        } else {
            // No arguments, display the contributions thermometer
            const numCharactersPerLine = 48;
            const numLines = 3;
            library.System.getParameter(message.guild.id, 'contributions', message.client)
                .then(contributions => {
                    var barChartText = library.Format.textBarChart(contributions.current, numCharactersPerLine, numLines, " AP", contributions.target);
                    if(barChartText) {
                        var messageText = `${message.author},`;
                        messageText += '\n' + library.Discord.markdown.codeBlock.multi + '\n';
                        messageText += barChartText + '\n';
                        messageText += library.Discord.markdown.codeBlock.multi;
                        library.Helper.editWaitSuccessMessage(msg, messageText);
                    } else {
                        library.Helper.editWaitErrorMessage(msg, `Sorry, ${message.author}, something went wrong and I am unable to show you the alliance contributions thermometer.`)
                    }
            });
        }
    }
};
