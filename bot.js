/*
 * @Author: BanderDragon
 * @Date: 2019-03-10 02:54:40 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-13 19:21:58
 */

// Configure the Discord bot client
const Discord = require('discord.js');
const config = require('./config.json');
const configSecret = require('./config-secret.json');
const db = require('./db');
const fs = require('fs');
const cmdLog = './cmdExec.log';

// Set up the library functions
const library = require('./library');

// Set up global access so that all modules can access the library
// TODO - there has to be a better way of doing this:
// - maybe move library into the client? (but this doesn't work for functions who cannot access, unless the client is passed)
// Back-compatibility - leave definition of library variable above, and in other areas of the code.
// The main problem being encountered is when one library module requires functions from other library modules.... I have been
// referencing them individually, as doing require('../../library') is not working
global.library = library;

// Set up the logger for debug/info
const logger = require('winston');
const { WebPush } = require('./web-push/web-push');
global.webPushApp = new WebPush();
global.webPushApp.initialise();

//anotherWebApp.sendTest();

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});

logger.level = config.debugLevel;

// Initialize Discord Bot
// token needs to be added to config.json
const client = new Discord.Client({
    token: config.token,
    autorun: true
});

// Initialise the commands module
client.commands = library.Commands.initialiseCommands(client);

// initialise the cooldowns collection
const cooldowns = new Discord.Collection();

client.ignoreBots = true;
client.ignoreMyself = true;
client.myselfCount = 0;
client.myselfMaximum = 0;
var me = false;

try {
    client.deleteCallingCommand = config.deleteCallingCommand
} catch (error) {
    logger.info(`Failed to access config.deleteCallingCommand; update your config.json with this member.  Error: ${JSON.stringify(error)}`);
    client.deleteCallingCommand = false;
}

try {
    // Initialise the settings for individual servers - these
    // will be stored in the database, but a cached version in the client
    // would be much more efficient...
    client.guildSettings = [];
} catch (error) {
    logger.error(`Failed to initialise guild settings, ${JSON.stringify(error)}`);
}

try {
    var stream = fs.createWriteStream(cmdLog, {flags:'a'});
    client.cmdLogStream = stream;
    if(stream == null) {
        logger.info(`Unable to initialise file stream for cmdExec.log`);
    } else {
        stream.write(new Date().toISOString() + ` bot started`) + `/n`;
    }
} catch (error) {
    logger.info(`Unable to write ${cmdLog}`);
}

