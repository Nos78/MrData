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

    outputTables: function (client) {
        // we want the bot not to ignore the next 3 messages
        client.ignoreMyself = false;
        client.myselfMaximum = client.myselfMaximum + 3;

        let chan = client.channels.find("name", "power");
        this.clearChannelAndSend(chan, "!power");
        chan = client.channels.find("name", "resources-raided");
        this.clearChannelAndSend(chan, "!rr");
        chan = client.channels.find("name", "power-destroyed");
        this.clearChannelAndSend(chan, "!pd");
    }
}
