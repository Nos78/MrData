/*
 * @Author: BanderDragon 
 * @Date: 2019-07-01 23:25:57
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-28 22:56:41
 */

const library = require('../library');
const logger = require('winston');

module.exports = {
    name: 'broadcast',
    description: `Bot *creator only* command! Broadcasts to every connected guild, using the default (or first available) channel.`,
    args: true,
    category: 'owner',
    version: '1.0.1',
    usage: '<message to send>',
    async execute(message, args) {
        // Only the bot creator can use the command 'broadcast'
        logger.debug(`${message.author.id} requested a broadcast message.  My creator is `)
        if (library.Admin.isBotOwner(message.author.id)) {
            if (args.length == 0) {
                // No args specified, reply and quit.
                message.channel.send(`${message.author}, you have not specifed a message to send.`);
                return;
            }

            logger.info("Performing a system-wide message broadcast...")
            message.client.guilds.forEach((guild) => {
                logger.debug(`getting channel for guild ${guild.name}`);
                library.Admin.findDefaultChannel(guild, message.client)
                    .then(channel => {
                        if(channel !== null) {
                            var msgToSend = library.collateArgs(0, args);
                            logger.debug(`sending to ${channel.name} on guild server ${guild.name}`);
                            logger.debug(`message: '${msgToSend}'`);
                            channel.send(msgToSend);
                        } else {
                            logger.debug(`Unable to send to ${channel.name} on guild server ${guild.name}`);
                        }
                });
            });
        } else {
            message.channel.send(`Sorry ${message.author}, you are not my creator.  You cannot use this command.`);
        }
    },
};
