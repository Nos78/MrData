/*
 * @Author: BanderDragon 
 * @Date: 2020-09-01 01:33:48 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-01 01:34:08
 */

DELETE FROM
    user_guild_settings ugs
USING
    guilds AS g
WHERE
    ugs.g_id = g.id
    AND g.guild_id = $1
