/*
 * @Author: BanderDragon 
 * @Date: 2020-09-08 20:02:01 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-09 03:31:30
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
        try {
            var cmdFile = `${this.commandsModuleAbsPath()}/${cmdName}.js`;
            var result = client.commands.delete(cmdName);
            delete require.cache[require.resolve(cmdFile)];
            var cmd = require(cmdFile);
            var templates = global.library.Config.getHelpTextParameters(client);
            cmd.description = this.resolveCommandDescription(cmd, templates);
            return client.commands.set(cmdName, cmd);
        } catch (err) {
            logger.error(`Could not reload command ${cmdName}, error ${JSON.stringify(err)}`);
        }
    },

    resolveCommandDescriptions(client) {
        var templates = global.library.Config.getHelpTextParameters(client);
        client.commands.forEach(function(command) {
            command.description = this.resolveCommandDescription(command, templates);
        }.bind(this));
    },

    resolveCommandDescription(command, templates) {
        templates.forEach(function(template) {
            command.description = command.description.replace(template.name, template.value);
        });
        return command.description;
    }
}
