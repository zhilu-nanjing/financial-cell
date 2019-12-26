import {cloneDeep, rangeSum} from "../helper/dataproxy_helper";
import {isHave} from '../helper/check_value';
import {xy2expr} from '../utils/alphabet';
import {changeFormula, cutStr, isAbsoluteValue, value2absolute} from "../core/operator";
import {expr2xy} from "../utils/alphabet";
import dayjs from 'dayjs'
import {deepCopy, distinct, isSheetVale, splitStr} from "./operator";
import Recast from "./recast";
import PasteProxy from "./paste_proxy";
import CellProxy from "./cell_proxy";
import CellRange from "./cell_range";
import CellProp from "../model/cell_prop";
import Cell from "../model/cell";

export function isFormula(text) {
    return text && text[0] === "=";
}

function isEmpty(text, formulas, formatText) {
    if(isHave(text) && text !== "") {
        return false;
    }

    if(isHave(formulas) && formulas !== "") {
        return false;
    }


    return !isHave(formatText);
}

function otherAutoFilter(d, darr, direction, isAdd, what, cb, other, dri) {
    // other 为 '=asd'或者'asd'也为false
    let ncell = this.getCellByTopCell(d, direction, isAdd, 'other', dri, 0);

    let {text, formulas} = ncell;
    let iText = formulas !== "" ? formulas : text;

    // if (other) {
    //     this.copyRender(darr, d.ri, d.ci, ncell, what, cb);
    // } else
    if (this.isFormula(iText)) {
        this.calcFormulaCellByTopCell(iText, darr, d, direction, isAdd, cb);
    } else {
        // 为 '=asd'或者'asd' 进这里
        this.calcCellByTopCell(cb, what, ncell, darr, isAdd, iText, d, text);
    }
}

function numberAutoFilter(d, darr, direction, isAdd, diffValue, what, cb, isNumber) {
    let ncell = "";

    if (isAdd) {
        diffValue = Math.abs(diffValue);
    } else {
        diffValue = diffValue * -1;
    }

    if (!isNumber) {
        ncell = {
            "text": d.v,
            "formulas": d.v,
        };
        diffValue = 0;
    } else {
        ncell = this.getCellByTopCell(d, direction, isAdd);
    }

    this.calcNumberCellByTopCell(ncell, diffValue, darr, d, what, cb);
}

function dateAutoFilter(d, line, isDown, darr, what, cb, isDate) {
    let direction = line;
    let ncell = "";
    let diff = isDown ? 1 : -1;
    if (!isDate) {
        ncell = {
            "text": d.v,
            "formulas": d.v,
        };
        diff = 0;
    } else {
        ncell = this.getCellByTopCell(d, direction, isDown, 'date');
    }
    this.calcDateCellByTopCell(ncell, darr, d, isDown, what, cb, diff);
}

class Rows {
    constructor({len, height}, data = "") {
        this._ = {};
        this.len = len;
        // default row height
        this.height = height;
        this.data = data;
        this.pasteProxy = new PasteProxy();
        this.workbook = null;
    }

    getHeight(ri) {
        const row = this.get(ri);
        if (row && row.height) {
            return row.height;
        }
        return this.height;
    }

    setHeight(ri, v) {
        const row = this.getOrNew(ri);
        row.height = v;
    }

    setStyle(ri, style) {
        const row = this.getOrNew(ri);
        row.style = style;
    }

    sumHeight(min, max, exceptSet) {
        return rangeSum(min, max, (i) => {
            if (exceptSet && exceptSet.has(i)) return 0;
            return this.getHeight(i);
        });
    }

    totalHeight() {
        return this.sumHeight(0, this.len);
    }

    get(ri) {
        return this._[ri];
    }

    getOrNew(ri) {
        this._[ri] = this._[ri] || {cells: {}};
        return this._[ri];
    }

    getCell(ri, ci) {
        const row = this.get(ri);
        if (row !== undefined && row.cells !== undefined && row.cells[ci] !== undefined
            && (isHave(row.cells[ci].text) || isHave(row.cells[ci].formulas) || isHave(row.cells[ci].style || typeof row.cells[ci] === 'object'))) {
            return row.cells[ci];
        }
        return null;
    }

    getCellMerge(ri, ci) {
        const cell = this.getCell(ri, ci);
        if (cell && cell.merge) return cell.merge;
        return [0, 0];
    }

    getCellOrNew(ri, ci) {
        const row = this.getOrNew(ri);
        row.cells[ci] = row.cells[ci] || {};
        return row.cells[ci];
    }

    toString(text) {
        if (isHave(text) === false) {
            text = "";
        }
        return text + "";
    }

    isBackEndFunc(text) {
        // if (text.indexOf("MD.RTD") !== -1) {
        //     return true;
        // }

        return text.indexOf("MD.RTD") !== -1;
    }

    isReferOtherSheet(cell, state = false) {
        return cell.formulas && cell.formulas[0] === "=" && (state || isSheetVale(cell.formulas));
    }

    isEmpty(cell) {
        return cell && (cell.text || cell.formulas || cell.depend);
    }

    isFormula(text) {
        return isFormula(text);
    }

    setValue(type, value, cell) {
        cell[type] = value;
    }

