const expect = require('chai').expect;
const fs = require('fs');
const cheerio = require('cheerio')

const scraper = require('../src/scraper.js');

describe('Scraper', () => {
    let htmlData = '';

    before(() => {
        htmlData = fs.readFileSync('./test/data/schedule.html');
    });

    describe('parseSchedule', () => {
        it ('gets the first game correctly as Crash Bandicoot', () => {
            const parsedData = scraper.parseSchedule(htmlData);
            expect(parsedData).to.not.be.empty;
            const firstGame = parsedData[0];
            expect(firstGame.id).to.equal('4a9e2013c349e74f7528455a189eb5433b9967b9');
            expect(firstGame.title).to.equal('Crash Bandicoot N. Sane Trilogy');
            expect(firstGame.startTime).to.equal('2018-01-07T17:00:00Z');
            expect(firstGame.runners).to.equal('JHobz');
            expect(firstGame.setupTime).to.equal('0:10:00');
            expect(firstGame.runTime).to.equal('1:13:00');
            expect(firstGame.category).to.equal('Crash Bandicoot 3: Warped - Any%');
        });
    
        it ('get the last game correctly as The Legend of Zelda: BOTW', () => {
            const parsedData = scraper.parseSchedule(htmlData);
            const lastGame = parsedData[parsedData.length - 1];
            expect(lastGame.id).to.equal('3068e7bc7f11224098b676c294e65505e5e63f4e');
            expect(lastGame.title).to.equal('The Legend of Zelda: Breath of the Wild');
            expect(lastGame.startTime).to.equal('2018-01-14T04:14:00Z');
            expect(lastGame.runners).to.equal('atz');
            expect(lastGame.setupTime).to.equal('0:10:00');
            expect(lastGame.runTime).to.equal('3:57:00');
            expect(lastGame.category).to.equal('All Main Quests (No Amiibo)');
        });
    });

    describe('generateId', () => {
        it('generates the correct id', () => {

            const game = {
                title: 'Thing',
                category: 'Another Thing',
                event: 'AGDQ 2018',
            };
            expect(scraper.generateId(game)).to.equal('6fb050ef0f536afa808feb3fffb8d8372645dde3');

            const game2 = {
                title: 'Thing',
                category: 'Another Thing',
                event: 'AGDQ 2017',
            };
            expect(scraper.generateId(game2)).to.equal('7e0e74b47db3f368568b501f509ae09894b6479d');
        });
    });
});