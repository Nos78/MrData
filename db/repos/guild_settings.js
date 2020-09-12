/*
 * @Author: BanderDragon 
 * @Date: 2020-08-31 20:55:32
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-04 23:00:21
 */

'use strict';

const sql = require('../sql').guild_settings;

const cs = {}; // Reusable ColumnSet objects.

 /**
  * @class GuildSettingsRepository
  * @description Class representing the GuildSettingsRepository. This class encapsulates the logic required
  * to access the data source(s) and the data contained within the model layer.
  */
class GuildSettingsRepository {
    /**
     * Constructor, creates an instance of GuildSettingsRepository.
     * @date 31/08/2020
     * @param {Database} db
     * @param {pg-promise} pgp
     * @memberof GuildSettingsRepository
     */
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
        
        // set-up all ColumnSet objects, if needed:
        createColumnsets(pgp);
    }

    // ************************************************************************
    // TABLE Operations
    // Create, drop, empty and check if 'guild_settings' table exists.
    // ************************************************************************

    /**
     * @description Creates the guild_settings table using the defined SQL query. A successful call
     * to this function, once the promise is completed, should return no data. Any data returned by
     * the query will represent an error.
     * @returns {Promise<QueryResultError>} A promise object representing the result.
     * @memberof GuildSettingsRepository
     */
    create() {
        return this.db.none(sql.create);
    }

    /**
     * @description Check if the guild_settings table exists.
     * @returns {Promise<Result>} the result of the query, with a boolean 'exists' field.
     * @memberof GuildSettingsRepository
     */
    exists() {
        return this.db.result(sql.exists, []);
    }

    /**
     * @description Drops (deletes) the guild_settings table.  Once the promise is completed, a successful
     * result will contain no data. Any data return will describe the error encountered.
     * @returns {Promise<QueryResultError>} A promise object defining the result of the query.
     * @memberof GuildSettingsRepository
     */
    drop() {
        return this.db.none('DROP TABLE guild_settings');
    }

    /**
     * @description Empties the guild_settings table, but keeps the table in the database.  Once the promise
     * is completed, a successful operation will contain no data.  Any data returned will describe the error
     * encountered.
     * @returns {Promise<QueryResultError>} A promise object defining the result of the query.
     * @memberof GuildSettingsRepository
     */
    empty() {
        return this.db.none(sql.empty);
    }

    // ************************************************************************
    // DATA ACCESS
    // Perform operations that manipulate the data contained within the
    // 'guild_settings' table
    // add, update/insert (upsert), remove
    // ************************************************************************

    /**
     * @description Adds a new record for guildId & settings object (JSON), and returns the object.  The
     * return value may be null if the add operation was unsuccessful.
     * @param {string} guildId
     * @param {Object} settings json object
     * @returns {Promise<Result>} resolves with 1 row, or null - multiple results generate a {QueryResultError}
     * @memberof GuildSettingsRepository
     */
    add(guildId, settings) {
        return this.db.oneOrNone(sql.insert, {guildDiscordId: guildId, settings: settings});
    }

    /**
     * @description Adds (inserts) a new record for guildId & settings object (JSON), and returns the object.  The
     * return value may be null if the add operation was unsuccessful.
     * @param {string} guildId
     * @param {Object} settings json object
     * @returns {Promise<Result>} resolves with 1 row, or null - multiple results generate a {QueryResultError}
     * @memberof GuildSettingsRepository
     */
    insert(guildId, settings) {
        return this.add(guildId, settings);
    }

    /**
     * @description Updates or Inserts a new record for a given guildId and settings object.
     * @param {string} guildId - the guild id (the discord alphanumeric id string)
     * @param {Object} settings - Json object describing the settings for guildId
     * @returns {Promise<Result>} A single row object containing the new record, or null. A failure returns a QueryResultError
     * @memberof GuildSettingsRepository
     */
    async upsert(guildId, settings) {
        var guildSettingsObj = await this.add(guildId, settings);
        if (guildSettingsObj == null) {
            guildSettingsObj = this.update(guildId, settings);
        }
        return guildSettingsObj;
    }

    /**
     * @description Updates the record for guild with the given discord guild id.
     * @param {string} guildId - the discord id of the guild being updated.
     * @param {Object} settings - a Json describing the settings for a given guild id.
     * @returns {Promise<Result>} - either a single row object on success, or a QueryResultError on failure
     * @memberof GuildSettingsRepository
     */
    update(guildId, settings) {
        return this.db.one(sql.update, {
            guildDiscordId: guildId,
            settings: settings
        });
    }

    /**
     * @description Removes a record with the given discord guild id from the guild_settings table.
     * @param {string} guildId - the discord ID of the guild
     * @return {*}  
     * @memberof GuildSettingsRepository
     */
    remove(guildId) {
        return this.db.result(sql.remove, +guildId, r => r.rowCount);
    }

    // ************************************************************************
    // FIND Operations
    // methods to find records in the guild_settings table.
    // ************************************************************************

    /**
     * Finds the record for a given discord guild id.
     * @param {string} guildId 
     * @returns {Promise<Result>} On resolution of the promise, returns the row
     * or null. A failure produces a QueryResultError.
     */
    findGuildSettingsById(guildId) {
        return this.db.oneOrNone(sql.find, guildId);
    }

    /**
     * @description Returns all the records within the 'guild_settings' table.
     * @returns {Promise<Result>} When the Promise is resolved, contains an
     * array of rows. If the table is empty, returns an empty array.
     * @memberof GuildSettingsRepository
     */
    all() {
        return this.db.any('SELECT * FROM guild_settings gs JOIN guilds g ON g.id = gs.g_id');
    }
    
    // ************************************************************************
    // UTILITY Operations
    // Miscellaneous methods not defined by one of the categories above.
    // ************************************************************************

    // Returns the total number of guild_settings;
    total() {
        return this.db.one('SELECT count(*) FROM guild_settings', [], a => +a.count);
    }
}

//////////////////////////////////////////////////////////
// Example of statically initializing ColumnSet objects:

function createColumnsets(pgp) {
    // create all ColumnSet objects only once:
    if (!cs.insert) {
        // Type TableName is useful when schema isn't default "public" ,
        // otherwise you can just pass in a string for the table name.
        const table = new pgp.helpers.TableName({table: 'guild_settings', schema: 'public'});

        cs.insert = new pgp.helpers.ColumnSet(['g_id'], {table});
        cs.update = cs.insert.extend({ name: 'settings', mod: ':raw'});
    }
    return cs;
}

module.exports = GuildSettingsRepository;
