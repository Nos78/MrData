/*
 * @Author: BanderDragon 
 * @Date: 2020-08-25 21:10:12 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-28 20:55:09
 */
 
/* 
 * library/config/config.js
 * ========================
 * A library of functions related to the configuration of the bot.
 * 
 */

const logger = require('winston');
const config = require('../../config.json');
const pkg = require('../../package.json');
const packageLock = require('../../package-lock.json');
const process = require('process');

var fs = require('fs');

var path = require('path');

module.exports = {

    /**
     * Gets my command prefix from the config
     */
    getPrefix: function() {
        return config.prefix;
    },

    /**
     * Populates the template string, where key is the TEMPLATE name to be replaced and
     * value is the data to replace the template with.  This allows templates to be
     * put into the help text, and they will be replaced with data during runtime.  This
     * allows the help text to show data that is not available until the bot is running,
     * such as the bot's discord name (which is not available until the bot connects to
     * a discord server).
     * @param {string} key the name of the templated string to be replaced with the value.
     * @param {string} value the data to be inserted, replacing the template name.
     * @param {string} defaultValue optional data to be inserted if the value is null.
     */
    populateHelpTextParameter: function(key, value, defaultValue = '') {
        var parameter = Object.assign({}, config.helpTextParamsTemplate);
        parameter.name = key;
        if (value != null) {
            parameter.value = value;
        } else {
            parameter.value = defaultValue;
        }

        return parameter;
    },

    /**
     * Gets an array of template parameters, calling this.populateHelpTextParameter
     * with every template.
     * @param {Client} client 
     * @returns {array} an array of helpTextParams
     */
    getHelpTextParameters: function(client, guild = null) {
        var parameters = [];
        parameters.push(this.populateHelpTextParameter("@BOTNAME", this.botName(client)));
        if(guild) {
            parameters.push(this.populateHelpTextParameter("@SERVERNAME", global.library.Discord.getGuildName(guild)));
            parameters.push(this.populateHelpTextParameter("@GUILDPREFIX", global.library.System.getPrefix(guild.id, client), config.prefix));
        } else {
            parameters.push(this.populateHelpTextParameter("@GUILDPREFIX", config.prefix));
        }
        return parameters;
    },

    /**
     * A specific version that utilise the above helpTextParameter commands to replace occurrences
     * of the templated parameters in a given string. This function takes as an additional parameter
     * the message that initiated the command.
     * @param {*} text 
     * @param {*} message 
     */
    replaceHelpTextParameters: function(text, client) {
        var templates = global.library.Config.getHelpTextParameters(client);
        var returnText = text;
        templates.forEach(function(template) {
            returnText += returnText.replace(template.name, template.value);
        });
        return returnText;
    },

    resolveTemplate(templatedText, templates) {
        for(var i = 0; i < templates.length; i++) {
            templatedText = templatedText.replace(templates[i].name, templates[i].value);
        }
        return templatedText;
    },

    replaceJsonTextParameters: function(json, client, guild = null) {
        var newJson = {};
        var templates = this.getHelpTextParameters(client, guild);
        var jsonKeys = Object.keys(json);
        var jsonLength = jsonKeys.length;
        for(var i = 0; i < jsonLength; i++) {
            var itemName = jsonKeys[i];
            itemName = this.resolveTemplate(itemName, templates);

            var itemValue = null;
            
            switch(global.library.Format.typeOf(json[jsonKeys[i]])) {
                case 'object':
                    itemValue = Object.assign({}, json[jsonKeys[i]]);
                    itemValue = this.replaceJsonTextParameters(itemValue, client, guild);
                    newJson[itemName] = itemValue;
                    break;

                case 'string':
                    itemValue = json[jsonKeys[i]];
                    itemValue = this.resolveTemplate(itemValue, templates);
                    newJson[itemName] = itemValue;
                    break;
                    
                default:
                    itemValue = json[jsonKeys[i]];
                    itemValue = this.resolveTemplate(itemValue, templates);
                    newJson[itemName] = itemValue;
            }
        }
        return newJson;
    },

    /**
     * Returns the name of the package, taken from the package.json
     * @returns {string} package name
     */
    packageName: function() {
        return pkg.name;
    },

    /**
     * get the package version number from package.json
     * @returns {string}
     */
    packageVersion: function() {
        return pkg.version;
    },
    
    /**
     * get the licence from the package.json file
     * @returns {string}
     */
    packageLicense: function() {
        return pkg.license;
    },

    /**
     * get the offical name of the node installation
     * @returns {string}
     */
    nodeName: function() {
        return process.release.name;
    },

    /**
     * get the version number of the installed version of node
     * @returns {string}
     */
    nodeVersion: function() {
        return process.version;
    },

    /**
     * gets the version number of the installed discord.js API
     * @returns {string}
     */
    discordJsVersion: function() {
        const discordKey = Object.keys(packageLock.dependencies).find(key => key.includes("discordjs"));
        return packageLock.dependencies[discordKey].version;
    },
    
    /**
     * Gets the discord name of the bot (each discord server can set its own nickname for the bot,
     * so we are not always guaranteed to be called MrData - we could even change this ourselves
     * using the discord API).
     * @param {*} client 
     * @returns {string}
     */
    botName: function(client) {
        var returnValue = "";
        if(client) {
            returnValue = client.user.username;
        } else {
            returnValue = this.packageName();
        }
        return returnValue;
    },

    botAvatar: function(client) {
        return client.user.avatarURL;
    },

    /**
     * Returns the applications absolute path
     * @returns {string}
     */
    appPath: function() {
        return path.dirname(require.main.filename);
    },

    /**
     * returns the full path, prefixed with the application root directory
     * @param {string} relativePath
     * @returns {string}
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
     * @returns {string}
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
    }
}
