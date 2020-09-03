/*
 * @Author: BanderDragon 
 * @Date: 2020-09-01 20:15:19 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-02 20:01:07
 */

const Discord = require('discord.js');
const db = require('../db');
const config = require('../config.json');
const library = require('../library');
const fetch = require("node-fetch");


// Set up the logger for debug/info
const logger = require('winston');

module.exports = {
    name: 'registerredalert',
    description: 'Register for red alert messages!  If your base is attacked, your alliance members can use the red alert system to notify you (and optionally the rest of the alliance).\n\nThe Red Alert system is **OPT-IN**.  Use this command to initiate your registration.  Once you have clicked to allow notifications from me, I will be able to message you directly via *push notifications*.  You know what these are even if you have not heard the name - STFC is constantly sending them every time an Armada is created.  **Be assured, I do not and will not engage in unsolicited messaging!**  Any message you receive from the red alert system will be as a *direct result of a red alert command executed by you or your fellow alliance members.*',
    aliases: ['rra', 'register', 'opt-in'],
    args: false,
    usage: '<self | alliance | allies> - receive notifications if you, your alliance members, or your allies are attacked.  If no parameter is specified, self-registration is assumed.',
    cooldown: 3,
    guildOnly: true,
    execute(message, args) {
        var msg = library.Helper.sendWaitMessage("Please wait...", message.channel);
        var userId = library.Helper.parseIdNumber(message.author.id);
        var guildId = library.Helper.parseIdNumber(message.guild.id);
        var webAddr = config.webPush.clientAddr;
        var webPort = config.webPush.clientDisplayPort;
        var displayAddress = "";
        if(webAddr) {
            displayAddress = webAddr;
        }
        if (webPort && webPort > 0) {
            displayAddress += `:${webPort}`;
        }
        if(displayAddress.length > 0) {
            var msgText = `${displayAddress}/?userId=${userId}&guildId=${guildId}`;

            fetch(`${displayAddress}`, {timeout: 2000})
                .then(res => {
                    console.log(res);
                if(res.status == 200) {
                    library.Helper.editWaitSuccessMessage(msg, `Thank you, ${message.author} - I have sent you a direct message containing a link ` +
                        `that you need to open using the device you wish to be notified on.  Call me paranoid, but for your added security and to comply ` +
                        `with any prevailing privacy legislation in your region, you need to explicitly opt-in to receive red alert messages.\n\n` +
                        `Be assured, **I do not, and will not, engage in unsolicited messaging!**  Any message you receive from me will be ` +
                        `as a *direct result of a red alert action raised by you or your fellow alliance members.*\n\n` +
                        `In order to complete your registration, visit the URL below.  Once you have clicked and allowed notifications from me, ` +
                        `I will be able to message you via a service known as *push notifications*.  You know what these are even if you ` +
                        `have not heard the name - STFC constantly sends you them every time an Armada is created! :D\n\nThese notifications do not use the ` +
                        `discord app, but rather are delivered via your web browser!  This means that regardless of your discord notification settings, ` +
                        `you will be able to receive these notifications.\n\n **PLEASE NOTE:** *You will only be alerted if another alliance member ` +
                        `uses the alert command* - sadly, I am no miracle worker - I can only alert you when the alarm is raised.\n\nTo complete your ` +
                        `registration, please visit the web page that I have sent to you via direct message.\n`);
                    message.author.send(`Please visit the following link: \n${msgText}`);
                } else {
                    library.Helper.editWaitErrorMessage(msg, `I am sorry, ${message.author}, the registration link appears to be undergoing difficulties - ` +
                        `http status code ${res.status}, ${res.statusText} was received.\n\nIt appears that my registration web page is currently not functioning correctly.  ` +
                        `I may be undergoing technical difficulties - my owner has been alerted, and I should be back to normal shortly.  Please check back at a later time.\n\n`);
                }
                // if(!error && response.statusCode == 200) {
                //     
                // } else {
                //     library.Helper.editWaitErrorMessage(msg, `Registration URL:\n${msgText}\n\n. I am sorry, ${message.author}, but it appears that this webpage is currently not functioning.  Please check back at a later time.\n${JSON.stringify(error)}`);
                // }
                })
                .catch(err => {
                    library.Helper.editWaitErrorMessage(msg, `I am sorry, ${message.author}, but it appears that my registration web page is currently unavailable.  I may be undergoing technical difficulties - my owner has been alerted, and I should be back to normal shortly.  The red alert system is a popular feature, so my server ma just be overloaded with requests.  Please check back at a later time.\n` +
                    `\nError type: ${err.type}\nError message: ${err.message}\nStack trace: ${err.stack}`);
                }); 
        } else {
            library.Helper.editWaitErrorMessage(msg, `Sorry, ${message.author}, I am not currently configured to provide a URL for you in order to register for red alert messages.  This feature is in development, please try again at a later date.`);
        }
    }
}