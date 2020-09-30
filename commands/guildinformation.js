/*
 * @Author: BanderDragon 
 * @Date: 2020-08-29 02:51:12 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-30 21:34:39
 */

const library = require('../library');
const config = require('../config.json');
const { initialiseCommands } = require('../library/discord/discord');

module.exports = {
    name: 'guildinformation',
    description: `Returns information on a discord guild (a server).  @BOTNAME must be a member of the guild to provide information. The default command returns information on your server.`,
    aliases: ['guild', 'guildinfo', 'serverinfo', 'allianceinfo'],
    usage: `<guild name>`,
    args: false,
    version: '0.0.0',
    category: 'utility',    
    guildOnly: true,
    async execute(message, args) {
        var msg = library.Helper.sendStandardWaitMessage(message.channel);
        // if(args.length == 0) {
        //     library.Helper.sendErrorMessage(`${this.name} requires a name.  Try '${config.prefix}${this.name} ${message.author}', for example.`);
        //     return;
        // }
        var collatedArgs = library.collateArgs(0, args);
        var guildId = message.guild.id;
        var guild = null;
        if(args.length > 0) {
            if(isNaN(args[0])) {
                // Name, not a number...
                guild = library.Discord.getDiscordGuild(library.Helper.parseName(collatedArgs), message.client)
            } else {
                guildId = args[0];
//                guild = await message.client.guilds.fetch(guildId);
                if(!message.client.guilds.has(`${guildId}`)) {
                    return library.Helper.editWaitErrorMessage(msg, `Sorry, ${message.author}, I do not have access to guild ${guildId}.`)
                } else {
                    guild = message.client.guilds.get(guildId);
                }
            }

            if(!guild) {
                return library.Helper.editWaitErrorMessage(msg, `Sorry, ${message.author}, I could not find the guild you asked for (${collatedArgs}).`)
            }
        } else {
            guild = message.guild;
        }

        if(!guild) {
            return library.Helper.editWaitErrorMessage(msg, `Sorry, ${message.author}, something went wrong - I cannot access your guild's information.`)
        }

        var displayName = library.Discord.getGuildName(guild);
        
        if (guild) {
            var fields = [];
            fields.push({"name": `Description`, "value": `${guild.description}`});
            fields.push({"name": `Guild Owner`, "value": `Name: **${guild.owner.displayName}**\nDiscord username: **${guild.owner.user.username}#${guild.owner.user.discriminator}**\nDiscord ID number: **${guild.ownerID}**`});
            fields.push({"name": `Icon`, "value": `${guild.icon}`});
            fields.push({"name": `Icon`, "value": `${guild.iconURL}`});
            if(guild.banner) {
                fields.push({"name": `Banner`, "value": `${guild.banner}`});
                if(guild.bannerURL) {
                    fields.push({"name": `Banner URL`, "value": `${guild.bannerURL()}`});
                }
            }
            fields.push({"name": `Is Available?`, "value": `${guild.available}`});
            fields.push({"name": `Is ${library.Config.botName(message.client)} Deleted?`, "value": `${guild.deleted}`});
            fields.push({"name": `AFK Timeout`, "value": `${guild.afkTimeout}`});
            if(guild.applicationID) {
                fields.push({"name": `Application ID`, "value": `${guild.applicationID}`});
            }
            fields.push({"name": `Number of members (manual count of the list)`, "value": `${guild.members.size}`});
            fields.push({"name": `Number of members (as recorded by the guild data)`, "value": `${guild.memberCount}`});
            fields.push({"name": `Maximum number of members permitted`, "value": `${guild.maximumMembers}`});
            fields.push({"name": `Is large?`, "value": `${guild.large}`});
            fields.push({"name": `Number of channels`, "value": `${guild.channels.size}`});
            var channelsList = "";
            var channels = guild.channels.map(channel => channel.name);
            for(var i = 0; i < guild.channels.size; i++) {
                channelsList += `\t${channels[i]}`;
                var blockOfX = (i + 1) / 2;
                if(i > 0 && (blockOfX - Math.floor(blockOfX) == 0)) {
                    channelsList += `\n\n`;
                } else {
                    channelsList += ` -- `;
                }
            }
            fields.push({"name": `Channels on ${displayName}`, "value": `${channelsList}`});
            fields.push({"name": `MFA Level`, "value": `${guild.mfaLevel}`});
            fields.push({"name": `Name Acronym`, "value": `${guild.nameAcronym}`});
            fields.push({"name": `Discord Guild Unique ID Number`, "value": `${guild.id}`});
            //fields.push({"name": `Is Partnered?`, "value": `${guild.partnered}`});
            fields.push({"name": `Guild Region`, "value": `${guild.region}`});
            fields.push({"name": `Boosts Count`, "value": `${guild.premiumSubscriptionCount}`});
            fields.push({"name": `Premium Tier`, "value": `${guild.premiumTier}`});
            if(guild.splash) {
                fields.push({"name": `Splash Image`, "value": `${guild.splash}`});
            }
            if(guild.vanityURLCode) {
                fields.push({"name": `Vanity URL Code`, "value": `${guild.vanityURLCode}`});
                fields.push({"name": `Vanity URL Uses`, "value": `${guild.vanityURLUses}`});
            }
            fields.push({"name": `Verification Level`, "value": `${guild.verificationLevel}`});
            fields.push({"name": `Verified?`, "value": `${guild.verified}`});
            fields.push({"name": `${displayName} Created At`, "value": `${guild.createdAt}`});
            fields.push({"name": `${library.Config.botName(message.client)} Joined ${displayName} At`, "value": `${guild.joinedAt}`});

            var guildEmbed = library.Helper.createFullRichEmbed(`Discord Guild: ${displayName}`,
                `*I have scoured my databanks and the Discord network. Here is all the information I could find for* **${displayName}**`,
                `Guild Owner: ${guild.owner.displayName}`, guild.owner.user.avatarURL, `http://discordapp.com/users/${guild.owner.user.id}`,
                fields, message.channel, message.client, config.messageSuccessColor, `https://discord.com/developers/servers/${guild.id}`, guild.iconURL, library.Helper.URLs.fundMrDataBanner);
            var msg2 = library.Helper.editMessageEmbed(msg, guildEmbed);

            var msg3 = null;
            try {
                var invites = guild.fetchInvites()
                    .then(result => {
                        fields = [];
                        if(result) {
                            let inviteArr = result.array();
                            for(var j = 0; j < inviteArr.length; j++) {
                                fields.push({"name": `Invite link:`, "value": `https://discord.gg/${inviteArr[j].code}`});
                            }
                            //fields.push({"name": `Invite link`, "value": `https://discord.gg/${vanityCode}`});
                            //fields.push({"name": `Invite links`, "value": `${JSON.stringify(invites)}`});
                            msg3 = library.Helper.sendRichMessage(`${displayName} current invitation links`, `Here is a list of the current invitation links that can be used to join ${displayName}`, fields, message.channel, message.client, config.messageSuccessColor);
                        }
                    })
                    .catch(err => {
                        msg3 = library.Helper.sendErrorMessage(`Sorry, ${message.author}, my current permission level means I am unable to access the invites data for ${displayName}.`, message.channel);
                    });
            } catch (err) {
                msg3 = library.Helper.sendErrorMessage(`Sorry, ${message.author}, my current permission level means I am unable to access the invites data for ${displayName}.`, message.channel);
            }
        
            var msg4 = null;
            try {
                guild.fetchBans().then(function(bans) {
                    if(bans) {
                        fields = [];
                        fields.push({"name": `Banned Users`, "value": `${JSON.stringify(bans)}`});
                        Array.from(bans).forEach(function(ban) {
                            fields.push({"name": `User name`, "value": `${ban.username}#${ban.discriminator}`});
                        });
                    }
                    if(fields.length > 0) {
                        msg4 = library.Helper.sendRichMessage(`Banned user list for ${displayName}`, `The following users have an active ban:`, fields, message.channel, message.client, config.messageSuccessColor);           
                    }
                })
                .catch(err => {
                    msg4 = library.Helper.sendErrorMessage(`Sorry, ${message.author}, my current permission level means I am unable to access the bans data for ${displayName}.`, message.channel);
                });
            } catch (err) {
                msg4 = library.Helper.sendErrorMessage(`Sorry, ${message.author}, my current permission level means I am unable to access the bans data for ${displayName}.`, message.channel);
            }
        } else {
            library.Helper.sendErrorMessage(`Sorry, ${message.author}, I am not connected to ${args[0]} and therefore I am unable to return any information about their organisation.  To see a list of organisations I have connections with, you can use the ${library.Config.getPrefix()}guilds command.`, message.channel);
        }
    } // end execute
}
