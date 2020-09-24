/*
 * @Author: BanderDragon 
 * @Date: 2019-05-05 18:00:48
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-24 19:43:37
 */

const config = require('../config.json');

module.exports = {
    name: 'deletecallingcommand',
    description: `Enables or disables the ${this.name} setting. This command is a shorthand variation of the settings command with the deletecallngcommand parameter set (or unset).`,
    cooldown: 60,
    category: 'config',
    args: false,
    usage: '<@memberName>',
    execute(message, args) {

    },
 };
