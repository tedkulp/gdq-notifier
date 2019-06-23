const _ = require('lodash');
const moment = require('moment-timezone');
const Promise = require('bluebird');
const PushBullet = require('pushbullet');
const nodemailer = require('nodemailer');
const pusher = new PushBullet(process.env.PUSHBULLET_API_KEY);

const api = require('./api');

let useEmail = false;

if (process.env.EMAIL_ADDRESS && process.env.EMAIL_SERVER && process.env.EMAIL_USERNAME && process.env.EMAIL_PASSWORD) {
    useEmail = true;
}

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

const createMessage = game => {
    return `${game.event} - ${game.title}`, `${game.title} by ${game.runners} is going to start at ${moment(game.startTime).tz(process.env.TIMEZONE || 'America/New_York').format('h:mm a')}.`;
};

const sendPushbulletMessage = game => {
    pusher.note({}, createMessage(game));
};

const sendEmail = game => {
    if (useEmail) {
        const port = process.env.EMAIL_PORT || 25;
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER,
            port: port,
            secure: port === 465, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        transporter.sendMail({
            from: '"GDQ Notifier" <no-reply@tedkulp.com>', // sender address
            to: process.env.EMAIL_ADDRESS, // list of receivers
            subject: "GDQ Update", // Subject line
            text: createMessage(game), // plain text body
        })
    }
};

const checkForNotifications = (parsedData, redis, userId) => {
    const checkTime = moment().add(10, 'minutes');

    api.listWatchedGames(redis, userId).then(watchedGames => {
        const foundGames = _.filter(parsedData, game => _.includes(watchedGames, game.id));
        _.forEach(foundGames, game => {
            checkIfNotificationSent(redis, userId, game.id).then(wasNotified => {
                if (!wasNotified && moment(game.startTime).isSameOrBefore(checkTime)) {
                    sendPushbulletMessage(game);
                    sendEmail(game);
                    setNotificationAsSent(redis, userId, game.id);
                }
            });
        });
    });
};

exports.checkForNotifications = checkForNotifications;
