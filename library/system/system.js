/*
 * @Author: BanderDragon 
 * @Date: 2020-08-26 21:18:46 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-09 01:39:49
 */
const logger = require('winston');
const config = require('../../config.json');
const Config = require('../config/config.js');
const Settings = require('../settings/settings.js');
const db = require('../../db');

module.exports = {

    /**
     * Save the named parameter to the settings, and commit the settings to the database.
     * If the discord client is passed, the settings will be taken from the cache instead of
     * the database, and the new settings will be cached to the client AND committed to the database.
     * @param {string} guildId 
     * @param {string} parameterName 
     * @param {any} parameterValue 
     * @param {Client} client, defaults to null
     * @returns {Object} settings
     */
    saveParameter: async function(guildId, parameterName, parameterValue, client = null) {
        var settings = null;

        // If the client is available, get settings from client
        if(client) {
            settings = client.guildSettings[`${guildId}`];
        } else {
            settings = await this.getGuildSettings(guildId);
        }

        // assign the new value to the named parameter
        settings[`${parameterName}`] = parameterValue;
        settings.modified = true;
        
        // save the settings to the client (cache them)
        if(client) {
            client.guildSettings[`${guildId}`] = settings;
             settings[`${parameterName}`] = parameterValue;
        }

        // Update the database with the new settings (async, don't need return value)
        this.saveGuildSettings(guildId, client.guildSettings)
            .then(result => {
                logger.info(`Saved settings for ${guildId} to database, result: ${JSON.stringify(result)}`)
            });

        // return the settings
        return settings;
    },

    /**
     * Gets the named parameter from the guild settings.  If the discord client
     * is passed, the cached settings will be used, otherwise the database will
     * be accessed, and then cached in the client.
     * @param {string} guildId 
     * @param {string} parameterName 
     * @param {Client} client, default is null
     * @returns {any} the parameter value
     */
    getParameter: async function(guildId, parameterName, client = null) {
        if(client) {
            return client.guildSettings[`${guildId}`][`${parameterName}`];
        } else {
            var result = await this.getParameterFromDb(guildId, parameterName);
            return result;
        }
    },

    savePrefix: async function(guildId, prefix, client = null) {
        if(guildId && guildId != 'null') {
            var settings = null;
            if (client) {
                settings = client.guildSettings[`${guildId}`];
            } else {
                settings = await this.getGuildSettings(guildId);
            }
            if(settings) {
                settings.prefix = prefix;
                settings.modified = false;
                if(client) {
                    client.guildSettings[`${guildId}`] = settings;
                }
                return await db.guildSettings.upsert(guildId, settings).catch(err => {console.log(`${err}`)});
            } else {
                return null;
            }
        }
    },

    getPrefix: async function(guildId, client) {
        var prefix = null;
        if(guildId && guildId != 'null') {
            if(client) {
                prefix = client.guildSettings[`${guildId}`];
            }
            if (!prefix) {
                prefix = await this.getPrefixFromDb(guildId);
            }
        } else {
            prefix = config.prefix;
        }
        return prefix;
    },

    getParameterFromDb: async function(guildId, parameterName) {
        var parameterValue = null;
        var settings = await this.getGuildSettings(guildId);
        if(settings) {
            if(settings[`${parameterName}`]) {
                parameterValue = settings[`${parameterName}`];
            }
        }
        return parameterValue;
    },

    getPrefixFromDb: async function(guildId) {
        var prefix = await Config.getPrefix();
        var settings = await this.getGuildSettings(guildId);
        if(settings) {
            if(settings.prefix) {
                prefix = settings.prefix;
            }
        }
        return prefix;
    },

    /**
     * Commit the settings json object to the database
     * @param {string} guildId 
     * @param {Object} settings 
     */
    saveGuildSettings: function(guildId, settings) {
        var result = null;
        if(guildId && guildId != 'null') {
            if(settings) {
                settings.modified = false;
                result = db.guildSettings.upsert(guildId, settings)
                    .catch(err => {
                        logger.error(`${err}`)
                    });
            }
        }
        return result;
    },

    /**
     * Get the settings json object from the database
     * @param {string} guildId
     * @returns {Object} settings
     */
    getGuildSettings: async function(guildId) {
        var settings = null;
        if(guildId && guildId != 'null') {
            let result = await db.guildSettings.findGuildSettingsById(guildId)
            settings = await Settings.getGuildSettingsFromRecord(result);
        }
        return settings;
    },

    getUserGuildSettings: function(userId, guildId) {
        var settings = null;
        if(userId && userId != 'null' && guildId && guildId != 'null') {
            db.userGuildSettings.findGuildSettingsById(userId, guildId)
                .then(result => {
                    return Settings.getUserGuildSettingsFromRecord(result);
                });
        }
        return settings;
    }
}
