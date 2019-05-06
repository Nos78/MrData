/**
 * @Author: BanderDragon
 * @Date:   2019-04-28T03:17:49+01:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: upgrade.sql
 * @Last modified by:   BanderDragon
 * @Last modified time: 2019-05-05T15:57:32+01:00
 */



ALTER TABLE scores
    RENAME TO scores_old;
ALTER TABLE scores_old
    RENAME COLUMN uid TO user_id;
ALTER TABLE scores_old
    RENAME COLUMN guild TO guild_id;
ALTER TABLE scores_old
    RENAME COLUMN totalpower TO total_power;

CREATE TABLE guilds
(
    id serial PRIMARY KEY,
    guild_id varchar UNIQUE
);

INSERT INTO
   guilds (guild_id)
SELECT DISTINCT
   guild_id
FROM
   scores_old
WHERE
   NOT EXISTS (SELECT *
     FROM guilds g0
     WHERE g0.guild_id = scores_old.guild_id
   )
ORDER BY
    guild_id ;

CREATE TABLE users
(
    id serial PRIMARY KEY,
    user_id varchar UNIQUE
);

INSERT INTO
   users (user_id)
SELECT DISTINCT
   user_id
FROM
   scores_old
WHERE
   NOT EXISTS (SELECT *
     FROM users s0
     WHERE s0.user_id = scores_old.user_id
   )
ORDER BY
    user_id ;

CREATE TABLE scores
(
    user_id integer references users(id) ON DELETE CASCADE,
    guild_id integer references guilds(id) ON DELETE CASCADE,
    power_destroyed BIGINT NOT NULL DEFAULT 0,
    resources_raided BIGINT NOT NULL DEFAULT 0,
    total_power BIGINT NOT NULL DEFAULT 0,
    pvp_ships_destroyed INT NOT NULL DEFAULT 0,
    pvp_kd_ratio FLOAT NOT NULL DEFAULT 0.0,
    pvp_total_damage BIGINT NOT NULL DEFAULT 0,
    hostiles_destroyed INT NOT NULL DEFAULT 0,
    hostiles_total_damage BIGINT NOT NULL DEFAULT 0,
    resources_mined INT NOT NULL DEFAULT 0,
    current_level SMALLINT NOT NULL DEFAULT 0,
    UNIQUE (user_id, guild_id),
    PRIMARY KEY(user_id, guild_id)
);

INSERT INTO
    scores (user_id, guild_id, power_destroyed, resources_raided, total_power)
SELECT
    users.id, guilds.id, power_destroyed, resources_raided, total_power
FROM
    scores_old
    JOIN users USING(user_id)
    JOIN guilds USING(guild_id)
ORDER BY
    guild_id, user_id, total_power;
