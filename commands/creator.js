/**
 * @Date:   2019-07-02T00:57:15+01:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: creator.js
 * @Last modified time: 2019-07-02T02:45:26+01:00
 */

const config = require('../config.json');
const library = require('../library');
const logger = require('winston');

module.exports = {
    name: 'creator',
    description: 'Checks if the user is registered as my creator',
    cooldown: 60,
    args: false,
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
