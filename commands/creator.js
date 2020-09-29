/*
 * @Author: BanderDragon 
 * @Date: 2020-09-28 23:00:57 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-29 03:21:45
 */

const config = require('../config.json');
const library = require('../library');
const logger = require('winston');
const { guildOnly } = require('./isowner');

module.exports = {
    name: 'creator',
    description: 'Returns the discord username of my creator.',
    cooldown: 60,
    args: false,
    version: '0.1.0',
    category: 'utility',
    async execute(message, args) {
        const creatorID = global.library.Admin.botOwnerId();
        msg = library.Helper.sendStandardWaitMessage(message.channel);
        message.client.fetchUser(creatorID)
            .then(function (creatorUser) {
                var member = null;
                if(message.guild.member(creatorID)) {
                    member = message.guild.members.get(creatorID);
                }
                var embedMsg = global.library.Helper.userCard(creatorUser, message.channel, message.client, member);
                library.Helper.editMessageEmbed(msg, embedMsg);
        }.bind(this));
    }
};
