//
// Helper functions for Bot admin
//

module.exports = {
  isOwner: function (uid, gid, bot) {
    let guild = bot.guilds.get(gid);
    return guild.ownerID == uid;
  },

  isAdmin: function (uid, gid, bot) {
    return bot.guilds.get(gid).members.get(uid).hasPermission("ADMINISTRATOR");
  },

  owner: function(gid, bot) {
    return bot.guilds.get(gid).owner;
  }
}
