/*
    Inserts a new user score record.
*/
INSERT INTO ${schema~}.scores(uid, guild, power_destroyed, resources_raided)
VALUES(${uid}, ${guild}, ${power_destroyed}, ${resources_raided})
RETURNING *
