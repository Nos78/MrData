/*
 * @Author: BanderDragon 
 * @Date: 2020-09-01 01:34:49 
 * @Last Modified by:   BanderDragon 
 * @Last Modified time: 2020-09-01 01:34:49 
 */

DELETE FROM
    user_guild_settings ugs
USING
    users AS u
WHERE
    ugs.u_id = u.id
    AND g.user_id = $1
