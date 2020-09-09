/*
 * @Author: BanderDragon 
 * @Date: 2020-08-25 02:56:13 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-09 01:41:54
 */

const config = require('../../config.json');
const Discord = require('discord.js');

const embedValueCharacterLimit = 1024;

/*
 * Private functions
 */
function createRichEmbed (title, description, author, authorAvatarURL, messages, color = 16777215) {
    const embed = new Discord.RichEmbed()
        .setTitle(title)
        .setAuthor(author, authorAvatarURL)
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
    return embed;
}

/*
 * PUBLIC CLASS
 */
module.exports = {

    createEmbed: function(messageText, color) {
        return {
            embed: {
                color: color,
                description: messageText
            }
        }
    },

    createRichEmbed: function(title, description, messages, channel, client, color = 16777215) {
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
        return embed;
    },
    
    createFullRichEmbed: function(title, description, author, authorURL, messages, channel, client, color = 16777215) {
        const embed = new Discord.RichEmbed()
            .setTitle(title)
            .setAuthor(author, authorURL)
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
        return embed;
    },

    /**
     * Sends a standard-styled message, with optional custom color
     * @param {string} message 
     * @param {Channel} channel 
     * @param {integer} color 
     * @returns {Promise<Message>}
     */
    sendMessage: function(messageText, channel, color = 16777215) {
        return channel.send(this.createEmbed(messageText, color));
    },

    /**
     * Edits a standard-styled message, with optional custom color.
     * @param {Message} message 
     * @param {string} messageText 
     * @param {integer} color
     * @returns {Promise<Message>}
     */
    editMessage: async function(message, messageText, color = 16777215) {
        // Message objects are promises, and may still be pending
        if(message) {
            message.then(function (msg) {
                if (msg.editable) {
                    return msg.edit(this.createEmbed(messageText, color));
                } else {
                    this.sendErrorMessage(`An error occurred, I was unable to edit the above promise message ('${msg.Message}').\n\n**New Message content:**\n${messageText}.`);
                }
            }.bind(this));
        }
    },

    /**
     * Edits the given message object, which was returned by a previous call to
     * sendWaitMessage. The message will be updated with the new messageText and
     * the color will be changed to the optional new color.
     * @param {Message} message 
     * @param {string} messageText 
     * @param {integer} color
     * @returns {Promise<Message>}
     */
    editWaitMessage: function(message, messageText) {
        return this.editMessage(message, messageText, config.messagePleaseWaitColor);
    },

    amendWaitMessage: function(message, messageText) {
        var msgText = message.content + "\n\n" + messageText;
        return this.editMessage(message, msgText, config.messagePleaseWaitColor);
    },

    /**
     * Edits the given message object, returned by a previous call to
     * sendWaitMessage. The message will be changed into a standard success-styled message.
     * @param {Message} message 
     * @param {string} messageText 
     * @param {integer} color
     * @returns {Promise<Message>}
     */
    editWaitSuccessMessage: function(message, messageText) {
        return this.editMessage(message, messageText, config.messageSuccessColor);
    },

    /**
     * Edits the given message object, returned by a previous call to
     * sendWaitMessage. The message will be changed into a standard error-styled message.
     * @param {Message} message 
     * @param {string} messageText 
     * @param {integer} color
     * @returns {Promise<Message>}
     */
    editWaitErrorMessage: function(message, messageText) {
        return this.editMessage(message, messageText, config.messageErrorColor);
    },

    /**
     * Sends a message to the channel using the error colour defined in the config settings
     * @param {string} message 
     * @param {Channel} channel 
     * @returns {Promise<Message>}
     */
    sendErrorMessage: function(message, channel) {
        return this.sendMessage(message, channel, config.messageErrorColor);
    },

    /**
     * Sends a message to the channel using the error colour defined in the config settings
     * @param {string} message 
     * @param {Channel} channel 
     * @returns {Promise<Message>}
     */
    sendSuccessMessage: function(message, channel) {
        return this.sendMessage(message, channel, config.messageSuccessColor);
    },

    /**
     * Sends a wait-styled message, with customised payload, using the config colour messagePleaseWaitColor
     * @param {string} message 
     * @param {Channel} channel 
     * @returns {Promise<Message>}
     */
    sendWaitMessage: function(message, channel) {
        return this.sendMessage(message, channel, config.messagePleaseWaitColor);
    },

    /**
     * Sends a standard 'Please Wait...' message, using the config colour messagePleaseWaitColor
     * @param {string} message 
     * @param {Channel} channel 
     * @returns {Promise<Message>}
     */
    sendStandardWaitMessage: function(channel) {
        return this.sendMessage('Please wait...', channel, config.messagePleaseWaitColor);
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
        return channel.send(this.createRichEmbed(title, description, messages, channel, client, color));
    },

    /**
     * Sends a custom Wait Rich embed message, using the standard wait color
     * @param {string} title 
     * @param {string} description 
     * @param {array<string>} messages 
     * @param {Channel} channel 
     * @param {Client} client 
     */
    sendWaitRichMessage: function(title, description, messages, channel, client) {
        return this.sendRichMessage(title, description, messages, channel, client, config.messagePleaseWaitColor);
    },

    /**
     * Edits the given message, copying the original author and icon from the existing embed,
     * and creating a new embed object using the new message fields.
     *
     * @param {string} message 
     * @param {string} title 
     * @param {string} description 
     * @param {Array<string>} messages 
     * @param {integer} color
     * @returns {Promise<Message>}
     */
    editWaitRichMessage: async function(message, title, description, messages, color) {
        var newEmbed = null;
        if(message) {
            message.then(function (msg) {
                if(msg.editable) {
                    if(msg.embeds.length > 0) {
                        const oldEmbed = msg.embeds[0];
                        var authorName = "";
                        var authorIcon = "";
                        if(oldEmbed.author) {
                            authorName = author.name;
                            authorIcon = author.iconURL;
                        }
                        newEmbed = createRichEmbed(title, description, authorName, authorIcon, messages, color);
                    }
                }
                return msg.edit(newEmbed);
            });
        }
    },

    editWaitFullRichMessage: async function(message, title, description, author, authorURL, messages, color = 16777215) {
        var newEmbed = null;
        if(message) {
            message.then(function (msg) {
                if(msg.editable) {
                    if(msg.embeds.length > 0) {
                        //const oldEmbed = msg.embeds[0];
                        // if(oldEmbed.author) {

                        // }
                        newEmbed = createRichEmbed(title, description, author, authorURL, messages, color);
                    }
                }
                return msg.edit(newEmbed);
            });
        }
    },

    /**
     * Sends a completely customized Rich message, using a custom author and iconURL, and optional custom colour
     * and creating the embed object using the message fields.
     *
     * @param {string} message 
     * @param {string} title 
     * @param {string} description 
     * @param {Array<string>} messages 
     * @param {integer} color
     * @returns {Promise<Message>}
     */
    sendFullRichMessage: function(title, description, author, authorURL, messages, channel, client, color = 16777215) {
        return channel.send(this.createFullRichEmbed(title, description, author, authorURL, messages, channel, client, color));
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
            count = global.library.Format.stripCommas(args[1]);
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

    /**
     * Returns a 'clean' name string, removing any @ prefix, or #1234 suffix.
     * @param {string} name 
     * @returns {string}
     */
    parseName: function (name) {
        name = name.replace('@', '');
        name = name.replace(':', '');
        name = name.replace('```', '');
        var index = name.indexOf('#');
        if (index > -1) {
            name = name.substring(0, index);
        }
        return name;
    },

    parseIdNumber: function (number) {
        number = number.replace('@', '');
        number = number.replace('<', '');
        number = number.replace('>', '');
        return number;
    },
    
    /**
     * Parses the given string and extracts any number
     * @param {string} text 
     * @returns {integer?}
     */
    parseNumber: function (text) {
        var regex = /[1234567890]*/g;
        let reg = new RegExp(regex);
        return text.match(reg).join('');
    },
}
