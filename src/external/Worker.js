// Worker.js
import XLSX_CALC from "xlsx-calc"
var formulajs = require('formulajs');

const _ = require('lodash')

const obj = {foo: 'foo'}

_.has(obj, 'foo')

// // 发送数据到父线程
// self.postMessage({ foo: 'foo' })

function add() {
    return 11111;
}

// 响应父线程的消息
self.addEventListener('message', (event) => {
    console.log("...");
    // let {workbook} = event.data;
    // console.log(add());
    // XLSX_CALC.import_functions(formulajs);
    //
    // XLSX_CALC(workbook);
    // postMessage({data: workbook, type: 1})
});