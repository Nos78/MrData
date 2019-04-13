module.exports = {
	name: 'ping',
	description: 'Calculates the ping between sending a message and editing it, calculating round-trip latency! The second ping is the averge latency between the bot and the web-socket (one way).',
	cooldown: 5,
	args: false,
	execute(message, args) {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! ${sender} Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
	},
};
