/*
 * @Author: BanderDragon 
 * @Date: 2020-08-25 21:10:12 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-08-29 04:25:58
 */

const logger = require('winston');
const config = require('../../config.json');
const helper = require('../helper/helper.js');

module.exports = {
    initialiseCommands: function (client) {

    },

    /**
     * Gets the member object of a given member from a guild object, using the member name.
     * @param {string} name 
     * @param {guild} guild 
     * @returns {member}
     */
    getDiscordMember: function(name, guild) {
        // Get a 'clean' copy of the name
        name = helper.parseName(name);

        // return the member object from the members list
        return guild.members.find("displayName", name);
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