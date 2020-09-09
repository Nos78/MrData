/*
 * @Author: BanderDragon 
 * @Date: 2019-05-06 08:09:56 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-08 20:38:10
 */

'use strict';

// Renaming and exporting all library classes:
const format = require('./format/format.js');
const admin = require('./admin/admin.js');
const league = require('./league/league.js');
const helper = require('./helper/helper.js');
const config = require('./config/config.js');
const discord = require('./discord/discord.js');
const settings = require('./settings/settings.js');
const system = require('./system/system.js');
const commands = require('./commands/commands.js');

module.exports = {
  Format: format,
  Admin: admin,
  League: league,
  Helper: helper,
  Config: config,
  Discord: discord,
  Settings: settings,
  System: system,
  Commands: commands,

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
