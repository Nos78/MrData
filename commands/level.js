/**
 * @Date:   2019-05-08T16:05:07+01:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: level.js
 * @Last modified time: 2020-03-29T19:12:23+01:00
 */

const Discord = require('discord.js');
const db = require('../db');
const config = require('../config.json');
const library = require('../library');

// Set up the logger for debug/info
const logger = require('winston');

module.exports = {
    name: 'level',
    description: 'See the top 10 levels, or set your own level score.',
    aliases: ['l'],
    args: false,
    usage: '<number>',
    cooldown: 3,
    category: 'scoring',
    version: '1.0.2',
    guildOnly: true,
    execute(message, args) {
        // New score object stores the data for adding into the database
        // This will configured in the switch statement below
        // And committed to the database after.
        var new_score = {
            user_discord_id: 0,
            guild_discord_id: message.guild.id,
            current_level: 0,
            success_message: ""
        };

        var maxRankCount = library.Helper.parseMaxRankCount(args);

        if(maxRankCount < 1) {
          // not a member, print the error message and exit
          message.channel.send({
              embed: {
                  color: config.levelColor,
                  description: `${message.author}, that command makes no sense - you cannot print a ranking table containing ${maxRankCount} users!`
              }
          });
          return;
        }

        logger.debug(`Executing level, args: ${JSON.stringify(args)}`);
        switch (args.length) {
            case 0:
                /*
 				 */
                logger.debug("No parameters, simply display the league table");
                /*
                 * Print the league table
                 * 1. Find the message sender's score.
                 * 2. Get the score table.
                 * 3. Print the top 10
                 * 4. Print the message sender's score.
                 */
                db.scores.findByUserAndGuild(message.author.id, message.guild.id)
                    .then(author_score => {
                        db.scores.findByGuild(message.guild.id, `current_level DESC LIMIT ${maxRankCount}`)
                            .then(top10 => {
                                logger.debug(`findByGuild().then() called for ${message.guild}`);
                                if (top10 == null || top10.length == 0) {
                                    logger.debug(`No records found for ${message.guild}`);
                                    message.channel.send({
                                        embed: {
                                            color: config.levelColor,
                                            description: `${message.author}, *No* records were found for **${message.client.guilds.cache.get(message.guild.id).name}**`
                                        }
                                    });
                                } else {
                                    logger.debug(`Displaying the league table for ${message.guild}`);
                                    const embed = new Discord.MessageEmbed()
                                        .setTitle("Power Destroyed Leaderboard")
                                        .setAuthor(message.client.user.username, message.client.user.avatarURL())
                                        .setDescription(`Our top ${maxRankCount} level!`)
                                        .setColor(config.levelColor);
                                    var c = 1;
                                    for (const data of top10) {
                                        var top10member = message.client.guilds.cache.get(message.guild.id).members.cache.get(data.user_id);
                                        var displayName = "";
                                        if (top10member == null) {
                                            displayName = `User ${data.user_id} has left the building`;
                                        } else {
                                            displayName = top10member.displayName;
                                        }
                                        embed.addField(`${c}. ${displayName}`, `${library.Format.numberWithCommas(data.current_level)}`);
                                        c++;
                                    }
                                    if (author_score == null || author_score.length == 0) {
                                        embed.addField(`*You have not yet set any scores!*`);
                                    } else {
                                        logger.debug(`${message.author} score ${author_score.current_level}`);
                                        embed.addField(`*Your personal level score is*`, `*${library.Format.numberWithCommas(author_score.current_level)}*`);
                                    }
                                    logger.debug(`Sending embed mesage ${embed}`);
                                    return message.channel.send({ embed });
                                } // endif top10
                            }); // db.scores.findByGuild
                    });
                return;

            case 1:
				/*
				 * Parameter could be a name or a number
				 */

                // remove commas from args[0] - these should not be present in a name
                // but the user might input a comma-formatted number
                args[0] = library.Format.stripCommas(args[0]);
                if (isNaN(args[0])) {
                    logger.debug(`Checking if this is a name...`);
                    let member = message.mentions.members.first();
                    if (member) {
                        logger.debug(`Finding ${member.displayName} score record...`)
                        db.scores.findByUserAndGuild(member.id, message.guild.id)
                            .then(score => {
                                let desc = `Unable to find ${member.displayName} in my database.  They need to log their scores for you to view them!`;
                                if (score != null) {
                                    logger.debug(`${member.displayName} score record located...`)
                                    desc = `${member.displayName} level is ${library.Format.numberWithCommas(score.resources_raided)}`
                                } // endif
                                message.channel.send({
                                    embed: {
                                        color: config.levelColor,
                                        description: `${desc}`
                                    } // Embed
                                }); // message.channel.send
                                return;
                            }); // db.findByUserAndGuild
                    } else {
                        // not a member, print the error message and exit
                        message.channel.send({
                            embed: {
                                color: config.levelColor,
                                description: `${message.author}, please use \`!level abc\`, where abc is a number or an actual person!}`
                            }
                        });
                        return;
                    } // endif member
                } else {
                    // Parameter is a number, configure the relevant information object
                    // This will be sent to the database once we drop out of the switch
                    logger.debug(`User is ${message.author.username}: Configuring the score...`)
                    new_score.current_level = args[0];
                    new_score.user_discord_id = message.author.id;
                    new_score.success_message = `Thank you, ${message.author}, your level is set to ${library.Format.numberWithCommas(new_score.current_level)}`;
                }
                break;
            case 2:
                {
                    /*
                     * This is a special case, for use with admin privileges only.
                     * This allows an admin to specify a username and update their scores
                     * for that user.
                     */
                    let member = message.mentions.members.first();
                    // remove commas from args[1] - the user might input a comma-formatted number
                    args[1] = library.Format.stripCommas(args[1]);
                    if (member && !isNaN(args[1])) {
                        // The command seems to be of the form !level @name number
                        let allowedRole = message.guild.roles.find("name", "Admin");
                        if (!message.member.roles.has(allowedRole.id)) {
                            // Sender in not priveleged, warn and exit. Do not drop
                            // out of the switch statement.
                            message.channel.send({
                                embed: {
                                    color: config.levelColor,
                                    description: `${message.author}, only an Administrator can set the score of other users`
                                }
                            });
                            return;
                        } else {
                            // admin is allowed access to the command
                            // Configure the information object
                            new_score.current_level = args[1];
                            new_score.user_discord_id = member.id;
                            new_score.success_message = `Thank you, ${message.author}, ${member.displayName} level is set to ${library.Format.numberWithCommas(new_score.current_level)}`
                        }
                    }
                    break;
                }
        }

        //
        // COMMIT TO THE DATABASE!
        //
        // We have the relevant information object (new_score)
        // Add this into the database
        //
        // 1. Get existing record (if exists, go directly to 4)
        // 2. Check if the guild_discord_id exists (and add).
        // 3. Check if the user_discord_id exists (and add).
        // 4. Upsert the new score data
        db.scores.findByUserAndGuild(new_score.user_discord_id, new_score.guild_discord_id)
            .then(score => {
                if (score == null) {
                    score = [];
                    score.user_id = new_score.user_discord_id
                    score.guild_id = new_score.guild_discord_id
                    score.resources_raided = 0
                    score.power_destroyed = 0
                    score.total_power = 0
                    score.pvp_ships_destroyed = 0
                    score.pvp_kd_ratio = 0
                    score.pvp_total_damage = 0
                    score.hostiles_destroyed = 0
                    score.hostiles_total_damage = 0
                    score.resources_mined = 0
                    score.current_level = new_score.current_level
                    score.alliances_help = 0
                    score.missions = 0

                } else if (score.length == 0) {
                    score.guild_id = new_score.guild_discord_id
                    score.resources_raided = 0
                    score.power_destroyed = 0
                    score.total_power = 0
                    score.pvp_ships_destroyed = 0
                    score.pvp_kd_ratio = 0
                    score.pvp_total_damage = 0
                    score.hostiles_destroyed = 0
                    score.hostiles_total_damage = 0
                    score.resources_mined = 0
                    score.current_level = new_score.current_level
                    score.alliances_help = 0
                    score.missions = 0
                } else {
                    score.current_level = new_score.current_level
                }
                logger.debug("Calling db.scores.upsert()");
                db.scores.upsert(score).then((result) => {
                    if (result == null) {
                        message.channel.send({
                            embed: {
                                color: config.levelColor,
                                description: `${message.author}, an error occured, and I was unable to commit your information into my database.`
                            }
                        });
                    }
                    else { // no records added?
                        message.channel.send({
                            embed: {
                                color: config.levelColor,
                                description: new_score.success_message
                            }
                        });
                    }
                })
            })
    } // execute
} // module.exports
