/* global document */

import {calc}  from '../../src/calc';
// import { MockCalc } from '../calc/calc_cmd/mock_calc';

import Selector from './selector';
import Scroll from './scroll';
import Clipboard from './clipboard';
import AutoFilter from './auto_filter';
import {Merges} from './merge';
import {isNumber} from '../helper/dataproxy_helper';
import {isHave} from '../helper/check_value';
import * as helper from '../helper/dataproxy_helper';
import {isFormula, Rows} from './row';
import {Cols} from './col';
import {Validations} from './validation';
import {CellRange} from './cell_range';
import {expr2xy, xy2expr} from '../utils/alphabet';
import {t} from '../locale/locale';
import Moved from '../event/move';
import {h} from "../component/element";
import {mountImg} from "../event/paste";
import {parseCell2} from "../component/table";
import {isLegal} from "./operator";
import Recast from "./recast";
import {changeFormat, dateDiff, formatDate} from '../utils/date';
import {formatNumberRender} from "./format";
import MultiPreAction from "../core/multi_pre_action";
import CellProxy from "./cell_proxy";
import CellProp from "../model/cell_prop";
import PaintFormat from "../model/paint_format";
import Chart from "../chart/chart_cmd/chart";
// private methods
/*
 * {
 *  name: ''
 *  freeze: [0, 0],
 *  formats: [],
 *  styles: [
 *    {
 *      bgcolor: '',
 *      align: '',
 *      valign: '',
 *      textwrap: false,
 *      strike: false,
 *      underline: false,
 *      color: '',
 *      format: 1,
 *      border: {
 *        left: [style, color],
 *        right: [style, color],
 *        top: [style, color],
 *        bottom: [style, color],
 *      },
 *      font: {
 *        family: 'Helvetica',
 *        size: 10,
 *        bold: false,
 *        italic: false,
 *      }
 *    }
 *  ],
 *  merges: [
 *    'A1:F11',
 *    ...
 *  ],
 *  rows: {
 *    1: {
 *      height: 50,
 *      style: 1,
 *      cells: {
 *        1: {
 *          style: 2,
 *          type: 'string',
 *          text: '',
 *          value: '', // cal result
 *        }
 *      }
 *    },
 *    ...
 *  },
 *  cols: {
 *    2: { width: 100, style: 1 }
 *  }
 * }
 */
const defaultSettings = {
    view: {
        height: () => document.documentElement.clientHeight,
        width: () => document.documentElement.clientWidth,
    },
    formula: {},
    showGrid: true,
    showToolbar: true,
    showContextmenu: true,
    showEditor: true,
    autoLoad: true,
    ignore: [],
    cellWidth: 0,
    ignoreRi: 0,
    minus: false,
    footerContainerHeight: 0,
    row: {
        len: 100,
        height: 25,
    },
    col: {
        len: 26,
        width: 100,
        indexWidth: 60,
        minWidth: 10,
    },
    rowsInit: false,
    style: {
        bgcolor: '#ffffff',
        align: 'left',
        valign: 'middle',
        textwrap: false,
        strike: false,
        flexible: false,
        underline: false,
        autoAdapt: false,
        color: '#0a0a0a',
        font: {
            name: 'Arial',
            size: 10,
            bold: false,
            italic: false,
        },
    },
};

const toolbarHeight = 41;


// src: cellRange
// dst: cellRange
function canPaste(src, dst, error = () => {
}) {
    if (!dst) {
        return false;
    }
    const {merges} = this;
    const cellRange = dst.clone();
    const [srn, scn] = src.size();
    const [drn, dcn] = dst.size();
    if (srn > drn) {
        cellRange.eri = dst.sri + srn - 1;
    }
    if (scn > dcn) {
        cellRange.eci = dst.sci + scn - 1;
    }
    if (merges.intersects(cellRange)) {
        error(t('error.pasteForMergedCell'));
        return false;
    }
    return true;
}

function copyPaste(srcCellRange, dstCellRange, what, autofill = false) {
    const {rows, merges} = this;
    // delete dest merge
    if (what === 'all' || what === 'format') {
        rows.deleteCells(dstCellRange, what);
        merges.deleteWithin(dstCellRange);
    }
    rows.copyPaste(srcCellRange, dstCellRange, what, autofill, (ri, ci, cell) => {
        if (cell && cell.merge) {
            // console.log('cell:', ri, ci, cell);
            const [rn, cn] = cell.merge;
            if (rn <= 0 && cn <= 0) return;
            merges.add(new CellRange(ri, ci, ri + rn, ci + cn));
        }
    });
}

function cutPaste(srcCellRange, dstCellRange, cleard) {
    const {clipboard, rows, merges} = this;
    rows.cutPaste(srcCellRange, dstCellRange);
    merges.move(srcCellRange,
        dstCellRange.sri - srcCellRange.sri,
        dstCellRange.sci - srcCellRange.sci);
    if (cleard)
        clipboard.clear();
}

// bss: { top, bottom, left, right }
function setStyleBorder(ri, ci, bss) {
    const {styles, rows} = this;
    const cell = rows.getCellOrNew(ri, ci);
    let cstyle = {};
    if (isHave(cell.style)) {
        cstyle = helper.cloneDeep(styles[cell.style]);
    }

    Object.assign(cstyle, {border: bss});
    cell.style = this.addStyle(cstyle);
}

function selectorCellText(ri, ci, text, event_type) {
    if (ri === -1 || ci === -1) {
        return {
            "state": true,
            "msg": "单元格坐标有误"
        };
    }
    if (event_type !== 'style' && (!text || text[0] !== '=')) {
        return {
            "state": false,
            "msg": "正确"
        };
    }

    // state
    let args = errorPop.call(this, text);
    if (event_type !== 'style' && args.state === true) {
        return {
            "msg": args.msg,
            "state": true,
        };
    }
    return {
        "msg": args.msg,
        "state": false,
    };
}

function errorPop(text) {
    let enter = false;
    let msg = "";
    try {
        let recast = new Recast(text);
        recast.parse();
    } catch (e) {
        msg = '您输入的公式存在问题，请更正, 错误原因: ' + e.description;
        enter = true;
    }

    if (enter === true) {
        if (isLegal(text) === false) {
            msg = '缺少左括号或右括号';
            enter = true;
        }
    }

    if (enter) {
        return {
            "state": true,
            "msg": msg
        };
    } else {
        return {
            "state": false,
            "msg": msg
        };
    }
}

