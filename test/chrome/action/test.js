import DataProxy from "../../../src/core/data_proxy";
import Sheet from "../../../src/component/sheet";
import {h} from "../../../src/component/element";
import {cssPrefix} from "../../../src/config";
import {bugout} from "../../../src/log/log_proxy";
import {simulateInputEvent, simulateKeyboardEvent, simulateMouseEvent} from "../../util/event";
import Vaild from "../../util/valid";
import {consoleSuccess} from "../../util/utils";
import {isHave} from "../../../src/core/helper";
import {deepCopy} from "../../../src/core/operator";


let assert = require('assert');

/*
    对同一个单元格操作
    1. 按下单元格然后输入=A1, 回车。  单元格值为:  =A1
    2. 按下单元格然后输入=A2, 回车。  单元格值为:  =A2
    3. 按下ctrl+z, 然后单元格应该等于=A1
    4. 按下ctrl+y, 然后单元格应该等于=A2
 */
describe("action", function () {
    window.bugout = bugout;
    let data = new DataProxy("sheet1", {rowsInit: true}, {});
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
    data.sheet = sheet;

    it('test1', function () {
        // 第二组操作
        setTimeout(() => {
            let count2 = 0;
            // step 6-6 按下ctrl+z
            setTimeout(() => {
                sheet.table.valid = new Vaild(() => {
                    let cell = data.rows.getCell(11, 2);

                    assert.equal(cell.formulas, '=A1');
                    consoleSuccess("step 6-6 按下ctrl+z 验证恢复, 延时2秒 成功");
                    sheet.table.valid = null;
                });

                pressUndoByMouseDown();
                // step 6-7 按下ctrl+y
                setTimeout(() => {
                    sheet.table.valid = new Vaild(() => {
                        let cell = data.rows.getCell(11, 2);
                        assert.equal(cell.formulas, "=A2");
                        consoleSuccess("step 6-7 按下ctrl+y 成功");
                        sheet.table.valid = null;
                    });

                    pressRedoByMouseDown();
                }, 2000);
            }, 2000);


            sheet.table.valid = new Vaild(() => {
                if (count2 === 0) {
                    sheet.editor.valid = new Vaild(() => {
                        // step 6-3 在单元格中输入
                        inputInCell({data: "=A2", msg: "step 6-3 在单元格中输入 成功"});
                        sheet.editor.valid = null;

                        sheet.editor.valid2 = new Vaild(() => {
                            // step 6-4 按下回车是否存入
                            pressEnterByMouseDown({msg: "step 6-4 按下回车是否存入 成功"});
                            sheet.editor.valid2 = null;
                        });
                    });

                    // step 6-2  双击按下单元格
                    pressCellByMouseDown({msg: "step 6-2  双击按下单元格 成功"});
                } else if (count2 === 1) {
                    // step 5 验证撤销是否存入
                    vaildUndo("step 6-5 验证撤销是否存入数组 成功", 2);
                    sheet.table.valid = null;
                }
                count2 += 1;
            });

            // step 6-1 再次按下
            getRICIByMouseDown({msg: "step 6-1 再次按下按钮 成功"});
        }, 3000);


        let count = 0;
        sheet.table.valid = new Vaild(() => {
            if (count === 0) {
                // step 2  双击按下单元格
                pressCellByMouseDown({msg: "step 2  双击按下单元格 成功"});

                sheet.editor.valid = new Vaild(() => {
                    // step 3 在单元格中输入
                    inputInCell({data: "=A1", msg: "step 3 在单元格中输入 成功"});
                    sheet.editor.valid = null;

                    sheet.editor.valid2 = new Vaild(() => {
                        // step 4 按下回车是否存入
                        pressEnterByMouseDown({msg: "step 4 按下回车是否存入 成功"});
                        sheet.editor.valid2 = null;
                    });
                });
            } else if (count === 1) {
                // step 5 验证撤销是否存入
                vaildUndo("step 5 验证撤销是否存入数组 成功");
                sheet.table.valid = null;
            }
            count += 1;
        });

        // step 1  先获取ri,ci 的位置
        getRICIByMouseDown({msg: 'step 1 按下鼠标 成功'});
    });


    function pressUndoByMouseDown() {
        // consoleSuccess("按下ctrl + z");
        let undoEvt = simulateKeyboardEvent('keydown', {
            keyCode: 90,
            metaKey: true,
        });
        window.dispatchEvent(undoEvt);
    }

    function pressRedoByMouseDown() {
        // consoleSuccess("按下ctrl + y");
        let undoEvt = simulateKeyboardEvent('keydown', {
            keyCode: 89,
            metaKey: true,
        });
        window.dispatchEvent(undoEvt);
    }

    function vaildUndo(msg, num = 1) {
        assert.equal(sheet.data.multiPreAction.undoItems.length, num);

        consoleSuccess(msg);
    }

    function pressEnterByMouseDown({msg}) {
        consoleSuccess(msg);
        let e = simulateKeyboardEvent('keydown', {
            keyCode: 13
        });
        window.dispatchEvent(e);
    }

    function inputInCell({data, msg}) {
        let {editor} = sheet;
        let {textEl} = editor;
        consoleSuccess(msg);
        let e = simulateInputEvent('input', {
            data: data,
            inputType: 'insertText',
        });
        textEl.el.dispatchEvent(e);
    }

    function pressCellByMouseDown({msg}) {
        let {overlayerEl} = sheet;
        consoleSuccess(msg);
        let evt = simulateMouseEvent('mousedown', {
            detail: 2,
            buttons: 1,
        });
        overlayerEl.el.dispatchEvent(evt);
    }

    function getRICIByMouseDown({msg}) {
        let {overlayerEl} = sheet;
        consoleSuccess(msg);
        let evt = simulateMouseEvent('mousedown', {
            detail: 1,
            buttons: 1,
            clientX: 300,
            clientY: 300,
        });
        overlayerEl.el.dispatchEvent(evt);
    }
});
