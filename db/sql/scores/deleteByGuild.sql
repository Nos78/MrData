DELETE FROM scores
USING guilds
WHERE scores.guild_id = guild.id
AND guilds.guild_id = ${guildId};
