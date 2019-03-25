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

  switch(cmd) {
    // uptime
    case 'uptime':
      let totalSeconds = (bot.uptime / 1000);
      let days = Math.floor(totalSeconds / 86400);
      let hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      let minutes = Math.floor(totalSeconds / 60);
      let seconds = totalSeconds % 60;
      let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
      message.channel.send(`${sender}, I have been active for ${uptime}`);
    break;

    // !ping
    case 'ping':
      // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
      // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
      const m = await message.channel.send("Ping?");
      m.edit(`Pong! ${sender} Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
    break;

    case 'isowner':
      let owner = "is not";
      if(library.Admin.isOwner(senderID, guildID, bot)) {
        owner = "is"
      }
      message.channel.send(`According to my records, ${sender} ${owner} recorded as being my owner.`);
    break;

    case 'isadmin':
      let admin = "is not";
      if(library.Admin.isAdmin(senderID, guildID, bot)) {
        admin = "is"
      }
      message.channel.send(`According to my records, ${sender} ${admin} recorded as an admin of ${message.guild.name}.`);
    break;

    case 'owner':
      message.channel.send(`According to my records, my current owner is ${library.Admin.owner(guildID, bot)}`);
      break;

    case 'datahelp':
      message.channel.send('```# The following commands can be used to instruct me:\n' +
                  '!ping      : see if I am awake\n' +
                  '!datahelp  : self explanatory!\n' +
                  '\n' +
                  '!power        : see the power top 10.\n' +
                  '!power number : set your power to the you specify.\n' +
                  '!power @name  : see the power of @name.\n' +
                  '\n' +
                  '!pd        : see the powerdestroyed top 10 (alias = !powerdestroyed).\n' +
                  '!pd number : set your power destroyed.\n' +
                  '!pd @name  : see the power destroyed of <name>.\n' +
                  '\n' +
                  '!rr        : see the resourcesraided top 10 (alias = !resourcesraided).\n' +
                  '!rr number : set your resources raided.\n' +
                  '!rr @name  : see the resources raided of @name.\n' +
                  '```');
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
              resources_raided: 0,
              totalpower: 0
            }
            logger.info(`Created score: ${score}`);
          }
          switch (args.length) {
            case 2:
              if(args.length > 1) {
                let member = message.mentions.members.first();
                if(member && !isNaN(args[1])) {
                  // We have a !pd @name number
                  // Admin only command
                  let allowedRole = message.guild.roles.find("name", "Admin");
                  if (message.member.roles.has(allowedRole.id)) {
                    // allowed access to command
                    db.scores.findByNameAndGuild(member.id, message.guild.id)
                      .then (score => {
                        if (score == null) {
                          score = {
                            uid: member.id,
                            guild: message.guild.id,
                            power_destroyed: 0,
                            resources_raided: 0,
                            totalpower: 0
                          }
                          logger.info(`Created score: ${score}`);
                        }
                        score.power_destroyed = args[1];
                        if(score.id == null) {
                          db.scores.add(score)
                            .then(function(result) {
                              // notify the user it was successful
                              message.channel.send({embed: {
                                color: 3447003,
                                description: `Thank you, ${sender}, ${member.displayName} power destroyed is set to ${library.Format.numberWithCommas(score.power_destroyed)}`
                            }});
                          })
                        } else {
                          db.scores.update(score)
                            .then(function(result) {
                              // notify the user it was successful
                              message.channel.send({embed: {
                                color: 3447003,
                                description: `Thank you, ${sender}, ${member.displayName} power destroyed is set to ${library.Format.numberWithCommas(score.power_destroyed)}`
                              }});
                          })
                        }
                    });
                  }
                }
              }
            break;

            case 1:
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
                        description: `Thank you, ${sender}, your power destroyed is set to ${library.Format.numberWithCommas(score.power_destroyed)}`
                      }});
                    })
                  } else {
                    db.scores.update(score)
                      .then(function(result) {
                        // notify the user it was successful
                        message.channel.send({embed: {
                          color: 3447003,
                          description: `Thank you, ${sender}, your power destroyed is set to ${library.Format.numberWithCommas(score.power_destroyed)}`
                        }});
                    })
                  }
              } else {
                let member = message.mentions.members.first();
                if(member) {
                  db.scores.findByNameAndGuild(member.id, message.guild.id)
                    .then (score => {
                      let desc = `Unable to find ${member.displayName} in my database.  They need to log their scores for you to view them!`;
                      if(score!=null) {
                        desc = `${member.displayName} power destroyed is ${library.Format.numberWithCommas(score.power_destroyed)}`
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
            break;

          case 0:
            db.manyOrNone("SELECT * FROM scores WHERE guild = $1 ORDER BY power_destroyed DESC LIMIT 10;", message.guild.id)
              .then(top10 => {
                const embed = new Discord.RichEmbed()
                  .setTitle("Power Destroyed Leaderboard")
                  .setAuthor(bot.user.username, bot.user.avatarURL)
                  .setDescription("Our top 10 power destroyed leaders!")
                  .setColor(0x00AE86);
                var c = 1;
                for(const data of top10) {
                  embed.addField(`${c}. ${bot.guilds.get(guildID).members.get(data.uid).displayName}`, `${library.Format.numberWithCommas(data.power_destroyed)}`);
                  c++;
                }
                embed.addField(`Your personal power destroyed is`, `${library.Format.numberWithCommas(score.power_destroyed)}`)
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
            resources_raided: 0,
            totalpower: 0
          }
          logger.info(`Created score: ${score}`);
        }
        switch (args.length) {
          case 2:
            if(args.length > 1) {
              let member = message.mentions.members.first();
              if(member && !isNaN(args[1])) {
                // We have a !pd @name number
                // Admin only command
                let allowedRole = message.guild.roles.find("name", "Admin");
                if (message.member.roles.has(allowedRole.id)) {
                  // allowed access to command
                  db.scores.findByNameAndGuild(member.id, message.guild.id)
                    .then (score => {
                      if (score == null) {
                        score = {
                          uid: member.id,
                          guild: message.guild.id,
                          power_destroyed: 0,
                          resources_raided: 0,
                          totalpower: 0
                        }
                        logger.info(`Created score: ${score}`);
                      }
                      score.resources_raided = args[1];
                      if(score.id == null) {
                        db.scores.add(score)
                          .then(function(result) {
                            // notify the user it was successful
                            message.channel.send({embed: {
                              color: 3447003,
                              description: `Thank you, ${sender}, ${member.displayName} resources raided is set to ${library.Format.numberWithCommas(score.resources_raided)}`
                          }});
                        })
                      } else {
                        db.scores.update(score)
                          .then(function(result) {
                            // notify the user it was successful
                            message.channel.send({embed: {
                              color: 3447003,
                              description: `Thank you, ${sender}, ${member.displayName} resources raided is set to ${library.Format.numberWithCommas(score.resources_raided)}`
                            }});
                        })
                      }
                  });
                }
              }
            }
          break;

          case 1:
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
                      description: `Thank you, ${sender}, your resources raided is set to ${library.Format.numberWithCommas(core.resources_raided)}`
                    }});
                  })
                } else {
                  db.scores.update(score)
                    .then(function(result) {
                      // notify the user it was successful
                      message.channel.send({embed: {
                        color: 3447003,
                        description: `Thank you, ${sender}, your resources raided is set to ${library.Format.numberWithCommas(score.resources_raided)}`
                      }});
                  })
                }
            } else {
              let member = message.mentions.members.first();
              if(member) {
                db.scores.findByNameAndGuild(member.id, message.guild.id)
                  .then (score => {
                    let desc = `Unable to find ${member.displayName} in my database.  They need to log their scores for you to view them!`;
                    if(score!=null) {
                      desc = `${member.displayName} resources raided is ${library.Format.numberWithCommas(score.resources_raided)}`
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
          break;

        case 0:
          db.manyOrNone("SELECT * FROM scores WHERE guild = $1 ORDER BY resources_raided DESC LIMIT 10;", message.guild.id)
            .then(top10 => {
              const embed = new Discord.RichEmbed()
                .setTitle("Resources Raided Leaderboard")
                .setAuthor(bot.user.username, bot.user.avatarURL)
                .setDescription("Our top 10 resources raided leaders!")
                .setColor(0x770086);
              var c = 1;
              for(const data of top10) {
                embed.addField(`${c}. ${bot.guilds.get(guildID).members.get(data.uid).displayName}`, `${library.Format.numberWithCommas(data.resources_raided)}`);
                c++;
              }
              embed.addField(`Your personal resources raided is`, `${library.Format.numberWithCommas(score.resources_raided)}`)
              return message.channel.send({embed});
            });
        }
      });
  break;

  // Just add any case commands if you want to..
  case 'power':
    var score = [];
    db.scores.findByNameAndGuild(message.author.id, message.guild.id)
      .then (score => {
        if (score == null) {
          score = {
            uid: message.author.id,
            guild: message.guild.id,
            power_destroyed: 0,
            resources_raided: 0,
            totalpower: 0
          }
          logger.info(`Created score: ${score}`);
        }
        switch (args.length) {
          case 2:
            if(args.length > 1) {
              let member = message.mentions.members.first();
              if(member && !isNaN(args[1])) {
                // We have a !pd @name number
                // Admin only command
                let allowedRole = message.guild.roles.find("name", "Admin");
                if (message.member.roles.has(allowedRole.id)) {
                  // allowed access to command
                  db.scores.findByNameAndGuild(member.id, message.guild.id)
                    .then (score => {
                      if (score == null) {
                        score = {
                          uid: member.id,
                          guild: message.guild.id,
                          power_destroyed: 0,
                          resources_raided: 0,
                          totalpower: 0
                        }
                        logger.info(`Created score: ${score}`);
                      }
                      score.totalpower = args[1];
                      if(score.id == null) {
                        db.scores.add(score)
                          .then(function(result) {
                            // notify the user it was successful
                            message.channel.send({embed: {
                              color: 3447003,
                              description: `Thank you, ${sender}, ${member.displayName} total power is set to ${library.Format.numberWithCommas(score.totalpower)}`
                          }});
                        })
                      } else {
                        db.scores.update(score)
                          .then(function(result) {
                            // notify the user it was successful
                            message.channel.send({embed: {
                              color: 3447003,
                              description: `Thank you, ${sender}, ${member.displayName} total power is set to ${library.Format.numberWithCommas(score.totalpower)}`
                            }});
                        })
                      }
                  });
                }
              }
            }
          break;

          case 1:
            logger.info(`Args detected`);
            if(!isNaN(args[0])) {
              // Second argument is a number, update the score to this value
              score.totalpower = args[0];
              if(score.id == null) {
                db.scores.add(score)
                  .then(function(result) {
                    // notify the user it was successful
                    message.channel.send({embed: {
                      color: 3447003,
                      description: `Thank you, ${sender}, your total power is set to ${library.Format.numberWithCommas(score.totalpower)}`
                    }});
                  })
                } else {
                  db.scores.update(score)
                    .then(function(result) {
                      // notify the user it was successful
                      message.channel.send({embed: {
                        color: 3447003,
                        description: `Thank you, ${sender}, your total power is set to ${library.Format.numberWithCommas(score.totalpower)}`
                      }});
                  })
                }
            } else {
              let member = message.mentions.members.first();
              if(member) {
                db.scores.findByNameAndGuild(member.id, message.guild.id)
                  .then (score => {
                    let desc = `Unable to find ${member.displayName} in my database.  They need to log their scores for you to view them!`;
                    if(score!=null) {
                      desc = `${member.displayName} power is ${library.Format.numberWithCommas(score.totalpower)}`
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
          break;

        case 0:
          db.manyOrNone("SELECT * FROM scores WHERE guild = $1 ORDER BY totalpower DESC LIMIT 10;", message.guild.id)
            .then(top10 => {
              const embed = new Discord.RichEmbed()
                .setTitle("Power Leaderboard")
                .setAuthor(bot.user.username, bot.user.avatarURL)
                .setDescription("Our top 10 power leaders!")
                .setColor(0xFFFF00);
              var c = 1;
              for(const data of top10) {
                embed.addField(`${c}. ${bot.guilds.get(guildID).members.get(data.uid).displayName}`, `${library.Format.numberWithCommas(data.totalpower)}`);
                c++;
              }
              embed.addField(`Your personal total power is`, `${library.Format.numberWithCommas(score.totalpower)}`)
              return message.channel.send({embed});
            });
        }
      });
  break;
  }
});

// Start the client!
bot.login(process.env.BOT_TOKEN);
