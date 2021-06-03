/*
 * @Author: BanderDragon 
 * @Date: 2020-08-26 21:18:46 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-14 16:01:42
 */
const logger = require('winston');
const config = require('../../config.json');
const Config = require('../config/config.js');
const Settings = require('../settings/settings.js');
const db = require('../../db');

module.exports = {

    /**
     * Cache the entire settings Json object for a given guild to the client guild settings cache
     * @param {string} guildId 
     * @param {Object} settings 
     * @param {Client} client 
     */
    cacheSettings: function(guildId, settings, client) {
        if(settings) {
            if(client) {
                if (guildId && guildId != 'null') {
                    // Mark the settings as modified, so they can be committed to the database later
                    settings.modified = true;
                    // Take a copy of the settings, as objects are passed by ref.
                    client.myGuildSettings[`${guildId}`] = Object.assign({}, settings);
                    // And return this object
                    return client.myGuildSettings[`${guildId}`];
                } else {
                    throw `cacheSettings: guildId is null caching settings to guild ${guildId}`;
                }
            } else {
                throw `cacheSettings: client is null caching settings to guild ${guildId}`;
            }
        } else {
            throw `cacheSettings: settings is null caching to guild ${guildId}`;
        }
    },

    /**
     * Store a parameter in the cached copy of the settings Json object for a given guild
     * @param {string} guildId 
     * @param {string} parameterName 
     * @param {any} parameterValue 
     * @param {Client} client 
     */
    cacheParameter: function(guildId, parameterName, parameterValue, client) {
        if(client) {
            if (guildId && guildId != 'null') {
                // objects are assigned by reference, no need to assign back to client
                var settings = client.myGuildSettings[`${guildId}`];
                // assign the new value to the named parameter
                settings[`${parameterName}`] = parameterValue;
                settings.modified = true;
                return settings;
            } else {
                throw `cacheParameter: guildId is null caching parameter ${parameterName} to guild ${guildId}`;
            }
        } else {
            throw `cacheParameter: client is null caching parameter ${parameterName} to guild ${guildId}`;
        }
    },
    
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
        var returnValue = null;

        // If the client is available, cache the parameter to client
        if(client) {
            settings = this.cacheParameter(guildId, parameterName, parameterValue, client);
        } else {
            settings = this.getGuildSettings(guildId);
            settings[`${parameterName}`] = parameterValue;
            settings.modified = true;
        }

        // If the settings were successfully modified, commit them to the Db immediately
        if(settings.modified) {
            // Update the database with the new settings (async, don't need return value)
            returnValue = this.saveGuildSettings(guildId, settings)
                .then(result => {
                    logger.info(`Saved settings for ${guildId} to database, result: ${JSON.stringify(result)}`);
                    return result;
                })
                .catch(error => {
                    logger.error(`System.saveParameter: An error occurred committing the settings (typeof ${global.library.Format.typeOf(settings)}) to the database for guild ${guildId}. Error: ${JSON.stringify(error)}`)
                });
        }
        
        // return the returnValue
        return returnValue;
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
            return this.getCachedParameter(guildId, parameterName, client);
        } else {
            var result = await this.getParameterFromDb(guildId, parameterName);
            return result;
        }
    },

    /**
     * Gets a property from the settings cache without querying the database
     * @param {string} guildId 
     * @param {string} parameterName 
     * @param {Client} client 
     * @returns {any} the property value
     */
    getCachedParameter: function(guildId, parameterName, client) {
        return client.myGuildSettings[`${guildId}`][`${parameterName}`];
    },

    /**
     * Saves the command prefix to the given guild settings record. Caches the parameter to
     * the client (if passed) and immediately commits the change to the database.
     * @param {string} guildId 
     * @param {string} prefix 
     * @param {Client} client 
     * @returns {Object} settings
     */
    savePrefix: async function(guildId, prefix, client = null) {
        var result = null;
        if(guildId && guildId != 'null') {

            result = this.saveParameter(guildId, 'prefix', prefix, client)
                .then(res => {
                    if(!res) {
                        throw `savePrefix: call to this.saveParameter() - unexpected db return value ${JSON.stringify(res)}.`;
                    }
                })
                .catch(err => {
                    logger.error(`System.savePrefix: an error occurred committing the prefix (${prefix}) to the database for guild ${guildId}. Client present: ${!(client == null)}, Error: ${JSON.stringify(err)}`);
                })
        }
        return result;
    },

    /**
     * Gets the current command prefix for MrData from the guild settings - this always
     * returns a value, defaulting to the value in config.prefix
     * @param {string} guildId 
     * @param {*} client 
     * @returns {string} command prefix
     */
    getPrefix: async function(guildId, client) {
        var prefix = null;
        if(guildId && guildId != 'null') {
            prefix = this.getParameter(guildId, 'prefix', client);
            if (!prefix) {
                prefix = await this.getPrefixFromDb(guildId);
            }
        } else {
            prefix = config.prefix;
        }
        return prefix;
    },

    /**
     * Gets the value from the named parameter for a key/value pair, taken
     * from the settings objectfor a given guild id record of the database.
     * @param {string} guildId 
     * @param {string} parameterName 
     * @returns {any} parameter value.
     */
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

    /**
     * Gets the command prefix from the settings object for a given guild id record in the database.
     * @param {string} guildId 
     */
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
     * Commit the settings object for a given guild id to the database
     * @param {string} guildId 
     * @param {Object} settings 
     * @returns {Promise<result>} the row that has been upserted (added or inserted).
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
            } else {
                throw `saveGuildSettings: settings object was null saving to ${guildId} record.`;
            }
        } else {
            throw `saveGuildSettings: guildId was null saving settings for guild ${guildId} to database.`;
        }
        return result;
    },

    /**
     * Get the settings object from the database for a given guild id.
     * @param {string} guildId
     * @returns {Object} settings
     */
    getGuildSettingsFromDb: async function(guildId) {
        var settings = null;
        if(guildId && guildId != 'null') {
            let result = await db.guildSettings.findGuildSettingsById(guildId);
            settings = await Settings.getGuildSettingsFromRecord(result);
        }
        return settings;
    },

    /**
     * Gets the settings object from the cache, or Db if not cached.
     * @param {string} guildId 
     * @param {Client} client 
     * @returns {Object} settings Json
     */
    getGuildSettings: async function(guildId, client = null) {
        var returnValue = null;
        if(guildId && guildId != 'null') {
            if(client) {
                if(client.myGuildSettings[`${guildId}`]) {
                    returnValue = client.myGuildSettings[`${guildId}`];
                }
            }

            if(!returnValue) {
                returnValue = this.getGuildSettingsFromDb(guildId);
            }
        }
        return returnValue;
    },

    /**
     * Gets the user-guild settings object for a given user and guild id primary key pair.
     * @todo function is still in development
     * @param {*} userId 
     * @param {*} guildId 
     */
    getUserGuildSettings: function(userId, guildId) {
        var settings = null;
        if(userId && userId != 'null' && guildId && guildId != 'null') {
            db.userGuildSettings.findGuildSettingsById(userId, guildId)
                .then(result => {
                    return Settings.getUserGuildSettingsFromRecord(result);
                });
        }
        return settings;
    },


}
