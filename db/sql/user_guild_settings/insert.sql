/*
 * @Author: BanderDragon 
 * @Date: 2020-09-01 00:31:03 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-02 19:55:10
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

INSERT INTO
    user_guild_settings(u_id, g_id, settings)
    SELECT
        userIdAndGuild.u,
        userIdAndGuild.g,
        ${settings}
    FROM
        userIdAndGuild
ON CONFLICT DO NOTHING
RETURNING *