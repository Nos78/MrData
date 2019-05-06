# MrData
Discord Bot serving Star Trek Fleet Command alliances with a whole host of interactive features, including an scoring system for the games various statistics, and a whole host of alliance commands.

This Bot uses the DiscordJS API wrapper and a Postgres database.

It requires the following:...

+ nodejs if runing under windows

npm packages (using npm install):
+ discord.js
+ winston
+ pg
+ pg-promise
+ bluebird
+pg-monitor

...as detailed in packages.json

You will also need to follow any instructions to register as a bot on the discordapp.com website, and a useful guide can be found here: https://anidiots.guide/first-bot

In config-secret.json, put the following:
- discord token, 
- database URL,
- username,
- password