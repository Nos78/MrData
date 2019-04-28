'use strict';

const sql = require('../sql').scores;

const cs = {}; // Reusable ColumnSet objects.

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

    // Adds a new user, and returns the new object;
    add(values) {
        return this.db.one(sql.add, {
            user_id: values.userId,
            guild_id: values.guildId,
            power_destroyed: values.power_destroyed,
            resources_raided: values.resources_raided,
            totalpower: values.totalpower
        });
    }

    update(values) {
      return this.db.one(sql.update, {
          uid: values.userId,
          guild: values.guildId,
          power_destroyed: values.power_destroyed,
          resources_raided: values.resources_raided,
          totalpower: values.totalpower
      });
    }

    // Tries to delete a user's scores by id, and returns the number of records deleted;
    removeUser(userId) {
        return this.db.result('DELETE FROM scores WHERE user_id = $1', +userId, r => r.rowCount);
    }

    // Tries to find a user's scores from id;
    findByUser(userId) {
        return this.db.result('SELECT * FROM scores WHERE user_id = $1', +userId);
    }

    // Finds scores by guild (individual discord server)
    findByGuild(guildId) {
      return this.db.result('SELECT * from scores WHERE guild_id = $1', +guildId);
    }

    findByUserAndGuild(userId, guildId) {
      var values = [];
      values.push(uid);
      values.push(guild);
      return this.db.oneOrNone('SELECT * from scores WHERE user_id = $1 AND guild_id = $2', values);
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
        cs.update = cs.insert.extend({name:'guild_id', mod:'^'});
        cs.update = cs.insert.extend({name:'power_destroyed', mod:'int', def:0});
        cs.update = cs.insert.extend({name:'resources_raided', mod:'int', def:0});
        cs.update = cs.insert.extend({name:'totalpower', mod:'int', def:0});
    }
    return cs;
}

module.exports = ScoresRepository;
