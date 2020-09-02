/*
 * @Author: BanderDragon 
 * @Date: 2020-08-31 22:15:28 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-02 06:49:32
 */
SELECT
    ugs.settings
FROM
    user_guild_settings ugs
    JOIN users u ON ugs.u_id = u.id
    JOIN guilds g ON ugs.g_id = g.id
WHERE
    u.user_id = ${userDiscordId}
    AND g.guild_id = ${guildDiscordId}