function processPasteDirectionsArr(pasteDirectionsArr, type = 'to', sheet) {
    if (type === 'to') {
        let arr = [];
        for (let i = 0; i < pasteDirectionsArr.length; i++) {
            let item = pasteDirectionsArr[i];
            console.log(item);
            let newItem = {
                src: item.img2.src,
                ri: item.ri,
                ci: item.ci,
                top: item.top,
                left: item.left,
                range: item.range,
                offsetLeft: item.offsetLeft,
                offsetTop: item.offsetTop,
                nextLeft: item.nextLeft,
                nextTop: item.nextTop,
                img: item.img,
                arr: item.arr,
                img2: item.img2
            };

            arr.push(newItem);
        }

        return arr;
    } else if (type === 'from') {
        if (typeof sheet === 'string') {
            return;
        }
        for (let i = 0; i < pasteDirectionsArr.length; i++) {
            let item = pasteDirectionsArr[i];
            let img = h('img', '');
            img.el.src = item.src;
            mountImg.call(sheet, img.el, true, item.ri, item.ci, item.range);
        }
    }
}

function clickCopyPasteHelp(ri, lci) {
    let {rows} = this;
    let lri = ri + 1;
    let enter = true;
    while (enter) {
        let lcell = rows.getCellOrNew(lri, lci);
        if (!lcell || !lcell.text) {
            enter = false;
        } else {
            lri = lri + 1;
        }
    }

    return lri;
}

function setStyleBorders({mode, style, color}) {
    const {styles, selector, rows} = this;
    const {
        sri, sci, eri, eci,
    } = selector.range;
    const multiple = !this.isSignleSelected();
    if (!multiple) {
        if (mode === 'inside' || mode === 'horizontal' || mode === 'vertical') {
            return;
        }
    }

    for (let ri = sri; ri <= eri; ri += 1) {
        for (let ci = sci; ci <= eci; ci += 1) {
            setStyleBorder.call(this, ri, ci, {});
        }
    }

    if (mode === 'outside' && !multiple) {
        setStyleBorder.call(this, sri, sci, {
            top: [style, color], bottom: [style, color], left: [style, color], right: [style, color],
        });
    } else if (mode === 'none') {
        selector.range.each((ri, ci) => {
            const cell = rows.getCell(ri, ci);
            if (cell && cell.style !== undefined) {
                const ns = helper.cloneDeep(styles[cell.style]);
                delete ns.border;
                // ['bottom', 'top', 'left', 'right'].forEach((prop) => {
                //   if (ns[prop]) delete ns[prop];
                // });
                cell.style = this.addStyle(ns);
            }
        });
    } else if (mode === 'all' || mode === 'inside' || mode === 'outside'
        || mode === 'horizontal' || mode === 'vertical') {
        const merges = [];
        for (let ri = sri; ri <= eri; ri += 1) {
            for (let ci = sci; ci <= eci; ci += 1) {
                // jump merges -- deal1Char
                const mergeIndexes = [];
                for (let ii = 0; ii < merges.length; ii += 1) {
                    const [mri, mci, rn, cn] = merges[ii];
                    if (ri === mri + rn + 1) mergeIndexes.push(ii);
                    if (mri <= ri && ri <= mri + rn) {
                        if (ci === mci) {
                            ci += cn + 1;
                            break;
                        }
                    }
                }
                mergeIndexes.forEach(it => merges.splice(it, 1));
                if (ci > eci) break;
                // jump merges -- end
                const cell = rows.getCell(ri, ci);
                let [rn, cn] = [0, 0];
                if (cell && cell.merge) {
                    [rn, cn] = cell.merge;
                    merges.push([ri, ci, rn, cn]);
                }
                const mrl = rn > 0 && ri + rn === eri;
                const mcl = cn > 0 && ci + cn === eci;
                let bss = {};
                if (mode === 'all') {
                    bss = {
                        bottom: [style, color],
                        top: [style, color],
                        left: [style, color],
                        right: [style, color],
                    };
                } else if (mode === 'inside') {
                    if (!mcl && ci < eci) bss.right = [style, color];
                    if (!mrl && ri < eri) bss.bottom = [style, color];
                } else if (mode === 'horizontal') {
                    if (!mrl && ri < eri) bss.bottom = [style, color];
                } else if (mode === 'vertical') {
                    if (!mcl && ci <= eci) bss.right = [style, color];
                } else if (mode === 'outside' && multiple) {
                    if (sri === ri) bss.top = [style, color];
                    if (mrl || eri === ri) bss.bottom = [style, color];
                    if (sci === ci) bss.left = [style, color];
                    if (mcl || eci === ci) bss.right = [style, color];
                }
                if (Object.keys(bss).length > 0) {
                    setStyleBorder.call(this, ri, ci, bss);
                }
                ci += cn;
            }
        }
    } else if (mode === 'top' || mode === 'bottom') {
        for (let ci = sci; ci <= eci; ci += 1) {
            if (mode === 'top') {
                setStyleBorder.call(this, sri, ci, {top: [style, color]});
                ci += rows.getCellMerge(sri, ci)[1];
            }
            if (mode === 'bottom') {
                setStyleBorder.call(this, eri, ci, {bottom: [style, color]});
                ci += rows.getCellMerge(eri, ci)[1];
            }
        }
    } else if (mode === 'left' || mode === 'right') {
        for (let ri = sri; ri <= eri; ri += 1) {
            if (mode === 'left') {
                setStyleBorder.call(this, ri, sci, {left: [style, color]});
                ri += rows.getCellMerge(ri, sci)[0];
            }
            if (mode === 'right') {
                setStyleBorder.call(this, ri, eci, {right: [style, color]});
                ri += rows.getCellMerge(ri, eci)[0];
            }
        }
    }
}

// function getCellRowByAbsX(scrollOffsetx) {
//     let x = scrollOffsetx;
//     const {cols} = this;
//     const fsw = this.freezeTotalWidth();
//     let inits = cols.indexWidth;
//     if (fsw + cols.indexWidth <= x) inits -= scrollOffsetx;
//     const [ci, left, width] = calc_utils.rangeReduceIf(
//         0,
//         cols.len,
//         inits,
//         cols.indexWidth,
//         x,
//         i => cols.getWidth(i),
//     );
//     if (left <= 0) {
//         return {ci: 0, left: 0, width: cols.indexWidth};
//     }
//     return {ci: ci - 1, left, width};
// }

// function getCellRowByAbsY(scrollOffsety) {
//     let y = scrollOffsety;
//     let {rows} = this;
//     let ri = 0;
//     let top = rows.height;
//     const frset = this.exceptRowSet;
//     let {height} = rows;
//
//     for (; ri < rows.len; ri += 1) {
//         if (top > y) break;
//         if (!frset.has(ri)) {
//             height = rows.getHeight(ri);
//             top += height;
//         }
//     }
//
//     if (ri <= 0) {
//         ri = 0;
//     }
//     if (height <= 0) {
//         height = 0;
//     }
//
//     return {ri: ri, top, height};
// }

