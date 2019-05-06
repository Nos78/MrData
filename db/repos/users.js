/**
 * @Date:   2019-04-24T09:29:15+01:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: users.js
 * @Last modified time: 2019-05-06T01:42:52+01:00
 */

'use strict';

const sql = require('../sql').users;

const cs = {}; // Reusable ColumnSet objects.

/*
 This repository mixes hard-coded and dynamic SQL, primarily to show a diverse example of using both.
 */

class UsersRepository {
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
    // returns null if the user already exists
    add(user_id) {
        return this.db.oneOrNone(sql.add, user_id)
          .then (user => {
            if (user == null || user.length == 0) {
              findUserById(user_id)
                .then (user => {
                  return user;
              })
            }
            return user;
        });
    }

    // Tries to delete a user by id, and returns the number of records deleted;
    remove(user_id) {
        return this.db.result('DELETE FROM users WHERE user_id = $1', +id, r => r.rowCount);
    }

    // Tries to find a user from their discord user id;
    findUserById(user_id) {
        return this.db.oneOrNone('SELECT * FROM users WHERE user_id = $1', user_id);
    }

    // Returns all user records;
    all() {
        return this.db.any('SELECT * FROM users');
    }

    // Returns the total number of users;
    total() {
        return this.db.one('SELECT count(*) FROM users', [], a => +a.count);
    }
}

//////////////////////////////////////////////////////////
// Example of statically initializing ColumnSet objects:

function createColumnsets(pgp) {
    // create all ColumnSet objects only once:
    if (!cs.insert) {
        // Type TableName is useful when schema isn't default "public" ,
        // otherwise you can just pass in a string for the table name.
        const table = new pgp.helpers.TableName({table: 'users', schema: 'public'});

        cs.insert = new pgp.helpers.ColumnSet(['user_id'], {table});
        cs.update = cs.insert.extend(['?id']);
    }
    return cs;
}

module.exports = UsersRepository;
