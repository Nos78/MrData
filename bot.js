/*
 * @Author: BanderDragon
 * @Date: 2020-08-25 02:54:40 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-08-26 08:09:12
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

// Set up the logger for debug/info
const logger = require('winston');

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


client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

//
// Configure all the commands,
// read commands directory and place
// into the commands collection
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

//
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
    var templates = library.Config.getHelpTextParameters(client);
    client.commands.forEach(function(command) {
        templates.forEach(function(template) {
            command.description = command.description.replace(template.name, template.value);
        })
    });
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

    if (!(message.content && message.content.startsWith(config.prefix))) {
      // Not prefixed, do not continue
      return;
    }

    // split up the message into the command word and any additional arguements
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
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
            reply += `\nThe proper usage would be: \`${config.prefix}${cmd.name} ${cmd.usage}\``;
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
