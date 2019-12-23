import {describe} from "mocha";
import {randowByClient, fail} from "./runTest/actions/input";
import {waitTime} from "./runTest/util";

const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

const puppeteer = require('/Users/wen/Downloads/incubator-echarts/node_modules/puppeteer');
const url = "http://192.168.31.33:8081/";

describe('test', () => {

    it('test1 success', async function () {
        const browser = await puppeteer.launch({headless: false, defaultViewport: {width: 1500, height: 1500}});
        const page = await browser.newPage()
        await page.goto(url);
        await waitTime(500);
        let pngArr = await loadActions(randowByClient, page);
        console.log(pngArr);
        if (pngArr.length !== 2) {
            throw new Error('图片个数不正确');
        }
        let {diffRatio, diffPNG} = await compareScreenshot(pngArr[0], pngArr[1]);
        console.log(diffRatio);
        if (diffRatio > 0.005) {
            throw new Error('有问题' + diffRatio);
        }

        await browser.close();
    });

    it('test2 fail', async function () {
        const browser = await puppeteer.launch({headless: false, defaultViewport: {width: 1500, height: 1500}});
        const page = await browser.newPage()
        await page.goto(url);
        await waitTime(500);
        let pngArr = await loadActions(fail, page);
        if (pngArr.length !== 2) {
            throw new Error('图片个数不正确');
        }
        let {diffRatio, diffPNG} = await compareScreenshot(pngArr[0], pngArr[1]);
        console.log(diffRatio);
        if (diffRatio > 0.005) {
            throw new Error('有问题' + diffRatio);
        }

        await browser.close();
    });


    it('img diff test', async function () {
        let {diffRatio, diffPNG} = await compareScreenshot('/Users/wen/Downloads/incubator-echarts/test/runTest/tmp/__screenshot__/allZero-full-shot-actual.png', '/Users/wen/Downloads/incubator-echarts/test/runTest/tmp/__screenshot__/allZero-full-shot-expected.png');
    });
});

async function compareScreenshot(expectedPath, actualPath, threshold = 0.01) {
    return Promise.all([readPNG(expectedPath), readPNG(actualPath)]).then(([expectedImg, actualImg]) => {
        let width = expectedImg.width;
        let height = expectedImg.height;
        if ((width !== actualImg.width)
            || (height !== actualImg.height)) {
            throw new Error('Image size not match');
        }

        const diffPNG = new PNG({width, height});
        let diffPixelsCount = pixelmatch(expectedImg.data, actualImg.data, diffPNG.data, width, height, {threshold});
        let totalPixelsCount = width * height;
        return {
            diffRatio: diffPixelsCount / totalPixelsCount,
            diffPNG
        };
    });
}

function readPNG(path) {
    return new Promise(resolve => {
        fs.createReadStream(path)
            .pipe(new PNG())
            .on('parsed', function () {
                resolve({
                    data: this.data,
                    width: this.width,
                    height: this.height
                });
            });
    });
}

async function loadActions(actions, page) {
    let delay = 50;
    let png = [];
    for (let i = 0; i < actions.length; i++) {
        let {x, y, type} = actions[i];
        // console.log(type, i)
        if (type === 'mousedown') {
            await page.mouse.down();
            await waitTime(delay);
        } else if (type === 'mouseup') {
            await page.mouse.up();
            await waitTime(delay);
        } else if (type === 'mousemove') {
            await page.mouse.move(x, y);
            await waitTime(delay);
        } else if (type === 'dbmousedown') {
            await page.mouse.down({
                clickCount: 2
            });
            await waitTime(delay);
        } else if (type === 'screenshot') {
            let path = "/Users/wen/Desktop/work/sda/financial-cell/test/runTest/png/";
            let name = path + "asdd" + (Math.random() * delay * 1000) + ".png";
            console.log(name, "   name");
            await page.screenshot({path: name});
            png.push(name);
            await waitTime(delay * 10);
        } else if (type === 'input') {
            let {world} = actions[i];
            if(world) {
                await page.keyboard.down(world);
                await waitTime(delay / 2);
            }
        } else if (type === 'keydown') {
            let {world} = actions[i];
            await page.keyboard.press(world);
            await waitTime(delay);

        }
    }

    return png;
}
