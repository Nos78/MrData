/**
 * @Date:   2020-03-29T18:19:45+01:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: helper.js
 * @Last modified time: 2020-03-29T19:03:02+01:00
 */

 const format = require('../format/format.js');

 module.exports = {
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

       if (count > 25) {
         count = 25;
       }
       return count;
     },
 }
