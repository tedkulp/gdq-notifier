const CronJob = require('cron').CronJob;
const fs = require('fs');

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

const _ = require('lodash');
const Promise = require('bluebird');
const request = require('request');
const moment = require('moment');
const redis = require("redis");
const client = redis.createClient({
    host: process.env.DOCKER_REDIS_HOST,
    port: process.env.DOCKER_REDIS_PORT,
});

const api = require('./src/api')
const scraper = require('./src/scraper');
const notifier = require('./src/notifier');
const userId = '1';

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
        cronTime: '0 */5 * * * *',
        onTick: () => {
            callScraper();
        },
        start: true,
    });

    const notifierJob = new CronJob({
        cronTime: '0 * * * * *',
        onTick: () => {
            // TODO: 1 is the user id.  Change me for multiple users.
            notifier.checkForNotifications(parsedData, client, userId);
        },
        start: true,
    });

    app.get('/api/gamelist', (req, res) => {
        res.json(parsedData);
    });

    app.get('/api/watchedgames', (req, res) => {
        return api.listWatchedGames(client, userId).then(resp => {
            res.json(resp);
        });
    });

    app.post('/api/watchedgames/:gameId', (req, res) => {
        api.addWatchedGame(client, req.params.gameId, userId).then(resp => {
            res.json(resp);
        });
    });

    app.delete('/api/watchedgames/:gameId', (req, res) => {
        api.removeWatchedGame(client, req.params.gameId, userId).then(resp => {
            res.json(resp);
        });
    });

    app.listen(3002, () => console.log('Example app listening on port 3002!'))

    callScraper();
}
