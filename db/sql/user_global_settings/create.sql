/*
 * @Author: BanderDragon 
 * @Date: 2020-08-31 18:15:51 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-01 21:33:22
 */

CREATE TABLE ${schema~}.user_global_settings
(
    u_id integer references users(id) ON DELETE CASCADE,
    settings jsonb,
    UNIQUE (u_id),
    PRIMARY KEY(u_id)
);
