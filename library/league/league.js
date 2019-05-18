/**
 * @Author: BanderDragon
 * @Date:   2019-05-18T23:22:47+01:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: index.js
 * @Last modified by:   BanderDragon
 * @Last modified time: 2019-05-18T23:44:57+01:00
 */

const logger = require('winston');
const library = require('../../library');
const config = require('../../config.json');


module.exports = {
    clearChannelAndSend: function (channel, messageToSend) {
        if(channel != null) {
            libary.Admin.deleteAllMessages(channel)
              .then (returnValue => {
                  let m = channel.send(messageToSend);
                  m.delete;
            });
        }
    },

    outputTables: function (client) {
        let chan = client.channels.find("name", "power");
        library.League.clearChannelAndSend(chan, "!power");
        let chan = client.channels.find("name", "resources-raided");
        library.League.clearChannelAndSend(chan, "!rr");
        let chan = client.channels.find("name", "power-destroyed");
        library.League.clearChannelAndSend(chan, "!pd");
    }
}
