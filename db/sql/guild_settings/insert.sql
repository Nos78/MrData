/*
 * @Author: BanderDragon 
 * @Date: 2020-09-01 00:36:10 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-01 00:37:40
 */

WITH selectGuildId AS (
    SELECT
        id
    FROM
        guilds
    WHERE
        guild_id = ${guildDiscordId}
)

INSERT INTO
    guild_settings(g_id, settings)
SELECT
  selectGuildId.id, ${settings}
FROM
    selectGuildId
