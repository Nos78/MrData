/*
 * @Author: BanderDragon 
 * @Date: 2020-08-25 21:10:12 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-08 19:27:50
 */

const logger = require('winston');
const config = require('../../config.json');
const helper = require('../helper/helper.js');

// PRIVATE FUNCTIONS - Not to be exported

/**
 * 
 * @param {string} parameterName 
 * @param {string} parameterValue 
 * @param {Guild} guild
 * @returns 
 */
function findDiscordMember(parameterName, parameterValue, guild) {
    if(!parameterName) {
        throw 'findDiscordMember: parameterName was null!'
    }
    return guild.members.find(parameterName, parameterValue);
}

module.exports = {
    initialiseCommands: function (client) {

    },

    /**
     * Gets the member object of a given member from a guild object, using the member name.
     * @param {string} name 
     * @param {guild} guild 
     * @returns {member}
     */
    getDiscordMemberByName: function(name, guild) {
        // Get a 'clean' copy of the name
        name = helper.parseName(name);

        // return the member object from the members list
        return findDiscordMember("displayName", name, guild);
    },

    getDiscordMemberById: function(id, guild) {
        id = helper.parseIdNumber(id);

        return findDiscordMember("id", id, guild);
    },

    getDiscordMember: function(identifier, guild) {
        var memberId = helper.parseIdNumber(identifier);
        var memberName = helper.parseName(identifier);

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
        name = helper.parseName(name);

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
    },
}