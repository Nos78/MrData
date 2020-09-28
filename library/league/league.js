/**
 * @Author: BanderDragon
 * @Date:   2019-05-18T23:22:47+01:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: index.js
 * @Last modified by:   BanderDragon
 * @Last modified time: 2019-05-19T00:03:12+01:00
 */

const logger = require('winston');
const library = require('../../library');

module.exports = {
    clearChannelAndSend: async function (channel, messageToSend) {
        if (channel != null) {
            let fetched;
            do {
                fetched = await channel.fetchMessages({ limit: 100 });
                channel.bulkDelete(fetched);
            }
            while (fetched.size >= 2);
            let m = channel.send(messageToSend);
            m.delete;
        }
    },

    outputTables: function (guild, table = "") {
        if(guild && guild != "null") {
            // we want the bot not to ignore the next 3 messages
            guild.client.ignoreMyself = false;
            guild.client.myselfMaximum = guild.client.myselfMaximum + 3;

            if(!table || (table && table == "")) {
                this.outputTable("power", guild);
                this.outputTable("powerdestroyed", guild);
                this.outputTable("resourcesraided", guild);
            } else {
                this.outputTable(table, guild)
            }
        }
    },

    /**
     * Output the table for the specified stat.  This will output the ranking table into the channel with the same
     * name as the command (this can be overridden by defining the channel field within the command definition).
     * @param {string} table 
     * @param {Object} guild 
     */
    outputTable: function(table, guild) {
        if((table && table != "") && guild) {
            const command = global.library.Commands.getCommand(table, guild.client);
            if(command) {
                var channelName = command.channel;
                if(!channelName) {
                    channelName = command.name;
                }
                const chan = guild.channels.find("name", channelName);
                global.library.System.getPrefix(guild.id)
                    .then(prefix => {
                        this.clearChannelAndSend(chan, `${prefix}${command.name}`);
                });
            } else {
                logger.error(`outputTable: unable to located the specified command.`)
            }
        } else {
            logger.error(`outputTable: unable to output the table, one or more of the parameters was uninitialised.`)
        }
    }
}