    // what: all | text | format
    setCell(ri, ci, cell, what = 'all') {
        let {data} = this;
        const row = this.getOrNew(ri);
        let _cell = new Cell();
        _cell.setCell(cell);
        if (what === 'all') {
            row.cells[ci] = _cell;
        } else if(what === 'formulas') {
            row.cells[ci] = row.cells[ci] || {};
            row.cells[ci].formulas = _cell.formulas;
        } else if (what === 'text') {
            row.cells[ci] = row.cells[ci] || {};
            row.cells[ci].text = _cell.text;
        } else if (what === 'format') {
            row.cells[ci] = row.cells[ci] || {};
            row.cells[ci].style = _cell.style;
            if (cell.merge) row.cells[ci].merge = _cell.merge;
        } else if (what === 'date' || what === 'datetime') {
            // row.cells[ci] = {};
            if (!isHave(row.cells[ci])) {
                row.cells[ci] = {}
            }
            if (!this.isFormula(cell.formulas)) {
                row.cells[ci].formulas = _cell.text;
            } else {
                row.cells[ci].formulas = _cell.formulas;
            }
            row.cells[ci].text = _cell.text;
            row.cells[ci].style = _cell.style;
            row.cells[ci].to_calc_num = _cell.to_calc_num;
        } else if (what === 'normal' || what === 'number') {
            if (!isHave(row.cells[ci])) {
                row.cells[ci] = {}
            }
            if (!this.isFormula(cell.formulas)) {
                row.cells[ci].formulas = _cell.text;
            } else {
                row.cells[ci].formulas = _cell.formulas;
            }
            // row.cells[ci].value = cell.value;
            row.cells[ci].text = _cell.text;
            row.cells[ci].style = _cell.style;
        } else if (what === 'rmb' || what === 'percent') {        // rmb 单独拿出来是因为 text是￥123, 而formalus不能是 ￥123,应该是123
            if (!isHave(row.cells[ci])) {
                row.cells[ci] = {}
            }

            row.cells[ci].text = _cell.text;
            row.cells[ci].formulas = _cell.formulas;
            row.cells[ci].style = _cell.style;
        } else if (what === 'all_with_no_workbook') {
            row.cells[ci] = _cell;

            return;
        } else if (what === 'style') {
            if (!isHave(row.cells[ci])) {
                row.cells[ci] = {};
            }

            row.cells[ci].style = _cell.style;
            return;
        }else if(what === 'assign') {
            Object.assign(row.cells[ci], cell);
        }

        // cell
        this.getDependCell(xy2expr(ci, ri), this.getCell(ri, ci));
        _cell.setFormatText(data.tryParseToNum(_cell, ri, ci));
    }

    getDependCell(expr, cell) {
        let {formulas} = cell;
        if (isHave(formulas) === false) {
            return;
        }
        if (isFormula(formulas)) {
            let arr = cutStr(formulas, true, true);

            for (let i = 0; i < arr.length; i++) {
                let args = this.mergeCellExpr(arr[i]);
                if (args.state) {
                    arr.push(...args.mergeArr);
                }
            }
            arr = distinct(arr);

            if (isHave(cell.depend) === false) {
                cell.depend = [];
            }
            for (let i = 0; i < arr.length; i++) {
                let ref = arr[i];
                let [ci, ri] = expr2xy(ref);
                let refCell = this.getCell(ri, ci);
                if (isHave(refCell) === false) {
                    refCell = {};
                }

                if (isHave(refCell.depend) === false) {
                    refCell.depend = [];
                }
                refCell.depend.push(expr);
                refCell.depend = distinct(refCell.depend);
                this.setCell(ri, ci, refCell, 'all_with_no_workbook');
            }
        }
    }

    mergeCellExpr(d) {
        if (!isAbsoluteValue(d, 6)) {
            return {
                "state": false,
            }
        }
        d = d.replace(/\$/g, '');
        d = d.split(":");
        let e1 = expr2xy(d[0]);
        let e2 = expr2xy(d[1]);

        if (e1[0] > e2[0]) {
            let t = e2[0];
            e2[0] = e1[0];
            e1[0] = t;
        }
        if (e1[1] > e2[1]) {
            let t = e2[1];
            e2[1] = e1[1];
            e1[1] = t;
        }
        let cellRange = new CellRange(e1[1], e1[0], e2[1], e2[0]);
        let arr = [];
        cellRange.each((i, j) => {
            arr.push(xy2expr(j, i));
        });

        return {
            "state": true,
            "mergeArr": arr,
        };
    }

    useOne(param, other, value = true) {
        if (isHave(param) === false) {
            return other;
        }

        if (value && this.isFormula(param)) {
            return other;
        }
        return param;
    }

    // what === cell 把原本的cell 的merge 清空， 原因是不清空 merge还会存在
    setCellText(ri, ci, {text, style, formulas, merge = ""},  what = 'all') {
        if(what === 'all_with_no_workbook') {
            this.setCell(ri, ci, {}, 'all_with_no_workbook');
            return;
        }

        const cell = this.getCellOrNew(ri, ci);
        let _cell = new Cell();
        _cell.setCell(cell);
        // _cell.setFormatText(data.tryParseToNum(_cell, ri, ci));
        if (what === 'style') {
            _cell.style = style;
            _cell.formulas = text;   //    cell.formulas = cell.formulas;
        }   else if (what === 'format') {
            _cell.formulas = cell.formulas;
            _cell.style = style;
        } else if (what === 'cell') {
            _cell.style = style;
            _cell.formulas = formulas;
            _cell['merge'] = undefined;
            if (merge !== "") {
                _cell.merge = merge;
            }
        } else {
            _cell.formulas = text;
        }
        _cell.text = text;
        this.setCell(ri, ci, _cell);

        this.getDependCell(xy2expr(ci, ri), this.getCell(ri, ci));
    }

