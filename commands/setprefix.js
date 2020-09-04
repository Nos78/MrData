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
    name: 'setprefix',
    description: `This command is used to change @BOTNAME's command prefix for your server, which defaults to ${config.prefix} if none is specified.`,
    aliases: ['sp', 'scp', 'setcommandprefix'],
    args: true,
    usage: '<new prefix>, where the new prefix can be a single character of your choice, from !"£*$%^&+?~:;',
    guildOnly: true,
    async execute(message, args) {
        let msg = library.Helper.sendStandardWaitMessage(message.channel);
        if (library.Admin.isAdmin(message.author.id, message.guild.id, message.client)) {
            if (args.length != 1) {
                return library.Helper.editWaitErrorMessage(msg, `Insufficient parameters!  Please use ${library.System.getPrefix(message.guild.id)}${this.name} <new prefix>`);
            } else {
                var newPrefix = args[0];
                if (newPrefix.match(/[!"£*$%^&+?~:;]{1}$/)) {
                    let result = await library.System.savePrefix(message.guild.id, newPrefix);

                    if(result) {
                        return library.Helper.editWaitSuccessMessage(msg, `Thank you, ${message.author}, your new command prefix has been set to ${args[0]}`);
                    } else {
                        return library.Helper.editWaitErrorMessage(msg, `${message.author}, unfortunately I was unable to save your new command prefix.`);
                    }
                }
            }
        } else {
            return library.Helper.editWaitErrorMessage(msg, `Sorry, ${message.author}, this command can only be used by administrators or privileged users.`);
        }
    }
}
