/*
 * @Author: BanderDragon 
 * @Date: 2020-09-01 00:44:19 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-01 00:44:39
 */

/*
  see if the user_global_settings table exist.
*/
SELECT EXISTS (
  SELECT table_name FROM information_schema.tables
  WHERE table_name = 'user_global_settings'
);
