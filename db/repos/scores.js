/**
 * @Author: BanderDragon
 * @Date:   2019-03-10T12:45:21+00:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: scores.js
 * @Last modified by:
 * @Last modified time: 2019-05-07T22:38:50+01:00
 */
'use strict';

const sql = require('../sql').scores;

const cs = {}; // Reusable ColumnSet objects.

const logger = require('winston');

class ScoresRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;

        // set-up all ColumnSet objects, if needed:
        createColumnsets(pgp);
    }

    // Creates the table;
    create() {
        return this.db.none(sql.create);
    }

    exists() {
        return this.db.result(sql.exists, []);
    }

    // Drops the table;
    drop() {
        return this.db.none(sql.drop);
    }

    // Removes all records from the table;
    empty() {
        return this.db.none(sql.empty);
    }

    upsert(values) {
      return this.db.one(sql.upsert, {
          userId: values.user_id,
          guildId: values.guild_id,
          powerDestroyed: values.power_destroyed,
          resourcesRaided: values.resources_raided,
          totalPower: values.total_power,
          pvpShipsDestroyed: values.pvp_ships_destroyed,
          pvpKdRatio: values.pvp_kd_ratio,
          pvpTotalDamage: values.pvp_total_damage,
          hostilesDestroyed: values.hostiles_destroyed,
          hostilesTotalDamage: values.hostiles_total_damage,
          resourcesMined: values.resources_mined,
          currentLevel: values.current_level,
          alliancesHelpSent: values.alliances_help,
          missions: values.missions
      });
    }

    // Tries to delete a user's scores by id, and returns the number of records deleted;
    removeUser(userId) {
        return this.db.result('DELETE FROM scores USING users WHERE users.user_id = $1', +userId, r => r.rowCount);
    }

    // Tries to find a user's scores from id;
    findByUser(userId) {
        return this.db.manyOrNone(sql.findByUser, {
          userId: userId
        });
    }

    // Finds scores by guild (individual discord server)
    findByGuild(guildId, orderBy) {
      if (orderBy == null || orderBy.length == 0) {
        orderBy = 'user_id';
      }
      logger.debug(`findByGuild(${guildId}, ${orderBy}`);
      return this.db.any(sql.findByGuild, {
        guildId: guildId, orderBy: orderBy
      });
    }

    findByUserAndGuild(userId, guildId) {
      return this.db.oneOrNone(sql.findByUserAndGuild, {
        userId: userId, guildId: guildId
      });
    }

    // Returns all scores records;
    all() {
        return this.db.any('SELECT * FROM scores');
    }

    // Returns the total number of scores;
    total() {
        return this.db.one('SELECT count(*) FROM scores', [], a => +a.count);
    }
}

//////////////////////////////////////////////////////////
// Example of statically initializing ColumnSet objects:

function createColumnsets(pgp) {
    // create all ColumnSet objects only once:
    if (!cs.insert) {
        // Type TableName is useful when schema isn't default "public" ,
        // otherwise you can just pass in a string for the table name.
        const table = new pgp.helpers.TableName({table: 'scores', schema: 'public'});

        cs.insert = new pgp.helpers.ColumnSet(['user_id'], {table});
        cs.update = cs.insert.extend({ name: 'guild_id', mod:'^'});
        cs.update = cs.insert.extend({ name: 'power_destroyed', mod:'bigint', def:0});
        cs.update = cs.insert.extend({ name: 'resources_raided', mod:'bigint', def:0});
        cs.update = cs.insert.extend({ name: 'total_power', mod:'bigint', def:0});
        cs.update = cs.insert.extend({ name: 'pvp_ships_destroyed', mod: 'int', def: 0 });
        cs.update = cs.insert.extend({ name: 'pvp_kd_ratio', mod: 'float', def: 0.0 });
        cs.update = cs.insert.extend({ name: 'pvp_total_damage', mod: 'bigint', def: 0 });
        cs.update = cs.insert.extend({ name: 'hostiles_destroyed', mod: 'int', def: 0 });
        cs.update = cs.insert.extend({ name: 'hostiles_total_damage', mod: 'bigint', def: 0 });
        cs.update = cs.insert.extend({ name: 'resources_mined', mod: 'int', def: 0 });
        cs.update = cs.insert.extend({ name: 'current_level', mod: 'smallint', def: 0 });
        cs.update = cs.insert.extend({ name: 'alliances_help', mod: 'int', def: 0 });
        cs.update = cs.insert.extend({ name: 'missions', mod: 'smallint', def: 0 });
    }
    return cs;
}

module.exports = ScoresRepository;