function getCellRowByY(y, scrollOffsety) {
    const {rows} = this;
    const fsh = this.freezeTotalHeight();
    // console.log('y:', y, ', fsh:', fsh);
    let inits = rows.height;
    if (fsh + rows.height < y) inits -= scrollOffsety;

    // handle ri in autofilter
    const frset = this.exceptRowSet;

    let ri = 0;
    let top = inits;
    let {height} = rows;
    for (; ri < rows.len; ri += 1) {
        if (top > y) break;
        if (!frset.has(ri)) {
            height = rows.getHeight(ri);
            top += height;
        }
    }
    top -= height;
    // console.log('ri:', ri, ', top:', top, ', height:', height);

    if (top <= 0) {
        return {ri: -1, top: 0, height};
    }

    return {ri: ri - 1, top, height};
}

function getCellColByX(x, scrollOffsetx) {
    const {cols} = this;
    const fsw = this.freezeTotalWidth();
    let inits = cols.indexWidth;
    if (fsw + cols.indexWidth <= x) inits -= scrollOffsetx;
    const [ci, left, width] = helper.rangeReduceIf(
        0,
        cols.len,
        inits,
        cols.indexWidth,
        x,
        i => cols.getWidth(i),
    );
    if (left <= 0) {
        return {ci: -1, left: 0, width: cols.indexWidth};
    }
    return {ci: ci - 1, left, width};
}

function makeFormatCell({text, formula}, {symbol, position}, cb) {
    if (!isHave(text) || !isNumber(text)) {
        return null;
    }

    let cText = cb(formatNumberRender(text, -1));
    formula = isFormula(formula) ? formula : cText;
    if (!isNaN(cText)) {

        return {
            "text": position === 'begin' ? symbol + cText : cText + symbol,
            "value": text,
            "formulas": formula,
        };
    } else {
        return null;
    }
}

// what = 'input' || 'change'
function tryParseToNum(cell, ri, ci) {
    return getType.call(this, ri, ci, cell);
}

function getType(ri, ci, cell) {
    let data = this;
    let {rows} = this;
    let cellStyle = data.getCellStyle(ri, ci);
    let {isValid, diff} = dateDiff(cell.text);

    let format = rows.getCellStyleConvert(cellStyle, isValid);
    if (format === 'number') {
        let text = cell.text, formula = cell.formulas;
        let _cell = {};
        if (isValid) {
            _cell = {
                "text": diff.toFixed(2),
                "formulas": formula,
            };
        } else {
            text = formatNumberRender(text, 2);
            _cell = {
                "text": text,
                "value": cell.text,
                "formulas": formula,
            };
        }

        if (isHave(_cell.text) && isNumber(_cell.text)) {
            return {
                "state": true,
                "style": format,
                "text": _cell.text,
                "cell": _cell,
            }
        } else {
            return {
                "state": false,
                "style": format,
                "text": _cell.text,
                "cell": _cell,
            }
        }
    } else if (format === 'date' || format === 'datetime') {
        let text = cell.text;

        if (!isValid) {
            let args = formatDate(text);
            let {state, date} = args;
            // minute = args.minute;
            isValid = state;
            diff = cell.text;
            text = date;
        }

        if (isValid) {
            if (format === 'datetime') {
                text = changeFormat(formatDate(dateDiff(text).diff).date);
            }

        }

        return {
            "state": isValid,
            "style": format,
            "text": !isHave(cellStyle) ? diff : text,
        };
    } else if (format === 'normal') {
        if (isValid) {
            let text = diff, formula = cell.formulas;
            let _cell = {
                "formulas": rows.toString(formula),
                "text": rows.toString(text),
            };

            return {
                "state": true,
                "text": _cell.text,
                "style": format,
                "cell": _cell,
            }
        } else {
            let text = cell.text, formula = cell.formulas;
            let _cell = {
                "formulas": formula,
                "text": text,
            };

            return {
                "state": true,
                "style": format,
                "text": _cell.text,
                "cell": _cell,
            }
        }
    } else if (format === 'rmb') {
        let text = "", formula = "";
        if (isValid) {
            text = diff;
            formula = isFormula(cell.formulas) ? cell.formulas : diff;
        } else {
            text = formatNumberRender(cell.text, 0);
            formula = cell.formulas;
        }

        let _cell = makeFormatCell({text, formula}, {symbol: "￥", position: "begin"}, (s) => {
            return s;
        });
        if (_cell) {
            return {
                "state": true,
                "style": format,
                "text": _cell.text,
                "cell": _cell,
            };
        }
    } else if (format === 'percent') {
        let text = "", formula = "";

        if (isValid) {
            text = diff;
            formula = isFormula(cell.formulas) ? cell.formulas : diff;
        } else {
            text = rows.useOne(cell.value, cell.text);
            formula = cell.formulas;
        }
        let _cell = makeFormatCell({text, formula}, {symbol: "%", position: "end"}, (s) => {
            return Number(s * 100).toFixed(2);
        });
        if (_cell) {
            return {
                "state": true,
                "style": format,
                "text": _cell.text,
                "cell": _cell,
            };
        }
    }

    return {
        "state": false,
        "style": format,
        "text": cell.text,
        "cell": {},
    };
}


export default class DataProxy {
    constructor(name, settings, methods) {
        this.settings = helper.merge(defaultSettings, settings || {});
        // save data begin
        this.name = name || 'belongSheet';
        this.methods = methods;
        this.freeze = [0, 0];
        this.styles = []; // Array<Style>
        this.merges = new Merges(); // [CellRange, ...]
        this.rows = new Rows(this.settings.row, this);
        this.cols = new Cols(this.settings.col);
        this.validations = new Validations();
        this.hyperlinks = {};
        this.comments = {};
        this.showEquation = false;
        // this.calc = new Calc();
        this.calc = new calc.Calc()
        this.pasteDirectionsArr = [];
        this.changeDataForCalc = null;
        this.chart = new Chart();

        // save data end

        // don't save object
        this.multiPreAction = new MultiPreAction(this);
        this.selector = new Selector();
        this.scroll = new Scroll();
        // this.history = created History(this);
        this.clipboard = new Clipboard();
        this.moved = new Moved();
        this.autoFilter = new AutoFilter();
        this.change = () => {
        };
        this.exceptRowSet = new Set();
        this.sortedRowMap = new Map();
        this.unsortedRowMap = new Map();
    }

    addValidation(mode, ref, validator) {
        // console.log('mode:', mode, ', ref:', ref, ', validator:', validator);
        this.changeData(() => {
            this.validations.add(mode, ref, validator);
        });
    }

    removeValidation() {
        const {range} = this.selector;
        this.changeData(() => {
            this.validations.remove(range);
        });
    }

    tryParseToNum(cell, ri, ci) {
        return tryParseToNum.call(this, cell, ri, ci);
    }

