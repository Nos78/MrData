/*
    Creates table Users.
    NOTE: We only add schema here to demonstrate the ability of class QueryFile
    to pre-format SQL with static formatting parameters when needs to be.
*/

CREATE TABLE ${schema~}.scores
(
    id serial NOT NULL,
    uid text NOT NULL,
    guild text NOT NULL,
    power_destroyed BIGINT,
    resources_raided BIGINT,
    PRIMARY KEY(id)
)
