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
    /**
     * is this user the owner of the bot?
     * @param {Snowflake} uid
     * 
     * @returns boolean
     */
    isBotOwner: function (uid) {
        //return uid == process.env.BOT_ONWER;
        var id = uid.toString().trim();
        var owner = this.botOwnerId().toString().trim();
        logger.debug(`isBotOwner() uid = '${id}', botOwner = '${owner}'`);
        logger.debug(`uid == botOwnerId = ${id == owner}`);
        logger.debug(`uid == botOwnerId = ${5 == "5"}`);
        return id === owner;
    },

    /**
     * Returns the discord user ID of the bot owner.
     * This is hardcoded in the config file and is not user-editable (unless you have access to the VM running the bot!)
     * 
     * @returns {string}
     */
    botOwnerId: function () {
        return config.botCreator;
    },

    /**
     * is this user a server owner?
     * @param {Snowflake} uid 
     * @param {Snowflake} gid 
     * @param {object} client - Discord API object
     * 
     * @returns {boolean}
     */
    isOwner: function (uid, gid, client) {
        let guild = client.guilds.get(gid);
        return guild.ownerID == uid;
    },

    /**
     * Is this user an admin of this server?
     * @param {Snowflake} uid - user ID being queried
     * @param {Snowflake} gid - guild ID of the server being queried
     * @param {object} client - Discord API object
     * 
     * @returns {boolean}
     */
    isAdmin: function (uid, gid, client) {
        return client.guilds.get(gid).members.get(uid).hasPermission("ADMINISTRATOR");
    },

    /**
     * Checks whether a user is privileged, either marked as an Administrator OR is a member of a privileged role
     * @param {Snowflake} uid  - user ID to check
     * @param {Snowflake} gid - guild ID
     * @param {object} client - Discord API object
     */
    isPrivileged: function(uid, gid, client) {
        if(this.isAdmin(uid, gid, client)) {
            return true;
        }
        
        let guild = client.guilds.get(gid);
        if (guild) {
            let member = guild.members.get(uid);
            if (member) {
                return this.hasPrivilegedRole(member, gid);
            }
        }
    },

    /**
     * Does the user have the specified permission?
     * @param {string} permissionToCheck  - https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
     * @param {int} uid - id of the user to query
     * @param {int} gid - the id of the guild the user is a member of
     * @param {object} client - The Discord client object
     * 
     * @returns {boolean}
     */
    hasPermission: function (permissionToCheck, uid, gid, client) {
        return client.guilds.get(gid).members.get(uid).hasPermission(permissionToCheck);
    },

    /**
     * Returns the owner of the server being queried.
     * @param {int} gid - guild ID of the server being queried
     * @param {object} client - Discord client object
     * 
     * @returns {object} GuildMember object of the owner/user
     */
    owner: function(gid, client) {
        return client.guilds.get(gid).owner;
    },

    /**
     * Get a guild object using a given id
     * @param {int} gid 
     * @param {object} client
     * @returns guild object
     */
    getGuild: function(gid, client) {
        return client.guilds.get(gid);
    },

    /**
     * Get a member from a given user ID and guid ID
     * @param {int} uid 
     * @param {int} gid 
     * @param {object} client
     * @returns member (user) object
     */
    getMember: function(uid, gid, client) {
        return client.guilds.get(gid).members.get(uid);
    },

    /**
     * Read roles the given gid, stored in the roles directory
     * @param {int} gid - guild ID being queried
     * 
     * @returns the roles list, in JSON format
     */
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

    /**
     * Writes the roles file for a given guild id into the roles directory
     * @param {json object} roles 
     * @param {*} gid 
     * @returns boolean indicating success or failure
     */
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

    /**
     * Indicates whether the specified user has a privileged role. The roles come from the roles directory for a given guild id.
     * @param {object} member 
     * @param {int} gid
     *  
     * @returns boolean
     */
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

    /**
     * Deletes all the messages from a given channel
     * @param {object} channel 
     */
    deleteAllMessages: async function (channel) {
        let fetched;
        do {
            fetched = await channel.fetchMessages({limit: 100});
            channel.bulkDelete(fetched);
        }
        while(fetched.size >= 2);
    },

    /**
     * Finds a channel that the bot considers to the the 'default', or welcome, channel
     * @param {object} guild - guild object
     * @param {object} client - Discord API object
     */
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
            }
            else {
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
            }
            else {
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
