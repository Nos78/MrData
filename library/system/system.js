/*
 * @Author: BanderDragon 
 * @Date: 2020-08-26 21:18:46 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-04 22:46:26
 */
const logger = require('winston');
const config = require('../../config.json');
const Config = require('../config/config.js');
const Settings = require('../settings/settings.js');
const db = require('../../db');

module.exports = {
    savePrefix: async function(guildId, prefix) {
        if(guildId && guildId != 'null') {
            let settings = await this.getGuildSettings(guildId)
            if(settings) {
                settings.prefix = prefix;
                return await db.guildSettings.upsert(guildId, settings).catch(err => {console.log(`${err}`)});
            } else {
                return null;
            }
        }
    },

    getPrefix: async function(guildId) {
        var prefix = await this.getPrefixFromDb(guildId);
        return prefix;
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
