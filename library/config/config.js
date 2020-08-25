/*
 * @Author: BanderDragon 
 * @Date: 2020-08-25 21:10:12 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-08-26 00:01:53
 */
 
/* 
 * library/config/config.js
 * ========================
 * A library of functions related to the configuration of the bot.
 * 
 */

const logger = require('winston');
const config = require('../../config.json');

var fs = require('fs');
var userConfigPath = config.userConfigurationPath;
const userConfigExt = config.userConfigurationExt;

var path = require('path');

module.exports = {

    /**
     * Returns the applications absolute path
     */
    appPath: function() {
        return path.dirname(require.main.filename);
    },

    /**
     * returns the full path, prefixed with the application root directory
     * @param {string} relativePath 
     */
    absolutePath: function(relativePath) {
        // Check if a ~ has been specified (this is not required, but clearly signifies the path is relative)
        var firstChar = relativePath.charAt(0);
        if(firstChar == "~") {
            // Remove the ~
            relativePath = relativePath.substring(1);
        }
        // Normalise the path, so that we can run on any OS
        relativePath = path.normalize(relativePath);

        // Return the full path, prefixed with the application root directory
        return path.join(this.appPath(), relativePath);
    },

    /**
     * Returns the full path and filename of the user configuration file for the given guild.
     * - The file is not created, so it may not yet exist.
     * @param {string} gid 
     */
    userConfigFile: function(gid) {
        var fullPath = "";
        if(gid) {
            var filename = config.userConfigurationFilePrefix + gid + config.userConfigurationExtension;
            var relativePathAndFile = path.join(config.userConfigurationPath, filename);
            fullPath = this.absolutePath(relativePathAndFile);
        } else {
            throw "userConfigFile: A null guild Id was passed."
        }

        return fullPath;
    },
    
    /*
    * The following are wrappers for storing and loading the 
    * user-defined config files - the user-defined config files allow
    * configuration to be customised on a per-guild basis.
    *
    * These functions wrap the config save/load functionality so that
    * the storage medium can be changed at a later date without requiring
    * massive code changes. If the API remains static, we can switch from
    * a file storage system to a database with relative ease.
    */
    serializeConfigObjToString: function(gid, configString, client) {

    },

    parseConfigStringToObj: function(gid, configString, client) { 
        var returnObj;
        try {
            returnObj = JSON.parse(configString);
        } catch (e) {
            logger.error(`Unable to parse config string - exception ${e.name}`)
        }
    },
    
    exportConfig: function (client) {

    },

    importConfig: function (client) {

    },

    exportGuildConfig: function (gid, client) {

    },

    importGuildConfig: function (gid, client) {

    }
}