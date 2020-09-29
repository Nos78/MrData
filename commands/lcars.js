/*
 * @Author: BanderDragon 
 * @Date: 2020-23-08 08:00:48
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-29 03:29:20
 */

const config = require('../config.json');

module.exports = {
    name: 'lcars',
    description: 'Returns a discord invitation link for the LCARS discord server.',
    cooldown: 60,
    category: 'misc',
    version: '0.0.3',
    args: false,
    async execute(message, args) {
        var desc = "";

        // No args needed.
        desc = `${message.author}, join the **LCARS discord server** here:\nhttps://discord.gg/txzasxY`;

        message.channel.send({embed: {
            color:config.standardMessageColor,
            description: `${desc}`
        }});
     }
};
