/*
 * @Author: BanderDragon 
 * @Date: 2019-05-06 08:09:56
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-29 13:00:32
 */

const Discord = require('discord.js');
const db = require('../db');
const config = require('../config.json');
const library = require('../library');
//const fastcsv = require("fast-csv");
const csvjson = require('csvjson');

// Set up the logger for debug/info
const logger = require('winston');

const fs = require("fs");

module.exports = {
    name: 'export',
    description: 'Export your scores into a file that can be opened in a spreadsheet package, or a text editor.',
    args: false,
    usage: 'export',
    cooldown: 3,
    version: '0.0.2',
    category: 'scoring',    
    guildOnly: true,
    async execute(message, args) {
        // New score object stores the data for adding into the database
        // This will configured in the switch statement below
        // And committed to the database after.
        msg = library.Helper.sendStandardWaitMessage(message.channel);
        var prefix = await library.System.getPrefix(message.guild.id);
        db.scores.findByGuild(message.guild.id, `user_id ASC`)
            .then(scores => {
                if(scores == null || scores.length == 0) {
                    logger.debug(`No records found for ${message.guild}`);
                    message.channel.send({
                        embed: {
                            color: config.powerDestroyedColor,
                            description: `${message.author}, *No* records were found for **${message.client.guilds.cache.get(message.guild.id).name}**`
                        }
                    });
                } else {
                    var tmpFilename = config.tempDir + message.guild.id;
                    if (!fs.existsSync(config.tempDir)) {
                        fs.mkdirSync(config.tempDir);
                    }
                    if(fs.existsSync(tmpFilename)) {
                        fs.unlinkSync(tmpFilename);
                    }

                    var jsonData = JSON.parse(JSON.stringify(scores));
                    delete jsonData["id"];
                    delete jsonData["guild_id"];
                    for(var i = 0; i < scores.length; i++) {
                        var user =  message.guild.members.cache.get(jsonData[i].user_id);
                        var username = null; //var username = jsonData[i].user_id;
                        if(user) {
                            username = user.displayName;
                        }
                        jsonData[i].username = username;
                    }
                    delete jsonData["user_id"];
                    jsonData = jsonData.filter(data => data.username !== null);

                    // Now re-order the fields
                    jsonData = JSON.parse(JSON.stringify(jsonData, ["username", "current_level", "missions", "alliances_help",
                                                                    "total_power", "power_destroyed", "resources_raided",
                                                                    "hostiles_destroyed", "hostiles_total_damage",
                                                                    "pvp_kd_ratio", "pvp_ships_destroyed", "pvp_total_damage",
                                                                    "resources_mined"]));
                    console.log(`jsonData`, jsonData);

                    const csvData = csvjson.toCSV(jsonData, {headers: 'key'});

                    fs.writeFile(tmpFilename, csvData, (err) => {
                        if(err) {
                            console.log(err);
                        } else {
                            console.log(`successfully written ${tmpFilename}`);
                            library.Helper.editWaitSuccessMessage(msg, `${message.author}, the scoring data for ${library.Discord.getGuildName(message.guild)}`
                                + ` is now ready to be downloaded and imported into your spreadsheet package.\n\n`
                                + `**Please note:** Data from deleted users has been filtered and is not included in this export. `
                                + `If you would like to include this data, please contact the bot owner `
                                + `(Use the \`${prefix}creator\` command to file contact details) and the feature can be included.\n\n`
                                + `If you do not know how to use a .csv file, don't panic! Just follow the simple instructions from this easy-to-read guide: https://www.wikihow.com/Open-CSV-Files`);
                            message.channel.send({
                                files: [{
                                    attachment: `${tmpFilename}`,
                                    name: `${message.guild.name}.csv`
                                }]
                            });
                        }
                    })
           }
            });
    } // execute
} // module.exports
