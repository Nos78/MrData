/*
 * @Author: BanderDragon 
 * @Date: 2020-08-31 23:44:03 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-01 00:14:39
 */

WITH selectGuildId AS (
	SELECT
        id
    FROM
        guilds g
    WHERE
        g.guild_id = ${guildDiscordId}
), userIdAndGuild (u, g) AS (
	VALUES((SELECT id FROM users WHERE user_id = ${userDiscordId}),
        (SELECT selectGuildId.id FROM selectGuildId)
	)
)

UPDATE
    user_guild_settings
SET
    settings = ${settings}
FROM (
    SELECT
        u, g
    FROM
        userIdAndGuild
    ) AS uag
WHERE 
    g_id = uag.g
    AND u_id = uag.u
RETURNING *
