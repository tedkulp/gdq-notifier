const CronJob = require('cron').CronJob;
const fs = require('fs');

const _ = require('lodash');
const Promise = require('bluebird');
const request = require('request');
const moment = require('moment');
const redis = require("redis");
const client = redis.createClient({
    host: process.env.DOCKER_REDIS_HOST,
    port: process.env.DOCKER_REDIS_PORT,
});

const scraper = require('./src/scraper');
const notifier = require('./src/notifier');

let isList = false;
for (let j = 0; j < process.argv.length; j++) {  
    if (process.argv[j] === "--list") {
        isList = true;
    }
}

let parsedData = [];

const callScraper = () => {
    return new Promise((resolve, reject) => {
        request('https://gamesdonequick.com/schedule', (error, response, body) => {
            parsedData = scraper.parseSchedule(body);
            resolve(parsedData);
        });
    });
};

if (isList) {
    callScraper().then(data => {
        _.forEach(data, game => {
            console.log(game.id, game.title, '-', moment(game.startTime).format('MMM Do, h:mm a'));
        });
        process.exit();
    });
} else {
    const scraperJob = new CronJob({
        cronTime: '0 */10 * * * *',
        onTick: () => {
            callScraper();
        },
        start: true,
    });
    
    const notifierJob = new CronJob({
        cronTime: '0 * * * * *',
        onTick: () => {
            // TODO: 1 is the user id.  Change me for multiple users.
            notifier.checkForNotifications(parsedData, client, '1');
        },
        start: true,
    });

    callScraper();
}
