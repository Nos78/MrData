/**
 * @Date:   2019-05-06T08:09:56+01:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: admin.js
 * @Last modified time: 2019-07-02T02:45:13+01:00
 */

const logger = require('winston');
const config = require('../../config.json');

var fs = require('fs');
var rolePath = config.rolesPathAndFilename;
const roleExt = config.rolesExtension;

module.exports = {
    isBotOwner: function (uid) {
        //return uid == process.env.BOT_ONWER;
        var id = uid.toString().trim();
        var owner = this.botOwnerId().toString().trim();
        logger.debug(`isBotOwner() uid = '${id}', botOwner = '${owner}'`);
        logger.debug(`uid == botOwnerId = ${id == owner}`);
        logger.debug(`uid == botOwnerId = ${5 == "5"}`);
        return id === owner;
    },

    botOwnerId: function () {
        return config.botCreator;
    },

    isOwner: function (uid, gid, client) {
        let guild = client.guilds.get(gid);
        return guild.ownerID == uid;
    },

    isAdmin: function (uid, gid, client) {
        return client.guilds.get(gid).members.get(uid).hasPermission("ADMINISTRATOR");
    },

    owner: function(gid, client) {
        return client.guilds.get(gid).owner;
    },

    readRoles: function (gid) {
        var roleFilename = rolePath + gid + roleExt;
        logger.debug(`Reading ${roleFilename}`);
        var data = null;
        try {
            data = JSON.parse(fs.readFileSync(roleFilename, 'utf8').toString());
            logger.debug(`${JSON.stringify(data)}`);
        } catch (err) {
            logger.debug(`Error reading ${roleFilename}, ${JSON.stringify(err)}`);
        }
        if (data == null) {
            data = [];
        }
        return data;
    },

    writeRoles: function (roles, gid) {
        var roleFilename = rolePath + gid + roleExt;
        var onlyPath = require('path').dirname(roleFilename);
        if (!fs.existsSync(onlyPath)) {
            fs.mkdirSync(onlyPath);
        }
        logger.debug(`Writing ${roleFilename}`);
        var data = JSON.stringify(roles);
        try {
            fs.writeFileSync(roleFilename, data, 'utf8');
            logger.debug(`Written ${data} to file ${roleFilename}`);
        } catch (err) {
            logger.debug(`Error writing ${roleFilename}, ${JSON.stringify(err)}`);
            return false;
        }
        return true;
    },

    hasPrivilegedRole: function (member, gid) {
        var roles = this.readRoles(gid);
        if (roles != null) {
            for (var i = 0; i < roles.length; i++) {

                if (member.roles.has(roles[i])) {
                    return true;
                }
            }
        }
        return false;
    },

    deleteAllMessages: async function (channel) {
        let fetched;
        do {
            fetched = await channel.fetchMessages({limit: 100});
            channel.bulkDelete(fetched);
        }
        while(fetched.size >= 2);
    },

    findDefaultChannel: async function (guild, client) {
        /* This will perform 3 different attempts to find a 'default' channel.
         * 1. Find a channel called 'welcome' or 'general'.
         * 2. Find a channel @everyone can send messages to, and post to the
         *    most active channel in the list.
         * 3. Find the first available channel to post into (not perferred..
         *    since admin privs mean you can post to every channel!)
         */
        if(guild != null && client != null) {
        var channel = guild.channels.find('name', `welcome`);

        logger.debug(`testing option 1 for guild ${guild.name}`);
        logger.debug(`...checking 'welcome' channel`);
        if(channel == null || channel.type !== 'text' || !channel.permissionsFor(guild.me).has('SEND_MESSAGES')) {
            logger.debug(`......checking 'general' channel`)
            channel = guild.channels.find('name', 'general');
        } else {
          // return channel from option 1 (welcome)
          logger.debug(`......using ${channel.name}`);
          return channel;
        }

        if(channel == null || channel.type.trim() !== 'text' || !channel.permissionsFor(guild.me).has('SEND_MESSAGES')) {
            logger.debug(`testing option 2 for guild ${guild.name}`);
            // attempt option 2
            var everyone = guild.roles.first();
            logger.debug(`...everyone role: ${everyone.name}`);

            if(everyone.name.trim() == '@everyone') {
                guild.channels.forEach((channel) => {
                    logger.debug(`...checking ${channel.name}`);
                    if(channel !== null && channel.type.trim() == 'text' && channel.permissionsFor(everyone).has('SEND_MESSAGES')) {
                        // return channel from option 2
                        logger.debug(`......using ${channel.name}`);
                        return channel;
                    } else {
                        logger.debug(`......not suitable ${channel.name}`);
                    }
                });
            }
        } else {
            // channel from option 1 (general)
            if(channel.type.trim() == 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES')) {
                logger.debug(`.........using ${channel.name}`);
                return channel;
            }
        }

        // option 3
        channel = guild.channels.sort(function (chan1, chan2) {
            if(chan1.type !== 'text') return 1;
            if(!chan1.permissionsFor(guild.me).has('SEND_MESSAGES')) return -1;
            return chan1.position < chan2.position ? -1 : 1;
        }).first();

        return channel;
    }
    }
}
