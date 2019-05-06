/*
    Inserts a new user record.
    NOTE: We only add schema here to demonstrate the ability of class QueryFile
    to pre-format SQL with static formatting parameters when needs to be.
*/
INSERT INTO ${schema~}.users(user_id)
VALUES($1)
ON CONFLICT DO NOTHING
RETURNING *
