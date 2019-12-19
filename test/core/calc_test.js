import {describe, it} from "mocha";
import {changeFormat} from "../../src/utils/date";
import DataProxy from "../../src/core/data_proxy";
import PreAction from "../../src/model/pre_action";
import CellRange from "../../src/core/cell_range";
import Cell from "../../src/model/cell";
let assert = require('assert');

describe('calc', () => {
    let data = new DataProxy("sheet1", {}, {});

    it(' bug1 ', function () {
        let cell = new Cell()
        cell.setCell({text: "=ABS(-1)", formulas: "=ABS(-1)", style: 1})
        data.rows.setCell(1, 1, cell, 'all');

        let changeDataForCalc = new PreAction({
            type: 11,
            ri: -1,
            ci: -1,
            oldCell:data.rows.eachRange(new CellRange(0, 0, 10, 10)),
            newCell: data.rows.eachRange(new CellRange(0, 0, 10, 10))
        }, data);
        data.calc.calculateRows(data.rows, changeDataForCalc);

        let cell1 = data.rows.getCell(1,1);
        console.log(cell1);
        assert.equal(cell1.text, '1');
        assert.equal(cell1.formulas, '=ABS(-1)');
        assert.equal(cell1.style, 1);
    });
});