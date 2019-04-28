/*
    Finds a scores record by user id + guild id.
    NOTE: We only add schema here to demonstrate the ability of class QueryFile
    to pre-format SQL with static formatting parameters when needs to be.
*/

SELECT * FROM ${schema~}.scores
WHERE user_id = ${userId} AND guild_id = ${guildId}
