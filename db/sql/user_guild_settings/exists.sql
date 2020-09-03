/*
 * @Author: BanderDragon 
 * @Date: 2020-09-01 00:45:13 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-01 00:47:12
 */

/*
  see if the user_guild_settings table exist.
*/
SELECT EXISTS (
  SELECT table_name FROM information_schema.tables
  WHERE table_name = 'user_guild_settings'
);
