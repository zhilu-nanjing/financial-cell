import {rootPath} from "./util";

let fs = require('fs');
let url = require('url');
let path = require("path");
let http = require('http');
const puppeteer = require('/Users/wen/Downloads/incubator-echarts/node_modules/puppeteer');


http.createServer(function (req, res) {
    let pathobj = url.parse(req.url, true)
    res.setHeader("Access-Control-Allow-Origin", "*"); // 设置可访问的源
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("content-type", "application/json");
    let data = '';
    console.log(req.url)

    req.on('data', function (chunk) {
        data = chunk;
    });

    req.on('end', async function () {

            switch (req.url) {
                case '/':
                    await runAction();
                    res.write("爬虫成功");
                    break;
                case "/save":
                    console.log(data, JSON.parse(data));
                    save(data, "test.html");
                    break;
            }


        res.end();
    });
}).listen(1001);

async function runAction() {
    const browser = await puppeteer.launch({headless: false, defaultViewport: {width: 1500, height: 1500}});
    const page = await browser.newPage();
    await page.goto('https://stats.nba.com/player/76375/boxscores/?Season=ALL&SeasonType=Regular%20Season', {
        'timeout': 1000 * 60 * 60
    });
    page.waitFor(1000)

    let str = "";
    await page.evaluate(() => {
        let tableDom = document.getElementsByClassName("nba-stat-table__overflow")[0].getElementsByTagName("table");
        let tmpNode = document.createElement("div");
        let cdn = document.createElement("script");
        cdn.src="https://cdn.bootcss.com/axios/0.19.0/axios.min.js";
        document.getElementsByTagName("head")[0].appendChild(cdn);
        //appendChild()  参数Node对象   返回Node对象  Element方法
        //cloneNode()  参数布尔类型  返回Node对象   Element方法
        cdn.onload = () => {
            tmpNode.appendChild(tableDom[0]);
            console.log(tmpNode, tableDom);
            str = tmpNode.innerHTML;
            console.log({
                data: JSON.stringify(str)
            });

            axios.post("http://127.0.0.1:1001/save", {
                data: JSON.stringify(str)
            });
        }
    });
}

function nodeToString(node) {
    //createElement()返回一个Element对象
    let tmpNode = document.createElement("div");
    //appendChild()  参数Node对象   返回Node对象  Element方法
    //cloneNode()  参数布尔类型  返回Node对象   Element方法
    tmpNode.appendChild(node.cloneNode(true));
    let str = tmpNode.innerHTML;
    tmpNode = node = null; // prevent memory leaks in IE
    return str;
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
    if (!fileName) {
        return;
    }
    let m = showTime().split(":", "-");
    console.log(m);
    fs.writeFile(path + "/" + fileName, JSON.stringify(action), (err) => {
        if (err) throw err;
    });
}

function showTime() {
    let now = new Date();
    let nowTime = now.toLocaleString();

    return nowTime.substring(11, 20).trim();
}
