/*
    Inserts or replaces a user score record.
*/
INSERT INTO ${schema~}.scores(id, uid, guild, power_destroyed, resources_raided, totalpower)
VALUES(${id}, ${uid}, ${guild}, ${power_destroyed}, ${resources_raided}, ${totalpower})
ON conflict(id)
DO UPDATE SET power_destroyed = ${power_destroyed}, resources_raided = ${resources_raided}, totalpower = ${totalpower}
RETURNING *