    setCellAll(ri, ci, text, formulas = "") {
        const cell = this.getCellOrNew(ri, ci);
        let _cell = new Cell();
        _cell.formulas = formulas === "" ? cell.formulas : formulas;
        _cell.text = text;

        this.setCell(ri, ci, _cell, 'formulas');
        this.setCell(ri, ci, _cell, 'text');
        this.getDependCell(xy2expr(ci, ri), this.getCell(ri, ci));
    }

    moveChange(arr, arr2, arr3) {
        if (arr.length !== arr2.length && arr3.length !== arr2.length) {
            return;
        }

        for (let i = 0; i < arr.length; i++) {

            let s1 = arr[i].expr;
            arr[i].each((ri, ci) => {
                let cell = this.getCell(ri, ci);
                if (isHave(cell) === false) {
                    cell = {};
                }
                if (!isHave(cell.formulas)) {
                    cell.formulas = "";
                }

                let formulas = changeFormula(cutStr(cell.formulas));

                if (formulas.indexOf(s1) !== -1) {
                    let ca = arr3[i].expr.replace(/\$/g, "\\$");

                    this.setCellAll(ri, ci, cell.text.replace(new RegExp(ca, 'g'), arr2[i].expr), cell.formulas.replace(ca, arr2[i].expr));
                } else {
                    let s = value2absolute(s1);
                    let es = value2absolute(arr2[i].expr);
                    if (formulas.indexOf(s.s3) !== -1) {
                        s = value2absolute(arr3[i].expr);

                        s.s3 = s.s3.replace(/\$/g, "\\$");
                        this.setCellAll(ri, ci, cell.text.replace(new RegExp(s.s3, 'g'), es.s3), cell.formulas.replace(new RegExp(s.s3, 'g'), es.s3));
                    } else if (formulas.indexOf(s.s2) !== -1) {
                        s = value2absolute(arr3[i].expr);
                        s.s2 = s.s2.replace(/\$/g, "\\$");
                        this.setCellAll(ri, ci, cell.text.replace(new RegExp(s.s2, 'g'), es.s2), cell.formulas.replace(new RegExp(s.s2, 'g'), es.s2));
                    } else if (formulas.indexOf(s.s1) !== -1) {
                        s = value2absolute(arr3[i].expr);
                        s.s1 = s.s1.replace(/\$/g, "\\$");

                        this.setCellAll(ri, ci, cell.text.replace(new RegExp(s.s1, 'g'), es.s1), cell.formulas.replace(new RegExp(s.s1, 'g'), es.s1));
                    }
                }
            });
        }
    }

    formatMoney(s, type) {
        if (/[^0-9\.]/.test(s))
            return "0";
        if (s == null || s === "")
            return "0";
        s = s.toString().replace(/^(\d*)$/, "$1.");
        s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
        s = s.replace(".", ",");
        let re = /(\d)(\d{3},)/;
        while (re.test(s))
            s = s.replace(re, "$1,$2");
        s = s.replace(/,(\d\d)$/, ".$1");
        if (type === 0) {
            let a = s.split(".");
            if (a[1] === "00") {
                s = a[0];
            }
        }
        return s;
    }

    // isValid => true 为日期  false 为 数字
    getCellStyleConvert(cellStyle, isValid) {
        if (cellStyle && cellStyle.format && cellStyle.format === 'number') {
            return "number";
        } else if (cellStyle && cellStyle.format && cellStyle.format === 'rmb') {
            return 'rmb';
        } else if ((cellStyle && cellStyle.format && cellStyle.format === 'normal')) {
            return "normal";
        } else if (cellStyle && cellStyle.format && cellStyle.format === 'percent') {
            return "percent";
        } else if (cellStyle && cellStyle.format && cellStyle.format === 'datetime') {
            return "datetime";
        } else if (
            (isValid && !isHave(cellStyle))
            || (isValid && cellStyle && cellStyle.format !== 'normal')
            || cellStyle && cellStyle.format && cellStyle.format === 'date') {
            return "date";
        }

        return "";
    }

    getCellTextIsAdd(isInsert, sri, ds, isAdd, dei, dci, abs = 0, isRows) {
        let enter = false;
        let s = "";
        if (isInsert) {
            if (sri <= ds[1] && isAdd && isRows) {
                s = xy2expr(ds[0] + dei, ds[1] + dci, abs);
                enter = true;
            } else if (sri <= ds[1] && !isAdd && isRows) {
                s = xy2expr(ds[0] + dei, ds[1] + dci, abs);
                enter = true;
            } else if (sri <= ds[0] && isAdd && isRows === false) {
                s = xy2expr(ds[0] + dei, ds[1] + dci, abs);
                enter = true;
            }
        }

        return {
            "enter": enter,
            "data": s,
        }
    }

    eachRange(range) {
        let cells = [];
        range.each((i, j) => {
            let cell = this.getCell(i, j);
            if (isHave(cell)) {
                let empty = isEmpty(cell);
                cell = deepCopy(cell);
                let cellProp = new CellProp(i, j, cell, xy2expr(j, i), empty);
                cells.push(cellProp);
            } else  {
                cell = {};
                let cellProp = new CellProp(i, j, cell, xy2expr(j, i), true);
                cells.push(cellProp);
            }
        });

        return cells;
    }

