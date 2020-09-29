/*
 * @Author: BanderDragon 
 * @Date: 2019-05-05 18:00:48
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-29 02:57:18
 */

const config = require('../config.json');

module.exports = {
    name: 'deletecallingcommand',
    description: `Enables or disables the ${this.name} setting. This command is a shorthand variation of the settings command with the deletecallngcommand parameter set (or unset).`,
    cooldown: 60,
    category: 'config',
    args: false,
    version: '0.0.0',
    usage: '<@memberName>',
    execute(message, args) {

    },
 };
