import {h} from "./element";
import {cssPrefix} from "../config";
import {cuttingByPos, cuttingByPosEnd, isAbsoluteValue} from "../core/operator";
import {expr2xy} from "../core/alphabet";
import {lockCells} from "./formula_editor";
import {CellRange} from "../core/cell_range";
import {mouseMoveUp} from "./event";

function find(str, cha) {

    return str.lastIndexOf(cha);
}

export default class SelectorMove {
    constructor(boxinner, data, sheet, selector) {
        this.l = h('div', `${cssPrefix}-selector-box-l-move-l`);
        this.r = h('div', `${cssPrefix}-selector-box-l-move-r`);
        this.t = h('div', `${cssPrefix}-selector-box-l-move-t`);
        this.b = h('div', `${cssPrefix}-selector-box-l-move-b`);
        this.data = data;
        this.sheet = sheet;
        this._selector = selector;

        this.event(this.l, 1);
        this.event(this.r, 2);
        this.event(this.t, 3);
        this.event(this.b, 4);
        this.boxinner = boxinner;
        this.boxinner.children(
            this.l,
            this.r,
            this.t,
            this.b,
        );
    }

    event(target, dict) {
        let timer = null;
        target.on('mousedown.stop', evt => {
            let {data, sheet, _selector} = this;
            let p = -1;
            let {selector} = data;
            let _move_selectors = null;
            let {sri, sci, eri, eci, w, h} = selector.range;
            let cellRange = new CellRange(sri, sci, eri, eci, w, h);
            let _cellRange = null;
            let {selectors} = sheet;
            let msri = -1, msci = -1, meri = -1, meci = -1;

            mouseMoveUp(window, (e) => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    sheet.container.css('pointer-events', 'none');
                    for (let i = 0; i < selectors.length; i++) {
                        let selector = selectors[i];
                        selector.selector.setBoxinner("none");
                    }

                    let {ri, ci} = data.getCellRectByXY(e.layerX, e.layerY);
                    if (ri !== -1 && ci !== -1) {
                        let {pos} = this.sheet.editor;
                        let inputText = this.sheet.editor.editorText.getText();
                        let _erpx = cuttingByPos(inputText, pos - 1, true);
                        if (inputText.length > pos - 1) {
                            _erpx += cuttingByPosEnd(inputText, pos - 1);
                        }
                        for (let i = 0; i < selectors.length; i++) {
                            let selector = selectors[i];
                            let {className, erpx} = selector;

                            if (erpx === _erpx && className === _selector.className + " clear_selector") {
                                _move_selectors = _move_selectors ? _move_selectors : selector;
                                if (erpx.search(/^[A-Za-z]+\d+:[A-Za-z]+\d+$/) !== -1) {
                                    let arr = erpx.split(":");
                                    let e1 = expr2xy(arr[0]);
                                    let e2 = expr2xy(arr[1]);
                                    cellRange = new CellRange(e1[1], e1[0], e2[1], e2[0], w, h);
                                    cellRange.move(ri, ci);
                                    const rect = data.getMoveRect(cellRange);
                                    _move_selectors.selector.range = cellRange;
                                    _move_selectors.selector.setMove(rect);
                                } else {
                                    _move_selectors.selector.set(ri, ci, true);
                                }
                                break;
                            } else if (erpx !== _erpx && className === _selector.className + " clear_selector") {
                                p = p !== -1 ? p : find(inputText, selector.erpx);
                                this.sheet.editor.setCursorPos(p + selector.erpx.length);
                                _move_selectors = _move_selectors ? _move_selectors : selector;

                                if (selector.erpx.search(/^[A-Za-z]+\d+:[A-Za-z]+\d+$/) !== -1) {
                                    let arr = erpx.split(":");
                                    let e1 = expr2xy(arr[0]);
                                    let e2 = expr2xy(arr[1]);
                                    cellRange = new CellRange(e1[1], e1[0], e2[1], e2[0], w, h);
                                    if (_cellRange === null) {
                                        _cellRange = cellRange;
                                    }
                                    if (dict === 4) {
                                        let args = data.getCellRectByXY(e.layerX, e.layerY);
                                        cellRange.move2(e1[1], e1[0], args.ri, args.ci);
                                        const rect = data.getMoveRect(cellRange);
                                        _move_selectors.selector.range = cellRange;
                                        _move_selectors.selector.setMove(rect);
                                    } else if (dict === 1) {
                                        let args = data.getCellRectByXY(e.layerX, e.layerY);
                                        cellRange.move2(e1[1], args.ci, args.ri, e2[0]);
                                        // console.log(cellRange, _cellRange);
                                        const rect = data.getMoveRect(cellRange);
                                        _move_selectors.selector.range = cellRange;
                                        _move_selectors.selector.setMove(rect);
                                    } else if (dict === 3) {
                                        let args = data.getCellRectByXY(e.layerX, e.layerY);
                                        cellRange.move2(args.ri, args.ci, e2[1], e2[0]);
                                        const rect = data.getMoveRect(cellRange);
                                        _move_selectors.selector.range = cellRange;
                                        _move_selectors.selector.setMove(rect);
                                    } else if (dict === 2) {
                                        let args = data.getCellRectByXY(e.layerX, e.layerY);
                                        cellRange.move2(args.ri, e1[0], e2[1], args.ci);
                                        const rect = data.getMoveRect(cellRange);
                                        _move_selectors.selector.range = cellRange;
                                        _move_selectors.selector.setMove(rect);
                                    }
                                } else {
                                    let e1 = expr2xy(selector.erpx);
                                    let e2 = expr2xy(selector.erpx);
                                    let args = data.getCellRectByXY(e.layerX, e.layerY);
                                    if (dict === 4) {
                                        cellRange.move2(e1[1], e1[0], args.ri, args.ci);
                                        const rect = data.getMoveRect(cellRange);
                                        _move_selectors.selector.range = cellRange;
                                        _move_selectors.selector.setMove(rect);
                                    } else if (dict === 1) {
                                        cellRange.move2(e1[1], args.ci, args.ri, e2[0]);
                                        const rect = data.getMoveRect(cellRange);
                                        _move_selectors.selector.range = cellRange;
                                        _move_selectors.selector.setMove(rect);
                                    } else if (dict === 3) {
                                        cellRange.move2(args.ri, args.ci, e2[1], e2[0]);
                                        const rect = data.getMoveRect(cellRange);
                                        _move_selectors.selector.range = cellRange;
                                        _move_selectors.selector.setMove(rect);
                                    } else if (dict === 2) {
                                        cellRange.move2(args.ri, e1[0], e2[1], args.ci);
                                        const rect = data.getMoveRect(cellRange);
                                        _move_selectors.selector.range = cellRange;
                                        _move_selectors.selector.setMove(rect);
                                    }
                                }
                                break;
                            }
                        }

                        if (_move_selectors
                            && (msri !== cellRange.sri
                                || msci !== cellRange.sci
                                || meri !== cellRange.eri
                                || meci !== cellRange.eci)) {
                            _move_selectors.selector.setCss(_move_selectors.color, false);
                            lockCells.call(this.sheet, evt, _move_selectors, isAbsoluteValue(_move_selectors.erpx), p);
                        }
                        msri = cellRange.sri;
                        msci = cellRange.sci;
                        meri = cellRange.eri;
                        meci = cellRange.eci;
                    }
                }, 6);
            }, () => {
                clearTimeout(timer);
                let {selectors} = this.sheet;
                sheet.container.css('pointer-events', 'auto');
                for (let i = 0; i < selectors.length; i++) {
                    let selector = selectors[i];
                    selector.selector.setBoxinner("all");
                }
                p = -1;
                if (_move_selectors && _move_selectors.selector)
                    _move_selectors.selector.setCss(_move_selectors.color, true);
                _move_selectors = null;
            })
        });
    }
}