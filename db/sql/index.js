/*
 * @Author: BanderDragon 
 * @Date: 2019-03-10
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-01 01:49:33
 */

'use strict';

const QueryFile = require('pg-promise').QueryFile;
const path = require('path');

///////////////////////////////////////////////////////////////////////////////////////////////
// Criteria for deciding whether to place a particular query into an external SQL file or to
// keep it in-line (hard-coded):
//
// - Size / complexity of the query, because having it in a separate file will let you develop
//   the query and see the immediate updates without having to restart your application.
//
// - The necessity to document your query, and possibly keeping its multiple versions commented
//   out in the query file.
//
// In fact, the only reason one might want to keep a query in-line within the code is to be able
// to easily see the relation between the query logic and its formatting parameters. However, this
// is very easy to overcome by using only Named Parameters for your query formatting.
////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
    users: {
      create: sql('users/create.sql'),
      empty: sql('users/empty.sql'),
      drop: sql('users/drop.sql'),
      add: sql('users/add.sql'),
      exists: sql('users/exists.sql')
    },

    guilds: {
      create: sql('guilds/create.sql'),
      empty: sql('guilds/empty.sql'),
      drop: sql('guilds/drop.sql'),
      add: sql('guilds/add.sql'),
      exists: sql('guilds/exists.sql')
    },

    scores: {
        create: sql('scores/create.sql'),
        empty: sql('scores/empty.sql'),
        drop: sql('scores/drop.sql'),
        upsert: sql('scores/upsert.sql'),
        exists: sql('scores/exists.sql'),
        deleteByGuild: sql('scores/deleteByGuild.sql'),
        deleteByUser: sql('scores/deleteByUser.sql'),
        deleteByUserAndGuild: sql('scores/deleteByUserAndGuild.sql'),
        findByUser: sql('scores/findByUser.sql'),
        findByGuild: sql('scores/findByGuild.sql'),
        findByUserAndGuild: sql('scores/findByUserAndGuild.sql')
    },

    guild_settings: {
        create: sql('guild_settings/create.sql'),
        exists: sql('guild_settings/exists.sql'),
        empty: sql('guild_settings/empty.sql'),
        insert: sql('guild_settings/insert.sql'),
        update: sql('guild_settings/update.sql'),
        remove: sql('guild_settings/delete.sql'),
        find: sql('guild_settings/find.sql')
    },

    user_guild_settings: {
        create: sql('user_guild_settings/create.sql'),
        exists: sql('user_guild_settings/exists.sql'),
        empty: sql('user_guild_settings/empty.sql'),
        insert: sql('user_guild_settings/insert.sql'),
        update: sql('user_guild_settings/update.sql'),
        remove: sql('user_guild_settings/delete.sql'),
        removeByUserId: sql('user_guild_settings/deleteByUserId.sql'),
        removeByGuildId: sql('user_guild_settings/deleteByGuildId.sql'),
        find: sql('user_guild_settings/find.sql')
    },

    user_global_settings: {
        create: sql('user_global_settings/create.sql'),
        exists: sql('user_global_settings/exists.sql'),
        empty: sql('user_global_settings/empty.sql'),
        insert: sql('user_global_settings/insert.sql'),
        update: sql('user_global_settings/update.sql'),
        remove: sql('user_global_settings/delete.sql'),
        find: sql('user_global_settings/find.sql')
    }
};

///////////////////////////////////////////////
// Helper for linking to external query files;
function sql(file) {

    const fullPath = path.join(__dirname, file); // generating full path;

    const options = {

        // minifying the SQL is always advised;
        // see also option 'compress' in the API;
        minify: true,

        // Showing how to use static pre-formatting parameters -
        // we have variable 'schema' in each SQL (as an example);
        params: {
            schema: 'public' // replace ${schema~} with "public"
        }
    };

    const qf = new QueryFile(fullPath, options);

    if (qf.error) {
        // Something is wrong with our query file :(
        // Testing all files through queries can be cumbersome,
        // so we also report it here, while loading the module:
        console.error(qf.error);
    }

    return qf;

    // See QueryFile API:
    // http://vitaly-t.github.io/pg-promise/QueryFile.html
}
