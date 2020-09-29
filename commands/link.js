/*
 * @Author: BanderDragon 
 * @Date: 2020-09-08 17:28:56 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-29 03:30:38
 */

const config = require('../config.json');
const library = require('../library');
 module.exports = {
    name: 'link',
    description: 'Returns a discord invitation link to install @BOTNAME on a discord server.  Want to add me to your own discord server?  Everything you need is right here.',
    cooldown: 60,
    category: 'misc',
    version: '0.0.2',
    aliases: ['linkme', 'datalink', 'url', 'addme'],
    args: false,
    guildOnly: false,

    async execute(message, args) {
        var link = "https://discordapp.com/oauth2/authorize?&client_id=553632838486982657&scope=bot&permissions=8";
        // No args needed.
        var desc = `${message.author}, you can add me to your own discord server¹ using the following link:\n\n**__Add ${library.Config.botName(message.client)}:__** ${link}`;
        desc += `\n\nFor installation help, visit my own help page (currently in development) or you may view `;
        desc += `my top.gg² page:\n\n**__MrData help:__** https://mrdata.thebotfactory.net\n__**top.gg:**²__  `;
        desc += `https://top.gg/bot/553632838486982657 \n\n**1** - in order to invite a bot, you must be the `;
        desc += `server owner or have the *manage server* privilege.\n**2** - top.gg is a popular library/cataloging `;
        desc += `website for discord bots.`
        library.Helper.sendSuccessMessage(desc, message.channel);
    }
 };