    clickCopyPaste() {
        let ri = this.selector.range.eri;
        let ci = this.selector.range.eci;
        let {rows} = this;
        const cell = rows.getCellOrNew(ri, ci);
        const cell2 = rows.getCellOrNew(ri + 1, ci);
        if (!cell || !cell.text || (cell2 && cell2.text)) {
            return {
                enter: false
            };
        }

        let left = clickCopyPasteHelp.call(this, ri, ci - 1);
        let right = clickCopyPasteHelp.call(this, ri, ci + 1);
        let eri = left < right ? right : left;

        let enter = false;
        for (let i = 1; i < eri && enter === false; i++) {
            let cell3 = rows.getCellOrNew(ri + i, ci);

            if (cell3 && cell3.text) {
                eri = ri + i;
                enter = true;
            }
        }


        let dstCellRange = new CellRange(ri + 1, ci, eri - 1, ci);
        let srcCellRange = new CellRange(ri, ci, ri, ci);

        return {
            enter: true,
            dstCellRange: dstCellRange,
            srcCellRange: srcCellRange
        };
    }


    // getSelectedValidator() {
    //     const {ri, ci} = this.selector;
    //     const v = this.validations.get(ri, ci);
    //     return v ? v.validator : null;
    // }

    getSelectedValidation() {
        const {ri, ci, range} = this.selector;
        const v = this.validations.get(ri, ci);
        const ret = {ref: range.toString()};
        if (v !== null) {
            ret.mode = v.mode;
            ret.validator = v.validator;
        }
        return ret;
    }

    canUndo() {
        return this.multiPreAction.getItems(1).length > 0;
        // return this.history.canUndo();
    }

    canRedo() {
        return this.multiPreAction.getItems(2).length > 0;
    }

    undo() {
        this.multiPreAction.undo();
        this.changeDataForCalc = this.getChangeDataToCalc();
        // this.history.undo(this.getData(), (d) => {
        //     this.setData(d);
        // }, belongSheet);
    }

    historyList(item) {
        return this.multiPreAction.getItems(item);
    }

    redo() {
        this.multiPreAction.redo();
        this.changeDataForCalc = this.getChangeDataToCalc();
        // this.history.redo(this.getData(), (d) => {
        //     this.setData(d);
        // });
    }

    copy() {
        document.execCommand('copy', true);
        this.clipboard.copy(this.selector.range);
    }

    makeCellPropArr(range, dsri, dsci) {
        let {rows} = this;
        let darr = [];
        let cells = rows.eachRange(range);
        for (let i = 0; i < cells.length; i++) {
            let {ri, ci, cell} = cells[i];

            if (isHave(cell) && isHave(cell.style) === false) {
                let cstyle = this.defaultStyle();
                cell.style = this.addStyle(cstyle);
            }

            let cellProp = new CellProp(ri + dsri, ci + dsci, cell, xy2expr(ri + dsri, ci + dsci));
            darr.push(cellProp);
        }

        return darr;
    }

    setCellByCellProp(pArr, cb) {
        let {rows} = this;
        for (let i = 0; i < pArr.length; i++) {
            let {ri, ci, cell} = pArr[i];
            if (isHave(cell) && isHave(cell.style)) {
                rows.setCell(ri, ci, cell, 'style');
            }
            cb(ri, ci);
        }
    }

    paintFormatChange(cb) {
        this.changeData(() => {
            let {clipboard,   selector} = this;
            let {range} = clipboard;
            let sri = selector.ri;
            let sci = selector.ci;

            let dsri = sri - range.sri;
            let dsci = sci - range.sci;
            let darr = this.makeCellPropArr(range, dsri, dsci);

            if (selector.range.eri - selector.range.sri === 0 && selector.range.eci - selector.range.sci === 0) {
                this.setCellByCellProp(darr, cb);
            } else {
                let paintFormat = new PaintFormat(range, selector.range);
                let paintType = paintFormat.getPaintType();
                let pArr = paintFormat.makePaintArr(paintType, darr);

                this.setCellByCellProp(pArr, cb);
            }
        }, {type: 12, cellRange: this.selector.range});
    }

    move() {
        this.moved.move();
    }

    cut() {
        this.clipboard.cut(this.selector.range);
    }

    paste(cellRange) {
        this.changeData(() => {

        }, {type: 6, cellRange: cellRange});
    }

    // what: all | text | format
    // paste(what = 'all', error = () => {
    // }) {
    //
    //     // console.log('sIndexes:', sIndexes);
    //     // const {clipboard, selector} = this;
    //     // if (clipboard.isClear()) return false;
    //     // if (!canPaste.call(this, clipboard.range, selector.range, error)) return false;
    //     //
    //     // this.changeData(() => {
    //     //     if (clipboard.isCopy()) {
    //     //         copyPaste.call(this, clipboard.range, selector.range, what);
    //     //     } else if (clipboard.isCut()) {
    //     //         cutPaste.call(this, clipboard.range, selector.range);
    //     //     }
    //     // });
    //     return true;
    // }

    autofill(cellRange, what, error = () => {
    }) {
        const srcRange = this.selector.range;
        if (!canPaste.call(this, srcRange, cellRange, error)) return false;
        this.changeData(() => {
            copyPaste.call(this, srcRange, cellRange, what, true);
        }, {type: 5, cellRange: cellRange});

        return true;
    }


    clickAutofill(srcRange, cellRange, what, error = () => {
    }) {
        if (!canPaste.call(this, srcRange, cellRange, error)) return false;
        this.changeData(() => {
            copyPaste.call(this, srcRange, cellRange, what, true);
        });
        return true;
    }

    clearClipboard() {
        this.clipboard.clear();
    }

    calSelectedRangeByEnd(ri, ci) {
        const {
            selector, rows, cols, merges,
        } = this;
        let {
            sri, sci, eri, eci,
        } = selector.range;
        const cri = selector.ri;
        const cci = selector.ci;
        let [nri, nci] = [ri, ci];
        if (ri < 0) nri = rows.len - 1;
        if (ci < 0) nci = cols.len - 1;
        // row index
        if (nri <= cri) [sri, eri] = [nri, cri];
        else eri = nri;
        // col index
        if (nci <= cci) [sci, eci] = [nci, cci];
        else eci = nci;
        selector.range = merges.union(new CellRange(
            sri, sci, eri, eci,
        ));
        // console.log('selector.range:', selector.range);
        return selector.range;
    }


    calSelectedRangeByStart(ri, ci) {
        const {
            selector, rows, cols, merges,
        } = this;
        let cellRange = merges.getFirstIncludes(ri, ci);
        // console.log('cellRange:', cellRange, ri, ci, merges);
        if (cellRange === null) {
            cellRange = new CellRange(ri, ci, ri, ci);
            if (ri === -1) {
                cellRange.sri = 0;
                cellRange.eri = rows.len - 1;
            }
            if (ci === -1) {
                cellRange.sci = 0;
                cellRange.eci = cols.len - 1;
            }
        }
        selector.range = cellRange;
        return cellRange;
    }


