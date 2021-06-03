/*
 * @Author: BanderDragon 
 * @Date: 2019-03-14 22:12:49
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-29 03:59:11
 */

module.exports = {
	name: 'ping',
	description: 'Calculates the ping between sending a message and editing it, calculating round-trip latency! The second ping is the averge latency between the bot and the web-socket (one way).',
	cooldown: 5,
	version: '1.0.0',
	category: 'utility',
	args: false,
	async execute(message, args) {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send(`Ping?`);
    m.edit(`Pong! ${message.author} Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(message.client.ws.ping)}ms`);
	},
};
