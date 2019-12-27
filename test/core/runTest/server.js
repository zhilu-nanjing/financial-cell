let fs = require('fs');
let url = require('url');
let path = require("path");
let http = require('http');
import {compareScreenshot, loadActions, readDirSync, rootPath, testUrl, waitTime} from "./util";

const puppeteer = require('/Users/wen/Downloads/incubator-echarts/node_modules/puppeteer');


http.createServer(function (req, res) {
    let pathobj = url.parse(req.url, true)
    res.setHeader("Access-Control-Allow-Origin", "*"); // 设置可访问的源
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("content-type", "application/json");
    let data = '';

    req.on('data', function (chunk) {
        data = JSON.parse(chunk);
    });

    req.on('end', async function () {
        switch (req.url) {
            case '/action':
                save(data, data['fileName']);
                res.write("保存成功");
                break;
            case '/action_run':
                await runAction();
                break;
            case '/action_runActions':
                if (data && data['data']) {
                    let {errorArr, successArr} = await runActions(data['data']);
                    res.write(JSON.stringify({
                        "msg": "运行成功",
                        "status": true,
                        "errorArr": errorArr,
                        "successArr": successArr,
                    }));
                }
                break;
            case '/action_catalogue':
                let dir = readDirSync(rootPath + "/actions");
                console.log(dir);
                res.write(JSON.stringify(dir));
                break;
        }

        res.end();
    });
}).listen(1001);

async function runActions(items) {
    let errorArr = [];
    let successArr = [];
    console.log(items);
    for (let i = 0; i < items.length; i++) {
        let data = fs.readFileSync(items[i]);
        try {
            let diff = await runAction(data.toString());
            successArr.push({
                "path": items[i],
                "diff": diff,
                "status": true,
            });
        } catch (e) {
            console.log(e);
            errorArr.push({
                "error": e.message,
                "path": items[i],
                "status": false,
            });
        }
    }

    return {
        "errorArr": errorArr,
        "successArr": successArr,
    }
}

async function runAction(inputAction) {
    inputAction = JSON.parse(inputAction)['data'];
    const browser = await puppeteer.launch({headless: false, defaultViewport: {width: 1500, height: 1500}});
    const page = await browser.newPage()
    await page.goto(testUrl);
    await waitTime(500);
    let pngArr = await loadActions(inputAction, page);
    console.log(pngArr);
    if (pngArr.length !== 2) {
        await browser.close();
        throw new Error('图片个数不正确');
    }
    let {diffRatio, diffPNG} = await compareScreenshot(pngArr[0], pngArr[1]);
    console.log(diffRatio);
    if (diffRatio > 0.005) {
        await browser.close();
        throw new Error('两张图片不一样， diff:' + diffRatio + "大于设置的 0.005" + "，图片路径" + pngArr[0] + ", " + pngArr[1]);
    }

    await browser.close();
    return diffRatio;
}


function save(action, fileName) {
    let myDate = new Date();
    let path = `${rootPath}/actions/${myDate.getFullYear()}-${myDate.getMonth() + 1}-${myDate.getDate()}`;
    console.log(path);
    fs.exists(path, (exists) => {
        if (!exists) {
            fs.mkdir(path, {recursive: false}, (err) => {
                if (err) throw err;
                saveFile(action, path, fileName);
            });
        } else {
            saveFile(action, path, fileName);
        }
    });

}


function saveFile(action, path, fileName) {
    if(!fileName) {
        return;
    }
    let m = showTime().split(":", "-");
    console.log(m);
    fs.writeFile(path + "/" + fileName + '.json', JSON.stringify(action), (err) => {
        if (err) throw err;
    });
}

function showTime() {
    let now = new Date();
    let nowTime = now.toLocaleString();

    return nowTime.substring(11, 20).trim();
}
