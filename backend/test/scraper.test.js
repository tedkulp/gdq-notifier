const expect = require('chai').expect;
const fs = require('fs');
const cheerio = require('cheerio');

const scraper = require('../src/scraper.js');

describe('Scraper', () => {
    let htmlData = '';

    before(() => {
        htmlData = fs.readFileSync('./test/data/schedule.html');
    });

    describe('parseSchedule', () => {
        it ('gets the first game correctly', () => {
            const parsedData = scraper.parseSchedule(htmlData);
            expect(parsedData).to.not.be.empty;
            const firstGame = parsedData[0];
            expect(firstGame.id).to.equal('a91876480f5b2bcf596401c8fc15358f556e2aa5');
            expect(firstGame.title).to.equal('Spyro Reignited Trilogy: Spyro the Dragon');
            expect(firstGame.startTime).to.equal('2019-06-23T17:00:00Z');
            expect(firstGame.runners).to.equal('ChrisLBC');
            expect(firstGame.setupTime).to.equal('0:10:00');
            expect(firstGame.runTime).to.equal('1:00:00');
            expect(firstGame.category).to.equal('Any% — PS4');
        });

        it ('get the last game correctly', () => {
            const parsedData = scraper.parseSchedule(htmlData);
            const lastGame = parsedData[parsedData.length - 1];
            expect(lastGame.id).to.equal('0275397b4868409af6121651467b2f3fa63d3742');
            expect(lastGame.title).to.equal('Chrono Trigger');
            expect(lastGame.startTime).to.equal('2019-06-29T22:52:00Z');
            expect(lastGame.runners).to.equal('puwexil');
            expect(lastGame.setupTime).to.equal('0:10:00');
            expect(lastGame.runTime).to.equal('6:00:00');
            expect(lastGame.category).to.equal('Glitchless Any% — SNES');
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