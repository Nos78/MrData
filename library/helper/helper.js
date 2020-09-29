/*
 * @Author: BanderDragon 
 * @Date: 2020-03-29
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-29 03:15:53
 */

const config = require('../../config.json');
const Discord = require('discord.js');
const logger = require('winston');
const moment = require('moment');

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

    activityType: ['Playing', 'Streaming', 'Listening to', 'Watching'],
    
    URLs: {
        "mrdata-home": "http://mrdata.thebotfactory.net/",
        "fundMrDataQr": "http://mrdata.thebotfactory.net/mrdata-qr-donate.png",
        "fundMrDataBanner": "http://mrdata.thebotfactory.net/fundmrdata.png"
    },

    userCard: function(user, channel, client, member = null) {
        var name = user.username;
        if(member) {
            if(member.nickname) {
                name = member.displayName;
            }
        }
        var createdMoment = moment(user.createdAt);
        var dateString = `**Joined discord ${createdMoment.fromNow()}**, on ${createdMoment.format('DD MMMM, YYYY')}`;
        if(member) {
            var joinedMoment = moment(member.joinedAt);
            dateString += `\n**Joined ${global.library.Discord.getGuildName(member.guild)} ${joinedMoment.fromNow()}**, on ${joinedMoment.format('DD MMM, YYYY')}`;
        }
        var description = `${dateString}`;
        var authorName = user.tag;
        var authorAvatar = user.displayAvatarURL;
        var authorURL = `http://discordapp.com/users/515622530371944448`;
        var presenceString = '';
        if(user.presence) {
            if(user.presence.activities) {
                const activities = user.presence.activities;
                for(var i = 0; i < activities.length; i++) {
                    if(activities[i].name) {
                        var activity = this.activityType[activities[i].type];
                        presenceString += `${activity} ${activities[i].name}`;
                        if(activities[i].url) {
                            presenceString += `, ${activities[i].url}`;
                        }
                        if(activities[i].details) {
                            presenceString += `, ${activities[i].details}`;
                        }
                        if(activities[i].state) {
                            presenceString += `, ${activities[i].state} `;
                        }
                    }
                }
            }
            if(presenceString == '') {
                presenceString = `${user.presence.status}`;
            } else {
                presenceString 
            }
        }

        var fields = [
            {name: `Current status: *${user.presence.status}*`,
            value: `${presenceString}`, inline: true}
        ];
        return this.createFullRichEmbed(name,
            description,
            authorName,
            authorAvatar,
            authorURL,
            fields,
            channel,
            client,
            config.messageSuccessColor,
            authorURL,
            authorAvatar);
    },

    createEmbed: function(messageText, channel, color, messageId = null) {
        var showAdvert = false;
        var uniqueId = null;
        var cachedMessageId = null;

        // Check whether we can attach an advert
        if(channel && channel.type == 'dm') {
            // Don't throttle adverts in DM
            showAdvert = true;
        }

        if(channel.guild) {
            showAdvert = global.library.System.getCachedParameter(channel.guild.id, 'showAdvert', channel.client);
            cachedMessageId = global.library.System.getCachedParameter(channel.guild.id, 'messageId', channel.client);

            if(cachedMessageId) {
                var ids = cachedMessageId.split("::");
    
                cachedMessageId = ids[0];
                if(ids.length > 1) {
                    uniqueId = ids[1];
                }
            }
        }

        if(showAdvert) {
            // Start a timer for the next advert
            if(channel.guild) {
                setTimeout(function() {
                    global.library.System.cacheParameter(
                        channel.guild.id, 
                        'showAdvert',
                        true,
                        channel.client);}, config.timeBetweenAdverts * 1000);
                // Set parameter to prevent adverts until the timeout is called
                global.library.System.cacheParameter(channel.guild.id, 'showAdvert', false, channel.client);
                global.library.System.cacheParameter(channel.guild.id, 'uniqueId', messageId, channel.client);
            }
        } else {
            global.library.System.cacheParameter(channel.guild.id, 'uniqueId', null, channel.client);
        }
        
        // Attach the advert
        if(showAdvert || ((uniqueId != null && uniqueId != 'null') && (messageId != null && cachedMessageId == messageId))) {
            var guildText = "";
            if (channel.guild) { guildText = ` on ${channel.guild.name}`; }

            return {
                embed: {
                    color: color,
                    description: messageText,
                    image: {"url": this.URLs.fundMrDataBanner},
                    thumbnail: {"url": this.URLs.fundMrDataQr},
                    fields: [
                        {"name": `${global.library.Format.randomString(global.library.Funding.titles)}`,
                        "value": `${global.library.Format.randomString(global.library.Funding.texts)}\n[Please give what you can - if you can](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CA4PYT8KZ3B32&source=url)`, "inline": false},
                    ],
                    footer: {
                        "text": `${global.library.Config.packageName()} version ${global.library.Config.packageVersion()}, running as ${global.library.Config.botName(channel.client)}${guildText}\n\u00A9 The Bot Factory, under ${global.library.Config.packageLicense()} licence.`,
                        "icon_url": `${global.library.Config.botAvatar(channel.client)}`
                    }
                }
            }
        } else {
            return {
                embed: {
                    color: color,
                    description: messageText,
                    image: {"url": this.URLs.fundMrDataBanner},
                }
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

    /**
     * Creates a rich embed where all parameters/options can be set
     * @param {string} title 
     * @param {string} description 
     * @param {string} author 
     * @param {string} authorIconURL 
     * @param {string} authorURL 
     * @param {Array} messages 
     * @param {Channel} channel 
     * @param {Client} client 
     * @param {integer} color 
     * @param {string} URL 
     * @param {string} thumbnail 
     * @param {string} image 
     * @param {Date} timestamp 
     * @param {String} footer 
     */
    createFullRichEmbed: function(title, description, author, authorIconURL, authorURL, messages, channel, client, color = 16777215,
            URL = null, thumbnail = null, image = null, timestamp = null, footer = null, footerURL) {
        const embed = new Discord.RichEmbed()
            .setTitle(title)
            .setDescription(description)
            .setColor(color);
        if(messages) {
            messages.forEach(function(message) {
                if(message.name.length > Discord.RichEmbed.embedNameCharacterLimit) {
                    message.name = message.name.substring(0, Discord.RichEmbed.embedNameCharacterLimit);
                }
                if(message.value.length > embedValueCharacterLimit) {
                    message.value = message.value.substring(0, embedValueCharacterLimit);
                }
                embed.addField(message.name, message.value);
            });
        }
        if(author) {
            if(authorURL) {
                embed.setAuthor(author, authorIconURL, authorURL);
            } else {
                embed.setAuthor(author, authorIconURL);
            }
        }
        if(URL) {
            embed.setURL(URL);
        }
        if(thumbnail) {
            embed.setThumbnail(thumbnail);
        }
        if(image) {
            embed.setImage(image);
        }
        if(timestamp) {
            if(global.library.Format.typeOf(timestamp) == 'date') {
                embed.setTimestamp(timestamp);
            } else {
                logger.error(`createFullRichEmbed: ${timestamp} is not a date object`);
            }
        }
        if(footer) {
            if(footerURL) {
                embed.setFooter(footer, footerURL);
            } else {
                embed.setFooter(footer);
            }
        }
        return embed;
    },

    /**
     * Sends a standard-styled message, with optional custom color
     * @param {string} message 
     * @param {Channel} channel 
     * @param {integer} color 
     * @returns {Promise<Message>}
     */
    sendMessage: async function(messageText, channel, color = 16777215) {
        var uniqueID = global.library.Funding.makeId(16);
        return channel.send(await this.createEmbed(messageText, channel, color, uniqueID))
            .then(msg => {
                if(channel.guild) {
                    const uniqueId = global.library.System.getCachedParameter(channel.guild.id, 'uniqueId', channel.client);
                    global.library.System.cacheParameter(channel.guild.id, 'messageId', msg.id + "::" + uniqueId, channel.client);
                    global.library.System.cacheParameter(channel.guild.id, 'uniqueId', null, channel.client);
                }
                return msg;
            });
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
            message.then(async function (msg) {
                if (msg.editable) {
                    return msg.edit(await this.createEmbed(messageText, msg.channel, color, msg.id));
                } else {
                    this.sendErrorMessage(`An error occurred, I was unable to edit the above promise message ('${msg.Message}').\n\n**New Message content:**\n${messageText}.`);
                }
            }.bind(this));
        }
    },

    editMessageEmbed: async function(originalMessage, newEmbed) {
        if(originalMessage) {
            originalMessage.then(async function (msg) {
                if(msg.editable) {
                    return msg.edit(newEmbed);
                } else {
                    this.sendErrorMessage(`An error occurred, I was unable to edit the above promise message ('${msg.Message}').`);
                }
            })
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
        return channel.send(this.createFullRichEmbed(title, description, author, authorURL, null, messages, channel, client, color));
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