//
// Set up the callback functions
//
//
// bot.on ready - used when the bot comes online
//
client.on("ready", () => {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(client.user.username + ' - (' + client.user.id + ')');

    // Replace templated parameters in help text with real data
    library.Commands.resolveCommandDescriptions(client);

    // Update the bot activity text to reflect the connections status
    client.user.setActivity(`${client.guilds.size} guilds | ${config.prefix}datahelp`, { type: 'WATCHING' });
    logger.info(`${client.user.username} Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);

    /* We want to ensure our database is created when the bot comes online
     * and configure it if they don't exist...
     *
     * Create the users and guilds tables first, then the dependant tables...
     */

    db.users.exists()
        .then(data => {
            if (data.rows[0].exists == false) {
                // Database does not exist, lets create it...
                logger.debug(`No database users table found!  Creating...`);
                db.users.create();
                logger.debug(`Users configured.`)
            }
        });

    db.guilds.exists()
        .then(data => {
            if (data.rows[0].exists == false) {
                // Database does not exist, lets create it...
                logger.debug(`No database users table found!  Creating...`);
                db.guilds.create();
                logger.debug(`Guilds configured.`)
            }
        });

    db.scores.exists()
        .then(data => {
            if (data.rows[0].exists == false) {
                // Database does not exist, lets create it...
                logger.debug(`No database score table found!  Creating...`);
                db.scores.create();
                logger.debug(`Scores configured.`)
            }
        });

    db.userGlobalSettings.exists()
        .then(data => {
            if(data.rows[0].exists == false) {
                // Table does not exists, lets create it...
                logger.debug(`No userGlobalSettings table found!  Creating...`);
                db.userGlobalSettings.create();
                logger.debug(`userGlobalSettings configured.`)
            }
        });

    db.userGuildSettings.exists()
        .then(data => {
            if(data.rows[0].exists == false) {
                // Table does not exists, lets create it...
                logger.debug(`No userGuildSettings table found!  Creating...`);
                db.userGuildSettings.create();
                logger.debug(`userGuildSettings configured.`)
            }
        });

    db.guildSettings.exists()
        .then(data => {
            if(data.rows[0].exists == false) {
                // Table does not exists, lets create it...
                logger.debug(`No guildSettings table found!  Creating...`);
                db.guildSettings.create();
                logger.debug(`guildSettings configured.`)
            }
        });
    /* Populate the database with the guilds we are online in. */
    //for (x = 0; x < client.guilds.size; x++) {
    client.guilds.forEach((guild) => {
        logger.info(`Adding ${guild.name}, id: ${guild.id} to the database`);
        db.guilds.add(guild.id).then((guild_record) => {
            if (guild_record == null) {
                logger.info(`Guild already exists.`);
            } else {
                logger.info(`Added id: ${guild_record.id} guild id: ${guild_record.guild_id} into the guilds table.`);
            }
        });

        /* Cache the settings for this guild - and upgrade them to the latest version if required */
        var settings = library.System.getGuildSettings(guild.id, client)
            .then(settings => {
                var oldVersion = settings.version;
                settings = library.Settings.upgradeGuildSettings(settings);
                var newVersion = settings.version;
                client.guildSettings[`${guild.id}`] = settings;
                if (settings.modified) {
                    library.System.saveGuildSettings(guild.id, settings)
                        .then(result => {
                            logger.info(`Upgraded settings JSON for ${guild.name}, ${guild.id}, result: ${!(result == null)}. Old version: ${oldVersion}, new version: ${newVersion}`);
                        });
                }
            });

    }); // end for

});

//
// guildCreate & guildDelete
// These two events are triggered when the bot joins and leaves
// a guild server...
//
client.on("guildCreate", guild => {
    // This event triggers when the bot joins a guild.
    logger.info(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);

    // Update the bot activity text to reflect the new stat
    client.user.setActivity(`${client.guilds.size} guilds | ${config.prefix}datahelp`, { type: 'WATCHING' });
    db.guilds.add(guild.id)
        .then(guild_record => {
            logger.info(`Added id: ${guild_record.id} guild id: ${guild_record.guild_id} into the guilds table. ${guild_record.count} records added.`);
        });
});

client.on("guildDelete", guild => {
    // this event triggers when the bot is removed from a guild.
    logger.info(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    // Update the bot activity text to reflect the new stat
    client.user.setActivity(`${client.guilds.size} guilds | ${config.prefix}datahelp`, { type: 'WATCHING' });
});

client.on('message', async message => {
    // Ignore other bots!
    if (client.user.id == message.author.id) {
        // I sent this message
        me = true;
        if (client.ignoreMyself) {
            return;
        } else {
            logger.debug(`Not ignoring myself for ${client.myselfCount + 1} command, a maximum of ${client.myselfMaximum}`)
        }
    } else {
        me = false;
        if (client.ignoreBots) {
            if (message.author.bot) {
                return;
            }
        }
    }

    // Settings should be cached in the client

    var prefix = library.Config.getPrefix();
    if (message.guild) {
        prefix = await library.System.getPrefix(message.guild.id);
    }
    if (!(message.content && message.content.startsWith(prefix))) {
        // Hack to ensure !showprefix works, regardless of prefix specified
        var found = false
        if (prefix != config.prefix) {
            if(!message.content.startsWith(config.prefix + 'showprefix')) {
                var prefixCmd = client.commands.get('showprefix');
                for(var i=0; i < prefixCmd.aliases.length; i++) {
                    if(message.content.startsWith(config.prefix + prefixCmd.aliases[i])) {
                        found = true;
                        break;
                    }
                }
            } else {
                found = true;
            }
            
            if(!found && !message.content.startsWith(config.prefix + 'datahelp')) {
                var helpCmd = client.commands.get('datahelp');
                for(let i=0; i < helpCmd.aliases.length; i++) {
                    if(message.content.startsWith(config.prefix + helpCmd.aliases[i])) {
                        found = true;
                        break;
                    }
                }
            } else {
                found = true;
            }

            if(found) {
                prefix = config.prefix;
            }
        }
        if(!found) {
            if(message.channel.type == 'dm') {
                // Messages sent in DM cannot use custom command prefix
                // so we must feedback this to the user
                return library.Helper.sendErrorMessage(`${message.author}, I cannot understand your request.  Please note, when sending commands to ${library.Config.botName(message.client)} via direct messages, you cannot use your server's custom command prefix.\n\nDuring direct messages you should use my default prefix, which is **${library.Config.getPrefix()}**\nFor example:  *${library.Config.getPrefix()}datahelp*`, message.channel);
            }
            // Not prefixed, do not continue
            return;
        }
    }

    // split up the message into the command word and any additional arguements
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmdName = args.shift().toLowerCase();

    // get the specified command name
    const cmd = client.commands.get(cmdName)
        || client.commands.find(command => command.aliases && command.aliases.includes(cmdName));

    // If no command exists, simply exit
    if (!cmd) return;

    // Some commands are not meant to be executed inside DMs
    if (cmd.guildOnly && message.channel.type !== 'text') {
        return message.reply('I cannot execute that command inside a direct message!');
    }

    // If the command requires arguments yet there are none, provide
    // the user with a correct explanation.
    if (cmd.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;
        if (cmd.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${cmd.name} ${cmd.usage}\``;
        }
        return library.Helper.sendErrorMessage(reply, message.channel);
    }

    // Check if a specified role is required
    if(cmd.role) {
        let allowedRole = message.guild.roles.find("name", cmd.role);
        if(!message.member.roles.has(allowedRole.id)) {
            return message.channel.send(`You cannot use this command, only members of *${cmd.role}* can use this command.`)
        }
    }

    // Check if a specified channel is required
    if(cmd.channel) {
        if(message.channel.name != cmd.channel) {
            return message.channel.send(`You can only use this command in the *${cmd.channel}* channel.`);
        }
    }

    // Check for cooldowns status
    if (!cooldowns.has(cmd.name)) {
        cooldowns.set(cmd.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(cmd.name);
    const cooldownAmount = (cmd.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            //const timeLeft = (expirationTime - now) / 1000;
            //return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${cmd.name}\` command.`);
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    // try to execute the command
    // and exit gracefully on error

    try {
        if (me) {
            client.myselfCount++;

            if (client.myselfCount == client.myselfMaximum) {
                client.ignoreMyself = true;
                client.myselfCount = 0;
                client.myselfMaximum = 0;
            }
        }

        if(client.cmdLogStream == null) {
            logger.info("No open logfile stream");
            client.cmdLogStream = fs.createWriteStream(cmdLog, {flags:'a'});
        }
        try {
            var nowDateTimeStr = new Date().toISOString();
            logger.debug(`${nowDateTimeStr} - Writing to log file...`);
            client.cmdLogStream.write(nowDateTimeStr + ':' + "\n");
            client.cmdLogStream.write("    " + `executing ${cmd.name}` + "\n");
            client.cmdLogStream.write("    " + `called by ${message.author.username}` + "\n\n");
        } catch (e) {
            logger.error(e);
        }

        cmd.execute(message, args);
        if (client.deleteCallingCommand) {
            message.delete;
        }
    } catch (error) {
        let errorJSON = library.Format.stringifyError(error);
        let stack = error.stack.toString();

        logger.error(errorJSON);
        //message.reply('there was an error trying to execute that command!');
        if(logger.level === 'silly' || logger.level === 'debug' || logger.level === 'error') {
            const embed = new Discord.RichEmbed()
                .setTitle(`${error.name} : Unexpected Error (${error.name}) in the bagging area`)
                .setAuthor(message.client.user.username, message.client.user.avatarURL)
                .setDescription(`An unexpected error occurred : ${error.message}`)
                .setColor(config.hostilestotaldamageColor);
            embed.addField("Stack trace:", `length: ${stack.length} characters`);
            for(let i = 0; i < Math.ceil(stack.length / 255); i++) {
                let start = i * 256;
                let end = start + 256;
                if (end > stack.length) {
                    end = stack.length;
                }
                embed.addField(`${stack.substring(start, end)}`, `${start}, ${end}`);
            }
            message.channel.send({ embed });
        }
    }
});

// Start the client!
//client.login(process.env.BOT_TOKEN);
client.login(configSecret.token);
