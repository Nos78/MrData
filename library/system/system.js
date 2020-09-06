/*
 * @Author: BanderDragon 
 * @Date: 2020-08-26 21:18:46 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-03 23:41:11
 */
const logger = require('winston');
const config = require('../../config.json');
const Config = require('../config/config.js');
const Settings = require('../settings/settings.js');
const db = require('../../db');

module.exports = {
    savePrefix(guildId, prefix) {
        var settings = this.getGuildSettings(guildId);
        if(settings) {
            settings.prefix = prefix;
        }
        db.guildSettings.upsert(guildId, settings);
    },

    getPrefix(guildId) {
        return this.getPrefixFromDb(guildId);
    },

    getPrefixFromDb: function(guildId) {
        var prefix = Config.getPrefix();
        var settings = this.getGuildSettings(guildId);
        if(settings) {
            if(settings.prefix) {
                prefix = settings.prefix;
            }
        }
        return prefix;
    },

    getGuildSettings: function(guildId) {
        var settings = null;
        if(guildId && guildId != 'null') {
            db.guildSettings.findGuildSettingsById(guildId)
                .then(result => {
                    return Settings.getGuildSettingsFromRecord(result);
                });
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
