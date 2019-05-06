
const Discord = require('discord.js');
const db = require('../db');
const config = require('../config.json');
const library = require('../library');

// Set up the logger for debug/info
const logger = require('winston');

module.exports = {
	name: 'power',
  description: 'See the resources raided top 10, or set your own resources raided score.',
  aliases: ['rr'],
  args: false,
  usage: '<number>',
	cooldown: 3,
	guildOnly: true,
	execute(message, args) {
		let  = 0;

		// New score object stores the data for adding into the database
		// This will configured in the switch statement below
		// And committed to the database after.
  	var new_score = {
			user_discord_id: 0,
			guild_discord_id: message.guild.id,
			resources_raided_score: 0,
			success_message: ""
		};

		switch(args.length) {
			case 0:
				/*
				 * Print the league table
				 */
				 db.scores.findByGuild(message.guild.id, 'resources_raided')
					 .then(top10 => {
						 if(top10 == null || top10.length == 0) {
							 message.channel.send({embed: {
								 color: config.resourcesRaidedColor,
								 description: `${message.author}, *No* records were found for **${message.client.guilds.get(message.guild.id).name}**`
							 }});
						 } else {
							 const embed = new Discord.RichEmbed()
								 .setTitle("Resources Raided Leaderboard")
								 .setAuthor(message.client.user.username, message.client.user.avatarURL)
								 .setDescription("Our top 10 resources raided leaders!")
								 .setColor(config.resourcesRaidedColor);
							 var c = 1;
							 for(const data of top10) {
								 embed.addField(`${c}. ${message.client.guilds.get(message.guild.id).members.get(data.user_id).displayName}`, `${library.Format.numberWithCommas(data.resources_raided)}`);
								 c++;
							 }
							 db.scores.findByUser(message.author.id)
							 	.then(user => {
									if(user == null || user.length == 0) {
										embed.addField(`*You have not yet set any scores!*`);
									} else {
										embed.addField(`*Your personal resources raided is*`, `*${library.Format.numberWithCommas(score.resources_raided)}*`);
									}
								});
							 return message.channel.send({embed});
						 } // endif top10
					 }); // db.scores.findByGuild
				break;

			case 1:
				/*
				 * Parameter could be a name or a number
				 */
				if(isNaN(args[0])) {
 					let member = message.mentions.members.first();
					if(member) {
						db.scores.findByUserAndGuild(member.id, message.guild.id)
 					 		.then (score => {
 								let desc = `Unable to find ${member.displayName} in my database.  They need to log their scores for you to view them!`;
								if(score!=null) {
									desc = `${member.displayName} resources raided is ${library.Format.numberWithCommas(score.resources_raided)}`
								} // endif
								message.channel.send({embed: {
										color: config.resourcesRaidedColor,
										description: `${desc}`
									} // Embed
 								}); // message.channel.send
								return;
					 	}); // db.findByUserAndGuild
				 	} else {
						// not a member, print the error message and exit
						message.channel.send({embed: {
						 color: config.resourcesRaidedColor,
						 description: `${message.author}, please use \`!pd abc\`, where abc is a number or an actual person!}`
					 	}});
						return;
					} // endif member
				} else {
					// Parameter is a number, configure the relevant information object
					// This will be sent to the database once we drop out of the switch
					new_score.resources_raided_score = args[0];
					new_score.user_discord_id = message.author.id;
					new_score.success_message = `Thank you, ${message.author}, your resources raided is set to ${library.Format.numberWithCommas(new_score.resources_raided)}`;
				}
				break;
			case 2:
				/*
				 * This is a special case, for use with admin privleges only.
				 * This allows an admin to specify a username and update their scores
				 * for that user.
				 */
				let member = message.mentions.members.first();
				if(member && !isNaN(args[1])) {
					// The command seems to be of the form !pd @name number
					let allowedRole = message.guild.roles.find("name", "Admin");
        	if (!message.member.roles.has(allowedRole.id)) {
						// Sender in not priveleged, warn and exit. Do not drop
						// out of the switch statement.
						message.channel.send({embed: {
						 color: config.resourcesRaidedColor,
						 description: `${message.author}, only an Administrator can set the score of other users`
					 	}});
						return;
					} else {
						// admin is allowed access to the command
						// Configure the information object
						new_score.resources_raided_score = args[1];
						new_score.user_discord_id = member.id;
						new_score.success_message = `Thank you, ${message.author}, ${member.displayName} resources raided is set to ${library.Format.numberWithCommas(new_score.resources_raided)}`
					}
				}
				break;
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

		var score = [];
		score.userId = new_score.user_discord_id,
		score.guildId = new_score.guild_discord_id,
		score.resourcesRaided = new_score.resources_raided_score,
		score.powerDestroyed = 0,
		score.totalPower = 0,
		score.pvpShipsDestroyed = 0,
		score.pvpKdRatio = 0,
		score.pvpDamage = 0,
		score.hostilesDestroyed = 0,
		score.hostilesTotalDamage = 0,
		score.resourcesMined = 0,
		score.currentLevel = 0

		logger.debug("Calling db.scores.upsert()");
		db.scores.upsert(score).then((result) => {
				if(result == null) {
					message.channel.send({embed: {
					 color: config.resourcesRaidedColor,
					 description: `${message.authot}, an error occured, and I was unable to commit your information into my database.`
					}});
				}
				else { // no records added?
					message.channel.send({embed: {
					 color: config.resourcesRaidedColor,
					 description: new_score.success_message
					}});
				}
		});
	} // execute
} // module.exports
