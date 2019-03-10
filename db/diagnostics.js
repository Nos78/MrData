'use strict';

// This module uses pg-monitor to log
// errors in a DEV and PROD environments.

// As an alternative for a PROD environment, instead of using pg-monitor
// you could handle event 'error' within initialization options yourself,
// which may be a little better performing, but lacks all the nice formatting
// provided by pg-monitor.

const os = require('os');
const fs = require('fs');
const monitor = require('pg-monitor');

monitor.setTheme('matrix'); // changing the default theme;

// Flag to indicate whether we are in a DEV environment:
const $DEV = process.env.NODE_ENV === 'development';

// Log file for database-related errors:
const logFile = './db/errors.log';

// Below we are logging errors exactly the way they are reported by pg-monitor,
// This can be tweaked: parameter 'info' provides all the details for that.
//
// see: https://github.com/vitaly-t/pg-monitor#log
monitor.setLog((msg, info) => {

    // In a PROD environment we will only receive event 'error',
    // because this is how we set it up below.

    // And the check below is for DEV environment only, as we want to log
    // errors only, or else the file will grow out of proportion in no time.

    if (info.event === 'error') {
        let logText = os.EOL + msg; // line break + next error message;
        if (info.time) {
            // If it is a new error being reported,
            // and not an additional error line;
            logText = os.EOL + logText; // add another line break in front;
        }
        fs.appendFileSync(logFile, logText); // add error handling as required;
    }

    // We absolutely must not let the monitor write anything into the console
    // while in a PROD environment, and not just because nobody will be able
    // to see it there, but mainly because the console is incredibly slow and
    // hugely resource-consuming, suitable only for debugging.

    if (!$DEV) {
        // If it is not a DEV environment:
        info.display = false; // display nothing;
    }

});

module.exports = {
    // Monitor initialization function;
    init(options) {
        if ($DEV) {
            // In a DEV environment, we attach to all supported events:
            monitor.attach(options);
        } else {
            // In a PROD environment we should only attach to the type of events
            // that we intend to log. And we are only logging event 'error' here:
            monitor.attach(options, ['error']);
        }
    }
};
