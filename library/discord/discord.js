/*
 * @Author: BanderDragon 
 * @Date: 2020-08-25 21:10:12 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-10 17:31:43
 */

const logger = require('winston');
const config = require('../../config.json');

// PRIVATE FUNCTIONS - Not to be exported

/**
 * Calls the guild.members.find() method, searching the parameterName type, using the 
 * parameterValue as the string being searched for.
 * @param {string} parameterName 
 * @param {string} parameterValue 
 * @param {Guild} guild
 * @returns {GuildMember} object being searched
 */
function findDiscordMember(parameterName, parameterValue, guild) {
    if(!parameterName) {
        throw 'findDiscordMember: parameterName was null!'
    }
    return guild.members.find(parameterName, parameterValue);
}

module.exports = {

    // markdown property contains the various markdown tags used in discord.
    markdown: {
        "codeBlock": {
            "single": '`',
            "multi": '```'
        },
        "bold": '**',
        "italic": '*',
        "bolditalic": '***',
        "underline": '__',
        "strike": '~~',
        "blockQuote": {
            "single": '>',
            "multi": '>>>'
        },
        "spolier": '||'
    },
    
    /**
     * Gets the member object of a given member from a guild object, using the member name.
     * @param {string} name 
     * @param {Guild} guild 
     * @returns {GuildMember}
     */
    getDiscordMemberByName: function(name, guild) {
        // Get a 'clean' copy of the name
        name = global.library.Helper.parseName(name);

        // return the member object from the members list
        return findDiscordMember("displayName", name, guild);
    },

    /**
     * Attempts to find the member object from the guild.members collection, using
     * the id number of the member being searched for.
     * @param {string} id 
     * @param {Guild} guild 
     * @returns {GuildMember} object being searched for
     */
    getDiscordMemberById: function(id, guild) {
        id = global.library.Helper.parseIdNumber(id);

        return findDiscordMember("id", id, guild);
    },

    /**
     * Wrapper for getDiscordMemberBy..., this function calls the
     * relevant find function based on the content of the identifier
     * parameter.  If identifier is a numeral, then getDiscordMemberById is
     * invoked, and so on.
     * @param {string} identifier something unique that describes the member being searched
     * @param {Guild} guild object, usually from message.guild
     * @returns {GuildMember} a member object
     */
    getDiscordMember: function(identifier, guild) {
        var memberId = global.library.Helper.parseIdNumber(identifier);
        var memberName = global.library.Helper.parseName(identifier);

        if(isNaN(memberId)) {
            return this.getDiscordMemberByName(memberName, guild);
        } else {
            return this.getDiscordMemberById(memberId, guild);
        }
    },

    /**
     * Gets the named guild from the guilds collection.  The bot must be connected to this guild, else
     * no object will be returned.
     * @param {string} name 
     * @param {Client} client 
     */
    getDiscordGuild: function(name, client) {
        name = global.library.Helper.parseName(name);

        return client.guilds.find("name", name);
    },

    /**
     * Get the guild name from a given discordjs Guild object
     * @param {Guild} guild 
     */
    getGuildName: function(guild) {
        var name = "";
        if(guild) {
            name = guild.name;
        }
        return name;
    },

    /**
     * Gets the member.displayName or member.user.username if displayName is empty
     * @param {member} member 
     * @returns {string}
     */
    getDisplayName: function (member) {
        let displayName = "";
        if(member) {
            displayName = member.displayName;
            if (!displayName) {
                displayName = member.user.username;
            }
        }
        return displayName;
    }
}