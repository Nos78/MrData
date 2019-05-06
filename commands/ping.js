/**
 * @Author: BanderDragon
 * @Date:   2019-03-14T22:12:49+00:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: ping.js
 * @Last modified by:   BanderDragon
 * @Last modified time: 2019-05-05T18:00:32+01:00
 */

module.exports = {
	name: 'ping',
	description: 'Calculates the ping between sending a message and editing it, calculating round-trip latency! The second ping is the averge latency between the bot and the web-socket (one way).',
	cooldown: 5,
	args: false,
	async execute(message, args) {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! ${message.author} Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(message.client.ping)}ms`);
	},
};
