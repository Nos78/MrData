/*
 * @Author: BanderDragon 
 * @Date: 2020-08-29 02:51:12 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-13 23:25:58
 */

const library = require('../library');
const config = require('../config.json');
const { initialiseCommands } = require('../library/discord/discord');

module.exports = {
    name: 'guildinformation',
    description: `Returns information on a discord guild (a server).  @BOTNAME must be a member of the guild to provide information. The default command returns information on your server.`,
    aliases: ['guildinfo', 'serverinfo', 'allianceinfo'],
    usage: `<guild name>`,
    args: false,
    version: '0.0.0',
    guildOnly: true,
    execute(message, args) {
        // if(args.length == 0) {
        //     library.Helper.sendErrorMessage(`${this.name} requires a name.  Try '${config.prefix}${this.name} ${message.author}', for example.`);
        //     return;
        // }

        var guild = message.mentions.guilds.first();
        if (!guild) {
            guild = library.Discord.getDiscordGuild(library.Helper.parseName(args[0]), message);
        }

        var displayName = library.Discord.getGuildName(guild);
        
        if (guild) {
            var fields = [];
            fields.push({"name": `Properties for guild`, "value": `${guild.toString()} **Discord Guild:** [${guild.user.username}#${guild.user.discriminator}]`});
            fields.push({"name": `Description`, "value": `${guild.description}`});
            fields.push({"name": `Guild Owner`, "value": `${guild.owner.displayName} [${guild.owner.user.username}#${guild.owner.user.discriminator}] - ${guild.ownerID}`});
            fields.push({"name": `Icon`, "value": `${guild.icon}`});
            fields.push({"name": `Icon`, "value": `${guild.iconURL}`});
            fields.push({"name": `Banner`, "value": `${guild.banner}`});
            fields.push({"name": `Banner URL`, "value": `${guild.bannerURL()}`});
            fields.push({"name": `Discovery Splas URL`, "value": `${guild.discoverySplashURL()}`});
            fields.push({"name": `Description`, "value": `${guild.description}`});
            fields.push({"name": `Is Available?`, "value": `${guild.available}`});
            fields.push({"name": `Is ${library.Config.botName()} Deleted?`, "value": `${guild.deleted}`});
            fields.push({"name": `AFK Timeout`, "value": `${guild.afkTimeout}`});
            fields.push({"name": `Application ID`, "value": `${guild.applicationID}`});
            fields.push({"name": `Approximate umber of members`, "value": `${guild.approximateMemberCount}`});
            fields.push({"name": `Number of members`, "value": `${guild.members.count}`});
            fields.push({"name": `Number of members`, "value": `${guild.memberCount}`});
            fields.push({"name": `Maximum number of members permitted`, "value": `${guild.maximumMembers}`});
            fields.push({"name": `Is large? (Discord defines this as 50+ members)`, "value": `${guild.large}`});
            fields.push({"name": `Number of channels`, "value": `${guild.channels.count}`});
            fields.push({"name": `MFA Level`, "value": `${guild.mfaLevel}`});
            fields.push({"name": `Name Acronym`, "value": `${guild.nameAcronym}`});
            fields.push({"name": `Discord Guild Unique ID Number`, "value": `${guild.id}`});
            fields.push({"name": `Is Partnered?`, "value": `${guild.partnered}`});
            fields.push({"name": `Preferred Locale`, "value": `${guild.preferredLocale}`});
            fields.push({"name": `Boosts Count`, "value": `${guild.premiumSubscriptionCount}`});
            fields.push({"name": `Premium Tier`, "value": `${guild.premiumTier}`});
            fields.push({"name": `Region`, "value": `${guild.region}`});
            fields.push({"name": `Splash Image`, "value": `${guild.splash}`});
            fields.push({"name": `Vanity URL Code`, "value": `${guild.vanityURLCode}`});
            fields.push({"name": `Vanity URL Uses`, "value": `${guild.vanityURLUses}`});
            fields.push({"name": `Verification Level`, "value": `${guild.verificationLevel}`});
            fields.push({"name": `Verified?`, "value": `${guild.verified}`});
            fields.push({"name": `Voice State`, "value": `${guild.voice}`});
            fields.push({"name": `Vanity URL Code`, "value": `${guild.vanityURLCode}`});
            fields.push({"name": `Vanity URL Code`, "value": `${guild.vanityURLCode}`});
            fields.push({"name": `${library.Config.botName()} Joined At`, "value": `${guild.joinedAt}`});
            fields.push({"name": `Created At`, "value": `${guild.createdAt}`});
            library.Helper.sendRichMessage(`Displaying User Information`, `I have scoured ${message.guild.name} and the Discord network. Here is all the information I could find for ${args[0]}`, fields, message.channel, message.client, config.messageSuccessColor);           

            fields = [];
            guild.fetchBans().then(function(bans) {
                if(bans) {
                    fields.push({"name": `Banned Users`, "value": `${JSON.stringify(bans)}`});

                    Array.from(bans).forEach(function(ban) {
                        fields.push({"name": `User name`, "value": `${ban.username}#${ban.discriminator}`});
                    });
                }
            });
            library.Helper.sendRichMessage(`User Information Continued...`, `Based on my own permission level, I may or may not be able to perform the following actions:`, fields, message.channel, message.client, config.messageSuccessColor);           

        } else {
            library.Helper.sendErrorMessage(`Sorry, ${message.author}, I am not connected to ${args[0]} and therefore I am unable to return any information about their organisation.  To see a list of organisations I have connections with, you can use the ${library.Config.getPrefix()}guilds command.`, message.channel);
        }
    } // end execute
}
