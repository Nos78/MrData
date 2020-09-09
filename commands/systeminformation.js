/*
 * @Author: BanderDragon 
 * @Date: 2020-08-27 21:33:10 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-05 00:00:07
 */

const { useCustomLoadavg } = require('loadavg-windows');
const os = require('os');

const package = require('../package.json');
const library = require('../library');
const Discord = require('discord.js');
const moment = require('moment');
const momentTz = require('moment-timezone');
const process = require('process');

module.exports = {
    name: 'systeminformation',
    cooldown: 30,
    args: false,
    aliases: ['sysinfo', 'si', 'uptime', 'up', 'version', 'about'],
    description: `Provides system information about @BOTNAME. Provides details of my critical systems, my software version and licensing.        Also lists the status of my hardware, the level of resources my systems consume, and provides an indication of how long I have been online since my last system update, in other words the total time elapsed since this bot was (re)started.`,
    async execute(message, args) {
        const msg = library.Helper.sendStandardWaitMessage(message.channel);

        let botName = library.Config.botName(message.client);

        let totalSeconds = (message.client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.round(totalSeconds % 60);
        let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

        let serverTime = moment().local().format('LLLL');

        let pSeconds = process.uptime();
        let pDays = Math.floor(pSeconds /86400);
        pSeconds %= 86400;
        let pHours = Math.floor(pSeconds / 3600);
        pSeconds %= 3600;
        let pMinutes = Math.floor(pSeconds / 60);
        pSeconds %= 60;
        let processUptime = `${pDays} day, ${pHours} hours, ${pMinutes} minutes and ${Math.floor(pSeconds)} seconds`;
        let memoryUse = process.memoryUsage();
        let memoryText = `** __${botName} process:__ **\n`;
        for (let key in memoryUse) {
            memoryText += `** -** **${key}:    **${Math.round(memoryUse[key] / 1024 / 1024 * 100) / 100}MB\n`;
        }
        let memoryText2 = `__**System:**__\n`;
        memoryText2 += `** -** **memTotal:    **${library.Format.numberWithCommas(Math.floor(os.totalmem / 1024 / 1024))}MB\n ** -** **memFree:    **${library.Format.numberWithCommas(Math.floor(os.freemem / 1024 / 1024))}MB`;

        //let processConf = JSON.stringify(process.config);

        // CPU loading test - spin CPU for 500ms
        const previousUsage = process.cpuUsage();
        const startDate = Date.now();
        while(Date.now() - startDate < 500);
        var endDate = Date.now();

        const usage = process.cpuUsage(previousUsage);
        const resultUser = 100 * usage.user / ((endDate - startDate) * 1000);
        const resultSystem = 100 * usage.system / ((endDate - startDate) * 1000);
        const result = 100 * (usage.user + usage.system) / ((endDate - startDate) * 1000);
        //let percentResult = 100 * (result.user + result.system)/((endDate - startDate) * 1000);
        //let percentResult = (usage.user + usage.system) / 500;
        let osLoad = os.loadavg();
        let cpus = os.cpus();
        let cores = cpus.length;

        //const report = process.report.getReport();
        let fields = [];
        fields.push({"name": ` `, "value": ``});
        let text = `${message.author}, here is a summary of my critical systems:\n\n`
        text += `**\t${library.Config.packageName()}** *version ${library.Config.packageVersion()}*, running as`;
        text += ` **${botName}** on **${message.guild.name}**`;
        text += `\n\u00A9 The Bot Factory, under a ${library.Config.packageLicense()} licence.`;
        text += `\n\npowered by **${library.Config.nodeName()}JS**, *version ${library.Config.nodeVersion()}* and **discordJS**, *version ${library.Config.discordJsVersion()}*`;
        text += `\n\n*System Information:*`;
        text += `\n** -** ${os.platform} ${os.release}.`
        text += `\n\nMemory resources: *(resources available vs resources committed)*`
        text += `\n${memoryText}`
        text += `\n${memoryText2}`
        text += `\n\n\t\tCPU resources: *(Num. cores, CPU description(s), process cycles vs system load)*`
        let cpuModel = cpus[0].model;
        cpuModelsText = `*${cpuModel}*\n`;
        for(let i=1; i < cores; i++) {
            if (cpuModel.localeCompare(cpus[i].model) != 0) {
                cpuModelsText += `, *${cpus[i]}*\n`;
            }
        }
        text += `\n** - **${cores} cores, ${process.arch} architecture.`
        text += `\n** - ** ** - ** ${cpuModelsText} `;
        text += `\n\t\t\t** __${botName} process:__ **\n`
        text += `  ** - **CPU usage (%age) **User:** ${resultUser}    **System:** ${resultSystem}    **Total:** ${result}`
        text += `\n\n\t\t\t** __System:__ **\n`;
        text += `** -** CPU Load averages [1m, 5m, 15m]: ${osLoad[0]}, ${osLoad[1]}, ${osLoad[2]}`
        text += `\n** - **1m CPU Utilization = ${Math.min(Math.floor(osLoad[0] * 100 / cores), 100)}%`
        text += `\n\nReport issues at ${package.bugs.url}`
        text += `\n\n** __Uptime:__ **`
        text += `\n ** -** Current server time is ${serverTime}.\n ** -** I am located in the ${moment.tz.guess()} region.`
        text += `\n\n ** -** I have been active on discord for ${uptime}.`
        text += `\n** -** My process as been active for ${processUptime}`
        library.Helper.editWaitSuccessMessage(msg, text);
    },
};        
