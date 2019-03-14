'use strict';

// Renaming and exporting all library classes:
const format = require('./format/format.js');
const admin = require('./admin/admin.js');

module.exports = {
  Format: format,
  Admin: admin
}
