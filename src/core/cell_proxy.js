import {isHave} from "./helper";
import {isFormula} from "./row";
import {datePattern2, str2Re} from "../utils/reg_pattern";

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

        if ((ns || ns === 0) && typeof ns === 'number' && !isNaN(ns) && /^\d+$/.test(value) === true) {
            if(isNumber === true) {
                isNumber = true;
                nA = false;
                isDate = false;
            } else {
                nA = false;
                isNumber = false;
                isDate = false;
            }
            ncell.type = 'number';
        } else if (value && nA === true && isFormula(value)) {
            nA = true;
            isNumber = false;
            isDate = false;
            ncell.type = 'na';
        } else if (value && value.search(str2Re(datePattern2), '') !== -1) {
            if( isDate === true) {
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
