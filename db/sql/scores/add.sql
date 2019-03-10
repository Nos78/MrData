/*
    Inserts a new user score record.
*/
INSERT INTO ${schema~}.scores(id, user, guild, power_destroyed, resources_raided)
VALUES(${id}, ${user}, ${guild}, ${power_destroyed}, ${resources_raided})
RETURNING *
