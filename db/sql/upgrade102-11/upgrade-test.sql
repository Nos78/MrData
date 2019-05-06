CREATE TABLE public.users
(
    id serial PRIMARY KEY,
    user_id varchar UNIQUE
)

CREATE TABLE public.guilds
(
    id serial PRIMARY KEY,
    guild_id varchar UNIQUE
)

CREATE TABLE public.scores
(
    id serial NOT NULL,
    user_id varchar references users(id),
    guild_id varchar references guilds(id),
    power_destroyed BIGINT NOT NULL,
    resources_raided BIGINT NOT NULL,
    totalpower BIGINT NOT NULL,
    UNIQUE (user_id, guild_id),
    PRIMARY KEY(user_id, guild_id)
)

INSERT INTO
   guilds (guild_id)
SELECT DISTINCT
   guild_id
FROM
   scores_old
WHERE
   NOT EXISTS (SELECT *
                 FROM guilds g0
                WHERE g0.guild_id = scores_old.guild_id)
ORDER BY
    guild_id ;

INSERT INTO
   users (user_id)
SELECT DISTINCT
   user_id
FROM
   scores_old
WHERE
   NOT EXISTS (SELECT *
                 FROM users s0
                WHERE s0.user_id = scores_old.user_id)
ORDER BY
    user_id ;

INSERT INTO
    scores (user_id, guild_id, power_destroyed, resources_raided, totalpower)
SELECT
    user_id, guild_id, power_destroyed, resources_raided, totalpower
FROM
    scores_old
    JOIN users USING(user_id)
    JOIN guilds USING(guild_id)
ORDER BY
    guild_id, user_id, totalpower;
