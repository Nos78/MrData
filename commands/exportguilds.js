/*
 * @Author: BanderDragon 
 * @Date: 2019-05-06 08:09:56
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-29 07:57:03
 */

const Discord = require('discord.js');
const db = require('../db');
const config = require('../config.json');
const library = require('../library');
const fastcsv = require("fast-csv");
const moment = require('moment');

// Set up the logger for debug/info
const logger = require('winston');

const fs = require("fs");

module.exports = {
    name: 'exportguilds',
    description: 'Export the guilds @BOTNAME is connected to a text file.',
    args: false,
    usage: 'export',
    cooldown: 3,
    version: '0.0.1',
    category: 'owner',    
    guildOnly: true,
    execute(message, args) {
        msg = library.Helper.sendStandardWaitMessage(message.channel);
        if (!library.Admin.isBotOwner(message.author.id)) {
            return library.Helper.editWaitErrorMessage(msg, `Sorry, ${message.author}, only my owner can use this command.`);
        }
        const client = message.client;
        var data = [];
        data.push(`__Here is a list of all the guilds that I am currently connected to:__\n`);
        data.push(`ID,Name,Members,Joined,Deleted?,Owner,Region`);
        var connectedIds = client.guilds.map(guild => guild.id).sort();
        for(var i = 0; i < connectedIds.length; i++) {
            var guild = client.guilds.get(connectedIds[i]);
            var joined = moment(guild.joinedAt).format('DD/MM/YYYY');
            data.push(`${guild.id},${guild.name},${guild.memberCount},${joined},${guild.deleted},${guild.owner},${guild.region}`)
        }
        message.author.send(data, { split: true })
            .then(() => {
                if (message.channel.type === 'dm') return;
                library.Helper.editWaitSuccessMessage(msg, `${message.author}, I've sent you a DM with all the guilds I am connected to.`);
            })
            .catch(error => {
                logger.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
        });

        //var msg2 = library.Helper.sendStandardWaitMessage(message.channel);

        //library.Helper.editWaitSuccessMessage(msg, `${message.author}, I have sent you a private message with the list of guilds I am connected to.`);
    } // execute
} // module.exports
