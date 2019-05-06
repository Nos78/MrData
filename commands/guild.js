/**
 * @Author: BanderDragon
 * @Date:   2019-05-05T18:46:55+01:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: guild.js
 * @Last modified by:   BanderDragon
 * @Last modified time: 2019-05-05T18:49:32+01:00
 */

const config = require('../config.json');

module.exports = {
  name: 'guild',
  description: 'Returns the discord Id of the current guild (server).',
  cooldown: 60,
  args: false,
  async execute(message, args) {
    message.channel.send({embed: {
        color:config.standardMessageColor,
        description: `This guild is called ${message.guild.name}.  It\'s Id is ${message.guild.id}`
      }});
  },
};