    setSelectedCellAttr(property, value) {
        this.changeData(() => {
            const {selector, styles, rows} = this;
            if (property === 'merge') {
                if (value) this.merge();
                else this.unmerge();
            } else if (property === 'border') {
                setStyleBorders.call(this, value);
            } else if (property === 'cellFormulaProxy') {
                const cell = rows.getCellOrNew(selector.ri, selector.ci);
                cell.text = `=${value}()`;
                cell.formulas = `=${value}()`;
            } else {
                selector.range.each((ri, ci) => {
                    let cell = rows.getCellOrNew(ri, ci);

                    let cstyle = {};
                    if (isHave(cell.style)) {
                        cstyle = helper.cloneDeep(styles[cell.style]);
                    }
                    if (property === 'format') {
                        cstyle.format = value;
                        // cell.text = cell.text.replace("¥", "");
                        // cell.formulas = cell.formulas.replace("¥", "");
                        rows.setCellText(ri, ci, {
                            text: cell.text,
                            style: this.addStyle(cstyle)
                        }, 'format');
                        // this.rows.name2SheetProxy.change(ri, ci, cell, deepCopy(cell), 'change');
                    } else if (property === 'font-bold' || property === 'font-italic'
                        || property === 'font-name' || property === 'font-size') {
                        const nfont = {};
                        nfont[property.split('-')[1]] = value;
                        cstyle.font = Object.assign(cstyle.font || {}, nfont);
                        cell.style = this.addStyle(cstyle);
                    } else if (property === 'flexible') {
                        if (this.exceptRowSet.has(ri + 1) && this.exceptRowSet.has(ri + 2) && !this.exceptRowSet.has(ri + 3)) {
                            this.exceptRowSet.delete(ri);
                            this.exceptRowSet.delete(ri + 1);
                            this.exceptRowSet.delete(ri + 2);
                        } else {
                            this.exceptRowSet.add(ri);
                            this.exceptRowSet.add(ri + 1);
                            this.exceptRowSet.add(ri + 2);
                        }
                        cstyle[property] = value;
                        cell.style = this.addStyle(cstyle);
                    } else if (property === 'strike' || property === 'textwrap'
                        || property === 'underline'
                        || property === 'align' || property === 'valign'
                        || property === 'color' || property === 'bgcolor') {
                        cstyle[property] = value;
                        cell.style = this.addStyle(cstyle);
                    }
                });
            }
        }, {type: 11, cellRange: this.selector.range, property, value});
    }

    // state: input | finished
    setSelectedCellText(text, state = 'input') {
        const {ri, ci} = this.selector;
        let nri = ri;
        if (this.unsortedRowMap.has(ri)) {
            nri = this.unsortedRowMap.get(ri);
        }
        this.setCellText(nri, ci, {text}, state);
        this.resetAutoFilter();
    }

    // state: input | finished
    setSelectedCell(text, state = 'input', formulas, ri, ci) {
        this.setCellAll(ri, ci, text, formulas, state);
        this.resetAutoFilter();
    }

    getSelectedCell() {
        const {ri, ci} = this.selector;
        let nri = ri;
        if (this.unsortedRowMap.has(ri)) {
            nri = this.unsortedRowMap.get(ri);
        }
        return this.rows.getCell(nri, ci);
    }

    editorChangeToHistory(oldCell, {ri, ci}, type) {
        if (ri === -1 || ci === -1) {
            return {"state": false}
        }
        let newCell = this.rows.getCell(ri, ci);
        // if (oldCell.text === newCell.text || oldCell.formulas === newCell.text) {
        //     return {
        //         "state": false,
        //     };
        // }
        let {multiPreAction} = this;
        let expr = xy2expr(ci, ri);
        let step = multiPreAction.getStepType(type, {ri, ci, expr, text: newCell.text});

        let oc = new CellProp(ri, ci, oldCell, expr);
        let nc = new CellProp(ri, ci, newCell, expr);
        multiPreAction.addStep(step, {oldCell: [oc], newCell: [nc]});
        this.changeDataForCalc = this.getChangeDataToCalc();
        return {
            "state": true
        }
    }

    changeToHistory({ri, type, ci, cellRange, property, value, oldCell, oldMergesData}, oldStep) {
        if (type === -1) {
            return {"state": false,}
        }

        let {multiPreAction} = this;
        const {selector} = this;

        let step = multiPreAction.getStepType(type, {
            expr: '',
            property,
            value,
            oldCell,
            range: selector.range,
            ri,
            ci,
            cellRange: cellRange,
        });
        multiPreAction.addStep(step, {oldCell, oldMergesData, newMergesData: this.merges.getData(), oldStep,});
        return {
            "state": true
        }
    }

    getSelectedCellRiCi(ri, ci) {
        let nri = ri;
        if (this.unsortedRowMap.has(ri)) {
            nri = this.unsortedRowMap.get(ri);
        }
        return this.rows.getCell(nri, ci);
    }

    xyInSelectedRect(x, y) {
        const {
            left, top, width, height,
        } = this.getSelectedRect();
        const x1 = x - this.cols.indexWidth;
        const y1 = y - this.rows.height;
        // console.log('x:', x, ',y:', y, 'left:', left, 'top:', top);
        return x1 > left && x1 < (left + width)
            && y1 > top && y1 < (top + height);
    }

    getSelectedRect() {
        return this.getRect(this.selector.range);
    }

    getClipboardRect() {
        const {clipboard} = this;
        if (!clipboard.isClear()) {
            return this.getRect(clipboard.range);
        }
        return {left: -100, top: -100};
    }


    getMoveRect(range) {
        return this.getRect(range);
    }

    getRect(cellRange) {
        const {
            scroll, rows, cols, exceptRowSet,
        } = this;
        const {
            sri, sci, eri, eci,
        } = cellRange;
        // console.log('sri:', sri, ',sci:', sci, ', eri:', eri, ', eci:', eci);
        // no selector
        if (sri < 0 && sci < 0) {
            return {
                left: 0, l: 0, top: 0, t: 0, scroll,
            };
        }
        const left = cols.sumWidth(0, sci);
        const top = rows.sumHeight(0, sri, exceptRowSet);
        const height = rows.sumHeight(sri, eri + 1, exceptRowSet);
        const width = cols.sumWidth(sci, eci + 1);
        // console.log('sri:', sri, ', sci:', sci, ', eri:', eri, ', eci:', eci);
        let left0 = left - scroll.x;
        let top0 = top - scroll.y;
        const fsh = this.freezeTotalHeight();
        const fsw = this.freezeTotalWidth();
        if (fsw > 0 && fsw > left) {
            left0 = left;
        }
        if (fsh > 0 && fsh > top) {
            top0 = top;
        }
        return {
            l: left,
            t: top,
            left: left0,
            top: top0,
            height,
            width,
            scroll,
        };
    }

