/*
 * @Author: BanderDragon 
 * @Date: 2020-08-31 23:44:03 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-01 00:18:23
 */

WITH selectUserId AS (
    SELECT
        id
    FROM
        users
    WHERE
        user_id = ${userDiscordId}
)

UPDATE
    user_global_settings
SET
    settings = ${settings}
FROM (
    SELECT
        id
    FROM
        selectUserId
    ) AS sui
WHERE 
    u_id = sui.id
RETURNING *
