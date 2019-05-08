/**
 * Inserts or replaces a user's score record for a given guild_id.
 * Using CTE, make sure the user Id exists
 *
 * @Author: BanderDragon
 * @Date:   2019-03-10T14:40:47+00:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: upsert.sql
 * @Last modified by:
 * @Last modified time: 2019-05-07T22:43:18+01:00
 */
WITH insUser AS (
	INSERT INTO users (user_id)
	VALUES (${userId})
	ON CONFLICT DO NOTHING
    RETURNING id
), selUser AS (
	SELECT insUser.id FROM insUser
		UNION ALL
	SELECT id FROM users WHERE user_id = ${userId}
), userAndGuild (u, g) AS (
	VALUES((SELECT selUser.id FROM selUser),
		(SELECT id FROM guilds WHERE guild_id = ${guildId})
	)
)

INSERT INTO
  scores (
		user_id, guild_id, power_destroyed, resources_raided,
		total_power, pvp_ships_destroyed, pvp_kd_ratio, pvp_total_damage,
		hostiles_destroyed, hostiles_total_damage, resources_mined, current_level
	)
SELECT
  userAndGuild.u, userAndGuild.g,
  ${powerDestroyed}, ${resourcesRaided},
	${totalPower}, ${pvpShipsDestroyed},
	${pvpKdRatio}, ${pvpTotalDamage},
	${hostilesDestroyed}, ${hostilesTotalDamage},
	${resourcesMined}, ${currentLevel}
FROM
    userAndGuild
ON CONFLICT (user_id, guild_id) DO UPDATE SET
  power_destroyed = ${powerDestroyed},
  resources_raided = ${resourcesRaided},
  total_power = ${totalPower},
  pvp_ships_destroyed = ${pvpShipsDestroyed},
  pvp_kd_ratio = ${pvpKdRatio},
  pvp_total_damage = ${pvpTotalDamage},
  hostiles_destroyed = ${hostilesDestroyed},
  hostiles_total_damage = ${hostilesTotalDamage},
  resources_mined = ${resourcesMined},
  current_level = ${currentLevel}
RETURNING *
