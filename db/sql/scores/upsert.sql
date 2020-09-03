/*
 * @Author: BanderDragon 
 * @Date: 2019-03-10 14:40:47 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-04 00:07:47
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
		hostiles_destroyed, hostiles_total_damage, resources_mined, current_level, alliances_help, missions
	)
SELECT
  userAndGuild.u, userAndGuild.g,
  ${powerDestroyed}, ${resourcesRaided},
	${totalPower}, ${pvpShipsDestroyed},
	${pvpKdRatio}, ${pvpTotalDamage},
	${hostilesDestroyed}, ${hostilesTotalDamage},
	${resourcesMined}, ${currentLevel},
	${alliancesHelpSent}, ${missions}
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
  current_level = ${currentLevel},
  alliances_help = ${alliancesHelpSent},
  missions = ${missions}
RETURNING *
