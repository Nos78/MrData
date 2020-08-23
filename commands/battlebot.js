/**
 * @Author: BanderDragon
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: battlebot.js
 */

 const config = require('../config.json');

 module.exports = {
 	name: 'battlebot',
 	description: 'Returns the discord invitation for the battlebot discord server.',
 	cooldown: 60,
 	args: false,
        usage: '',

    async execute(message, args) {
       var desc = "";

       // No args needed.
       desc = `${message.author}, join the **Battlebot discord server** here:\nhttps://discord.com/invite/CAdwKZ5\n\nInstall Battlebot on your discord server by using this link:\nhttps://discord.com/oauth2/authorize?client_id=729384298981097492&scope=bot`;

       message.channel.send({embed: {
         color:config.standardMessageColor,
         description: `${desc}`
       }});
    }
 };
