/*
 * @Author: BanderDragon 
 * @Date: 2020-09-01 01:22:19 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-02 19:57:16
 */

'use strict';

const { loggers } = require('winston');

const sql = require('../sql').user_guild_settings;

const cs = {}; // Reusable ColumnSet objects.

 /**
  * @class UserGuildSettingsRepository
  * @description Class representing the UserGuildSettingsRepository. This class encapsulates the logic required
  * to access the data source(s) and the data contained within the model layer.
  */
class UserGuildSettingsRepository {
    /**
     * Constructor, creates an instance of UserGuildSettingsRepository.
     * @date 31/08/2020
     * @param {Database} db
     * @param {pg-promise} pgp
     * @memberof UserGuildSettingsRepository
     */
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
        
        // set-up all ColumnSet objects, if needed:
        createColumnsets(pgp);
    }

    // ************************************************************************
    // TABLE Operations
    // Create, drop, empty and check if 'user_guild_settings' table exists.
    // ************************************************************************

    /**
     * @description Creates the user_guild_settings table using the defined SQL query. A successful
     * call to this function, once the promise is completed, should return no data. Any data returned
     * by the query will represent an error.
     * @returns {Promise<QueryResultError>} A promise object representing the result.
     * @memberof UserGuildSettingsRepository
     */
    create() {
        return this.db.none(sql.create);
    }

    /**
     * @description Check if the user_guild_settings table exists.
     * @returns {Promise<Result>} the result of the query, with a boolean 'exists' field.
     * @memberof UserGuildSettingsRepository
     */
    exists() {
        return this.db.result(sql.exists, []);
    }

    /**
     * @description Drops (deletes) the user_guild_settings table.  Once the promise is completed, a successful
     * result will contain no data. Any data return will describe the error encountered.
     * @returns {Promise<QueryResultError>} A promise object defining the result of the query.
     * @memberof UserGuildSettingsRepository
     */
    drop() {
        return this.db.none('DROP TABLE user_guild_settings');
    }

    /**
     * @description Empties the user_guild_settings table, but keeps the table in the database.
     * Once the promise is completed, a successful operation will contain no data.  Any data
     * returned will describe the error encountered.
     * @returns {Promise<QueryResultError>} A promise object defining the result of the query.
     * @memberof UserGuildSettingsRepository
     */
    empty() {
        return this.db.none(sql.empty);
    }

    // ************************************************************************
    // DATA ACCESS
    // Perform operations that manipulate the data contained within the
    // 'user_guild_settings' table
    // add, update/insert (upsert), remove
    // ************************************************************************

    /**
     * @description Adds a new record for userId & settings object (JSON), and returns the object.  The
     * return value may be null if the add operation was unsuccessful.
     * @param {string} userId - the discord user id being queried.
     * @param {string} guildId - the guild/server discord id being queried.
     * @param {Object} settings - the settings json object to add.
     * @returns {Promise<Result>} resolves with 1 row, or null - multiple results generate a {QueryResultError}
     * @memberof UserGuildSettingsRepository
     */
    add(userId, guildId, settings) {
        return this.db.oneOrNone(sql.insert, {
            userDiscordId: userId,
            guildDiscordId: guildId,
            settings: settings});
    }

    /**
     * @description Adds a new record for userId & settings object (JSON), and returns the object.  The
     * return value may be null if the add operation was unsuccessful.
     * @param {string} userId - the discord user id being queried.
     * @param {string} guildId - the guild/server discord id being queried.
     * @param {Object} settings - the settings json object to add.
     * @returns {Promise<Result>} resolves with 1 row, or null - multiple results generate a {QueryResultError}
     * @memberof UserGuildSettingsRepository
     */
    insert(userId, guildId, settings) {
        return this.add(userId, guildId, settings);
    }

    /**
     * @description Updates or Inserts a new record for a given userId and settings object.
     * @param {string} userId - the user id (the discord alphanumeric id string)
     * @param {string} guildId - the guild id (the discord alphanumeric id string)
     * @param {Object} settings - Json object describing the settings for userId
     * @returns {Promise<Result>} A single row object containing the new record, or null. A failure returns a QueryResultError
     * @memberof UserGuildSettingsRepository
     */
    upsert(userId, guildId, settings) {
        if(!userId || !guildId) {
            loggers.error(`userGuildSettings - upsert(${userId}, ${guildId} - null parameter detected`);
            return null;
        } else {
            return this.add(userId, guildId, settings)
                .then (record => {
                if (record == null) {
                  return this.update(userId, guildId, settings);
                }
            })
        }
    }

    /**
     * @description Updates the record for user with the given discord user id.
     * @param {string} userId - the discord id of the user being updated.
     * @param {string} guildId - the discord id of the guild being updated.
     * @param {Object} settings - a Json describing the settings for a given user id.
     * @returns {Promise<Result>} - either a single row object on success, or a QueryResultError on failure
     * @memberof UserGuildSettingsRepository
     */
    update(userId, guildId, settings) {
        return this.db.one(sql.update, {
            userDiscordId: userId,
            guildDiscordId: guildId,
            settings: settings
        });
    }

    /**
     * @description Removes record(s) with the given discord user id from the user_guild_settings table.
     * @param {string} userId - the discord ID of the user
     * @returns {Promise<Result>} - A Promise resolving to a Result object
     * @memberof UserGuildSettingsRepository
     */
    removeAllByUserId(userId) {
        return this.db.result(sql.removeByUserId, +userId, r => r.rowCount);
    }

    /**
     * @description Removes record(s) with the given discord user id from the user_guild_settings table.
     * @param {string} guildId - the discord ID of the user
     * @returns {Promise<Result>} - A Promise resolving to a Result object
     * @memberof UserGuildSettingsRepository
     */
    removeAllByGuildId(guildId) {
        return this.db.result(sql.removeByGuildId, +guildId, r => r.rowCount);
    }

    /**
     * @description Removes a single record with the given discord user id & guild id from the user_guild_settings table.
     * @param {string} userId - the discord ID of the user
     * @param {string} guildId - the discord ID of the guild
     * @returns {Promise<Result>} - A Promise resolving to a Result object
     * @memberof UserGuildSettingsRepository
     */
    remove(userId, guildId) {
        return this.db.result(sql.remove,
            {
                userDiscordId: userId,
                guildDiscordId: guildId
            },
            r => r.rowCount);
    }

    // ************************************************************************
    // FIND Operations
    // methods to find records in the user_guild_settings table.
    // ************************************************************************

    /**
     * Finds the record for a given discord user id.
     * @param {string} userId 
     * @param {string} guildId 
     * @returns {Promise<Result>} On resolution of the promise, returns the row
     * or null. A failure produces a QueryResultError.
     */
    findUserSettingsById(userId, guildId) {
        return this.db.oneOrNone(sql.find, {userDiscordId: userId, guildDiscordId: guildId});
    }

    /**
     * @description Returns all the records within the 'user_guild_settings' table.
     * @returns {Promise<Result>} When the Promise is resolved, contains an
     * array of rows. If the table is empty, returns an empty array.
     * @memberof UserGuildSettingsRepository
     */
    all() {
        return this.db.any('SELECT * FROM user_guild_settings ugs JOIN users u ON u.id = ugs.u_id');
    }
    
    // ************************************************************************
    // UTILITY Operations
    // Miscellaneous methods not defined by one of the categories above.
    // ************************************************************************

    // Returns the total number of user_guild_settings;
    total() {
        return this.db.one('SELECT count(*) FROM user_guild_settings', [], a => +a.count);
    }
}

//////////////////////////////////////////////////////////
// Example of statically initializing ColumnSet objects:

function createColumnsets(pgp) {
    // create all ColumnSet objects only once:
    if (!cs.insert) {
        // Type TableName is useful when schema isn't default "public" ,
        // otherwise you can just pass in a string for the table name.
        const table = new pgp.helpers.TableName({table: 'user_guild_settings', schema: 'public'});

        cs.insert = new pgp.helpers.ColumnSet(['u_id'], {table});
        cs.update = cs.insert.extend({ name: 'g_id', mod: '^'});
        cs.update = cs.insert.extend({ name: 'settings', mod: ':raw'});
    }
    return cs;
}

module.exports = UserGuildSettingsRepository;
