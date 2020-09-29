/*
 * @Author: BanderDragon 
 * @Date: 2019-05-05 18:46:55
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-29 02:57:13
 */

const config = require('../config.json');

module.exports = {
  name: 'guildid',
  aliases: ['guild'],
  description: 'Returns the discord Id of the current guild (server).',
  cooldown: 60,
  version: '1.0.0',
  category: 'utility',
  args: false,
  async execute(message, args) {
    message.channel.send({embed: {
        color:config.standardMessageColor,
        description: `This guild is called ${message.guild.name}.  It\'s Id is ${message.guild.id}`
      }});
  },
};
