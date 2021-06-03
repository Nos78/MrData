/*
 * @Author: BanderDragon 
 * @Date: 2020-09-25 13:41:43 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-29 03:34:55
 */

const library = require('../library');

module.exports = {
    name: 'warpcalculator',
    aliases: ['warp', 'warprange'],
    description: 'Outputs a copy of the warp range calulator, v4c, as created by the good folks at LCARS.',
    cooldown: 60,
    args: false,
    version: '0.0.1',
    category: 'utility',
    usage: '<@memberName>',
    execute(message, args) {
        library.Helper.sendSuccessMessage(`${message.author}, please find attached the LCARS Warp Range calculator, version 4c. Please do not lose it, it is my only copy.\nhttps://cdn.discordapp.com/attachments/697529040600563807/763657209439584296/LCARS_USS_Discovery_Warp_Range_Calculator_v4c.xlsx`, message.channel);
    }
};
