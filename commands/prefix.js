/**
 * @Author: BanderDragon
 * @Date:   2019-05-10T19:54:25+01:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: privilegedrole.js
 * @Last modified by:
 * @Last modified time: 2019-05-20T19:03:58+01:00
 */

const library = require('../library');
const config = require('../config.json');

module.exports = {
    name: 'showprefix',
    description: `This command is used to change @BOTNAME's command prefix for your server, which defaults to ${config.prefix} if none is specified.`,
    aliases: ['prefix', 'commandprefix', 'showcommandprefix'],
    args: false,
    version: '1.0.1',
    category: 'config',
    guildOnly: true,
    execute(message, args) {
        let msg = library.Helper.sendStandardWaitMessage(message.channel);
        var prefix = library.System.getPrefix(message.guild.id);
        prefix.then(prefix => {
            library.Helper.editWaitSuccessMessage(msg, `Thank you, ${message.author}, the command prefix for ${message.guild.name} is ${prefix}`);
        }).catch(err => {
            library.Helper.editWaitSuccessMessage(msg, `Something went wrong, ${message.author}, but I was unable to read from the database.\n\n${err.name}`);
        });
    }
}
