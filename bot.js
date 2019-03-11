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
const formatter = require('./format.js');

const db = require('./db');

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
  const cmd = args.shift().toLowerCase();
  const sender = message.author;
  const senderID = message.author.id;
  const guildID = message.guild.id;

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
      var score = [];
      db.scores.findByNameAndGuild(message.author.id, message.guild.id)
        .then (score => {
          if (score == null) {
            score = {
              uid: message.author.id,
              guild: message.guild.id,
              power_destroyed: 0,
            }
            logger.info(`Created score: ${score}`);
          }
          if(args.length > 0) {
            logger.info(`Args detected`);
            if(!isNaN(args[0])) {
              // Second argument is a number, update the score to this value
              score.power_destroyed = args[0];
              if(score.id == null) {
                db.scores.add(score)
                  .then(function(result) {
                    // notify the user it was successful
                    message.channel.send({embed: {
                      color: 3447003,
                      description: `Thank you, ${sender}, your power destroyed is set to ${args[0]}`
                    }});
                  })
              } else {
                db.scores.update(score)
                  .then(function(result) {
                    // notify the user it was successful
                    message.channel.send({embed: {
                      color: 3447003,
                      description: `Thank you, ${sender}, your power destroyed is set to ${args[0]}`
                    }});
                  })
                }
            } else {
              let member = message.guild.members.get(args[0]);
              if(member) {
                db.scores.findByNameAndGuild(member.id, message.guild.id)
                  .then (score => {
                    let desc = `Unable to find ${member} in my database.  They need to log their scores for you to view them!`;
                    if(score!=null) {
                      desc = `${args[0]} power destroyed is ${formatter.numberWithCommas(score.power_destroyed)}`
                    }
                    message.channel.send({embed: {
                      color: 3447003,
                      description: `${desc}`
                    }
                  });
                })
              } else {
                message.channel.send({embed: {
                  color: 3447003,
                  description: `${sender}, please use \`!pd abc\`, where abc is a number or an actual person!}`
                }});
              }
            }
          } else {
            db.manyOrNone("SELECT * FROM scores WHERE guild = $1 ORDER BY power_destroyed DESC LIMIT 10;", message.guild.id)
              .then(top10 => {
                const embed = new Discord.RichEmbed()
                  .setTitle("Power Destroyed Leaderboard")
                  .setAuthor(bot.user.username, bot.user.avatarURL)
                  .setDescription("Our top 10 power destroyed leaders!")
                  .setColor(0x00AE86);
                var c = 1;
                for(const data of top10) {
                  embed.addField(`${c}. ${bot.guilds.get(guildID).members.get(data.uid).displayName}`, `${formatter.numberWithCommas(data.power_destroyed)}`);
                  c++;
                }
                embed.addField(`Your personal power destroyed is`, `${formatter.numberWithCommas(score.power_destroyed)}`)
                return message.channel.send({embed});
              });
          }
        });
    break;

    case 'resourcesraided':
    case 'rr':
      var score = [];
      db.scores.findByNameAndGuild(message.author.id, message.guild.id)
        .then (score => {
          if (score == null) {
            score = {
              uid: message.author.id,
              guild: message.guild.id,
              power_destroyed: 0,
              resources_raided: 0
            }
            logger.info(`Created score: ${score}`);
          }
          if(args.length > 0) {
            logger.info(`Args detected`);
            if(!isNaN(args[0])) {
              // Second argument is a number, update the score to this value
              score.resources_raided = args[0];
              if(score.id == null) {
                db.scores.add(score)
                  .then(function(result) {
                    // notify the user it was successful
                    message.channel.send({embed: {
                      color: 3447003,
                      description: `Thank you, ${sender}, your resources raided is set to ${args[0]}`
                    }});
                  })
              } else {
                db.scores.update(score)
                  .then(function(result) {
                    // notify the user it was successful
                    message.channel.send({embed: {
                      color: 3447003,
                      description: `Thank you, ${sender}, your resources raided is set to ${args[0]}`
                    }});
                  })
                }
            } else {
              let member = message.guild.members.get(args[0]);
              if(member) {
                db.scores.findByNameAndGuild(member.id, message.guild.id)
                  .then (score => {
                    let desc = `Unable to find ${member} in my database.  They need to log their scores for you to view them!`;
                    if(score!=null) {
                      desc = `${args[0]} resources raided is ${formatter.numberWithCommas(core.resources_raided)}`
                    }
                    message.channel.send({embed: {
                      color: 3447003,
                      description: `${desc}`
                    }
                  });
                })
              } else {
                message.channel.send({embed: {
                  color: 3447003,
                  description: `${sender}, please use \`!pd abc\`, where abc is a number or an actual person!}`
                }});
              }
            }
          } else {
            db.manyOrNone("SELECT * FROM scores WHERE guild = $1 ORDER BY resources_raided DESC LIMIT 10;", message.guild.id)
              .then(top10 => {
                const embed = new Discord.RichEmbed()
                  .setTitle("Resources Raided Leaderboard")
                  .setAuthor(bot.user.username, bot.user.avatarURL)
                  .setDescription("Our top 10 resources raided leaders!")
                  .setColor(0x770086);
                var c = 1;
                for(const data of top10) {
                  embed.addField(`${c}. ${bot.guilds.get(guildID).members.get(data.uid).displayName}`, `${formatter.numberWithCommas(data.resources_raided)}`);
                  //embed.addField(`${c}. ${bot.users.get(data.uid).tag}`, `${formatter.numberWithCommas(data.resources_raided)}`);
                  c++;
                }
                embed.addField(`Your personal resources raided is`, `${formatter.numberWithCommas(score.resources_raided)}`)
                return message.channel.send({embed});
              });
          }
        });
    break;
  }
});

// Start the client!
bot.login(process.env.BOT_TOKEN);

// 'Hack' to ensure our bot service runs on zeit!
require('http').createServer().listen(3000);