    getCellTextByShift(arr, dei, dci, isInsert = false, isAdd = false, sri = 0, isRows = false) {
        let bad = false;
        let enter = false;
        let newStr = "";

        for (let i = 0; i < arr.length; i++) {
            // if(isInsert && isHave(arr[i])) {
            //     arr[i] = arr[i].replace(/\$/, '');
            // }
            if (typeof arr[i] === 'string') {
                arr[i] = arr[i].toUpperCase();
            }
            if (arr[i].search(/^[A-Z]+\d+$/) !== -1) {
                let ds = expr2xy(arr[i]);
                if (ds[0] + dei < 0 || ds[1] + dci < 0) {
                    bad = true;
                }

                let args = this.getCellTextIsAdd(isInsert, sri, ds, isAdd, dei, dci, 0, isRows);
                if (args.enter) {
                    arr[i] = args.data;
                } else if (isInsert === false) {
                    arr[i] = xy2expr(ds[0] + dei, ds[1] + dci);
                }
                enter = true;
            } else if (arr[i].search(/^[A-Za-z]+\d+:[A-Za-z]+\d+$/) !== -1) {
                let a1 = arr[i].split(":")[0];
                let a2 = arr[i].split(":")[1];
                let ds1 = expr2xy(a1);
                let ds2 = expr2xy(a2);

                if (ds1[0] + dei < 0 || ds1[1] + dci < 0) {
                    bad = true;
                }
                if (ds2[0] + dei < 0 || ds2[1] + dci < 0) {
                    bad = true;
                }

                let s = "";

                let args = this.getCellTextIsAdd(isInsert, sri, ds1, isAdd, dei, dci, 0, isRows);
                if (args.enter) {
                    s = args.data + ":";
                } else if (isInsert === false) {
                    s = xy2expr(ds1[0] + dei, ds1[1] + dci) + ":";
                } else {
                    s = a1 + ":";
                }

                args = this.getCellTextIsAdd(isInsert, sri, ds2, isAdd, dei, dci, 0, isRows);
                if (args.enter) {
                    s += args.data;
                } else if (isInsert === false) {
                    s += xy2expr(ds2[0] + dei, ds2[1] + dci);
                } else {
                    s += a2;
                }

                enter = true;
                arr[i] = s;
            } else {
                let value = isAbsoluteValue(arr[i], 5);

                if (value === 2) {
                    let ds = expr2xy(arr[i].replace(/\$/g, ''));
                    if (ds[0] + dei < 0 || ds[1] + dci < 0) {
                        bad = true;
                    }

                    let args = this.getCellTextIsAdd(isInsert, sri, ds, isAdd, dei, dci, 2, isRows);
                    if (args.enter) {
                        arr[i] = args.data;
                    } else if (isInsert === false) {
                        arr[i] = xy2expr(ds[0] + dei, ds[1], 2);
                    }
                    enter = true;
                } else if (value === 1) {
                    let ds = expr2xy(arr[i].replace(/\$/g, ''));
                    if (ds[0] + dei < 0 || ds[1] + dci < 0) {
                        bad = true;
                    }

                    let args = this.getCellTextIsAdd(isInsert, sri, ds, isAdd, dei, dci, 1, isRows);
                    if (args.enter) {
                        arr[i] = args.data;
                    } else if (isInsert === false) {
                        arr[i] = xy2expr(ds[0], ds[1] + dci, 1);
                    }

                    enter = true;
                } else if (value === 4) {
                    let sp = arr[i].split(":");
                    console.log(arr[i], sp);
                    for (let item = 0; item < sp.length; item++) {
                        let ds = expr2xy(sp[item].replace(/\$/g, ''));
                        if (ds[0] + dei < 0 || ds[1] + dci < 0) {
                            bad = true;
                        }

                        let args = this.getCellTextIsAdd(isInsert, sri, ds, isAdd, dei, dci, 2, isRows);
                        if (args.enter) {
                            sp[item] = args.data;
                        } else if (isInsert === false) {
                            sp[item] = xy2expr(ds[0] + dei, ds[1], 2);
                        }
                    }
                    arr[i] = sp.join(':');
                    enter = true;
                } else if (value === 5) {
                    let sp = arr[i].split(":");
                    for (let item = 0; item < sp.length; item++) {
                        let ds = expr2xy(sp[item].replace(/\$/g, ''));
                        if (ds[0] + dei < 0 || ds[1] + dci < 0) {
                            bad = true;
                        }
                        if (item === 1) {
                            let args = this.getCellTextIsAdd(isInsert, sri, ds, isAdd, dei, dci, 1, isRows);
                            if (args.enter) {
                                sp[item] = args.data;
                            } else if (isInsert === false) {
                                sp[item] = xy2expr(ds[0], ds[1] + dci, 1);
                            }
                        } else {
                            let args = this.getCellTextIsAdd(isInsert, sri, ds, isAdd, dei, dci, 2, isRows);
                            if (args.enter) {
                                sp[item] = args.data;
                            } else if (isInsert === false) {
                                sp[item] = xy2expr(ds[0], ds[1] + dci, 2);
                            }
                        }
                    }
                    arr[i] = sp.join(':');
                    enter = true;
                } else if (value === 7) {
                    let sp = arr[i].split(':');
                    for (let item = 0; item < sp.length; item++) {
                        let ds = expr2xy(sp[item].replace(/\$/g, ''));
                        if (ds[0] + dei < 0 || ds[1] + dci < 0) {
                            bad = true;
                        }
                        let args = this.getCellTextIsAdd(isInsert, sri, ds, isAdd, dei, dci, 1, isRows);
                        if (args.enter) {
                            sp[item] = args.data;
                        } else if (isInsert === false) {
                            sp[item] = xy2expr(ds[0], ds[1] + dci, 1);
                        }
                    }
                    arr[i] = sp.join(':');
                    enter = true;
                } else if (value === 6) {
                    let sp = arr[i].split(":");
                    for (let item = 0; item < sp.length; item++) {
                        let ds = expr2xy(sp[item].replace(/\$/g, ''));
                        if (ds[0] + dei < 0 || ds[1] + dci < 0) {
                            bad = true;
                        }
                        if (item === 0) {
                            let args = this.getCellTextIsAdd(isInsert, sri, ds, isAdd, dei, dci, 1, isRows);
                            if (args.enter) {
                                sp[item] = args.data;
                            } else if (isInsert === false) {
                                sp[item] = xy2expr(ds[0], ds[1] + dci, 1);
                            }
                        } else {
                            let args = this.getCellTextIsAdd(isInsert, sri, ds, isAdd, dei, dci, 2, isRows);
                            if (args.enter) {
                                sp[item] = args.data;
                            } else if (isInsert === false) {
                                sp[item] = xy2expr(ds[0] + dei, ds[1], 2);
                            }
                        }
                    }
                    arr[i] = sp.join(':');
                    enter = true;
                } else if (value === 8) {
                    let sp = arr[i].split(":");
                    for (let item = 0; item < sp.length; item++) {
                        let ds = expr2xy(sp[item].replace(/\$/g, ''));
                        if (ds[0] + dei < 0 || ds[1] + dci < 0) {
                            bad = true;
                        }

                        if (item === 0) {
                            let args = this.getCellTextIsAdd(isInsert, sri, ds, isAdd, dei, dci, 0, isRows);
                            if (args.enter) {
                                sp[item] = args.data;
                            } else if (isInsert === false) {
                                sp[item] = xy2expr(ds[0] + dei, ds[1] + dci, 0);
                            }
                        } else {
                            let args = this.getCellTextIsAdd(isInsert, sri, ds, isAdd, dei, dci, 1, isRows);
                            if (args.enter) {
                                sp[item] = args.data;
                            } else if (isInsert === false) {
                                sp[item] = xy2expr(ds[0] + dei, ds[1], 1);
                            }
                        }
                    }
                    arr[i] = sp.join(':');
                    enter = true;
                } else if (value === 9) {
                    let sp = arr[i].split(":");
                    for (let item = 0; item < sp.length; item++) {
                        let ds = expr2xy(sp[item].replace(/\$/g, ''));
                        if (ds[0] + dei < 0 || ds[1] + dci < 0) {
                            bad = true;
                        }

                        if (item === 0) {
                            let args = this.getCellTextIsAdd(isInsert, sri, ds, isAdd, dei, dci, 1, isRows);
                            if (args.enter) {
                                sp[item] = args.data;
                            } else if (isInsert === false) {
                                sp[item] = xy2expr(ds[0] + dei, ds[1] + dci, 0);
                            }

                        } else {
                            let args = this.getCellTextIsAdd(isInsert, sri, ds, isAdd, dei, dci, 2, isRows);
                            if (args.enter) {
                                sp[item] = args.data;
                            } else if (isInsert === false) {
                                sp[item] = xy2expr(ds[0] + dei, ds[1], 2);
                            }
                        }
                    }
                    arr[i] = sp.join(':');
                    enter = true;
                } else if (value === 10) {
                    let sp = arr[i].split(":");
                    for (let item = 0; item < sp.length; item++) {
                        let ds = expr2xy(sp[item].replace(/\$/g, ''));
                        if (ds[0] + dei < 0 || ds[1] + dci < 0) {
                            bad = true;
                        }

                        if (item === 1) {
                            let args = this.getCellTextIsAdd(isInsert, sri, ds, isAdd, dei, dci, 0, isRows);
                            if (args.enter) {
                                sp[item] = args.data;
                            } else if (isInsert === false) {
                                sp[item] = xy2expr(ds[0] + dei, ds[1] + dci, 0);
                            }
                        } else {
                            let args = this.getCellTextIsAdd(isInsert, sri, ds, isAdd, dei, dci, 2, isRows);
                            if (args.enter) {
                                sp[item] = args.data;
                            } else if (isInsert === false) {
                                sp[item] = xy2expr(ds[0] + dei, ds[1], 2);
                            }
                        }
                    }
                    arr[i] = sp.join(':');
                    enter = true;
                } else if (value === 11) {
                    let sp = arr[i].split(":");
                    for (let item = 0; item < sp.length; item++) {
                        let ds = expr2xy(sp[item].replace(/\$/g, ''));
                        if (ds[0] + dei < 0 || ds[1] + dci < 0) {
                            bad = true;
                        }

                        if (item === 1) {
                            let args = this.getCellTextIsAdd(isInsert, sri, ds, isAdd, dei, dci, 0, isRows);
                            if (args.enter) {
                                sp[item] = args.data;
                            } else if (isInsert === false) {
                                sp[item] = xy2expr(ds[0] + dei, ds[1] + dci, 0);
                            }
                        } else {
                            let args = this.getCellTextIsAdd(isInsert, sri, ds, isAdd, dei, dci, 1, isRows);
                            if (args.enter) {
                                sp[item] = args.data;
                            } else if (isInsert === false) {
                                sp[item] = xy2expr(ds[0] + dei, ds[1], 1);
                            }
                        }
                    }
                    arr[i] = sp.join(':');
                    enter = true;
                }
            }
            newStr += arr[i];
        }

        return {
            "bad": bad,
            "enter": enter,
            "result": newStr
        };
    }

