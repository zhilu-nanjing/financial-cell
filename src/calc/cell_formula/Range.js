"use strict";

const col_str_2_int = require('../calc_utils/col_str_2_int.js');
const int_2_col_str = require('../calc_utils/int_2_col_str.js');
const getSanitizedSheetName = require('../getSanitizedSheetName.js');
const error_cf = require('../calc_utils/error_config.js');

class Range{
    constructor(str_expression, formula, possition_i){
        let range_expression, sheet_name, sheet;
        this.start_pst = possition_i - str_expression.length;
        this.end_pst = possition_i;

        if (str_expression.indexOf('!') !== -1) {
            let aux = str_expression.split('!');
            sheet_name = getSanitizedSheetName(aux[0]);
            range_expression = aux[1];
            this.range_start_pst = possition_i - aux[1].length
        }
        else {
            sheet_name = formula.sheet_name;
            range_expression = str_expression;
            this.range_start_pst = this.start_pst

        }
        this.sheet = formula.wb.Sheets[sheet_name];
        this.range_expression = range_expression;
        this.sheet_name = sheet_name;
        this.formula = formula

    }
    calc(){
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
                    if (formula.formula_ref[cell_full_name].status === 'new') {
                        formula.exec_formula(formula.formula_ref[cell_full_name]);
                    }
                    else if (formula.formula_ref[cell_full_name].status === 'working') {
                        throw new Error(error_cf.ERROR_CIRCULAR);
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

module.exports = Range;
