/**
 * @Author: BanderDragon
 * @Date:   2019-05-06T08:09:56+01:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: index.js
 * @Last modified by:   BanderDragon
 * @Last modified time: 2019-05-11T01:23:08+01:00
 */

'use strict';

// Renaming and exporting all library classes:
const format = require('./format/format.js');
const admin = require('./admin/admin.js');

module.exports = {
  Format: format,
  Admin: admin,

  collateArgs: function(index, args) {
      var returnString = "";
      if (index < args.length) {
          var returnString = args[index];
          for(var i = index + 1; i < args.length; i++) {
              returnString = returnString + " " + args[i];
          }
      }
      return returnString;
  }
}
