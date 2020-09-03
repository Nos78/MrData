/*
 * @Author: BanderDragon 
 * @Date: 2020-08-31 22:15:28 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-08-31 22:47:48
 */
SELECT
    ugs.settings
FROM
    user_global_settings ugs
    JOIN users u ON ugs.u_id = u.id
WHERE
    u.user_id = $1