    getCellRectByXY(x, y) {
        const {
            scroll, merges, rows, cols,
        } = this;

        let {ri, top, height} = getCellRowByY.call(this, y, scroll.y);
        let {ci, left, width} = getCellColByX.call(this, x, scroll.x);

        if (ci === -1) {
            width = cols.totalWidth();
        }
        if (ri === -1) {
            height = rows.totalHeight();
        }
        if (ri >= 0 || ci >= 0) {
            const merge = merges.getFirstIncludes(ri, ci);
            if (merge) {
                ri = merge.sri;
                ci = merge.sci;
                ({
                    left, top, width, height,
                } = this.cellRect(ri, ci));
            }
        }
        return {
            ri, ci, left, top, width, height,
        };
    }


    getCellRectByXYWithNotTotalResult(x, y) {
        const {
            scroll, merges,
        } = this;

        let {ri, top, height} = getCellRowByY.call(this, y, scroll.y);
        let {ci, left, width} = getCellColByX.call(this, x, scroll.x);


        if (ci === -1) {
            // // width = cols.totalWidth();
            // let args = getCellRowByAbsX.call(this, scroll.x);
            // console.log(args);
            // // ci = args.ci;
        }
        if (ri === -1) {
            // let args = getCellRowByAbsY.call(this, scroll.y);
            // console.log("1179: ", args.ri);
            // ri = args.ri;
        }
        if (ri >= 0 || ci >= 0) {
            const merge = merges.getFirstIncludes(ri, ci);
            if (merge) {
                ri = merge.sri;
                ci = merge.sci;
                ({
                    left, top, width, height,
                } = this.cellRect(ri, ci));
            }
        }
        return {
            ri, ci, left, top, width, height,
        };
    }


    isSignleSelected() {
        const {
            sri, sci, eri, eci,
        } = this.selector.range;
        const cell = this.getCell(sri, sci);
        if (cell && cell.merge) {
            const [rn, cn] = cell.merge;
            if (sri + rn === eri && sci + cn === eci) return true;
        }
        return !this.selector.multiple();
    }

    canUnmerge() {
        const {
            sri, sci, eri, eci,
        } = this.selector.range;
        const cell = this.getCell(sri, sci);
        if (cell && cell.merge) {
            const [rn, cn] = cell.merge;
            if (sri + rn === eri && sci + cn === eci) return true;
        }
        return false;
    }


    merge() {
        const {selector, rows} = this;
        if (this.isSignleSelected()) return;
        const [rn, cn] = selector.size();
        // console.log('merge:', rn, cn);
        if (rn > 1 || cn > 1) {
            const {sri, sci} = selector.range;
            const cell = rows.getCellOrNew(sri, sci);
            cell.merge = [rn - 1, cn - 1];
            this.merges.add(selector.range);
            // delete merge cells
            this.rows.deleteCells(selector.range);
            // console.log('cell:', cell, this.d);
            this.rows.setCell(sri, sci, cell);
        }
    }

    unmerge() {
        const {selector} = this;
        if (!this.isSignleSelected()) return;
        const {sri, sci} = selector.range;
        this.changeData(() => {
            this.rows.deleteCell(sri, sci, 'merge');
            this.merges.deleteWithin(selector.range);
        });
    }

    canAutofilter() {
        return !this.autoFilter.active();
    }

    autofilter() {
        const {autoFilter, selector} = this;
        this.changeData(() => {
            if (autoFilter.active()) {
                autoFilter.clear();
                this.exceptRowSet = new Set();
                this.sortedRowMap = new Map();
                this.unsortedRowMap = new Map();
            } else {
                let v = selector.range.toString();
                let eri = selector.range.eri;
                const {rows} = this;

                for (let i = selector.range.sci; i <= selector.range.eci; i++) {
                    let range = new CellRange(selector.range.sri, i, selector.range.sri, i);
                    range = rows.autoFilterRef(v, range);
                    if (eri < range.eri) {
                        eri = range.eri;
                    }
                }
                let range = new CellRange(selector.range.sri, selector.range.sci, eri, selector.range.eci);
                autoFilter.ref = range.toString();
            }
        });
    }

    throwFormula() {
        const {selector, rows} = this;

        this.changeData(() => {
            selector.range.each((i, j) => {
                const cell = rows.getCellOrNew(i, j);
                if (cell && cell.text && cell.formulas) {
                    rows.setCellAll(i, j, cell.text, cell.text);
                }
            });
        });
    }

    setAutoFilter(ci, order, operator, value) {
        const {autoFilter} = this;
        autoFilter.addFilter(ci, operator, value);
        autoFilter.setSort(ci, order);
        this.resetAutoFilter();
    }

    resetAutoFilter() {
        const {autoFilter, rows} = this;
        if (!autoFilter.active()) return;
        const {sort} = autoFilter;

        const {rset, fset} = autoFilter.filteredRows((r, c) => rows.getCell(r, c));
        const fary = Array.from(fset);
        const oldAry = Array.from(fset);
        if (sort) {
            fary.sort((a, b) => {
                if (sort.order === 'asc') return a - b;
                if (sort.order === 'desc') return b - a;
                return 0;
            });
        }
        this.exceptRowSet = rset;
        this.sortedRowMap = new Map();
        this.unsortedRowMap = new Map();
        fary.forEach((it, index) => {
            this.sortedRowMap.set(oldAry[index], it);
            this.unsortedRowMap.set(it, oldAry[index]);
        });
    }

    deleteCell(what = 'all') {
        const {selector} = this;
        this.changeData(() => {
            this.rows.deleteCells(selector.range, what);
            if (what === 'all' || what === 'format') {
                this.merges.deleteWithin(selector.range);
            }
        }, {type: 2});
    }

    // type: row | column
    insert(type, n = 1, begin = -1) {
        const {sri, sci} = this.selector.range;
        const {rows, merges, cols} = this;
        if (type === 'row') {
            begin = begin !== -1 ? begin : sri;
        } else if ('column') {
            begin = begin !== -1 ? begin : sci;
        }

        this.changeData(() => {
            let si = begin;
            if (type === 'row') {
                rows.insert(begin, n);
            } else if (type === 'column') {
                rows.insertColumn(begin, n);
                si = begin;
                cols.len += n;
            }
            merges.shift(type, si, n, (ri, ci, rn, cn) => {
                const cell = rows.getCell(ri, ci);
                cell.merge[0] += rn;
                cell.merge[1] += cn;
            });
        }, {type: 13, data: this.getData(), property: "insert"});
    }

