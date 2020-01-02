import {describe, it} from "mocha";

let assert = require('assert');
const puppeteer = require('/Users/wen/Downloads/incubator-echarts/node_modules/puppeteer');

describe('爬虫', () => {
    it(' 1 ', async function () {
        await runAction();
    });
});

async function runAction() {
    const browser = await puppeteer.launch({headless: false, defaultViewport: {width: 1500, height: 1500}});
    const page = await browser.newPage();
    await page.goto('https://stats.nba.com/player/76375/boxscores/?Season=ALL&SeasonType=Regular%20Season', {
        'timeout': 1000 * 60 * 20
    });
    page.waitFor(1000)

    await page.evaluate(() => {
        let tableDom = document.getElementsByClassName("nba-stat-table__overflow")[0].getElementsByTagName("table");
        console.log(tableDom[0]);
    });
}