    autoFilterRef(ref, range) {
        let [ci, ri] = expr2xy(ref);
        let cell = this.getCell(ri, ci);
        while (cell !== null) {
            ri += 1;
            cell = this.getCell(ri, ci);
        }
        range.eri = ri;

        return range;
    }

    // getAllDataType(cellRange)
    getAllDataType(cellRange) {
        let isNumber = true, isDate = true, sarr = [];

        cellRange.each((i, j) => {
            let und = false, cell = this.getCell(i, j);
            if (cell) {
                cell = deepCopy(cell);
                let args = new CellProxy(cell).getCellDataType(sarr, {isDate, isNumber});
                // pasteProxy.getCellDataType(cell, sarr, {isDate, isNumber}); // let args = CellProxy(cell).getCellDataType()
                isDate = args.isDate;
                isNumber = args.isNumber;
            } else {
                und = true;
                isNumber = false;
                isDate = false;
            }

            if (und) {
                sarr.push({
                    text: 0,
                    formulas: 0,
                    tmp: "",
                    type: "other",
                });
            }
        });

        return {
            isDate: isDate, isNumber: isNumber, sarr
        }
    }

    calcNumberCellByTopCell(ncell, diffValue, darr, d, what, cb) {
        let {text, formulas} = ncell;
        text = this.toString(text);
        formulas = this.toString(formulas);
        let cell = {};
        if (this.isFormula(formulas)) {
            let last1 = text.replace("=", "") * 1;

            let value = last1 + diffValue;
            cell = {
                "text": "=" + value + "",
                "formulas": "=" + value + "",
            };
        } else if (text !== '') {
            let last1 = text * 1;
            if (text.indexOf(",") !== -1) {
                last1 = last1.replace(/,/g, '');
                let value = parseFloat(last1) + diffValue;
                last1 = this.formatMoney(value, 0);
            } else {
                last1 = last1 + diffValue;
            }

            cell = {
                "text": last1 + "",
                "formulas": last1 + "",
            };
        }

        this.copyRender(darr, d.ri, d.ci, cell, what, cb);
    }

