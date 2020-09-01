/*
 * @Author: BanderDragon 
 * @Date: 2020-08-31 18:15:51 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-08-31 20:51:51
 */

CREATE TABLE ${schema~}.user_global_settings
(
    u_id integer references users(id) ON DELETE CASCADE,
    settings jsonb
    UNIQUE (u_id),
    PRIMARY KEY(u_id)
);
