import Vaild from "../../util/valid";
import Sheet from "../../../src/component/sheet";
import {simulateMouseEvent} from "../../util/event";
import DataProxy from "../../../src/core/data_proxy";
import {cssPrefix} from "../../../src/config";
import {bugout} from "../../../src/log/log_proxy";
import {h} from "../../../src/component/element";
import CellRange from "../../../src/core/cell_range";
import {consoleSuccess} from "../../util/utils";

let assert = require('assert');

describe("autoFill2", function () {
    window.bugout = bugout;

    /*  util 2 */
    let rows1 = {
        0: {
            cells: {
                1: {text: "", formulas: "=$T20"},
                19: {text: "22", formulas: "22"},
            }
        },
        1: {
            cells: {
                1: {text: "2019-01-01", formulas: "2019-01-01"},

            }
        },
        2: {
            cells: {
                1: {text: "asd123", formulas: "asd123"},
            }
        },
        3: {
            cells: {
                1: {text: "123", formulas: "=123"},
            }
        },
    };
    let data = new DataProxy("sheet1", {rowsInit: true}, {});
    const rootEl = h('div', `${cssPrefix}`)
        .on('contextmenu', evt => evt.preventDefault());
    let sheet = new Sheet(rootEl, data);
    sheet.toolbar.change('close', '');
    data.rows.setData(rows1, sheet, false, true);

    /*
        assert
            1. arange
            2. cell
            3. action
     */
    it('autoFill', function () {
        sheet.table.valid = new Vaild(() => {
            let cell1 = data.rows.getCell(1, 1);
            let cell2 = data.rows.getCell(2, 1);
            let cell3 = data.rows.getCell(3, 1);
            let cell4 = data.rows.getCell(4, 1);
            let cell5 = data.rows.getCell(5, 1);
            let cell6 = data.rows.getCell(6, 1);
            let cell7 = data.rows.getCell(7, 1);
            let cell8 = data.rows.getCell(8, 1);
            let cell9 = data.rows.getCell(9, 1);
            let cell11 = data.rows.getCell(11, 1);
            let cell20 = data.rows.getCell(20, 1);
            let cell21 = data.rows.getCell(21, 1);
            let cell26 = data.rows.getCell(26, 1);
            let cell36 = data.rows.getCell(36, 1);
            let cell50 = data.rows.getCell(50, 1);
            let cell63 = data.rows.getCell(63, 1);
            console.log(sheet);
            assert.equal(cell1.text, "2019-01-01");
            assert.equal(cell1.formulas, "2019-01-01");

            assert.equal(cell2.text, "asd123");
            assert.equal(cell2.formulas, "asd123");
            assert.equal(cell3.text, "123");
            assert.equal(cell3.formulas, "=123");
            assert.equal(cell4.text, "0");
            assert.equal(cell4.formulas, "=$T20");
            assert.equal(cell5.text, "2019-01-01");
            assert.equal(cell5.formulas, "2019-01-01");
            assert.equal(cell6.text, "asd123");
            assert.equal(cell6.formulas, "asd123");
            assert.equal(cell7.text, "123");
            assert.equal(cell7.formulas, "=123");
            assert.equal(cell8.text, "0");
            assert.equal(cell8.formulas, "=$T20");
            assert.equal(cell9.text, "2019-01-01");
            assert.equal(cell9.formulas, "2019-01-01");
            assert.equal(cell11.text, "123");
            assert.equal(cell11.formulas, "=123");
            assert.equal(cell20.text,"0");
            assert.equal(cell20.formulas, "=$T20");
            assert.equal(cell21.text, "2019-01-01");
            assert.equal(cell21.formulas, "2019-01-01");
            assert.equal(cell26.text, "asd123");
            assert.equal(cell26.formulas, "asd123");
            assert.equal(cell36.text, "0");
            assert.equal(cell36.formulas, "=$T20");
            assert.equal(cell50.text, "asd123");
            assert.equal(cell50.formulas, "asd123");
            assert.equal(cell63.text, "123");
            assert.equal(cell63.formulas, "=123");

            consoleSuccess("填充2 - 计算单元格 - 对比 正确");
        });

        data.multiPreAction.valid = new Vaild(() => {
            console.log(data.multiPreAction);
            assert.equal(data.multiPreAction.undoItems.length, 1);
            consoleSuccess("autofill-action 正确");
        });

        sheet.valid = new Vaild(() => {
            console.log("405", sheet.selector.arange)
            let sri = sheet.selector.arange.sri;
            let eri = sheet.selector.arange.eri;
            let eci = sheet.selector.arange.eci;
            let sci = sheet.selector.arange.sci;
            assert.equal(sri, 4);
            assert.equal(eri, 79);
            assert.equal(eci, 7);
            assert.equal(sci, 1);
            consoleSuccess("autofill-arange 正确");
        });

        let ev2 = simulateMouseEvent('mousedown', {
            clientX: 200,
            clientY: 200,
            buttons: 1,
            detail: 1,
            shiftKey: false,
        });

        ev2.corner = true;
        sheet.selector.range = new CellRange(0, 1, 3, 7);
        sheet.data.selector.range = new CellRange(0, 1, 3, 7);
        sheet.overlayerEl.el.dispatchEvent(ev2);

        for (let i = 0; i < 10; i++) {
            let ev = simulateMouseEvent('mousemove', {
                clientX: 200,
                clientY: (i + 1) * 200,
                buttons: 2,
                shiftKey: false
            });
            window.dispatchEvent(ev);
        }

        let ev3 = simulateMouseEvent('mouseup');
        window.dispatchEvent(ev3);


    });


});