    calcFormulaCellByTopCell(iText, darr, d, direction, isAdd, cb) {
        let strList = splitStr(iText);
        let args = this.getRangeByTopCell({ri: d.ri, ci: d.ci}, direction, isAdd);
        let dci = d.ri - args.ri;
        let dri = d.ci - args.ci;
        let {bad, result} = this.getCellTextByShift(strList, dri, dci);
        this.updateCellReferenceByShift(bad, result, d.ri, d.ci, cb);
    }

    calcCellByTopCell(cb, what, ncell, darr, isAdd, iText, d, text) {

        if (!isHave(iText)) {
            iText = "";
        }
        if (!isNaN(iText)) {
            ncell.text = iText;
            ncell.formulas = ncell.text;
        } else {
            let arr = this.toString(iText).split(/\d+/g);
            if (arr) {
                let count = 0;
                if (isAdd) {
                    ncell.text = iText.replace(/\d+/g, (word) => {
                        count = count + 1;
                        if (arr.length - 1 === count) {
                            return word * 1 + 1;
                        } else {
                            return word;
                        }
                    });
                } else {
                    ncell.text = iText.replace(/\d+/g, (word) => {
                        count = count + 1;
                        if (arr.length - 1 === count) {
                            return word * 1 - 1;
                        } else {
                            return word;
                        }
                    });
                }
                ncell.formulas = ncell.text;
            }
        }
        this.copyRender(darr, d.ri, d.ci, ncell, what, cb);
    }

    calcDateCellByTopCell(ncell, darr, d, isAdd, what, cb, diff) {
        if (ncell.text !== '') {
            let last1 = ncell.text;

            let value = "";
            if (isAdd) {
                value = dayjs(last1).add(diff, 'day').format('YYYY-MM-DD');
            } else {
                value = dayjs(last1).add(diff, 'day').format('YYYY-MM-DD');
            }
            ncell.text = this.toString(value);
            ncell.formulas = this.toString(value);
            this.copyRender(darr, d.ri, d.ci, ncell, what, cb);
        }
    }

    getRangeByTopCell({ri, ci}, direction, isAdd) {
        if (isAdd) {
            ri = !direction ? ri - 1 : ri;
            ci = !direction ? ci : ci - 1;
        } else {
            ri = !direction ? ri + 1 : ri;
            ci = !direction ? ci : ci + 1;
        }

        return {ri, ci};
    }

    // logProxy.log({"msg":"12312"})  console.log --> logProxy.log
    getCellByTopCell(d, direction, isAdd, what = 'all', dri = 0, dci = 0) {
        if (what === 'date') {
            if (direction === 1) {
                let {ri, ci} = this.getRangeByTopCell({ri: isAdd ? d.ri - dri : d.ri + dri, ci: d.ci}, false, isAdd);
                return this.getCellByCell(ri, ci);
            } else if (direction === 2) {
                return this.getCellByCell(d.ri, d.ci - 1);
            } else if (direction === 3) {
                return this.getCellByCell(d.ri, d.ci + 1);
            }
        } else {
            let {ri, ci} = this.getRangeByTopCell({ri: isAdd ? d.ri - dri : d.ri + dri, ci: d.ci}, direction, isAdd);
            return this.getCellByCell(ri, ci);
        }
    }

