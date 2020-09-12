/*
 * @Author: BanderDragon 
 * @Date: 2020-08-31 23:01:28 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-01 01:46:23
 */

DELETE FROM
    user_guild_settings ugs
USING
    guilds AS g,
    users AS u
WHERE
    ugs.g_id = g.id
    AND ugs.u_id = u.id
    AND g.guild_id = ${guildDiscordId}
    AND u.user_id = ${userDiscordId}
