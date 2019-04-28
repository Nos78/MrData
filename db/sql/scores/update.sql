/*
    Inserts or replaces a user score record.
*/
INSERT INTO ${schema~}.scores(user_id, guild_id, power_destroyed, resources_raided, totalpower)
VALUES(${user_id}, ${guild_id}, ${power_destroyed}, ${resources_raided}, ${totalpower})
ON conflict
DO UPDATE SET power_destroyed = ${power_destroyed}, resources_raided = ${resources_raided}, totalpower = ${totalpower}
RETURNING *
