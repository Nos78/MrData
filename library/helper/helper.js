/*
 * @Author: BanderDragon
 * @Date: 2020-08-25 02:34:34 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-08-25 02:35:04
 */

const format = require('../format/format.js');
 
module.exports = {
  displayName: function (member) {
    let displayName = member.displayName;
    if (!displayName) {
      displayName = member.name;
    }
    return displayName;
  },

  parseMaxRankCount: function (args) {
    var count = 10;
    if (args.length == 2) {
      count = format.stripCommas(args[1]);
      if ((args[0] == '-c' || args[0] == '-count') && !isNaN(count)) {
        args.length = 0;
      } else {
        count = 10;
      }
    }

    if (count > 24) {
      count = 24;
    }
    return count;
  },
}
