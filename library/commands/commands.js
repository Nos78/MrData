/*
 * @Author: BanderDragon 
 * @Date: 2020-09-08 20:02:01 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-28 20:58:44
 */

// Required modules
const Discord = require('discord.js');
const path = require('path');
const fs = require('fs');
const logger = require('winston');
const process = require('process');

// MrData configuration
const config = require('../../config.json');

// Module constants
const commandsModulePath = config.commandsModule; // Command module path is relative to the app root

module.exports = {
    /**
     * Configure all the commands - read the commands directory and place into the commands collection.
     * @param {Client} - the discord client object
     * @returns {Collection} of commands
     */
    commandsModuleAbsPath: function () {
        return path.resolve(process.cwd(), commandsModulePath);
    },

    initialiseCommands: function (client) {
        // get absolute module path
        const commandsModuleAbsPath = path.resolve(process.cwd(), commandsModulePath);

        // Initialise the collection
        client.commands = new Discord.Collection();
        // Read all the .js files from the commands module directory
        const commandFiles = fs.readdirSync(commandsModuleAbsPath).filter(file => file.endsWith('.js'));

        // Configure all the commands: require each
        // command and place into the commands collection
        for (const file of commandFiles) {
            const command = require(`${commandsModuleAbsPath}/${file}`);
            // set a new item in the Collection
            // with the key as the command name
            // and the value as the exported module
            client.commands.set(command.name, command);
        }

        return client.commands;
    },

    initialiseCooldowns: function () {

    },

    reloadCommand: function (cmdName, client) {
        var result = false;
        try {
            var cmdFile = `${path.join(this.commandsModuleAbsPath(), cmdName + '.js')}`;
            if(fs.existsSync(cmdFile)) {
                result = client.commands.delete(cmdName);
                delete require.cache[require.resolve(cmdFile)];
                var cmd = require(cmdFile);
                var templates = global.library.Config.getHelpTextParameters(client);
                cmd.description = this.resolveCommandDescription(cmd, templates);
                result = client.commands.set(cmdName, cmd);
            } else {
                return false;
            }
        } catch (err) {
            logger.error(`Could not reload command ${cmdName}, error ${JSON.stringify(err)}`);
            if(err.stack.includes("SyntaxError")) {
                var stackLines = err.stack.split('\n');
                var stackString = stackLines[0];
                for(var i=1; i < 5; i++) {
                    if(stackLines[i]) {
                        stackString += '\n' + stackLines[i];
                    }
                }
                throw `${cmdName}.js contains a syntax error and could not be reloaded:\n${stackString}`;
            }
            result = false;
        }
        return result;
    },

    removeCommand: function (cmdName, client) {
        var returnValue = "";
        try {
            var cmdFile = `${path.join(this.commandsModuleAbsPath(), cmdName + '.js')}`;
            if(!fs.existsSync(cmdFile)) {
                returnValue = `The file ${cmdName}.js does not exist. `;
            }
            var result = client.commands.delete(cmdName);
            if(result) {
                returnValue = true;
            } else {
                returnValue += `The command ${cmdName} could not be removed from my cache. `
            }
            delete require.cache[require.resolve(cmdFile)];
        } catch (err) {
            logger.error(`Could not reload command ${cmdName}, error ${JSON.stringify(err)}`);
            returnValue += `Error: ${err.code}`
        }
        return returnValue;
    },

    resolveCommandDescriptions: function(client) {
        var templates = global.library.Config.getHelpTextParameters(client);
        client.commands.forEach(function(command) {
            command.description = this.resolveCommandDescription(command, templates);
        }.bind(this));
    },

    resolveCommandDescription: function(command, templates) {
        templates.forEach(function(template) {
            command.description = command.description.replace(template.name, template.value);
        });
        return command.description;
    },

    /**
     * Get the named command from the commands array stored in the client
     * @param {string} commandName the name of the command being looked up
     * @param {Object} client 
     */
    getCommand: function(commandName, client) {
        // Get the specified command from the client
        const cmd = client.commands.get(commandName) ||
            client.commands.find(command => command.aliases && command.aliases.includes(commandName));
        return cmd;
    },

    /**
     * outputs the various parts of the command help text into an array. The array is passed into the function,
     * and the parts of the help text are pushing into this array. The function returns true if the array was
     * modified.
     * @param {string} command 
     * @param {string} prefix 
     * @param {Array} data
     * @returns {boolean} whether the array was modified.
     */
    commandHelp: function(command, prefix, data, client) {
        var returnValue = false;
        if(command) {
            data.push(`**Name:** ${command.name}`);

            if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
            if (command.description) data.push(`**Description:** ${command.description}`);
            if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

            if(command.channel) {
                data.push(`**Channel:** ${command.channel} - if this channel exists on your server, ${library.Config.botName(client)} will output the ranking table here.`);
            }
            if(command.category) {
                data.push(`**Category:** ${command.category}`);
            }
            if(command.version) {
                data.push(`**Version:** v${command.version}`);
            }

            data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
            returnValue = true;
        } else {
            logger.error(`commandHelp: command was not specified.`)
        }
        return returnValue;
    }
}
