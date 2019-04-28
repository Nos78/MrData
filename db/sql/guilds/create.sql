/*
    Creates table Guilds.
    NOTE: We only add schema here to demonstrate the ability of class QueryFile
    to pre-format SQL with static formatting parameters when needs to be.
*/

CREATE TABLE ${schema~}.guilds
(
    id serial PRIMARY KEY,
    guild_id varchar UNIQUE
);
