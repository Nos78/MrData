/*
 * @Author: BanderDragon 
 * @Date: 2020-08-25 21:10:12 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-02 22:57:20
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
        return {
            "pushTokens": []
        }
    },

    getSettingsFromRecord(dbRecord) {
        let settings = this.newSettings();
        if(dbRecord) {
            if(dbRecord.settings) {
                settings = dbRecord.settings;
            }
        }
        return settings;
    },

    addPushTokenToSettings(settings, pushToken) {
        if(settings) {
            settings.pushTokens.push(pushToken);
        } else {
            throw 'addPushTokenToSettings: error, settings object is null.';
        }
        return settings;
    }
}