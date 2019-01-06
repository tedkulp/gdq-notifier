const _ = require('lodash');
const fs = require('fs');
const os = require('os');
const moment = require('moment-timezone');
const Promise = require('bluebird');
const PushBullet = require('pushbullet');
const pusher = new PushBullet(process.env.PUSHBULLET_API_KEY);

const api = require('./api');

const setNotificationAsSent = (redis, userId, gameId) => {
    const keyName = `sentnotifications:${userId}`;
    redis.rpush(keyName, gameId);
};

const checkIfNotificationSent = (redis, userId, gameId) => {
    return new Promise((resolve, reject) => {
        const keyName = `sentnotifications:${userId}`;
        const existingGames = redis.lrange(keyName, 0, -1, (err, res) => {
            resolve(_.includes(res, gameId));
        });
    });
};

const checkForNotifications = (parsedData, redis, userId) => {
    const checkTime = moment().add(10, 'minutes');

    api.listWatchedGames(redis, userId).then(watchedGames => {
        const foundGames = _.filter(parsedData, game => _.includes(watchedGames, game.id));
        _.forEach(foundGames, game => {
            checkIfNotificationSent(redis, userId, game.id).then(wasNotified => {
                if (!wasNotified && moment(game.startTime).isSameOrBefore(checkTime)) {
                    pusher.note({}, `${game.event} - ${game.title}`, `${game.title} by ${game.runners} is going to start at ${moment(game.startTime).tz(process.env.TIMEZONE || 'America/New_York').format('h:mm a')}.`);
                    setNotificationAsSent(redis, userId, game.id);
                }
            });
        });
    });
};

exports.checkForNotifications = checkForNotifications;
