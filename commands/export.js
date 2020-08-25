/**
 * @Author: BanderDragon
 * @Date:   2019-05-06T08:09:56+01:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: powerdestroyed.js
 * @Last modified by:
 * @Last modified time: 2020-03-29T19:10:03+01:00
 */

const Discord = require('discord.js');
const db = require('../db');
const config = require('../config.json');
const library = require('../library');
const fastcsv = require("fast-csv");

// Set up the logger for debug/info
const logger = require('winston');

const fs = require("fs");

module.exports = {
    name: 'export',
    description: 'Export your scores into a file that can be opened in a spreadsheet package, or a text editor.',
    args: false,
    usage: 'export',
    cooldown: 3,
    guildOnly: true,
    execute(message, args) {
        // New score object stores the data for adding into the database
        // This will configured in the switch statement below
        // And committed to the database after.

        db.scores.findByGuild(message.guild.id, `user_id ASC`)
            .then(scores => {
                if(scores == null || scores.length == 0) {
                    logger.debug(`No records found for ${message.guild}`);
                    message.channel.send({
                        embed: {
                            color: config.powerDestroyedColor,
                            description: `${message.author}, *No* records were found for **${message.client.guilds.get(message.guild.id).name}**`
                        }
                    });
                } else {
                    var tmpFilename = config.tempDir + message.guild.id;
                    if (!fs.existsSync(config.tempDir)) {
                        fs.mkdirSync(config.tempDir);
                    }
                    if(!fs.existsSync(tmpFilename)) {
                        fs.unlinkSync(tmpFilename);
                    }
                    const ws = fs.createWriteStream(tmpFilename);

                    const jsonData = JSON.parse(JSON.stringify(scores));
                    console.log(`jsonData`, jsonData);

                    fastcsv
                        .write(jsonData, { headers: true })
                        .on("finish", function() {
                            logger.info(`Write to ${tmpFilename}!`);
                    })
                    .pipe(ws);
                    message.channel.send({
                        files: [{
                            attachment: `${tmpFilename}`,
                            name: `${message.guild.name}.csv`
                        }]
                    });
                }
            });
    } // execute
} // module.exports
