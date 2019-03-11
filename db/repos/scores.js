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
        var retval = this.db.none(sql.create);
        if(!retval) {
          // Ensure that the "id" is always unique and indexed.
          retval = this.db.none(`CREATE UNIQUE INDEX idx_scores_id ON scores (id)`);
        }
        return retval;
    }

    exists() {
        return this.db.result(sql.exists, []);
    }
    // Initializes the table with some user records, and return their id-s;
    init() {
        return this.db.map(sql.init, [], row => row.id);
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
            id: +values.id,
            uid: values.uid,
            guild: values.guild,
            power_destroyed: values.power_destroyed,
            resources_raided: values.resources_raided
        });
    }

    update(values) {
      return this.db.one(sql.update, {
          id: +values.id,
          uid: values.uid,
          guild: values.guild,
          power_destroyed: values.power_destroyed,
          resources_raided: values.resources_raided
      });
    }

    // Tries to delete a user by id, and returns the number of records deleted;
    remove(id) {
        return this.db.result('DELETE FROM scores WHERE id = $1', +id, r => r.rowCount);
    }

    // Tries to find a user from id;
    findById(id) {
        return this.db.oneOrNone('SELECT * FROM scores WHERE id = $1', +id);
    }

    // Tries to find a record from user;
    findByName(uid) {
        return this.db.oneOrNone('SELECT * FROM scores WHERE uid = $1', uid);
    }

    // Finds records by guild (individual discord server)
    findByGuild(guild) {
      return this.db.oneOrNone('SELECT * from scores WHERE guild = $1', guild);
    }

    findByNameAndGuild(uid, guild) {
      var values = [];
      values.push(uid);
      values.push(guild);
      return this.db.oneOrNone('SELECT * from scores WHERE uid = $1 AND guild = $2', values);
    }

    // Returns all user records;
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

        cs.insert = new pgp.helpers.ColumnSet(['uid'], {table});
        cs.update = cs.insert.extend(['?id']);
        cs.update = cs.insert.extend({name:'guild', mod:'^'});
        cs.update = cs.insert.extend({name:'power_destroyed', mod:'int', def:0});
        cs.update = cs.insert.extend({name:'resources_raided', mod:'int', def:0});
    }
    return cs;
}

module.exports = ScoresRepository;
