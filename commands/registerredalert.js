/*
 * @Author: BanderDragon 
 * @Date: 2020-09-01 20:15:19 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-01 22:31:53
 */

const Discord = require('discord.js');
const db = require('../db');
const config = require('../config.json');
const library = require('../library');

// Set up the logger for debug/info
const logger = require('winston');

module.exports = {
    name: 'registerredalert',
    description: 'Register for red alert messages on server @SERVERNAME',
    aliases: ['rm'],
    args: false,
    usage: '<number>',
    cooldown: 3,
    guildOnly: true,
    execute(message, args) {
        var msg = library.Helper.sendWaitMessage("Please wait...", message.channel);
        var userId = library.Helper.parseIdNumber(message.author.id);
        var guildId = library.Helper.parseIdNumber(message.guild.id);
        library.Helper.editWaitSuccessMessage(msg, `Please visit https://thebotfactory.net:5000/?userId=${userId}?guildId=${guildId}`)
    }
}