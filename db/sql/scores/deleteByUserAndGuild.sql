DELETE
FROM
    scores S
WHERE
    user_id=ANY(
        SELECT
            id
        FROM
            users U
        WHERE
            U.user_id = ${userId}
    ) AND
    guild_id=ANY(
        SELECT
            id
        FROM
            guilds G
        WHERE
            G.guild_id = ${guildId}
    )
