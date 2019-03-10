'use strict';

// Bluebird is the best promise library available today,
// and is the one recommended here:
const promise = require('bluebird');

const repos = require('./repos'); // loading all repositories

const config = require('../config.json'); // load the config file

// pg-promise initialization options:
const initOptions = {

    // Use a custom promise library, instead of the default ES6 Promise:
    promiseLib: promise,

    // Extending the database protocol with our custom repositories;
    // API: http://vitaly-t.github.io/pg-promise/global.html#event:extend
    extend(obj, dc) {
        // Database Context (dc) is mainly useful when extending multiple databases
        // with different access API-s.

        // Do not use 'require()' here, because this event occurs for every task
        // and transaction being executed, which should be as fast as possible.
        obj.scores = new repos.Scores(obj, pgp);
    }
};

// Load and initialize pg-promise:
const pgp = require('pg-promise')(initOptions);

// Create the database instance:
const db = pgp(config.db);

// Load and initialize optional diagnostics:
const diagnostics = require('./diagnostics');
diagnostics.init(initOptions);

// If you ever need access to the library's root (pgp object), you can do it via db.$config.pgp
// See: http://vitaly-t.github.io/pg-promise/Database.html#.$config
module.exports = db;
