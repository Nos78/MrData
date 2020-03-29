/**
 * @Date:   2020-03-29T16:40:40+01:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: uptime.js
 * @Last modified time: 2020-03-29T19:22:20+01:00
 */

module.exports = {
	name: 'uptime',
	cooldown: 30,
	args: false,
	description: 'Gives the total time elapsed since this bot was (re)started.',
  execute(message, args) {
    let totalSeconds = (message.client.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
    message.channel.send(`${message.author}, I have been active for ${uptime}`);
	},
};
