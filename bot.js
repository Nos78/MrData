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
//const sql = new SQLite('./scores.sqlite');
const pgp = require('pg-promise')(/*options*/)
const sql = pgp('postgres://username:password@host:port/database')

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
$bot.on("ready", () => {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.user.username + ' - (' + bot.user.id + ')');
  // Update the bot activity text to reflect the connections status
  bot.user.setActivity(`${bot.guilds.size} guilds | ${config.prefix}datahelp`, { type: 'WATCHING'});
  logger.info(`MrData Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`);

  // We want to ensure our table is created when the bot comes online
  // and configure them if they don't exist
  const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
  if (!table['count(*)']) {
    logger.debug(`No database score table found!  Creating...`);
    // If the table isn't there, create it and setup the database correctly.
    sql.prepare("CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, power_destroyed INTEGER, resources_raided INTEGER);").run();
    // Ensure that the "id" row is always unique and indexed.
    sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();
    sql.pragma("synchronous = 1");
    sql.pragma("journal_mode = wal");
    logger.debug(`Database configured.`)
  }

  // And then we have two prepared statements to get and set the score data.
  bot.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
  bot.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, power_destroyed, resources_raided) VALUES (@id, @user, @guild, @power_destroyed, @resources_raided);");
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
  const cmd = args.shift().toLowerCase();
  const sender = message.author;
  const senderID = message.author.id;

  logger.debug(`${sender} ${cmd}`);

  switch(cmd) {
    // !ping
    case 'ping':
      // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
      // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
      const m = await message.channel.send("Ping?");
      m.edit(`Pong! ${sender} Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
    break;

    case 'datahelp':
      bot.sendMessage({
        to: message.channel,
        message: '`!ping           : see if I am awake\n' +
                  '!datahelp         : self explanatory!\n' +
                  '\n' +
                  '!powerdestroyed : see the powerdestroyed league table (alias = !pd).\n' +
                  '!powerdestroyed <number> : set the level of your power destroyed to the <number> you specify.\n' +
                  '!powerdestroyed <name> : see the power destroyed of <name>.\n' +
                  '\n' +
                  '!resourcesraided : see the resourcesraided league table (alias = !rr).\n' +
                  '!resourcesraided <number> : set the level of your resourcesraided to the <number> you specify.\n' +
                  '!resourcesraided <name> : see the resourcesraided of <name>.\n' +
                  ''
      });
    break;

    // Just add any case commands if you want to..
    case 'powerdestroyed':
    case 'pd':
      let score = client.getScore.get(message.author.id, message.guild.id);
      if (!score) {
        score = {
          id: `${message.guild.id}-${message.author.id}`,
          user: message.author.id,
          guild: message.guild.id,
          power_destroyed: 0,
          resources_raided: 0
        }
      }
      if(args.length > 0) {
        logger.info(`Args detected`);
        if(!isNaN(args[0])) {
          // Second arguement is a number, update the score to this value
          score.power_destroyed = args[0];
          bot.setScore.run(score);

          message.channel.send({embed: {
              color: 3447003,
              description: `Thank you, ${sender}, your power destroyed is set to ${args[0]}`
          }});
        } else {
          let member = message.guild.members.get(args[0]);
          if(member) {
            let score = client.getScore.get(member.id, message.guild.id);
            message.channel.send({embed: {
              color: 3447003,
              description: `${args[0]} power destroyed is ${score.power_destroyed}`
            }});
          } else {
            message.channel.send({embed: {
              color: 3447003,
              description: `${sender}, please use \`!pd abc\`, where abc is a number or an actual person!}`
            }});
          }
        }
      } else {
        const top10 = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY power_destroyed DESC LIMIT 10;").all(message.guild.id);

        // Now shake it and show it! (as a nice embed, too!)
        const embed = new Discord.RichEmbed()
          .setTitle("Power Destroyed Leaderboard")
          .setAuthor(bot.user.username, bot.user.avatarURL)
          .setDescription("Our top 10 power destroyed leaders!")
          .setColor(0x00AE86);

        for(const data of top10) {
          embed.addField(bot.users.get(data.user).tag, `${data.power_destroyed}`);
        }
        embed.addField(`${sender}, your power destroyed is ${score.power_destroyed}`)
        return message.channel.send({embed});
      }
    break;
  }
});

// Start the client!
bot.login(config.token);
