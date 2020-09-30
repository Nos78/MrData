/*
 * @Author: BanderDragon 
 * @Date: 2019-05-05 18:46:55
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-30 17:47:54
 */

const config = require('../config.json');

module.exports = {
  name: 'guildid',
  aliases: ['serverid', 'gid'],
  description: 'Returns the discord Id of the current guild (server).',
  cooldown: 60,
  version: '1.0.1',
  category: 'utility',
  args: false,
  async execute(message, args) {
    message.channel.send({embed: {
        color:config.standardMessageColor,
        description: `This guild is called ${message.guild.name}.  It\'s Id is ${message.guild.id}`
      }});
  },
};
