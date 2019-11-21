import {isHave} from "./helper";
import {isFormula} from "./row";

export default class CellProxy {
    constructor(cell) {
        this.cell = cell;
    }

    renderFormat(style, nrindex, cindex, data, filter) {
        if(isHave(style) === false || isHave(style.format) === false) {
            return {
                "cellText": "",
                "state": false,
            };
        }

        let {cell} = this;
        let cellText = "";
        if (style.format) {
            // console.log(data.formatm, '>>', cell.format);
            let formatInfo = data.tryParseToNum(cell, nrindex, cindex);
            if(formatInfo.state) {
                if(filter) {
                    if((formatInfo.style === 'date' || formatInfo.style === 'datetime')) {
                        cellText = formatInfo.text;
                    } else {
                        formatInfo.state = false;
                    }
                }  else {
                    cellText = formatInfo.text;
                }
            } else {
                if( isHave(cell.text) === false) {
                    cell.text = "";
                }
                cellText = cell.text;
            }
            return {
                "cellText": cellText,
                "state": formatInfo.state,
            };
        }
        return {
            "cellText": cellText,
            "state": false,
        };
    }

    getCellDataType(sarr, {isDate, isNumber}) {
        let ncell = this.cell;
        // let enter = false;
        let nA = true;


        if (!isHave(ncell.formulas)) {
            ncell.formulas = "";
        }
        if (!isHave(ncell.text)) {
            ncell.text = "";
        }

        let value = ncell.formulas !== "" ? ncell.formulas + "" : ncell.text + "";
        // value = value.replace(/,/g, "").replace("=", "");
        value = value.replace(/,/g, "");        // =123 不要把=扔掉
        let ns = value * 1;

        if ((ns || ns == 0) && typeof ns === 'number' && !isNaN(ns) && /^\d+$/.test(value) === true) {
            if(isNumber == true) {
                isNumber = true;
                nA = false;
                isDate = false;
            } else {
                nA = false;
                isNumber = false;
                isDate = false;
            }
            ncell.type = 'number';
        } else if (value && nA == true && isFormula(value)) {
            nA = true;
            isNumber = false;
            isDate = false;
            ncell.type = 'na';
        } else if (value && value.search(/((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/ig, '') != -1) {
            if( isDate == true) { // jobs: todo: 正则表达式应该集中管理。而且这个正则表达式太复杂了，应该能简化。
                nA = false;
                isNumber = false;
                isDate = true;
            } else {
                nA = false;
                isNumber = false;
                isDate = false;
            }
            ncell.type = 'date';
        } else {//
            nA = false;
            isNumber = false;
            isDate = false;
            ncell.type = 'other';
        }
        ncell.tmp = value;
        sarr.push(ncell);

        return {
            nA, isDate: isDate, isNumber: isNumber
        }
    }
}
