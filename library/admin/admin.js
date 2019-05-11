/**
 * @Date:   2019-05-06T08:09:56+01:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: admin.js
 * @Last modified time: 2019-05-10T21:33:24+01:00
 *
 * Helper functions for Bot admin
 */

const logger = require('winston');
const library = require('../../library');
const config = require('../../config.json');

var fs = require('fs');
var rolePath = config.rolesPathAndFilename;
const roleExt = config.rolesExtension;

module.exports = {
    isBotOwner: function (uid) {
        return uid == process.env.BOT_ONWER;
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

    isPrivilegedRole: function (roleId, gid) {
        var roles = library.Admin.readRoles();
        if (roles != null) {
            for (var i = 0; i < roles.length; i++) {
                if (roles[i] == roleId) {
                    return true;
                }
            }
        }
        return false;
    }
}
