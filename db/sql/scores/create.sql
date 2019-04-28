/*
    Creates table Users.
    NOTE: We only add schema here to demonstrate the ability of class QueryFile
    to pre-format SQL with static formatting parameters when needs to be.
*/

CREATE TABLE ${schema~}.scores
(
    user_id integer references users(id),
    guild_id integer references guilds(id),
    power_destroyed BIGINT NOT NULL,
    resources_raided BIGINT NOT NULL,
    totalpower BIGINT NOT NULL,
    UNIQUE (user_id, guild_id),
    PRIMARY KEY(user_id, guild_id)
);
