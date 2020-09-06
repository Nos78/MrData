/*
 * @Author: BanderDragon 
 * @Date: 2020-08-29 02:51:12 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-08-29 05:37:33
 */

const library = require('../library');
const config = require('../config.json');

module.exports = {
    name: 'userinformation',
    description: `Command **${config.prefix}${this.name}** returns information on a discord user.  The user must be a member of your server.`,
    aliases: ['memberinfo', 'userinfo', 'memberinformation'],
    usage: `<member name>`,
    args: true,
    guildOnly: true,
    version: '0.0.2',
    execute(message, args) {
        if(args.length == 0) {
            library.Helper.sendErrorMessage(`${this.name} requires a name.  Try '${config.prefix}${this.name} ${message.author}', for example.`);
            return;
        }

        var member = message.mentions.members.first();
        if (!member) {
            member = library.Discord.getDiscordMember(args[0], message.guild);
        }

        var displayName = library.Discord.getDisplayName(member);
        
        if (member) {
            var fields = [];
            fields.push({"name": `Properties for member`, "value": `${member.toString()} **Discord User:** [${member.user.username}#${member.user.discriminator}]`});
            fields.push({"name": `Is A Bot?`, "value": `${member.user.bot}`});
            fields.push({"name": `Deleted?`, "value": `${member.deleted}`});
            fields.push({"name": `Discord Unique ID Number`, "value": `${member.user.id}`});
            fields.push({"name": `User name`, "value": `${member.user.username}`});
            fields.push({"name": `Display Name`, "value": `${member.displayName}`});
            fields.push({"name": `Nickname`, "value": `${member.nickname}`});
            fields.push({"name": `User avatar`, "value": `${member.user.avatarURL}`});
            fields.push({"name": `User displayed avatar`, "value": `${member.user.displayAvatarURL}`});
            fields.push({"name": `User default avatar`, "value": `${member.user.defaultAvatarURL}`});
            fields.push({"name": `Discord Tag`, "value": `${member.user.tag}`});
            fields.push({"name": `Joined At`, "value": `${member.joinedAt}`});
            fields.push({"name": `Created At`, "value": `${member.user.createdAt}`});
            fields.push({"name": `Permissions`, "value": `${member.permissions._member} - bitfield: ${member.permissions.bitfield}`});
            fields.push({"name": `Permissions detail`, "value": `Has administrator permissions: ${member.hasPermission("ADMINISTRATOR")}, Can kick members: ${member.hasPermission("KICK_MEMBERS")}, Can manage nicknames: ${member.hasPermission("MANAGE_NICKNAMES")}, Can manage roles: ${member.hasPermission("MANAGE_ROLES")}, Can manage guild: ${member.hasPermission("MANAGE_GUILD")}`});
            fields.push({"name": `Premium Since`, "value": `${member.premiumSince} - ${member.premiumSinceTimestamp}`});
            if(member.user.lastMessage) {
                var msg = `${member.user.lastMessage} ID: ${member.user.lastMessageID}`;
                if(member.user.lastMessage.channel) {
                    msg = msg + ` Channel: #${member.user.lastMessage.channel.name}`;
                } 
                fields.push({"name": `Last message`, "value": `${msg}`});
            }
            if(member.roles) {
                var roles = [];
                member.roles.forEach(function(role) {
                    roles.push(role.name);
                });
                fields.push({"name": `Roles`, "value": `${member.roles.size} - ${JSON.stringify(roles)}`});
            }
            fields.push({"name": `Is Deaf?`, "value": `${member.deaf}`});
            fields.push({"name": `Voice state`, "value": `${member.voice}`});
            fields.push({"name": `Client state`, "value": `desktop: ${JSON.stringify(member.user.presence.clientStatus)}, game: ${member.user.presence.game}, status: ${member.user.presence.status}`});
            library.Helper.sendRichMessage(`Displaying User Information`, `I have scoured ${message.guild.name} and the Discord network. Here is all the information I could find for ${args[0]}`, fields, message.channel, message.client, config.messageSuccessColor);           

            fields = [];
            fields.push({"name": `Is Kickable?`, "value": `${member.kickable}`});
            fields.push({"name": `Is Manageable?`, "value": `${member.manageable}`});
            fields.push({"name": `Is Bannable?`, "value": `${member.bannable}`});
            library.Helper.sendRichMessage(`User Information Continued...`, `Based on my own permission level, I may or may not be able to perform the following actions:`, fields, message.channel, message.client, config.messageSuccessColor);           

        } else {
            library.Helper.sendErrorMessage(`Sorry, ${message.author}, I cannot find ${args[0]} on the server.  Have you entered the correct name?`, message.channel);
        }
    } // end execute
}
