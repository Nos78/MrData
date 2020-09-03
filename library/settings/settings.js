/*
 * @Author: BanderDragon 
 * @Date: 2020-08-25 21:10:12 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-03 23:01:25
 */

const logger = require('winston');
const config = require('../../config.json');
const helper = require('../helper/helper.js');

module.exports = {
    /**
     * Create an initialise a new empty settings object
     * with all the required named fields pre-defined.
     */
    newSettings: function () {
        // From version v2.0.1, pushToken became an array
        // The name is therefore kept, so as not to break the database
        return {
            "pushToken": []
        }
    },

    convertPushTokenToArray: function (pushToken) {
        var returnArray = pushToken;
        if(!Array.isArray(pushToken)) {
            // Convert to array
            var token = pushToken;
            returnArray = [pushToken];
        }
        return returnArray;
    },

    getSettingsFromRecord: function (dbRecord) {
        let settings = this.newSettings();
        if(dbRecord) {
            if(dbRecord.settings) {
                settings = dbRecord.settings;
            }
        }
        return settings;
    },

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