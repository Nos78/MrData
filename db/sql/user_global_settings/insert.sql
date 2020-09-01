/*
 * @Author: BanderDragon 
 * @Date: 2020-09-01 00:19:08 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-01 00:29:16
 */

WITH selectUserId AS (
    SELECT
        id
    FROM
        users
    WHERE
        user_id = ${userDiscordId}
)

INSERT INTO
    user_global_settings(u_id, settings)
SELECT
  selectUserId.id, ${settings}
FROM
    selectUserId
