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

describe("autoFill", function () {
    window.bugout = bugout;
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
    // let rows1 = {
    //     0: {
    //         cells: {
    //             0: {text: "", formulas: "=T20"},
    //             1: {text: "", formulas: "=$T20"},
    //             2: {text: "", formulas: "=$T$20"},
    //             3: {text: "", formulas: "=ADD(1, T20)"},
    //             4: {text: "", formulas: "=213"},
    //             5: {text: 36009, formulas: 36009},
    //             6: {text: "", formulas: "=T20+T$10 + $T$20"},
    //             7: {text: "", formulas: "=T20+2"},
    //             8: {text: "", formulas: "=asdasd+T20+ADD(ADD(1, T20), T20)"},
    //             9: {text: "", formulas: "=asd123+as21+12"},
    //             19: {text: "123", formulas: "123"},
    //         }
    //     },
    //     1: {
    //         cells: {
    //             0: {text: "", formulas: "=asd+A2"},
    //             1: {text: "", formulas: "=A20+$A20"},
    //             2: {text: "", formulas: "=$T$20 + ADD(1, T20)"},
    //             3: {text: "", formulas: "=ADD($T$20, T20)"},
    //             4: {text: "", formulas: "=213 + A20"},
    //             5: {text: 309, formulas: 309},
    //             6: {text: "", formulas: "=T20+T$10 + =add(A$1:$A2)"},
    //             7: {text: "", formulas: "=T20+2+ 2 + A2"},
    //             8: {text: "", formulas: "=T$10+T20+ADD(ADD(1, T20), T20)+309"},
    //             9: {text: "", formulas: "=ADD($T$20:T20)"},
    //
    //         }
    //     },
    //     2: {
    //         cells: {
    //             0: {text: "asd", formulas: "asd"},
    //             1: {text: "=69705", formulas: "=69705"},
    //             2: {text: "=37872", formulas: "=37872"},
    //             3: {text: "=6233", formulas: "=6233"},
    //             4: {text: "=add(A1:A2)", formulas: "=add(A1:A2)"},
    //             5: {text: "=16844", formulas: "=16844"},
    //             6: {text: "=ADD($A1:$A2) + 2 + A2", formulas: "=ADD($A1:$A2) + 2 + A2"},
    //             7: {text: "=55026", formulas: "=55026"},
    //             8: {text: "=95271", formulas: "=95271"},
    //             9: {text: "=31355", formulas: "=31355"},
    //         }
    //     },
    //     3: {
    //         cells: {
    //             0: {text: "=42343", formulas: "=42343"},
    //             1: {text: "=69705", formulas: "=69705"},
    //             2: {text: "=37872", formulas: "=37872"},
    //             3: {text: "=6233", formulas: "=6233"},
    //             4: {text: "=add(A1:A2)", formulas: "=add(A1:A2)"},
    //             5: {text: "=16844", formulas: "=16844"},
    //             6: {text: "=ADD($A1:$A2) + 2 + A2", formulas: "=ADD($A1:$A2) + 2 + A2"},
    //             7: {text: "=55026", formulas: "=55026"},
    //             8: {text: "=95271", formulas: "=95271"},
    //             9: {text: "=31355", formulas: "=31355"},
    //         }
    //     },
    //     4: {
    //         cells: {
    //             0: {text: "=$K$142", formulas: "=$K$142"},
    //             1: {text: "=$B$859", formulas: "=$B$859"},
    //             2: {text: "=$J$928", formulas: "=$J$928"},
    //             3: {text: "=$E$135", formulas: "=$E$135"},
    //             4: {text: "=$H$171", formulas: "=$H$171"},
    //             5: {text: "=$K$798", formulas: "=$K$798"},
    //             6: {text: "=$C$739", formulas: "=$C$739"},
    //             7: {text: "=$I$428", formulas: "=$I$428"},
    //             8: {text: "=$H$11", formulas: "=$H$11"},
    //             9: {text: "=$H$769", formulas: "=$H$769"},
    //         }
    //     },
    //     5: {
    //         cells: {
    //             0: {text: "=A1+A2", formulas: "=A1+A2"},
    //             2: {text: "=A2+A3", formulas: "=A2+A3"},
    //             3: {text: "=A1+A3", formulas: "=A1+A3"},
    //             4: {text: "=A8+A5", formulas: "=A8+A5"},
    //             5: {text: "=A1+A4", formulas: "=A1+A4"},
    //             6: {text: "=A7+A4", formulas: "=A7+A4"},
    //             7: {text: "=A6+A2", formulas: "=A6+A2"},
    //             8: {text: "=A1+A2", formulas: "=A1+A2"},
    //         }
    //     },
    //     6: {
    //         cells: {
    //             0: {text: "=ADD(A1+A2, 0)", formulas: "=ADD(A1+A2, 0)"},
    //             2: {text: "=ADD(A2+A3, 2)", formulas: "=ADD(A2+A3, 2)"},
    //             3: {text: "=ADD(A1+A3, 3)", formulas: "=ADD(A1+A3, 3)"},
    //             4: {text: "=ADD(A8+A5, 4)", formulas: "=ADD(A8+A5, 4)"},
    //             5: {text: "=ADD(A1+A4, 5)", formulas: "=ADD(A1+A4, 5)"},
    //             6: {text: "=ADD(A7+A4, 6)", formulas: "=ADD(A7+A4, 6)"},
    //             7: {text: "=ADD(A6+A2, 7)", formulas: "=ADD(A6+A2, 7)"},
    //             8: {text: "=ADD(A1+A2, 8)", formulas: "=ADD(A1+A2, 8)"},
    //         }
    //     }
    // };

    /* util3 */
    let rows1 = {
        0: {
            cells: {
                0: {text: "", formulas: "=T20"},
                1: {text: "", formulas: "=$T20"},
                2: {text: "", formulas: "=$T$20"},
                3: {text: "", formulas: "=ADD(1, T20)"},
                4: {text: "", formulas: "=213"},
                5: {text: 36009, formulas: 36009},
                6: {text: "", formulas: "=T20+T$10 + $T$20"},
                7: {text: "", formulas: "=T20+2"},
                8: {text: "", formulas: "=asdasd+T20+ADD(ADD(1, T20), T20)"},
                9: {text: "", formulas: "=asd123+as21+12"},
                19: {text: "123", formulas: "123"},
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
            let cell4 = data.rows.getCell(4, 1);
            let cell5 = data.rows.getCell(5, 1);
            let cell20 = data.rows.getCell(20, 1);
            let cell21 = data.rows.getCell(21, 1);
            let cell26 = data.rows.getCell(26, 1);
            let cell36 = data.rows.getCell(36, 1);
            let cell50 = data.rows.getCell(50, 1);
            let cell63 = data.rows.getCell(63, 1);

            assert.equal(cell1.text, "0");
            assert.equal(cell2.text, "0");
            assert.equal(cell4.text, "0");
            assert.equal(cell5.text, "0");
            assert.equal(cell20.text, "0");
            assert.equal(cell21.text, "0");
            assert.equal(cell26.text, "0");
            assert.equal(cell36.text, "0");
            assert.equal(cell50.text, "0");
            assert.equal(cell63.text, "0");
            assert.equal(cell1.formulas, "=$T21");
            assert.equal(cell2.formulas, "=$T22");
            assert.equal(cell4.formulas, "=$T24");
            assert.equal(cell5.formulas, "=$T25");
            assert.equal(cell20.formulas, "=$T40");
            assert.equal(cell21.formulas, "=$T41");
            assert.equal(cell26.formulas, "=$T46");
            assert.equal(cell36.formulas, "=$T56");
            assert.equal(cell50.formulas, "=$T70");
            assert.equal(cell63.formulas, "=$T83");

            cell1 = data.rows.getCell(1, 2);
            cell2 = data.rows.getCell(2, 2);
            cell4 = data.rows.getCell(4, 2);
            cell5 = data.rows.getCell(5, 2);
            cell20 = data.rows.getCell(20, 2);
            cell21 = data.rows.getCell(21, 2);
            cell26 = data.rows.getCell(26, 2);
            cell36 = data.rows.getCell(36, 2);
            cell50 = data.rows.getCell(50, 2);
            cell63 = data.rows.getCell(63, 2);

            assert.equal(cell1.text, "0");
            assert.equal(cell2.text, "0");
            assert.equal(cell4.text, "0");
            assert.equal(cell5.text, "0");
            assert.equal(cell20.text, "0");
            assert.equal(cell21.text, "0");
            assert.equal(cell26.text, "0");
            assert.equal(cell36.text, "0");
            assert.equal(cell50.text, "0");
            assert.equal(cell63.text, "0");
            assert.equal(cell1.formulas, "=$T$20");
            assert.equal(cell2.formulas, "=$T$20");
            assert.equal(cell4.formulas, "=$T$20");
            assert.equal(cell5.formulas, "=$T$20");
            assert.equal(cell20.formulas, "=$T$20");
            assert.equal(cell21.formulas, "=$T$20");
            assert.equal(cell26.formulas, "=$T$20");
            assert.equal(cell36.formulas, "=$T$20");
            assert.equal(cell50.formulas, "=$T$20");
            assert.equal(cell63.formulas, "=$T$20");

            cell1 = data.rows.getCell(1, 3);
            cell2 = data.rows.getCell(2, 3);
            cell4 = data.rows.getCell(4, 3);
            cell5 = data.rows.getCell(5, 3);
            cell20 = data.rows.getCell(20, 3);
            cell21 = data.rows.getCell(21, 3);
            cell26 = data.rows.getCell(26, 3);
            cell36 = data.rows.getCell(36, 3);
            cell50 = data.rows.getCell(50, 3);
            cell63 = data.rows.getCell(63, 3);

            assert.equal(cell1.text, "1");
            assert.equal(cell2.text, "1");
            assert.equal(cell4.text, "1");
            assert.equal(cell5.text, "1");
            assert.equal(cell20.text, "1");
            assert.equal(cell21.text, "1");
            assert.equal(cell26.text, "1");
            assert.equal(cell36.text, "1");
            assert.equal(cell50.text, "1");
            assert.equal(cell63.text, "1");
            assert.equal(cell1.formulas, "=ADD(1, T21)");
            assert.equal(cell2.formulas, "=ADD(1, T22)");
            assert.equal(cell4.formulas, "=ADD(1, T24)");
            assert.equal(cell5.formulas, "=ADD(1, T25)");
            assert.equal(cell20.formulas, "=ADD(1, T40)");
            assert.equal(cell21.formulas, "=ADD(1, T41)");
            assert.equal(cell26.formulas, "=ADD(1, T46)");
            assert.equal(cell36.formulas, "=ADD(1, T56)");
            assert.equal(cell50.formulas, "=ADD(1, T70)");
            assert.equal(cell63.formulas, "=ADD(1, T83)");

            cell1 = data.rows.getCell(1, 4);
            cell2 = data.rows.getCell(2, 4);
            cell4 = data.rows.getCell(4, 4);
            cell5 = data.rows.getCell(5, 4);
            cell20 = data.rows.getCell(20, 4);
            cell21 = data.rows.getCell(21, 4);
            cell26 = data.rows.getCell(26, 4);
            cell36 = data.rows.getCell(36, 4);
            cell50 = data.rows.getCell(50, 4);
            cell63 = data.rows.getCell(63, 4);
            assert.equal(cell1.text, "213");
            assert.equal(cell2.text, "213");
            assert.equal(cell4.text, "213");
            assert.equal(cell5.text, "213");
            assert.equal(cell20.text, "213");
            assert.equal(cell21.text, "213");
            assert.equal(cell26.text, "213");
            assert.equal(cell36.text, "213");
            assert.equal(cell50.text, "213");
            assert.equal(cell63.text, "213");
            assert.equal(cell1.formulas, "=213");
            assert.equal(cell2.formulas, "=213");
            assert.equal(cell4.formulas, "=213");
            assert.equal(cell5.formulas, "=213");
            assert.equal(cell20.formulas, "=213");
            assert.equal(cell21.formulas, "=213");
            assert.equal(cell26.formulas, "=213");
            assert.equal(cell36.formulas, "=213");
            assert.equal(cell50.formulas, "=213");
            assert.equal(cell63.formulas, "=213");

            cell1 = data.rows.getCell(1, 5);
            cell2 = data.rows.getCell(2, 5);
            cell4 = data.rows.getCell(4, 5);
            cell5 = data.rows.getCell(5, 5);
            cell20 = data.rows.getCell(20, 5);
            cell21 = data.rows.getCell(21, 5);
            cell26 = data.rows.getCell(26, 5);
            cell36 = data.rows.getCell(36, 5);
            cell50 = data.rows.getCell(50, 5);
            cell63 = data.rows.getCell(63, 5);
            assert.equal(cell1.text, "36010");
            assert.equal(cell2.text, "36011");
            assert.equal(cell4.text, "36013");
            assert.equal(cell5.text, "36014");
            assert.equal(cell20.text, "36029");
            assert.equal(cell21.text, "36030");
            assert.equal(cell26.text, "36035");
            assert.equal(cell36.text, "36045");
            assert.equal(cell50.text, "36059");
            assert.equal(cell63.text, "36072");
            assert.equal(cell1.formulas, "36010");
            assert.equal(cell2.formulas, "36011");
            assert.equal(cell4.formulas, "36013");
            assert.equal(cell5.formulas, "36014");
            assert.equal(cell20.formulas, "36029");
            assert.equal(cell21.formulas, "36030");
            assert.equal(cell26.formulas, "36035");
            assert.equal(cell36.formulas, "36045");
            assert.equal(cell50.formulas, "36059");
            assert.equal(cell63.formulas, "36072");

            cell1 = data.rows.getCell(1, 6);
            cell2 = data.rows.getCell(2, 6);
            cell4 = data.rows.getCell(4, 6);
            cell5 = data.rows.getCell(5, 6);
            cell20 = data.rows.getCell(20, 6);
            cell21 = data.rows.getCell(21, 6);
            cell26 = data.rows.getCell(26, 6);
            cell36 = data.rows.getCell(36, 6);
            cell50 = data.rows.getCell(50, 6);
            cell63 = data.rows.getCell(63, 6);
            assert.equal(cell1.text, "0");
            assert.equal(cell2.text, "0");
            assert.equal(cell4.text, "0");
            assert.equal(cell5.text, "0");
            assert.equal(cell20.text, "0");
            assert.equal(cell21.text, "0");
            assert.equal(cell26.text, "0");
            assert.equal(cell36.text, "0");
            assert.equal(cell50.text, "0");
            assert.equal(cell63.text, "0");
            assert.equal(cell1.formulas, "=T21+T$10 + $T$20");
            assert.equal(cell2.formulas, "=T22+T$10 + $T$20");
            assert.equal(cell4.formulas, "=T24+T$10 + $T$20");
            assert.equal(cell5.formulas, "=T25+T$10 + $T$20");
            assert.equal(cell20.formulas, "=T40+T$10 + $T$20");
            assert.equal(cell21.formulas, "=T41+T$10 + $T$20");
            assert.equal(cell26.formulas, "=T46+T$10 + $T$20");
            assert.equal(cell36.formulas, "=T56+T$10 + $T$20");
            assert.equal(cell50.formulas, "=T70+T$10 + $T$20");
            assert.equal(cell63.formulas, "=T83+T$10 + $T$20");

            cell1 = data.rows.getCell(1, 7);
            cell2 = data.rows.getCell(2, 7);
            cell4 = data.rows.getCell(4, 7);
            cell5 = data.rows.getCell(5, 7);
            cell20 = data.rows.getCell(20, 7);
            cell21 = data.rows.getCell(21, 7);
            cell26 = data.rows.getCell(26, 7);
            cell36 = data.rows.getCell(36, 7);
            cell50 = data.rows.getCell(50, 7);
            cell63 = data.rows.getCell(63, 7);
            assert.equal(cell1.text, "2");
            assert.equal(cell2.text, "2");
            assert.equal(cell4.text, "2");
            assert.equal(cell5.text, "2");
            assert.equal(cell20.text, "2");
            assert.equal(cell21.text, "2");
            assert.equal(cell26.text, "2");
            assert.equal(cell36.text, "2");
            assert.equal(cell50.text, "2");
            assert.equal(cell63.text, "2");
            assert.equal(cell1.formulas, "=T21+2");
            assert.equal(cell2.formulas, "=T22+2");
            assert.equal(cell4.formulas, "=T24+2");
            assert.equal(cell5.formulas, "=T25+2");
            assert.equal(cell20.formulas, "=T40+2");
            assert.equal(cell21.formulas, "=T41+2");
            assert.equal(cell26.formulas, "=T46+2");
            assert.equal(cell36.formulas, "=T56+2");
            assert.equal(cell50.formulas, "=T70+2");
            assert.equal(cell63.formulas, "=T83+2");

            console.log(sheet);
            consoleSuccess("填充1 - 计算单元格 - 对比 正确");
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
            assert.equal(sri, 1);
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
        sheet.selector.range = new CellRange(0, 1, 0, 7);
        sheet.data.selector.range = new CellRange(0, 1, 0, 7);
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

        // assert.equal(sheet.data.multiPreAction.undoItems.length, 1);
        // console.log(sheet.multiPreAction);
        // todo: 数值，数字+英文， 数字+日期，2*2的区域填充奇数行，3个数字不是等差数列，
    });


});