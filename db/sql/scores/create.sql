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
    power_destroyed BIGINT NOT NULL,
    resources_raided BIGINT NOT NULL,
    totalpower BIGINT NOT NULL,
    PRIMARY KEY(id)
)
