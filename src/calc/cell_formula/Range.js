"use strict";

const col_str_2_int = require('../helper/col_str_2_int.js');
const int_2_col_str = require('../helper/int_2_col_str.js');
const getSanitizedSheetName = require('../getSanitizedSheetName.js');

class Range{
    constructor(str_expression, formula, possition_i){
        var range_expression, sheet_name, sheet;
        this.start_pst = possition_i - str_expression.length
        this.end_pst = possition_i

        if (str_expression.indexOf('!') != -1) {
            var aux = str_expression.split('!');
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
        this.range_expression = range_expression
        this.sheet_name = sheet_name
        this.formula = formula

    }
    calc(){
        let sheet_name = this.sheet_name
        let sheet = this.sheet
        let range_expression = this.range_expression
        let formula = this.formula
        var arr = range_expression.split(':');
        var min_row = parseInt(arr[0].replace(/^[A-Z]+/, ''), 10) || 0;
        var str_max_row = arr[1].replace(/^[A-Z]+/, '');
        var max_row;
        if (str_max_row === '' && sheet['!ref']) {
            str_max_row = sheet['!ref'].split(':')[1].replace(/^[A-Z]+/, '');
        }
        // the max is 1048576, but TLE
        max_row = parseInt(str_max_row == '' ? '500000' : str_max_row, 10);
        var min_col = col_str_2_int(arr[0]);
        var max_col = col_str_2_int(arr[1]);
        var matrix = [];
        for (var i = min_row; i <= max_row; i++) {
            var row = [];
            matrix.push(row);
            for (var j = min_col; j <= max_col; j++) {
                var cell_name = int_2_col_str(j) + i;
                var cell_full_name = sheet_name + '!' + cell_name;
                if (formula.formula_ref[cell_full_name]) {
                    if (formula.formula_ref[cell_full_name].status === 'new') {
                        formula.exec_formula(formula.formula_ref[cell_full_name]);
                    }
                    else if (formula.formula_ref[cell_full_name].status === 'working') {
                        throw new Error('Circular ref');
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

module.exports = Range
//     function Range(str_expression, formula) { // 这是一个Range 类; 把信息都封装到calc方法里面
//     var range_expression, sheet_name, sheet;
//     if (str_expression.indexOf('!') != -1) {
//         var aux = str_expression.split('!');
//         sheet_name = getSanitizedSheetName(aux[0]);
//         range_expression = aux[1];
//     }
//     else {
//         sheet_name = formula.sheet_name;
//         range_expression = str_expression;
//     }
//     sheet = formula.wb.Sheets[sheet_name];
//     this.range_expression = range_expression
//     this.sheet_name = sheet_name
//     console.log(this.range_expression)
//
//     this.calc = function() {
//         var arr = range_expression.split(':');
//         var min_row = parseInt(arr[0].replace(/^[A-Z]+/, ''), 10) || 0;
//         var str_max_row = arr[1].replace(/^[A-Z]+/, '');
//         var max_row;
//         if (str_max_row === '' && sheet['!ref']) {
//             str_max_row = sheet['!ref'].split(':')[1].replace(/^[A-Z]+/, '');
//         }
//         // the max is 1048576, but TLE
//         max_row = parseInt(str_max_row == '' ? '500000' : str_max_row, 10);
//         var min_col = col_str_2_int(arr[0]);
//         var max_col = col_str_2_int(arr[1]);
//         var matrix = [];
//         for (var i = min_row; i <= max_row; i++) {
//             var row = [];
//             matrix.push(row);
//             for (var j = min_col; j <= max_col; j++) {
//                 var cell_name = int_2_col_str(j) + i;
//                 var cell_full_name = sheet_name + '!' + cell_name;
//                 if (formula.formula_ref[cell_full_name]) {
//                     if (formula.formula_ref[cell_full_name].status === 'new') {
//                         formula.exec_formula(formula.formula_ref[cell_full_name]);
//                     }
//                     else if (formula.formula_ref[cell_full_name].status === 'working') {
//                         throw new Error('Circular ref');
//                     }
//                     if (sheet[cell_name].t === 'e') {
//                         row.push(sheet[cell_name]);
//                     }
//                     else {
//                         row.push(sheet[cell_name].v);
//                     }
//                 }
//                 else if (sheet[cell_name]) {
//                     if (sheet[cell_name].t === 'e') {
//                         row.push(sheet[cell_name]);
//                     }
//                     else {
//                         row.push(sheet[cell_name].v);
//                     }
//                 }
//                 else {
//                     row.push(null);
//                 }
//             }
//         }
//         return matrix;
//     };
// };
