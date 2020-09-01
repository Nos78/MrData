/*
 * @Author: BanderDragon 
 * @Date: 2020-08-31 20:44:19 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-08-31 20:51:55
 */

CREATE TABLE ${schema~}.user_guild_settings
(
    u_id integer references users(id) ON DELETE CASCADE,
    g_id integer references guilds(id) ON DELETE CASCADE,
    settings jsonb,
    UNIQUE (u_id, g_id),
    PRIMARY KEY(u_id, g_id)
);
