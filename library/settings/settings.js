/*
 * @Author: BanderDragon 
 * @Date: 2020-08-25 21:10:12 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-12 22:49:15
 */

const logger = require('winston');
const config = require('../../config.json');
var compareVersions = require('compare-versions');

// global.library now contains the library,
// so no longer need to require the other library
// modules that are required in this module

function getSettingsFromRecord (dbRecord, newSettings) {
    let settings = Object.assign({}, newSettings);
    if(dbRecord) {
        if(dbRecord.settings) {
            settings = dbRecord.settings;
        }
    }
    return settings;
}

module.exports = {
    /**
     * Create and initialise a new empty settings object
     * with all the required named fields pre-defined.
     * @returns {Object} A json object
     */
    newUserSettings: function () {
        // From version v2.0.1, pushToken became an array
        // The name is therefore kept, so as not to break the database
        return {
            "pushToken": []
        }
    },

    /**
     * Creates a JSON object describing each setting field.
     * @returns {Object}
     */
    userSettingsDescription: function () {
        return {
            "pushToken": "An array of push tokens, each referring to a device. Used to send a push notification to a device."
        }
    },

    /**
     * Creates a JSON object describing each setting field.
     * @returns {Object}
     */
    guildSettingsDescription: function (client, guild) {
        return global.library.Config.replaceJsonTextParameters(
        {
            "prefix": "the command prefix used for @BOTNAME on @SERVERNAME.",
            "deleteCallingCommand": "@BOTNAME will delete the command when printing the result.",
            "redalert": {
                "Not used": "The settings used for the red alert system on @SERVERNAME.  Not yet implemented."
            },
            "version": "the version of @BOTNAME that saved these settings.  Used for backward compatibility and avoiding breaking changes.",
            "modified": "whether the settings have been modified in the cache and need to be saved to the database.",
            "helpDM": "indicates whether lengthy help text should be output to the channel or via DM to the user."
        }, client, guild);
    },

    /**
     * Create and initialise a new empty settings object
     * with all the required named fields pre-defined.
     * @returns {Object} A json object.
     */
    newGuildSettings: function () {
        return {
            "prefix": config.prefix,
            "deleteCallingCommand": false,
            "redalert": {},
            "version": global.library.Config.packageVersion(),
            "modified": true,
            "showAdvert": true,
            "helpDM": false
        }
    },

    /**
     * Backward compatibility function - new settings may be added at any time,
     * so to ensure none of these changes break the code-base when loading older setting
     * objects, this function will convert an old settings object to the newest definition.
     * 
     * Compares existing settings against the default new settings.
     * @param {Object} settings 
     * @returns {Object} new settings
     */
    upgradeGuildSettings: function (settings) {
        if(!settings) {
            return Object.assign({}, this.newGuildSettings());
        }
        
        var oldSettingsId = settings.version;
        if(!oldSettingsId) {
            oldSettingsId = '0.0.0';
        }

        var newSettings = Object.assign({}, this.newGuildSettings());

        if(compareVersions.compare(newSettings.version, oldSettingsId, '<=')) {
            return settings;
        }
        // added for version, 2.1.2
        if(settings.hasOwnProperty('prefix')) {
            // settings.prefix) {
            newSettings.prefix = settings.prefix;
        }   
        // added for version, 2.1.2
        if(settings.hasOwnProperty('deleteCallingCommand')) {
            newSettings.deleteCallingCommand = settings.deleteCallingCommand;
        }
        // added for version, 2.1.2
        if(settings.hasOwnProperty('redalert')) {
            newSettings.redalert = Object.assign({}, settings.redalert);
        }
        // added for version 2.1.6
        if(settings.hasOwnProperty('showAdvert')) {
            newSettings.showAdvert = settings.showAdvert;
        }
        // added for version 2.1.7
        if(settings.hasOwnProperty('helpDM')) {
            newSettings = settings.helpDM;
        }

        return newSettings;
    },

    convertPushTokenToArray: function (pushToken) {
        var returnArray = pushToken;
        if(!Array.isArray(pushToken)) {
            // Convert to array
            returnArray = [pushToken];
        }
        return returnArray;
    },

    getGuildSettingsFromRecord: function (dbRecord) {
        let newSettings = Object.assign({}, this.newGuildSettings());
        return getSettingsFromRecord(dbRecord, newSettings);
    },

    getUserSettingsFromRecord: function (dbRecord) {
        let newSettings = Object.assign({}, this.newUserSettings());
        return getSettingsFromRecord(dbRecord, newSettings);
    },

    getUserGuildSettingsFromRecord: function (dbRecord) {
        let newSettings = Object.assign({}, this.newUserSettings());
        return getSettingsFromRecord(dbRecord, newSettings);
    },

    /**
     * Adds a given pushToken to the settings.  Takes the array of push tokens from the settings,
     * creating an array if it does not already exist, and adds the given push token to it.
     * If the pushToken in the settings is a string, it will add this and the new token to the new array,
     * to preserve compatibility with version 1.3., which stored only one pushToken as a string.
     * @param {Object} settings 
     * @param {string} pushToken 
     */
    addPushTokenToSettings: function (settings, pushToken) {
        if(settings) {
            // Compatibility with v1.3.2 - previously only one token was stored, whereas now it is an array
            settings.pushToken = this.convertPushTokenToArray(settings.pushToken);
            settings.pushToken = this.addPushTokenToArray(settings.pushToken, pushToken);
        } else {
            throw 'addPushTokenToSettings: error, settings object is null.';
        }
        return settings;
    },

    /**
     * Adds a given pushToken string to the pushTokens array.
     * @param {Array} pushTokens 
     * @param {string} pushToken 
     */
    addPushTokenToArray: function (pushTokens, pushToken) {
        if(!pushTokens) {
            throw 'addPushTokenToArray: pushTokens parameter was null!'
        }
        if(pushTokens && !Array.isArray(pushTokens)) {
            throw 'addPushTokenToArray: pushTokens parameter was not an array!'
        }
        if(!pushToken) {
            throw 'addPushTokenToArray: pushToken was null!'
        }

        if(!this.checkIfTokenExists(pushToken, pushTokens)) {
            pushTokens.push(pushToken);
        }
        return pushTokens;
    },

    /**
     * Checks to see if the given token exists in the tokens array.
     * @param {string} tokenToCheck 
     * @param {Array} tokens 
     * @returns {boolean}
     */
    checkIfTokenExists: function (tokenToCheck, tokens) {
        var result = false;
        if(tokenToCheck && tokens) {
            for(let i=0; i < tokens.length; i++) {
                if(tokenToCheck.localeCompare(tokens[i]) == 0) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }
}