    getCellByCell(ri, ci) {
        let ncell = this.getCell(ri, ci);
        if (!ncell) {
            ncell = {
                text: '',
                formulas: '',
            }
        }

        return cloneDeep(ncell);
    }

    updateCellReferenceByShift(bad, result, ri, ci, cb = () => {
    }) {
        let _cell = {};
        if (bad) {
            _cell.text = "#REF!";
            _cell.formulas = "#REF!";
        } else {
            _cell.text = result !== "" ? result : '';
            _cell.formulas = result !== "" ? result : '';
        }
        // rows.setCellText(ri, ci, {text, style}, proxy, this.name, 'style');
        this.setCell(ri, ci, _cell, 'all');
        cb(ri, ci, _cell);
    }

    // what: all | format | text
    // 填充
    copyPaste(srcCellRange, dstCellRange, what, autofill = false, cb = () => {
    }) {
        const {pasteProxy} = this;
        pasteProxy.setSrcAndDstCellRange(srcCellRange, dstCellRange);
        let {rn, cn} = pasteProxy.use();
        let isLeftRight = pasteProxy.autoFilterDirection();

        let len = isLeftRight ? rn : cn;
        for (let i = 0; i < len; i++) {
            let isDown = pasteProxy.upOrDown();
            let {srcOneDRange, dstOneDRange} = pasteProxy.getOneDRangeObj(isLeftRight, i);
            let {isNumber, isDate, sarr} = this.getAllDataType(srcOneDRange);
            // let isCopy = pasteProxy.isCopy(sarr, i);

            let darr = dstOneDRange.getLocationArray(sarr); //let dstOneDLocationAarray = dstOneDRange.getLocationArray()
            let line = pasteProxy.leftOrRight(); // 向左或者向右
            let other = false;

            for (let i = 0; i < darr.length; i++) {
                let d = darr[i];
                if (isNumber || d.type === 'number' || isDate || d.type === 'date') {
                    other = true;
                }
            }

            if (isDown) {
                for (let i = 0; i < darr.length; i++) {
                    let d = darr[i];
                    if (isNumber || d.type === 'number') {
                        let diffValue = pasteProxy.calcDiff(sarr, isDown);
                        numberAutoFilter.call(this, darr[i], darr, isLeftRight, isDown, diffValue, what, cb, isNumber);
                    } else if (isDate || d.type === 'date') {
                        dateAutoFilter.call(this, darr[i], line, isDown, darr, what, cb, isDate);
                    } else {
                        otherAutoFilter.call(this, darr[i], darr, isLeftRight, isDown, what, cb, other, sarr.length - 1);
                    }
                }
            } else {
                for (let i = darr.length - 1; i >= 0; i--) {
                    let d = darr[i];
                    if (isNumber || d.type === 'number') {
                        let diffValue = pasteProxy.calcDiff(sarr, isDown);
                        numberAutoFilter.call(this, darr[i], darr, isLeftRight, isDown, diffValue, what, cb, isNumber);
                    } else if (isDate || d.type === 'date') {
                        dateAutoFilter.call(this, darr[i], line, isDown, darr, what, cb, isDate);
                    } else {
                        otherAutoFilter.call(this, darr[i], darr, isLeftRight, isDown, what, cb, other, sarr.length - 1);
                    }
                }
            }
        }
    }


    copyRender(darr, nri, nci, ncell, what, cb) {
        let as = false;
        for (let k = 0; as === false && k < darr.length; k++) {
            if (darr[k].ri === nri && darr[k].ci === nci) {
                as = true;
            }
        }
        if (as) {
            this.setCell(nri, nci, ncell, what);
            cb(nri, nci, ncell);
        }
    }

    cutPaste(srcCellRange, dstCellRange) {
        let srcCell = [];
        // const ncellmm = {};
        this.each((ri) => {
            this.eachCells(ri, (ci) => {
                let nri = parseInt(ri, 10);
                let nci = parseInt(ci, 10);
                if (srcCellRange.includes(ri, ci)) {
                    nri = dstCellRange.sri + (nri - srcCellRange.sri);
                    nci = dstCellRange.sci + (nci - srcCellRange.sci);
                }

                if (ri * 1 !== nri || ci * 1 !== nci) {
                    // ncellmm[nri] = ncellmm[nri] || {cells: {}};
                    if (this._[ri].cells[ci].text !== '' && this._[ri].cells[ci].formulas !== '') {
                        srcCell.push({
                            nri: nri,
                            nci: nci,
                            ri: ri,
                            ci: ci,
                            cell: deepCopy(this._[ri].cells[ci]),
                        })
                        // this.setCell(nri, nci, this._[ri].cells[ci], 'all');
                    }

                    // if (this._[ri].cells[ci].style) {
                    //     this.setCell(nri, nci, this._[ri].cells[ci], 'all');
                    // }
                }
            });
        });
        for (let i = 0; i < srcCell.length; i++) {
            let {ri, ci} = srcCell[i];
            this.setCell(ri, ci, {}, 'all');
        }

        for (let i = 0; i < srcCell.length; i++) {
            let {nri, nci, cell} = srcCell[i];
            this.setCell(nri, nci, cell, 'all');
        }

        // this._ = ncellmm;
    }

