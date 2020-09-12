/*
 * @Author: BanderDragon 
 * @Date: 2020-08-31 23:03:40 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-08-31 23:04:04
 */

DELETE FROM
    user_global_settings ugs
USING
    guilds AS g
WHERE
    ugs.g_id = g.id
    AND g.guild_id = $1