    // type: row | column
    delete(type) {
        this.changeData(() => {
            const {
                rows, merges, selector, cols,
            } = this;
            const {range} = selector;
            const {
                sri, sci, eri, eci,
            } = selector.range;
            const [rsize, csize] = selector.range.size();
            let si = sri;
            let size = rsize;
            if (type === 'row') {
                rows.delete(sri, eri);
            } else if (type === 'column') {
                rows.deleteColumn(sci, eci);
                si = range.sci;
                size = csize;
                cols.len -= 1;
            }
            // console.log('type:', type, ', si:', si, ', size:', size);
            merges.shift(type, si, -size, (ri, ci, rn, cn) => {
                // console.log('ri:', ri, ', ci:', ci, ', rn:', rn, ', cn:', cn);
                const cell = rows.getCell(ri, ci);
                cell.merge[0] += rn;
                cell.merge[1] += cn;
                if (cell.merge[0] === 0 && cell.merge[1] === 0) {
                    delete cell.merge;
                }
            });
        });
    }

    scrollx(x, cb) {
        const {scroll, freeze, cols} = this;
        const [, fci] = freeze;
        const [
            ci, left, width,
        ] = helper.rangeReduceIf(fci, cols.len, 0, 0, x, i => cols.getWidth(i));
        // console.log('fci:', fci, ', ci:', ci);
        let x1 = left;
        if (x > 0) x1 += width;
        if (scroll.x !== x1) {
            scroll.ci = x > 0 ? ci : 0;
            scroll.x = x1;
            cb();
        }
    }

    scrolly(y, cb) {
        const {scroll, freeze, rows} = this;
        const [fri] = freeze;
        const [
            ri, top, height,
        ] = helper.rangeReduceIf(fri, rows.len, 0, 0, y, i => rows.getHeight(i));
        let y1 = top;
        if (y > 0) y1 += height;
        // console.log('ri:', ri, ' ,y:', y1);
        if (scroll.y !== y1) {
            scroll.ri = y > 0 ? ri : 0;
            scroll.y = y1;
            cb();
        }
    }

    cellRect(ri, ci) {
        const {rows, cols} = this;
        const left = cols.sumWidth(0, ci);
        const top = rows.sumHeight(0, ri);
        const cell = rows.getCell(ri, ci);
        let width = cols.getWidth(ci);
        let height = rows.getHeight(ri);
        if (cell !== null) {
            if (cell.merge) {
                const [rn, cn] = cell.merge;
                // console.log('cell.merge:', cell.merge);
                if (rn > 0) {
                    for (let i = 1; i <= rn; i += 1) {
                        height += rows.getHeight(ri + i);
                    }
                }
                if (cn > 0) {
                    for (let i = 1; i <= cn; i += 1) {
                        width += cols.getWidth(ci + i);
                    }
                }
            }
        }
        // console.log('data:', this.d);
        return {
            left, top, width, height, cell,
        };
    }

    getCell(ri, ci) {
        return this.rows.getCell(ri, ci);
    }

    getMax() {
        let mci = this.cols.len;
        let mri = this.rows.len;

        return {
            mri,
            mci
        }
    }


    // isEmpty(cell) {
    //     return this.rows.isEmpty(cell);
    // }

    renderFormat(style, cell, nrindex, cindex, filter) {
        let cellProxy = new CellProxy(cell);
        return cellProxy.renderFormat(style, nrindex, cindex, this, filter);
    }

    isFormula(text) {
        return this.rows.isFormula(text);
    }

    toString(text) {
        return this.rows.toString(text);
    }

    // isBackEndFunc(text) {
    //     return this.rows.isBackEndFunc(text);
    // }

    // isReferOtherSheet(cell) {
    //     return this.rows.isReferOtherSheet(cell);
    // }

    getCellTextOrDefault(ri, ci) {
        const cell = this.getCell(ri, ci);
        return (cell && cell.text) ? cell.text : '';
    }

    getCellStyle(ri, ci) {
        const cell = this.getCell(ri, ci);
        if (cell && cell.style !== undefined) {
            return this.styles[cell.style];
        }
        return null;
    }

    // getCellStyleHandle(index, type, cell, ri, ci) {
    //     let style = this.styles[index];
    //
    //     if (style && style.format === type) {
    //         return true;
    //     }
    //     return false;
    // }

    getCellStyleOrDefault(ri, ci) {
        const {styles, rows} = this;
        const cell = rows.getCell(ri, ci);
        const cellStyle = (cell && cell.style !== undefined) ? styles[cell.style] : {};
        return helper.merge(this.defaultStyle(), cellStyle);
    }

    getSelectedCellStyle() {
        const {ri, ci} = this.selector;
        return this.getCellStyleOrDefault(ri, ci);
    }

    getCellByExpr(src, table, name, inputText, pos) {
        // let p1 = inputText.substring(0, pos);
        // let p2 = inputText.substring(pos, inputText.length);
        // inputText = p1 + src + p2;
        // let name2SheetProxy = parseCell2.call(table, this.viewRange(), true, inputText);
        // return {
        //     "text": name2SheetProxy['Sheets'][name].A1.w ? name2SheetProxy['Sheets'][name].A1.w : name2SheetProxy['Sheets'][name].A1.v,
        //     "formulas": p1 + `${name}!` + src + p2
        // };
    }

    // state: input | finished
    setCellText(ri, ci, {text, style}, state) {
        // text = text.replace(/\"/g)
        const {rows, history, validations} = this;
        if (state === 'finished') {
            rows.setCellText(ri, ci, {text: ''});
            history.add(this.getData());
            rows.setCellText(ri, ci, {text});
        } else {
            if (state === 'end') {
                rows.setCellAll(ri, ci, text);
            } else if (state === 'formulas') {
                rows.setCellAll(ri, ci, text, "-");
            } else if (state === 'style') {
                rows.setCellText(ri, ci, {text, style}, 'style');
            } else {
                rows.setCellText(ri, ci, {text});
                // rows.
            }
            // 不应该没打开一个单元格就 change一次
            this.change(this.getData());
        }
        // validator
        validations.validate(ri, ci, text);
    }

    // setCellWithFormulas(ri, ci, text, formulas, what = 'all') {
    //     const {rows} = this;
    //     rows.setCellAll(ri, ci, text, formulas, what);
    // }


    // state: input | finished
    setCellAll(ri, ci, text, formulas, state) {
        const {rows, history, validations} = this;
        if (state === 'finished') {
            rows.setCellAll(ri, ci, '', '');
            history.add(this.getData());
            rows.setCellAll(ri, ci, text, formulas);
        } else {
            rows.setCellAll(ri, ci, text, formulas);
            // this.change(this.getData());
        }
        // validator
        validations.validate(ri, ci, text, formulas);
    }

    equationIsActive() {
        return this.showEquation;
    }

    freezeIsActive() {
        const [ri, ci] = this.freeze;
        return ri > 0 || ci > 0;
    }

    setFreeze(ri, ci) {
        this.changeData(() => {
            this.freeze = [ri, ci];
        });
    }

    freezeTotalWidth() {
        return this.cols.sumWidth(0, this.freeze[1]);
    }

    freezeTotalHeight() {
        return this.rows.sumHeight(0, this.freeze[0]);
    }