    insert(sri, n = 1) {
        const ndata = {};
        let cells = [];
        this.each((ri, row) => {
            let nri = parseInt(ri, 10);
            if (nri >= sri) {
                nri += n;
                this.eachCells(ri, (ci, cell) => {
                    if (isHave(cell) && isHave(cell.formulas) && this.isFormula(cell.formulas)) {
                        let {bad, result, enter} = this.getCellTextByShift(splitStr(cell.formulas), 0, n, true, true, sri, true);
                        if (enter && !bad) {
                            cells.push({ri: nri, ci: ci, cell: {text: result, formulas: result}});
                        }
                    }
                });
            }

            ndata[nri] = row;
        });

        this._ = ndata;
        for (let i = 0; i < cells.length; i++) {
            let {ri, ci, cell} = cells[i];
            this.setCell(ri, ci, cell, 'all');
        }
        this.len += n;
    }

    delete(sri, eri) {
        const n = eri - sri + 1;
        const ndata = {};
        let cells = [];
        this.each((ri, row) => {
            const nri = parseInt(ri, 10);
            if (nri < sri) {
                ndata[nri] = row;
            } else if (ri > eri) {
                ndata[nri - n] = row;

                this.eachCells(ri, (ci, cell) => {
                    if (isHave(cell) && isHave(cell.formulas) && this.isFormula(cell.formulas)) {
                        let {bad, result, enter} = this.getCellTextByShift(splitStr(cell.formulas), 0, n * -1, true, false, sri, true);
                        if (enter && !bad) {
                            cells.push({ri: nri - n, ci: ci, cell: {text: result, formulas: result}});
                        }
                    }
                });
            }
        });
        this._ = ndata;
        for (let i = 0; i < cells.length; i++) {
            let {ri, ci, cell} = cells[i];
            this.setCell(ri, ci, cell, 'all');
        }
        this.len -= n;
    }

    insertColumn(sci, n = 1) {
        let cells = [];
        this.each((ri, row) => {
            const rndata = {};
            this.eachCells(ri, (ci, cell) => {
                let nci = parseInt(ci, 10);
                if (nci >= sci) {
                    nci += n;

                    if (isHave(cell) && isHave(cell.formulas) && this.isFormula(cell.formulas)) {
                        let {bad, result, enter} = this.getCellTextByShift(splitStr(cell.formulas), n, 0, true, true, sci, false);
                        if (enter && !bad) {
                            cells.push({ri: ri, ci: nci, cell: {text: result, formulas: result}});
                        }
                    }
                }
                rndata[nci] = cell;
            });
            row.cells = rndata;
        });

        for (let i = 0; i < cells.length; i++) {
            let {ri, ci, cell} = cells[i];
            this.setCell(ri, ci, cell, 'all');
        }
    }

    deleteColumn(sci, eci) {
        const n = eci - sci + 1;
        this.each((ri, row) => {
            const rndata = {};
            this.eachCells(ri, (ci, cell) => {
                const nci = parseInt(ci, 10);
                if (nci < sci) {
                    rndata[nci] = cell;
                } else if (nci > eci) {
                    rndata[nci - n] = cell;
                }
            });
            row.cells = rndata;
        });
    }

    // what: all | text | format | merge
    deleteCells(cellRange, what = 'all') {
        cellRange.each((i, j) => {
            this.deleteCell(i, j, what);
        });
    }

    // what: all | text | format | merge
    deleteCell(ri, ci, what = 'all') {
        const row = this.get(ri);
        if (row !== null) {
            const cell = this.getCell(ri, ci);
            if (cell !== null) {
                if (what === 'all') {
                    delete row.cells[ci];
                } else if (what === 'text') {
                    if (isHave(cell.text)) delete cell.text;
                    if (isHave(cell.value)) delete cell.value;
                    if (isHave(cell.formulas)) delete cell.formulas;
                    // if (isHave(cell.depend)) delete cell.depend;
                } else if (what === 'format') {
                    if (cell.style !== undefined) delete cell.style;
                    if (cell.merge) delete cell.merge;
                } else if (what === 'merge') {
                    if (cell.merge) delete cell.merge;
                }
            }
        }
    }

    each(cb) {
        Object.entries(this._).forEach(([ri, row]) => {
            cb(ri, row);
        });
    }

    eachCells(ri, cb) {
        if (this._[ri] && this._[ri].cells) {
            Object.entries(this._[ri].cells).forEach(([ci, cell]) => {
                cb(ci, cell);
            });
        }
    }

    recast(cell) {
        try {
            if (this.isReferOtherSheet(cell, true)) {
                let recast = new Recast(cell.formulas);
                recast.parse();
                cell['recast'] = recast;
            } else {
                cell['recast'] = null;
            }
        } catch (e) {
            cell['recast'] = null;
        }
    }

    init() {
        this.each((ri) => {
            this.eachCells(ri, (ci) => {
                this.getDependCell(xy2expr(ci, ri), this.getCell(ri, ci));
            });
        });
    }

    setData(d, sheet = "", out = false, rowsInit = false) {
        try {
            if (d.len) {
                this.len = d.len;
                delete d.len;
            }
            this._ = d;


            if (out) {

            } else if (sheet !== '') {
                console.time("setData");
                if (rowsInit) {
                    this.init();
                    sheet.toolbar.change('close', '');
                }
                console.timeEnd("setData");

            }
        } catch (e) {
            console.error(e);
        }
    }

    getData() {
        const {len} = this;
        return Object.assign({len}, this._);
    }
}

export {
    Rows,
};
