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


//const SQLite = require("better-sqlite3");
//const db = new SQLite('./scores.sqlite');
//const pgp = require('pg-promise')(/*options*/);
//const db = pgp(config.db);

const db = require('./db');


// Set up the logger for debug/info
const logger = require('winston');
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});

logger.level = 'debug';


// Initialize Discord Bot
// token needs to be added to config.json
const bot = new Discord.Client({
 token: config.token,
 autorun: true
});

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
  logger.info(`db : ${db}`);
  logger.info(`scores : ${db.scores}`);
  db.scores.exists()
    .then(data => {
      console.log('DATA:', data.rows[0].exists);
    });

  /*catch (err) {
    logger.debug(`Error querying DB... error is ${err.name}`);
    if(err.name == "TypeError") {
      // Database does not exist, lets create it...
        logger.debug(`No database score table found!  Creating...`);
        db.scores.create();
        logger.debug(`Database configured.`);
    }
  }*/
});

// Start the client!
bot.login(config.token);
