// ============================
// MrData bot.js
// ============================
// Created by BanderDragon#5699
// (c) 2019
// noscere1978@gmail.com
// ============================

// Configure the Discord bot client
const Discord = require('discord.js');
const config = require('./config.json');
const library = require('./library');
const db = require('./db');

const fs = require('fs');
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Set up the logger for debug/info
const logger = require('winston');
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});

logger.level = 'none';

// Initialize Discord Bot
// token needs to be added to config.json
const bot = new Discord.Client({
 token: config.token,
 autorun: true
});

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

//
// Set up the callback functions
//
//
// bot.on ready - used when the bot comes online
//
bot.on("ready", () => {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.user.username + ' - (' + bot.user.id + ')');
  // Update the bot activity text to reflect the connections status
  bot.user.setActivity(`${bot.guilds.size} guilds | ${config.prefix}datahelp`, { type: 'WATCHING'});
  logger.info(`MrData Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`);

  // We want to ensure our table is created when the bot comes online
  // and configure them if they don't exist
  db.scores.exists()
    .then(data => {
      if(data.rows[0].exists == false) {
        // Database does not exist, lets create it...
        logger.debug(`No database score table found!  Creating...`);
        db.scores.create();
        logger.debug(`Database configured.`)
      }
    });
  });

//
// guildCreate & guildDelete
// These two events are triggered when the bot joins and leaves
// a guild server...
//
bot.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  logger.info(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  // Update the bot activity text to reflect the new stat
  bot.user.setActivity(`${bot.guilds.size} guilds | ${config.prefix}datahelp`, { type: 'WATCHING'});
});

bot.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  logger.info(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  // Update the bot activity text to reflect the new stat
  bot.user.setActivity(`${bot.guilds.size} guilds | ${config.prefix}datahelp`, { type: 'WATCHING'});
});

bot.on('message', async message => {
  // Ignore other bots!
  if(message.author.bot) return;

  // The bot should ignore any messages that are not commands
  // It will listen for messages that will start with the prefix
  // that is specified in config.prefix
  if(message.content.indexOf(config.prefix) !== 0) return;

  // split up the message into the command word and any additional arguements
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const cmdName = args.shift().toLowerCase();

  // get the specified command name
  const cmd = client.commands.get(cmdName)
    || client.commands.find(command => command.aliases && command.aliases.includes(cmdName));

  // If no command exists, simply exit
  if (!cmd) return;

  // Some commands are not meant to be executed inside DMs
  if (command.guildOnly && message.channel.type !== 'text') {
  	return message.reply('I cannot execute that command inside a direct message!');
  }

  // If the command requires arguments yet there are none, provide
  // the user with a correct explanation.
  if (cmd.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;
    if (cmd.usage) {
      reply += `\nThe proper usage would be: \`${config.prefix}${cmd.name} ${cmd.usage}\``;
    }
    return message.channel.send(reply);
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
  		const timeLeft = (expirationTime - now) / 1000;
  		return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
  	}
  }
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  // try to execute the command
  // and exit gracefully on error
  try {
     cmd.execute(message, args);
  } catch (error) {
    console.error(error);
	   message.reply('there was an error trying to execute that command!');
  }
});

// Start the client!
bot.login(process.env.BOT_TOKEN);
