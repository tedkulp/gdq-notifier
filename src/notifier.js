const _ = require('lodash');
const moment = require('moment');
const PushBullet = require('pushbullet');
const pusher = new PushBullet(process.env.PUSHBULLET_API_KEY);

const gamesICareAbout = [
    '4a9e2013c349e74f7528455a189eb5433b9967b9',
    '3068e7bc7f11224098b676c294e65505e5e63f4e',
];

const previousNotifications = [];

const checkForNotifications = parsedData => {
    //const checkTime = moment.add(10, 'minutes');
    const checkTime = moment().add(24, 'hours');
    const foundGames = _.filter(parsedData, game => _.includes(gamesICareAbout, game.id));
    _.forEach(foundGames, game => {
        if (!_.includes(previousNotifications, game.id)) {
            if (moment(game.startTime).isSameOrBefore(checkTime)) {
                pusher.note({}, `${game.event} Notification`, `${game.title} by ${game.runners} is going to start in a few minutes.`);
                previousNotifications.push(game.id);
            }
        }
    });
};

exports.checkForNotifications = checkForNotifications;