"use strict";

import {col_str_2_int} from '../../helper/calc_helper.js'
import {getSanitizedSheetName} from '../calc_utils/get_sheetname.js'
import {ERROR_CIRCULAR} from '../calc_utils/error_config.js'
import { int_2_col_str } from '../../helper/calc_helper';
import { FORMULA_STATUS } from '../calc_utils/config';

/**
 * @property {CalcCell} calcCell
 * @property {CalcSheet} calcSheet
 */
export class Range{
    constructor(str_expression, calcCell, position_i){
        let range_expression, sheet_name, sheet;
        this.calcCell = calcCell
        this.start_pst = position_i - str_expression.length;
        this.end_pst = position_i;

        if (str_expression.indexOf('!') !== -1) {
            let aux = str_expression.split('!');
            sheet_name = getSanitizedSheetName(aux[0]);
            range_expression = aux[1];
            this.range_start_pst = position_i - aux[1].length
        }
        else {
            sheet_name = this.calcCell.calcSheet.name;
            range_expression = str_expression;
            this.range_start_pst = this.start_pst

        }
        this.calcSheet = this.calcCell.workbookProxy.getSheetByName(sheet_name);
        this.range_expression = range_expression;
        this.sheet_name = sheet_name; // 所属的sheet
    }
    solveExpression(){
        let sheet_name = this.sheet_name;
        let range_expression = this.range_expression;
        let arr = range_expression.split(':');
        let min_row = parseInt(arr[0].replace(/^[A-Z]+/, ''), 10) || 0;
        let str_max_row = arr[1].replace(/^[A-Z]+/, '');
        let max_row;
        // the max is 1048576, but TLE
        max_row = parseInt(str_max_row === '' ? '500000' : str_max_row, 10);
        let min_col = col_str_2_int(arr[0]);
        let max_col = col_str_2_int(arr[1]);
        let matrix = [];
        for (let i = min_row; i <= max_row; i++) { // 这里的i是row index， j 是col index
            let row = [];
            matrix.push(row);
            for (let j = min_col; j <= max_col; j++) {
                let cell_name = int_2_col_str(j) + i;
                let refCalcCell = this.calcCell.workbookProxy.getCellByName(sheet_name, cell_name)
                if (refCalcCell) { // 之前就已经存在这个cell了
                    if (refCalcCell.cellStatus === FORMULA_STATUS.created) {
                        refCalcCell.execFormula(); // 这一步出错
                    }
                    else if (refCalcCell.cellStatus === FORMULA_STATUS.working) {
                        throw new Error(ERROR_CIRCULAR);
                    }
                    if (refCalcCell.cellObj.t === 'e') { // 出现错误
                        row.push(refCalcCell.cellObj);
                    }
                    else {
                        row.push(refCalcCell.cellObj.v);
                    }
                }
                else {
                    row.push(null);
                }
            }
        }
        return matrix;

    }

}

