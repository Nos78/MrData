/*
 * @Author: BanderDragon 
 * @Date: 2020-08-31 22:15:28 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-08-31 22:38:24
 */
SELECT
    gs.settings
FROM
    guild_settings gs
    JOIN guilds g ON gs.g_id = g.id
WHERE
    g.guild_id = $1