// Worker.js
import {changeFormula, cutStr, value2absolute} from "../core/operator";
import XLSX_CALC from "xlsx-calc"

const _ = require('lodash')

const obj = { foo: 'foo' }

_.has(obj, 'foo')

// // 发送数据到父线程
// self.postMessage({ foo: 'foo' })

// 响应父线程的消息
self.addEventListener('message', (event) => {
    let {type } = event.data;
    if(type === 1) {
        let {workbook } = event.data;

        XLSX_CALC(workbook);
        self.postMessage({ data: workbook })
    } else {
        let {arr,arr2,arr3, rows,  } = event.data;

        function each(cb) {
            Object.entries(rows._).forEach(([ri, row]) => {
                cb(ri, row);
            });
        }

        function eachCells(ri, cb) {
            if (rows._[ri] && rows._[ri].cells) {
                Object.entries(rows._[ri].cells).forEach(([ci, cell]) => {
                    cb(ci, cell);
                });
            }
        }

        function get(ri) {
            return rows._[ri];
        }

        function getCell(ri, ci) {
            const row = get(ri);
            if (row !== undefined && row.cells !== undefined && row.cells[ci] !== undefined) {
                return row.cells[ci];
            }
            return null;
        }

        function getOrNew(ri) {
            rows._[ri] = rows._[ri] || {cells: {}};
            return rows._[ri];
        }

        function getCellOrNew(ri, ci) {
            const row = getOrNew(ri);
            row.cells[ci] = row.cells[ci] || {};
            return row.cells[ci];
        }

        function setCellAll(ri, ci, text, formulas = "") {
            const cell = getCellOrNew(ri, ci);
            cell.formulas = formulas == "" ? cell.formulas : formulas;
            cell.text = text;
        }

        each((ri) => {
            eachCells(ri, (ci) => {
                for (let i = 0; i < arr.length; i++) {
                    let cell = getCell(ri, ci);
                    let s1 = arr[i];
                    let formulas = changeFormula(cutStr(cell.formulas));

                    if (formulas.indexOf(s1) != -1) {
                        let ca = arr3[i].replace(/\$/g, "\\$");

                        setCellAll(ri, ci, cell.text.replace(new RegExp(ca, 'g'), arr2[i]),
                            cell.formulas.replace(ca, arr2[i]));
                    } else {
                        let s = value2absolute(s1);
                        let es = value2absolute(arr2[i]);
                        if (formulas.indexOf(s.s3) != -1) {
                            s = value2absolute(arr3[i]);

                            s.s3 = s.s3.replace(/\$/g, "\\$");
                            setCellAll(ri, ci, cell.text.replace(new RegExp(s.s3, 'g'), es.s3),
                                cell.formulas.replace(new RegExp(s.s3, 'g'), es.s3));
                        } else if (formulas.indexOf(s.s2) != -1) {
                            s = value2absolute(arr3[i]);
                            s.s2 = s.s2.replace(/\$/g, "\\$");
                            setCellAll(ri, ci, cell.text.replace(new RegExp(s.s2, 'g'), es.s2),
                                cell.formulas.replace(new RegExp(s.s2, 'g'), es.s2));
                        } else if (formulas.indexOf(s.s1) != -1) {
                            s = value2absolute(arr3[i]);
                            s.s1 = s.s1.replace(/\$/g, "\\$");

                            setCellAll(ri, ci, cell.text.replace(new RegExp(s.s1, 'g'), es.s1),
                                cell.formulas.replace(new RegExp(s.s1, 'g'), es.s1));
                        }
                    }
                }
            });
        });


        postMessage({ rrows: rows._, type: 2 })
    }
});