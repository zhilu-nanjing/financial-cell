import DataProxy from "../../src/core/data_proxy";
import Sheet from "../../src/component/sheet";
import {h} from "../../src/component/element";
import {cssPrefix} from "../../src/config";
import CellRange from "../../src/core/cell_range";
import {sheetCopy} from "../../src/event/copy";
import {bugout} from "../../src/log/log_proxy";
import {GetInfoFromTable} from "../../src/event/paste";
import {simulateMouseEvent} from "../util/event";

let assert = require('assert');
/*
    rows.setData();  初始化数据
    sheet.toolbar.change('close', '');  计算所有公式
 */
describe("hexColorLuminance", function () {
    window.bugout = bugout;
    let data = new DataProxy("sheet1", {rowsInit: true}, {});
    /*  util 1 */
    // let rows1 = {};
    // let i = 0;
    // for (; i < 3; i++) {
    //     rows1[i] = {
    //         "cells": {}
    //     };
    //
    //     for (let j = 0; j < 10; j++) {
    //         rows1[i]["cells"][j] = cellTypeRandom('number');
    //     }
    // }
    // for (; i < 6; i++) {
    //     rows1[i] = {
    //         "cells": {}
    //     };
    //
    //     for (let j = 0; j < 10; j++) {
    //         rows1[i]["cells"][j] = cellTypeRandom('formulaNumber');
    //     }
    // }
    // for (; i < 9; i++) {
    //     rows1[i] = {
    //         "cells": {}
    //     };
    //
    //     for (let j = 0; j < 10; j++) {
    //         rows1[i]["cells"][j] = cellTypeRandom('abs_refs');
    //     }
    // }

    /*  util 2 */
    let rows1 = {
        0: {
            cells: {
                0: {text: 80523, formulas: 80523},
                1: {text: 66629, formulas: 66629},
                2: {text: 94874, formulas: 94874},
                3: {text: 26939, formulas: 26939},
                4: {text: 90612, formulas: 90612},
                5: {text: 36009, formulas: 36009},
                6: {text: 92343, formulas: 92343},
                7: {text: 79268, formulas: 79268},
                8: {text: 88584, formulas: 88584},
                9: {text: 4295, formulas: 4295},
            }
        },
        1: {
            cells: {
                0: {text: 23828, formulas: 23828},
                1: {text: 58404, formulas: 58404},
                2: {text: 93989, formulas: 93989},
                3: {text: 43875, formulas: 43875},
                4: {text: 83634, formulas: 83634},
                5: {text: 49846, formulas: 49846},
                6: {text: 56460, formulas: 56460},
                7: {text: 73191, formulas: 73191},
                8: {text: 59303, formulas: 59303},
                9: {text: 18474, formulas: 18474},
            }
        },
        2: {
            cells: {
                0: {text: 38045, formulas: 38045},
                1: {text: 83694, formulas: 83694},
                2: {text: 98268, formulas: 98268},
                3: {text: 85122, formulas: 85122},
                4: {text: 29484, formulas: 29484},
                5: {text: 82961, formulas: 82961},
                6: {text: 93080, formulas: 93080},
                7: {text: 25423, formulas: 25423},
                8: {text: 26093, formulas: 26093},
                9: {text: 15045, formulas: 15045},
            }
        },
        3: {
            cells: {
                0: {text: "=42343", formulas: "=42343"},
                1: {text: "=69705", formulas: "=69705"},
                2: {text: "=37872", formulas: "=37872"},
                3: {text: "=6233", formulas: "=6233"},
                4: {text: "=add(A1:A2)", formulas: "=add(A1:A2)"},
                5: {text: "=16844", formulas: "=16844"},
                6: {text: "=ADD($A1:$A2) + 2 + A2", formulas: "=ADD($A1:$A2) + 2 + A2"},
                7: {text: "=55026", formulas: "=55026"},
                8: {text: "=95271", formulas: "=95271"},
                9: {text: "=31355", formulas: "=31355"},
            }
        },
        4: {
            cells: {
                0: {text: "=$K$142", formulas: "=$K$142"},
                1: {text: "=$B$859", formulas: "=$B$859"},
                2: {text: "=$J$928", formulas: "=$J$928"},
                3: {text: "=$E$135", formulas: "=$E$135"},
                4: {text: "=$H$171", formulas: "=$H$171"},
                5: {text: "=$K$798", formulas: "=$K$798"},
                6: {text: "=$C$739", formulas: "=$C$739"},
                7: {text: "=$I$428", formulas: "=$I$428"},
                8: {text: "=$H$11", formulas: "=$H$11"},
                9: {text: "=$H$769", formulas: "=$H$769"},
            }
        },
        5: {
            cells: {
                0: {text: "=A1+A2", formulas: "=A1+A2"},
                2: {text: "=A2+A3", formulas: "=A2+A3"},
                3: {text: "=A1+A3", formulas: "=A1+A3"},
                4: {text: "=A8+A5", formulas: "=A8+A5"},
                5: {text: "=A1+A4", formulas: "=A1+A4"},
                6: {text: "=A7+A4", formulas: "=A7+A4"},
                7: {text: "=A6+A2", formulas: "=A6+A2"},
                8: {text: "=A1+A2", formulas: "=A1+A2"},
            }
        },
        6: {
            cells: {
                0: {text: "=ADD(A1+A2, 0)", formulas: "=ADD(A1+A2, 0)"},
                2: {text: "=ADD(A2+A3, 2)", formulas: "=ADD(A2+A3, 2)"},
                3: {text: "=ADD(A1+A3, 3)", formulas: "=ADD(A1+A3, 3)"},
                4: {text: "=ADD(A8+A5, 4)", formulas: "=ADD(A8+A5, 4)"},
                5: {text: "=ADD(A1+A4, 5)", formulas: "=ADD(A1+A4, 5)"},
                6: {text: "=ADD(A7+A4, 6)", formulas: "=ADD(A7+A4, 6)"},
                7: {text: "=ADD(A6+A2, 7)", formulas: "=ADD(A6+A2, 7)"},
                8: {text: "=ADD(A1+A2, 8)", formulas: "=ADD(A1+A2, 8)"},
            }
        }
    };

    const rootEl = h('div', `${cssPrefix}`)
        .on('contextmenu', evt => evt.preventDefault());
    let sheet = new Sheet(rootEl, data);
    sheet.toolbar.change('close', '');
    data.rows.setData(rows1, sheet, false, true);

    it("sheetCopy/paste test", function () {
        data.selector.range = new CellRange(0, 0, 6, 6);
        let args = sheetCopy.call(sheet);

        data.selector.ri = 1;
        data.selector.ci = 1;
        GetInfoFromTable.call(sheet, args.html.el);


        let cell1 = data.rows.getCell(1, 1);
        let cell2 = data.rows.getCell(1, 4);
        let cell3 = data.rows.getCell(1, 7);
        let cell4 = data.rows.getCell(4, 3);
        let cell5 = data.rows.getCell(4, 8);
        let cell6 = data.rows.getCell(7, 4);
        let cell7 = data.rows.getCell(6, 5);
        let cell8 = data.rows.getCell(4, 7);

        assert.equal(cell1.text, "80523");
        assert.equal(cell1.formulas, "80523");
        assert.equal(cell2.text, "26939");
        assert.equal(cell2.formulas, "26939");
        assert.equal(cell3.text, "92343");
        assert.equal(cell3.formulas, "92343");
        assert.equal(cell4.text, "=37872");
        assert.equal(cell4.formulas, "=37872");
        assert.equal(cell5.text, "0");
        assert.equal(cell5.formulas, "=$H$11");
        assert.equal(cell6.text, "=ADD(B2+B4, 3)");
        assert.equal(cell6.formulas, "=ADD(B2+B4, 3)");
        assert.equal(cell7.text, "=B9+B6");
        assert.equal(cell7.formulas, "=B9+B6");
        assert.equal(cell8.text, "=ADD($A2:$A3) + 2 + B3");
        assert.equal(cell8.formulas, "=ADD($A2:$A3) + 2 + B3");

        console.log('copy/paste success');
    });



});

