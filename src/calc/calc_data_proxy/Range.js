"use strict";

import {col_str_2_int} from '../../helper/calc_helper.js'
import {getSanitizedSheetName} from '../calc_utils/get_sheetname.js'
import {ERROR_CIRCULAR} from '../calc_utils/error_config.js'
import { int_2_col_str } from '../../helper/calc_helper';
import { FORMULA_STATUS } from '../calc_utils/config';

export class Range{
    constructor(str_expression, formulaProxy, position_i){
        let range_expression, sheet_name, sheet;
        this.start_pst = position_i - str_expression.length;
        this.end_pst = position_i;

        if (str_expression.indexOf('!') !== -1) {
            let aux = str_expression.split('!');
            sheet_name = getSanitizedSheetName(aux[0]);
            range_expression = aux[1];
            this.range_start_pst = position_i - aux[1].length
        }
        else {
            sheet_name = formulaProxy.sheet_name;
            range_expression = str_expression;
            this.range_start_pst = this.start_pst

        }
        this.sheet = formulaProxy.workbookProxy.Sheets[sheet_name];
        this.range_expression = range_expression;
        this.sheet_name = sheet_name;
        this.formula = formulaProxy

    }
    solveExpression(){
        let sheet_name = this.sheet_name;
        let sheet = this.sheet;
        let range_expression = this.range_expression;
        let formula = this.formula;
        let arr = range_expression.split(':');
        let min_row = parseInt(arr[0].replace(/^[A-Z]+/, ''), 10) || 0;
        let str_max_row = arr[1].replace(/^[A-Z]+/, '');
        let max_row;
        if (str_max_row === '' && sheet['!ref']) {
            str_max_row = sheet['!ref'].split(':')[1].replace(/^[A-Z]+/, '');
        }
        // the max is 1048576, but TLE
        max_row = parseInt(str_max_row === '' ? '500000' : str_max_row, 10);
        let min_col = col_str_2_int(arr[0]);
        let max_col = col_str_2_int(arr[1]);
        let matrix = [];
        for (let i = min_row; i <= max_row; i++) {
            let row = [];
            matrix.push(row);
            for (let j = min_col; j <= max_col; j++) {
                let cell_name = int_2_col_str(j) + i;
                let cell_full_name = sheet_name + '!' + cell_name;
                if (formula.formula_ref[cell_full_name]) {
                    if (formula.formula_ref[cell_full_name].status === FORMULA_STATUS.new) {
                        formula.formulaExecutor(formula.formula_ref[cell_full_name]); // todo: 这个语句需要修正
                    }
                    else if (formula.formula_ref[cell_full_name].status === FORMULA_STATUS.working) {
                        throw new Error(ERROR_CIRCULAR);
                    }
                    if (sheet[cell_name].t === 'e') {
                        row.push(sheet[cell_name]);
                    }
                    else {
                        row.push(sheet[cell_name].v);
                    }
                }
                else if (sheet[cell_name]) {
                    if (sheet[cell_name].t === 'e') {
                        row.push(sheet[cell_name]);
                    }
                    else {
                        row.push(sheet[cell_name].v);
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

