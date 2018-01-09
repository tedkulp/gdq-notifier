const _ = require('lodash');
const Promise = require('bluebird');

const getKeyName = userId => {
    return `watchedgames:${userId}`;
}

exports.listWatchedGames = (redis, userId) => {
    return new Promise((resolve, reject) => {
        redis.lrange(getKeyName(userId), 0, -1, (err, redisResponse) => {
            if (err)
                reject(err);
            resolve(redisResponse);
        });
    });
};

exports.addWatchedGame = (redis, gameId, userId) => {
    redis.rpush(getKeyName(userId), gameId);
    return exports.listWatchedGames(redis, userId);
};

exports.removeWatchedGame = (redis, gameId, userId) => {
    redis.lrem(getKeyName(userId), 0, gameId);
    return exports.listWatchedGames(redis, userId);
};
