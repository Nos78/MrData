/**
 * @Author: BanderDragon
 * @Date:   2019-05-06T08:09:56+01:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: create.sql
 * @Last modified by:   BanderDragon
 * @Last modified time: 2019-05-06T20:52:57+01:00
 *
 * Creates table Guilds.
 * NOTE: We only add schema here to demonstrate the ability of class QueryFile
 * to pre-format SQL with static formatting parameters when needs to be.
 */
CREATE TABLE ${schema~}.guilds
(
    id serial PRIMARY KEY,
    guild_id varchar UNIQUE
);