    setRowHeight(ri, height) {
        this.changeData(() => {
            this.rows.setHeight(ri, height);
        }, {type: 3, ri: ri});
    }

    setColWidth(ci, width) {
        this.changeData(() => {
            this.cols.setWidth(ci, width);
        }, {type: 4, ci: ci});
    }

    viewHeight() {
        const {view, showToolbar} = this.settings;
        let h = view.height();
        if (showToolbar) {
            h -= toolbarHeight;
        }
        return h;
    }

    viewWidth() {
        return this.settings.view.width();
    }

    freezeViewRange() {
        const [ri, ci] = this.freeze;
        return new CellRange(0, 0, ri - 1, ci - 1, this.freezeTotalWidth(), this.freezeTotalHeight());
    }

    viewRange() {
        const {
            scroll, rows, cols, freeze,
        } = this;
        let {ri, ci} = scroll;
        if (ri <= 0) [ri] = freeze;
        if (ci <= 0) [, ci] = freeze;

        let [x, y] = [0, 0];
        let [eri, eci] = [rows.len, cols.len];
        for (let i = ri; i < rows.len; i += 1) {
            y += rows.getHeight(i);
            eri = i;
            if (y > this.viewHeight()) break;
        }
        for (let j = ci; j < cols.len; j += 1) {
            x += cols.getWidth(j);
            eci = j;
            if (x > this.viewWidth()) break;
        }

        // console.log(ri, ci, eri, eci, x, y);
        return new CellRange(ri, ci, eri, eci, x, y);
    }

    viewRange2() {
        const {
            scroll, rows, cols, freeze,
        } = this;
        let {ri, ci} = scroll;
        if (ri <= 0) [ri] = freeze;
        if (ci <= 0) [, ci] = freeze;

        let [x, y] = [0, 0];
        let [eri, eci] = [rows.len, cols.len];
        for (let i = ri; i < rows.len; i += 1) {
            y += rows.getHeight(i);
            eri = i;
            if (y > this.viewHeight()) break;
        }
        for (let j = ci; j < cols.len; j += 1) {
            x += cols.getWidth(j);
            eci = j;
        }

        // console.log(ri, ci, eri, eci, x, y);
        return new CellRange(ri, ci, eri, eci, x, y);
    }

    eachMergesInView(viewRange, cb) {
        this.merges.filterIntersects(viewRange)
            .forEach(it => cb(it));
    }

    rowEach(min, max, cb) {
        let y = 0;
        const {rows} = this;
        const frset = this.exceptRowSet;
        const frary = [...frset];
        let offset = 0;
        for (let i = 0; i < frary.length; i += 1) {
            if (frary[i] < min) offset += 1;
        }
        // console.log('min:', min, ', max:', max, ', scroll:', scroll);
        for (let i = min + offset; i <= max + offset; i += 1) {
            if (frset.has(i)) {
                offset += 1;
            } else {
                const rowHeight = rows.getHeight(i);
                cb(i, y, rowHeight);
                y += rowHeight;
                if (y > this.viewHeight()) break;
            }
        }
    }

    colEach(min, max, cb) {
        let x = 0;
        const {cols} = this;
        for (let i = min; i <= max; i += 1) {
            const colWidth = cols.getWidth(i);
            cb(i, x, colWidth);
            x += colWidth;
            if (x > this.viewWidth()) break;
        }
    }

    defaultStyle() {
        return this.settings.style;
    }

    addStyle(nstyle) {
        const {styles} = this;
        // console.log('old.styles:', styles, nstyle);
        for (let i = 0; i < styles.length; i += 1) {
            const style = styles[i];
            if (helper.equals(style, nstyle)) return i;
        }
        styles.push(nstyle);
        return styles.length - 1;
    }

    // addPicture(pic) {
    //     const {pictures} = this;
    //
    // }

    getChangeDataToCalc() {
        let {multiPreAction} = this;
        if (multiPreAction.undoItems.length <= 0) {
            return null;
        }
        let lastStep = multiPreAction.undoItems[multiPreAction.undoItems.length - 1];
        if (!isHave(lastStep)) {
            return null;
        }

        return lastStep;
    }

    changeData(cb, {type = -1, ri = -1, ci = -1, cellRange = "", property = "", value = ""} = -1) {
        if (this.settings.showEditor === false) {
            return;
        }

        let oldCell = {};
        let oldMergesData = this.merges.getData();
        let {multiPreAction} = this;
        const {selector} = this;

        let step = multiPreAction.getStepType(type, {
            expr: '',
            property,
            value,
            oldCell,
            range: selector.range,
            ri,
            ci,
            cellRange: cellRange,
        });

        if (cellRange !== "") {
            let {multiPreAction} = this;
            oldCell = multiPreAction.eachRange(cellRange);
        }
        cb();
        this.changeToHistory({type, ri, ci, cellRange, property, value, oldCell, oldMergesData, newData: this.getData(), }, step);
        this.changeDataForCalc = this.getChangeDataToCalc();

        this.change(this.getData());
    }

    cutPaste(srcCellRange, dstCellRange, cleard = true) {
        cutPaste.call(this, srcCellRange, dstCellRange, cleard);
    }

    setData(d, sheet = "", out = false) {
        const {autoFilter} = this;
        Object.keys(d).forEach((property) => {
            // this.judgeAutoWidth(d.rows);
            if (property === 'merges'
                || property === 'cols' || property === 'validations' || property === 'chart') {
                this[property].setData(d[property]);
            } else if (property === 'flex') {
                autoFilter.addFiexRows(d[property]);
            } else if (property === 'rows') {
                this[property].setData(d[property], sheet, out, this.settings.rowsInit);
            } else if (property === 'freeze') {
                const [x, y] = expr2xy(d[property]);
                this.freeze = [y, x];
            } else if (property === 'pictures') {
                if (d[property]) {
                    processPasteDirectionsArr.call(this, d[property], 'from', sheet);
                }
            } else if (property === 'autofilter') {
                if (d[property] && d[property].ref) {
                    autoFilter.ref = d[property].ref;
                    autoFilter.filters = d[property].filters;
                    autoFilter.sort = d[property].sort;
                }
            } else if (d[property] !== undefined) {
                this[property] = d[property];
            }
        });
        return this;
    }

    selectorCellText(ri, ci, text, event_type) {
        return selectorCellText.call(this, ri, ci, text, event_type);
    }

    getData() {
        const {
            name, freeze, styles, merges, rows, cols, validations, autoFilter, pasteDirectionsArr,
        } = this;
        return {
            editor: this.settings.showEditor,
            name,
            freeze: xy2expr(freeze[1], freeze[0]),
            styles,
            pictures: processPasteDirectionsArr(pasteDirectionsArr, 'to'),
            merges: merges.getData(),
            rows: rows.getData(),
            cols: cols.getData(),
            validations: validations.getData(),
            autofilter: autoFilter.getData(),
        };
    }
}
