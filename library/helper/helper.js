/*
 * @Author: BanderDragon 
 * @Date: 2020-08-25 02:56:13 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-08-26 03:39:27
 */

const format = require('../format/format.js');
const config = require('../../config.json');
const Discord = require('discord.js');

const embedValueCharacterLimit = 1024;

module.exports = {
    sendMessage: function(message, channel, color = 16777215) {
        return channel.send({
            embed: {
                color: color,
                description: message
            }
        });
    },

    /**
     * Sends a message to the channel using the error colour defined in the config settings
     * @param {string} message 
     * @param {Channel} channel 
     */
    sendErrorMessage: function(message, channel) {
        return this.sendMessage(message, channel, config.messageErrorColor);
    },

    /**
     * Sends a message to the channel using the error colour defined in the config settings
     * @param {string} message 
     * @param {Channel} channel 
     */
    sendSuccessMessage: function(message, channel) {
        return this.sendMessage(message, channel, config.messageSuccessColor);
    },

    /**
     * Sends a rich embedded message to the channel using the error colour defined in the config settings
     * @param {string} title 
     * @param {string} description 
     * @param {string array} messages 
     * @param {Channel} channel 
     * @param {Client} client 
     * @param {integer} color 
     */
    sendRichMessage: function(title, description, messages, channel, client, color = 16777215) {
        const embed = new Discord.RichEmbed()
          .setTitle(title)
          .setAuthor(client.user.username, client.user.avatarURL)
        .setDescription(description)
        .setColor(color);
        messages.forEach(function(message) {
            if(message.name.length > Discord.RichEmbed.embedNameCharacterLimit) {
                message.name = message.name.substring(0, Discord.RichEmbed.embedNameCharacterLimit);
            }
            if(message.value.length > embedValueCharacterLimit) {
                message.value = message.value.substring(0, embedValueCharacterLimit);
            }
            embed.addField(message.name, message.value);
        });
        return channel.send({ embed });
    },

    displayName: function (member) {
        let displayName = member.displayName;
        if (!displayName) {
            displayName = member.name;
        }
        return displayName;
    },

    parseMaxRankCount: function (args) {
        var count = 10;
        if (args.length == 2) {
            count = format.stripCommas(args[1]);
            if ((args[0] == '-c' || args[0] == '-count') && !isNaN(count)) {
                args.length = 0;
            } else {
                count = 10;
            }
        }

        if (count > 24) {
            count = 24;
        }
        return count;
    },
}
