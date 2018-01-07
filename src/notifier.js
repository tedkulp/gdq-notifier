const _ = require('lodash');
const moment = require('moment');
const Promise = require('bluebird');
const PushBullet = require('pushbullet');
const pusher = new PushBullet(process.env.PUSHBULLET_API_KEY);

const gamesICareAbout = [
    '4a9e2013c349e74f7528455a189eb5433b9967b9',
    '2caeb6a99e5f965c3ebd31c510a076d854fddead',
    '3068e7bc7f11224098b676c294e65505e5e63f4e',
    '47f2ca191cd37fa6bb62e2040421305c0e181870',
    '152c4cd781ffbff99d17b58d117c434ac6c7a587',
    '8f2bea95c70ed278484fcb666d3377e1f2871b5d',
];

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
}

const checkForNotifications = (parsedData, redis, userId) => {
    const checkTime = moment().add(10, 'minutes');
    const foundGames = _.filter(parsedData, game => _.includes(gamesICareAbout, game.id));
    _.forEach(foundGames, game => {
        checkIfNotificationSent(redis, userId, game.id).then(wasNotified => {
            if (!wasNotified && moment(game.startTime).isSameOrBefore(checkTime)) {
                pusher.note({}, `${game.event} Notification`, `${game.title} by ${game.runners} is going to start at ${moment(game.startTime).format('h:mm a')}.`);
                setNotificationAsSent(redis, userId, game.id);
            }
        });
    });
};

exports.checkForNotifications = checkForNotifications;