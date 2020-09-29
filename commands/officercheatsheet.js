/*
 * @Author: BanderDragon 
 * @Date: 2020-09-25 13:41:43 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-29 03:34:55
 */

const library = require('../library');

module.exports = {
    name: 'officercheatsheet',
    aliases: ['officers', 'ocs'],
    description: 'Outputs a copy of the officer stats cheat sheet, as advertised and made (YouTube) famous by Rev Deuce.',
    cooldown: 60,
    args: false,
    version: '0.0.1',
    category: 'stats',
    usage: '<@memberName>',
    execute(message, args) {
        library.Helper.sendSuccessMessage(`${message.author}, please find attached my officer stats cheat sheet. This took many, many, many man hours to create. Please do not lose it, it is my only copy.\nhttps://cdn.discordapp.com/attachments/560112235758747649/750758861706887228/image0.png`, message.channel);
    }
};
