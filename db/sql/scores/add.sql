/*
    Inserts a new user score record.
*/
INSERT INTO ${schema~}.scores(user_id, guild_id, power_destroyed, resources_raided, totalpower)
VALUES(${user_id}, ${guild_id}, ${power_destroyed}, ${resources_raided}, ${totalpower})
RETURNING *
