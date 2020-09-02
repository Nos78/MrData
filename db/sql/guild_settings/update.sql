/*
 * @Author: BanderDragon 
 * @Date: 2020-08-31 23:07:20 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-02 19:56:01
 */

WITH selectGuildId AS (
	SELECT
        id
    FROM
        guilds g
    WHERE
        g.guild_id = ${guildDiscordId}
)

UPDATE
    guild_settings
SET
    settings = ${settings}
FROM (
    SELECT
        id
    FROM
        selectGuildId
    ) AS sgi
WHERE 
    g_id = sgi.id
ON CONFLICT DO NOTHING
RETURNING *
