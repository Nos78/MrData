/**
 * @Author: BanderDragon
 * @Date:   2019-05-06T08:09:56+01:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: index.js
 * @Last modified by:
 * @Last modified time: 2020-03-29T18:27:57+01:00
 */

'use strict';

// Renaming and exporting all library classes:
const format = require('./format/format.js');
const admin = require('./admin/admin.js');
const league = require('./league/league.js');
const helper = require('./helper/helper.js');

module.exports = {
  Format: format,
  Admin: admin,
  League: league,
  Helper: helper,

  collateArgs: function(index, args) {
      var returnString = "";
      if (index < args.length) {
          returnString = args[index];
          for(var i = index + 1; i < args.length; i++) {
              returnString = returnString + " " + args[i];
          }
      }
      return returnString;
  }
}
