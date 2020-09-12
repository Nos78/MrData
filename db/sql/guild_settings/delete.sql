/*
 * @Author: BanderDragon 
 * @Date: 2020-08-31 22:55:39 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-01 00:53:41
 */

DELETE FROM
    guild_settings gs
USING
    guilds AS g
WHERE
    gs.g_id = g.id
    AND g.guild_id = $1
