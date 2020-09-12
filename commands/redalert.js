/*
 * @Author: BanderDragon 
 * @Date: 2020-09-01 20:15:19 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-09 04:53:08
 */

const Discord = require('discord.js');
const db = require('../db');
const config = require('../config.json');
const library = require('../library');
const fetch = require("node-fetch");


// Set up the logger for debug/info
const logger = require('winston');

var payloadTemplate = {
    notification: {
      title: '@SERVERNAME Red Alert!',
      body: '@MEMBERNAME - Your base is under attack!  @NOTIFIER has raised the alarm.  Please log in immediately and raise your shield.',
    }
};

const options = {
    priority: 'high',
    timeToLive: 60 * 60 * 24, // 1 day
};

module.exports = {
    name: 'redalert',
    description: 'Send a red alert messages.  If one of your member\'s base is attacked, this command will attempt to notify them via a push notification.  It will also notify those alliance members who have registered to alliance red alert notifications.\n\n**PLEASE NOTE: **If the member has not registered, they will not receive a notification.  I will indicate whether your alert was successful.',
    aliases: ['ra', 'alert', 'red'],
    args: true,
    usage: '<member> <text> - send a red alert notification to <member>, with optional <text>.',
    cooldown: 3,
    guildOnly: true,
    execute(message, args) {
        if(args.length == 0) {
            library.Helper.sendErrorMessage(`${library.Config.getPrefix()}${this.name} requires a member name.  Try '${config.prefix}${this.name} ${message.author}', for example.`);
            return;
        }

        var msg = library.Helper.sendWaitMessage("Please wait...", message.channel);

        var member = message.mentions.members.first();
        if (!member) {
            member = library.Discord.getDiscordMemberByName(args[0], message.guild);
        }

        if(member) {
            var displayName = library.Discord.getDisplayName(member);

            var optionalText = message.content.split(args[0])[1].substring(1);

            // Collate required data for constructing the push message
            const guildName = message.guild.name;
            const msgSender = library.Discord.getDiscordMember(message.author.id, message.guild);
            var senderName = "An alliance member";
            if(msgSender) {
                senderName = library.Discord.getDisplayName(msgSender);
            }
            
            var payload = payloadTemplate;

            // Now prepare the payload by replacing the templated strings
            payload.notification.title = payload.notification.title.replace("@SERVERNAME", guildName);
            payload.notification.body = payload.notification.body.replace("@MEMBERNAME", displayName);
            payload.notification.body = payload.notification.body.replace("@NOTIFIER", senderName);
            payload.notification.icon = message.client.user.displayAvatarURL;

            // Go ahead and send the message to the users device(s)...
            db.userGuildSettings.findUserSettingsById(member.user.id, message.guild.id)
                .then(userGuildSettings => {
                    var settings = library.Settings.getUserSettingsFromRecord(userGuildSettings);
                    console.log(userGuildSettings);
                    if(settings) {
                        if(settings.pushToken) {
                            var pushTokens = null;
                            // Check what type of pushToken we have, for backward compatibility
                            if(!Array.isArray(settings.pushToken)) {
                                pushTokens = [settings.pushToken];
                            } else {
                                pushTokens = settings.pushToken;
                            }
                            // Now do the good stuff...
                            var devices = pushTokens.length;
                            msg = library.Helper.editWaitMessage(msg, `It seems ${displayName} has registered ${devices} devices, ${message.author} - attempting to notify them...`);
                            var count = 0;

                            if(optionalText && optionalText.length > 0) {
                                payload.notification.body += ("\n\n" + optionalText);
                            }
                            pushTokens.forEach(async token => {
                                var result = await global.webPushApp.sendToDevice(token, payload, options);
                                if(result.successCount > 0) {
                                    library.Helper.sendSuccessMessage(`Attempt to notify device ${count} succeeded, successCount: ${result.successCount}, failureCount: ${result.failureCount}`, message.channel);
                                } else {
                                    library.Helper.sendErrorMessage(`Attempt to notify device ${count} failed, failureCount: ${result.failureCount}, successCount: ${result.successCount}`, message.channel);
                                }
                                count++;
                            });
                        }
                    } else {
                        msg = library.Helper.editWaitErrorMessage(msg, `${message.author}, I cannot access the settings for ${displayName}, and so it appears that ${displayName} has not registered for alerts.`);
                    }
                });
            
        }
    }
}