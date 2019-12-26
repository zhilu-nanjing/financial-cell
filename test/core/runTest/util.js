const pixelmatch = require('pixelmatch');
const PNG = require('pngjs').PNG;
let fs = require('fs');
const {resolve} = require('path');

export const testUrl = "http://192.168.31.33:8080";
export const rootPath = resolve('./');

export function waitTime(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

export async function compareScreenshot(expectedPath, actualPath, threshold = 0.01) {
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


export async function loadActions(actions, page) {
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
            await waitTime(delay * 20);

            let path = "/Users/wen/Desktop/work/sda/financial-cell/test/core/runTest/png/";
            let name = path + "asdd" + (Math.random() * delay * 500) + ".png";
            console.log(name, "   name");
            await page.screenshot({path: name});
            png.push(name);
            await waitTime(delay);
        } else if (type === 'input') {
            let {world} = actions[i];
            if (world) {
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

export function readDirSync(path) {
    return geFileList(path);
}

function geFileList(path) {
    let filesList = [];
    let targetObj = {};
    readFile(path, filesList, targetObj);
    return filesList;
}

//遍历读取文件
function readFile(path, filesList, targetObj) {
    let files = fs.readdirSync(path);//需要用到同步读取
    files.forEach(walk);

    function walk(file) {
        let states = fs.statSync(path + '/' + file);
        if (states.isDirectory()) {
            let item;
            if (targetObj["children"]) {
                item = {label: file, children: []};
                targetObj["children"].push(item);
            }
            else {
                item = {label: file, children: []};
                filesList.push(item);
            }

            readFile(path + '/' + file, filesList, item);
        }
        else {
            let obj = new Object();
            obj.size = states.size;//文件大小，以字节为单位
            obj.name = file;//文件名
            obj.path = path + '/' + file; //文件绝对路径

            if (targetObj["children"]) {
                let item = {label: obj.path}
                targetObj["children"].push(item);
            }
            else {
                let item = {label: obj.path};
                filesList.push(item);
            }
        }
    }
}