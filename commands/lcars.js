/**
 * @Author: BanderDragon
 * @Date:   2020-23-08T08:00:48+01:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: lcars.js
 * @Last modified by:   BanderDragon
 * @Last modified time: 2020-23-08T08:45:40+01:00
 */

 const config = require('../config.json');

 module.exports = {
 	name: 'lcars',
 	description: 'Returns a discord invitation link for the LCARS discord server.',
 	cooldown: 60,
 	args: false,
        usage: '',

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
