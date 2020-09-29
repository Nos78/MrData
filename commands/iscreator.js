/*
 * @Author: BanderDragon 
 * @Date: 2019-07-02 00:57:15
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-28 23:00:15
 */

const config = require('../config.json');
const library = require('../library');
const logger = require('winston');

module.exports = {
    name: 'iscreator',
    description: 'Checks if you are registered as my creator',
    cooldown: 60,
    args: false,
    category: 'utility',
    usage: '<@memberName>',
    async execute(message, args) {
        logger.debug(`Creator command requested. Author id = ${message.author.id} and botOwnerId = ${library.Admin.botOwnerId()}`);

        if(library.Admin.isBotOwner(message.author.id)) {
            message.channel.send(`Greetings, ${message.author}, you are my creator!`);
        } else {
          message.channel.send(`Greetings, ${message.author}, alas you are not my creator.`);
        }
    }
};
