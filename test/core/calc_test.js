import {describe, it} from "mocha";
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
        data.calc.calculateRows(data.rows, changeDataForCalc);

        let cell1 = data.rows.getCell(1,1);
        console.log(cell1);
        assert.equal(cell1.text, '1');
        assert.equal(cell1.formulas, '=ABS(-1)');
        assert.equal(cell1.style, 1);
    });

    it(' bug2 ', function () {
        let cell = new Cell()
        cell.setCell({text: "1", formulas: "1", depend: ['B2']});
        data.rows.setCell(0, 0, cell, 'all');
        let changeDataForCalc = new PreAction({
            type: 1,
            ri: 0,
            ci: 0,
            action: "在A1中键入1",
            oldCell:data.rows.eachRange(new CellRange(0, 0, 0, 0)),
            newCell: data.rows.eachRange(new CellRange(0, 0, 0, 0))
        }, data);


        let cell2 = new Cell();
        cell2.setCell({text: "=A1", formulas: "=A1", depend: ['C3']})
        data.rows.setCell(1, 1, cell2, 'all');

        let cell3 = new Cell()
        cell3.setCell({text: "=B2", formulas: "=B2"})
        data.rows.setCell(2, 2, cell3, 'all');

        data.calc.calculateRows(data.rows, changeDataForCalc);
        data.rows.setCell(0, 0, {text: "2", formulas: "2", depend: ['B2']}, 'all');
        changeDataForCalc = new PreAction({
            type: 1,
            ri: 0,
            ci: 0,
            action: "在A1中键入1",
            oldCell:data.rows.eachRange(new CellRange(0, 0, 0, 0)),
            newCell: data.rows.eachRange(new CellRange(0, 0, 0, 0))
        }, data);
        data.calc.calculateRows(data.rows, changeDataForCalc);

        cell2 = data.rows.getCell(1,1);
        cell3 = data.rows.getCell(2, 2);

        assert.equal(cell2.text, '2');
        assert.equal(cell2.formula, '2');
        assert.equal(cell3.text, '2');
        assert.equal(cell3.formula, '2');

        console.log(data.rows.getCell(0, 0));
        console.log(data.rows.getCell(1,1));
        console.log(data.rows.getCell(2, 2));
    });

    it(' bug3 ', function () {
        let cell2 = new Cell();
        cell2.setCell({text: "=A1", formulas: "=A1"})
        data.rows.setCell(1, 1, cell2, 'all');

        data.calc.calculateRows(data.rows, changeDataForCalc);
        cell2 = data.rows.getCell(1,1);

        let changeDataForCalc = new PreAction({
            type: 11,
            ri: -1,
            ci: -1,
            oldCell:data.rows.eachRange(new CellRange(0, 0, 10, 10)),
            newCell: data.rows.eachRange(new CellRange(0, 0, 10, 10))
        }, data);
        data.calc.calculateRows(data.rows, changeDataForCalc);
        data.calc.calculateRows(data.rows, changeDataForCalc);

        assert.equal(cell2.text, '0');
        assert.equal(cell2.formula, '=A1');
    });


});