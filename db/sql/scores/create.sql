/*
    Creates table Users.
    NOTE: We only add schema here to demonstrate the ability of class QueryFile
    to pre-format SQL with static formatting parameters when needs to be.
*/

CREATE TABLE ${schema~}.scores
(
    id text PRIMARY KEY,
    user text NOT NULL,
    guild text NOT NULL,
    power_destroyed INTEGER,
    resources_raided INTEGER
)
