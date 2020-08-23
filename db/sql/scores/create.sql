/**
 * Creates table Users.
 * NOTE: We only add schema here to demonstrate the ability of class QueryFile
 * to pre-format SQL with static formatting parameters when needs to be.
 *
 * @Author: BanderDragon
 * @Date:   2019-03-10T13:06:32+00:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: create.sql
 * @Last modified by:   BanderDragon
 * @Last modified time: 2019-05-05T15:56:36+01:00
 */

CREATE TABLE ${schema~}.scores
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
    alliances_help INT NOT NULL DEFAULT 0,
    missions SMALLINT NOT NULL DEFAULT 0,
    UNIQUE (user_id, guild_id),
    PRIMARY KEY(user_id, guild_id)
);
