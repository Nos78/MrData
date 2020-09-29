/*
 * @Author: BanderDragon 
 * @Date: 2020-09-28 23:00:57 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-29 02:42:56
 */

const config = require('../config.json');
const library = require('../library');
const logger = require('winston');

module.exports = {
    name: `${library.Config.packageName()}`,
    description: 'Returns the discord user details of @BOTNAME.',
    cooldown: 60,
    args: false,
    category: 'utility',
    async execute(message, args) {
        const creatorID = global.library.Admin.botOwnerId();
        msg = library.Helper.sendStandardWaitMessage(message.channel);
        var embedMsg = global.library.Helper.userCard(message.client.user, message.channel, message.client);
        library.Helper.editMessageEmbed(msg, embedMsg);
    }
};
