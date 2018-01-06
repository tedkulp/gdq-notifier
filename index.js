const CronJob = require('cron').CronJob;
const fs = require('fs');

const scraper = require('./src/scraper');
const notifier = require('./src/notifier');

// TODO: Remove me
const htmlData = fs.readFileSync('./test/data/schedule.html');

let parsedData = [];

const scraperJob = new CronJob({
    cronTime: '*/5 * * * * *',
    onTick: () => {
        parsedData = scraper.parseSchedule(htmlData);
    },
    start: true,
});

const notifierJob = new CronJob({
    cronTime: '*/15 * * * * *',
    onTick: () => {
        notifier.checkForNotifications(parsedData);
    },
    start: true,
});
