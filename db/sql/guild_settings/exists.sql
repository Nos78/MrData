/*
 * @Author: BanderDragon 
 * @Date: 2020-09-01 00:43:53 
 * @Last Modified by:   BanderDragon 
 * @Last Modified time: 2020-09-01 00:43:53 
 */

/*
  see if the guild_settings table exist.
*/
SELECT EXISTS (
  SELECT table_name FROM information_schema.tables
  WHERE table_name = 'guild_settings'
);
