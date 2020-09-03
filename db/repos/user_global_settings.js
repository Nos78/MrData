/*
 * @Author: BanderDragon 
 * @Date: 2020-09-01 01:13:33 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-01 02:23:49
 */

'use strict';

const sql = require('../sql').user_global_settings;

const cs = {}; // Reusable ColumnSet objects.

 /**
  * @class UserGlobalSettingsRepository
  * @description Class representing the UserGlobalSettingsRepository. This class encapsulates the logic required
  * to access the data source(s) and the data contained within the model layer.
  */
class UserGlobalSettingsRepository {
    /**
     * Constructor, creates an instance of UserGlobalSettingsRepository.
     * @date 31/08/2020
     * @param {Database} db
     * @param {pg-promise} pgp
     * @memberof UserGlobalSettingsRepository
     */
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
        
        // set-up all ColumnSet objects, if needed:
        createColumnsets(pgp);
    }

    // ************************************************************************
    // TABLE Operations
    // Create, drop, empty and check if 'user_global_settings' table exists.
    // ************************************************************************

    /**
     * @description Creates the user_global_settings table using the defined SQL query. A successful
     * call to this function, once the promise is completed, should return no data. Any data returned
     * by the query will represent an error.
     * @returns {Promise<QueryResultError>} A promise object representing the result.
     * @memberof UserGlobalSettingsRepository
     */
    create() {
        return this.db.none(sql.create);
    }

    /**
     * @description Check if the user_global_settings table exists.
     * @returns {Promise<Result>} the result of the query, with a boolean 'exists' field.
     * @memberof UserGlobalSettingsRepository
     */
    exists() {
        return this.db.result(sql.exists, []);
    }

    /**
     * @description Drops (deletes) the user_global_settings table.  Once the promise is completed, a successful
     * result will contain no data. Any data return will describe the error encountered.
     * @returns {Promise<QueryResultError>} A promise object defining the result of the query.
     * @memberof UserGlobalSettingsRepository
     */
    drop() {
        return this.db.none('DROP TABLE user_global_settings');
    }

    /**
     * @description Empties the user_global_settings table, but keeps the table in the database.
     * Once the promise is completed, a successful operation will contain no data.  Any data
     * returned will describe the error encountered.
     * @returns {Promise<QueryResultError>} A promise object defining the result of the query.
     * @memberof UserGlobalSettingsRepository
     */
    empty() {
        return this.db.none(sql.empty);
    }

    // ************************************************************************
    // DATA ACCESS
    // Perform operations that manipulate the data contained within the
    // 'user_global_settings' table
    // add, update/insert (upsert), remove
    // ************************************************************************

    /**
     * @description Adds a new record for userId & settings object (JSON), and returns the object.  The
     * return value may be null if the add operation was unsuccessful.
     * @param {string} userId
     * @param {Object} settings json object
     * @returns {Promise<Result>} resolves with 1 row, or null - multiple results generate a {QueryResultError}
     * @memberof UserGlobalSettingsRepository
     */
    add(userId, settings) {
        return this.db.oneOrNone(sql.insert, {uId: userId, settings: settings});
    }

    /**
     * @description Adds (inserts) a new record for userId & settings object (JSON), and returns the object.  The
     * return value may be null if the add operation was unsuccessful.
     * @param {string} userId
     * @param {Object} settings json object
     * @returns {Promise<Result>} resolves with 1 row, or null - multiple results generate a {QueryResultError}
     * @memberof UserGlobalSettingsRepository
     */
    insert(userId, settings) {
        return this.add(userId, settings);
    }

    /**
     * @description Updates or Inserts a new record for a given userId and settings object.
     * @param {string} userId - the user id (the discord alphanumeric id string)
     * @param {Object} settings - Json object describing the settings for userId
     * @returns {Promise<Result>} A single row object containing the new record, or null. A failure returns a QueryResultError
     * @memberof UserGlobalSettingsRepository
     */
    upsert(userId, settings) {
        return this.add(userId, settings)
          .then (user => {
            if (user == null) {
              return this.update(userId, settings);
            }
        })
    }

    /**
     * @description Updates the record for user with the given discord user id.
     * @param {string} userId - the discord id of the user being updated.
     * @param {Object} settings - a Json describing the settings for a given user id.
     * @returns {Promise<Result>} - either a single row object on success, or a QueryResultError on failure
     * @memberof UserGlobalSettingsRepository
     */
    update(userId, settings) {
        return this.db.one(sql.update, {
            userDiscordId: userId,
            settings: settings
        });
    }

    /**
     * @description Removes a record with the given discord user id from the user_global_settings table.
     * @param {string} userId - the discord ID of the user
     * @returns {Promise<Result>} - A Promise resolving to a Result object
     * @memberof UserGlobalSettingsRepository
     */
    remove(userId) {
        return this.db.result(sql.remove, +userId, r => r.rowCount);
    }

    // ************************************************************************
    // FIND Operations
    // methods to find records in the user_global_settings table.
    // ************************************************************************

    /**
     * Finds the record for a given discord user id.
     * @param {string} userId 
     * @returns {Promise<Result>} On resolution of the promise, returns the row
     * or null. A failure produces a QueryResultError.
     */
    finduserSettingsById(userId) {
        return this.db.oneOrNone(sql.find, userId);
    }

    /**
     * @description Returns all the records within the 'user_global_settings' table.
     * @returns {Promise<Result>} When the Promise is resolved, contains an
     * array of rows. If the table is empty, returns an empty array.
     * @memberof UserGlobalSettingsRepository
     */
    all() {
        return this.db.any('SELECT * FROM user_global_settings ugs JOIN users u ON u.id = ugs.u_id');
    }
    
    // ************************************************************************
    // UTILITY Operations
    // Miscellaneous methods not defined by one of the categories above.
    // ************************************************************************

    // Returns the total number of user_global_settings;
    total() {
        return this.db.one('SELECT count(*) FROM user_global_settings', [], a => +a.count);
    }
}

//////////////////////////////////////////////////////////
// Example of statically initializing ColumnSet objects:

function createColumnsets(pgp) {
    // create all ColumnSet objects only once:
    if (!cs.insert) {
        // Type TableName is useful when schema isn't default "public" ,
        // otherwise you can just pass in a string for the table name.
        const table = new pgp.helpers.TableName({table: 'user_global_settings', schema: 'public'});

        cs.insert = new pgp.helpers.ColumnSet(['u_id'], {table});
        cs.update = cs.insert.extend({ name: 'settings', mod: ':raw'});
    }
    return cs;
}

module.exports = UserGlobalSettingsRepository;
