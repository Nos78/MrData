/*
 * @Author: BanderDragon 
 * @Date: 2020-08-31 22:28:02 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-01 21:33:15
 */

CREATE TABLE ${schema~}.guild_settings
(
    g_id integer references guilds(id) ON DELETE CASCADE,
    settings jsonb,
    UNIQUE (g_id),
    PRIMARY KEY(g_id)
);
