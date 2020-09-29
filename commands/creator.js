/*
 * @Author: BanderDragon 
 * @Date: 2020-09-28 23:00:57 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-29 02:50:46
 */

const config = require('../config.json');
const library = require('../library');
const logger = require('winston');

module.exports = {
    name: 'creator',
    description: 'Returns the discord username of my creator.',
    cooldown: 60,
    args: false,
    category: 'utility',
    async execute(message, args) {
        const creatorID = global.library.Admin.botOwnerId();
        msg = library.Helper.sendStandardWaitMessage(message.channel);
        message.client.fetchUser(creatorID)
            .then(function (creatorUser) {
                var embedMsg = global.library.Helper.userCard(creatorUser, message.channel, message.client);
                library.Helper.editMessageEmbed(msg, embedMsg);
        }.bind(this));
    }
};
