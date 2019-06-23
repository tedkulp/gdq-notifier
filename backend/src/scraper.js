const cheerio = require('cheerio');
var crypto = require('crypto');

const CURRENT_EVENT = 'SGDQ 2019';

const generateId = game => {
    const shasum = crypto.createHash('sha1');
    shasum.update(`${game.event}:${game.title}:${game.category}`);
    return shasum.digest('hex');
};

const parseSchedule = html => {
    const $ = cheerio.load(html);
    let games = [];

    let currentGame = undefined;
    let skipRow = false;
    $('tbody').find('tr').each((idx, elem) => {
        if (!$(elem).hasClass('second-row')) {
            currentGame = {
                event: CURRENT_EVENT,
            };
            skipRow = false;

            // Row 1
            const cells = $(elem).children('td');
            currentGame.startTime = $(cells[0]).text();
            currentGame.title = $(cells[1]).text();
            currentGame.runners = $(cells[2]).text();
            currentGame.setupTime = $(cells[3]).text().trim();

            if (currentGame.runners === 'Tech Crew' || currentGame.setupTime === '')
                skipRow = true;

            currentGame.id = generateId(currentGame);
        } else {
            if (skipRow) {
                return;
            }

            // Row 2
            const cells = $(elem).children('td');
            currentGame.runTime = $(cells[0]).text().trim();
            currentGame.category = $(cells[1]).text().trim();

            // Push to games list
            games.push(currentGame);
        }
    });

    return games;
};

exports.generateId = generateId;
exports.parseSchedule = parseSchedule;