"use strict";

const int_2_col_str = require('./int_2_col_str.js');
const col_str_2_int = require('./col_str_2_int.js');
const exec_formula = require('./exec_formula.js');
const find_all_need_calc_cell = require('./find_all_cells_with_formulas.js');
const Calculator = require('./Calculator.js');
const CalcCell = require('./CalcCell.js');
const checker = require('./formula_check.js');
const helper = require("../core/helper");
const CalcWorkBook = require('./CalcWorkBook')
const es6 = require('./es6');
var mymodule = function(rows, tileArr) {
    console.log(es6);
    if (helper.isHave(tileArr)){
        var Calc_WorkBook = new CalcWorkBook(rows, tileArr)
        var workbook = rows.workbook
        workbook = Calc_WorkBook.get_workbook(workbook)
        var formulas = find_all_need_calc_cell(workbook, tileArr, exec_formula)
        for (var i = formulas.length - 1; i >= 0; i--) {
            try {
                var calc_cell = new CalcCell(formulas[i], rows)
                var valid_res = calc_cell.check_valid()
                if (valid_res !== true){
                    formulas[i].cell.v = valid_res
                }else{
                    //对cell和sheet进行处理和转换({}参数加上'',未定义单元格置为default_0等)，计算完成后需将多余变动部分还原
                    formulas[i].cell.f = calc_cell.trans_formula()
                    checker.trans_sheet(formulas[i].sheet)
                    exec_formula(formulas[i]);
                    formulas[i].cell.f = calc_cell.recover_formula()
                    checker.recover_sheet(formulas[i].sheet)
                }
                //如果是多值单元格或公式返回结果为array，进入多单元格处理
                if (Calc_WorkBook.is_muti_cell(formulas[i]) || Array.isArray(formulas[i].cell.v)){
                    Calc_WorkBook.deal_muti_cell(workbook, formulas[i])
                }
            } catch (e) {
                console.log(e)
            }
        }
        Calc_WorkBook.calcDoneToSetCells(workbook, rows)
    }

};

mymodule.calculator = function calculator(workbook) {
    return new Calculator(workbook, exec_formula);
};

mymodule.set_fx = exec_formula.set_fx;
mymodule.exec_fx = exec_formula.exec_fx;
mymodule.col_str_2_int = col_str_2_int;
mymodule.int_2_col_str = int_2_col_str;
mymodule.import_functions = exec_formula.import_functions;
mymodule.import_raw_functions = exec_formula.import_raw_functions;
mymodule.xlsx_Fx = exec_formula.xlsx_Fx;
mymodule.localizeFunctions = exec_formula.localizeFunctions;

mymodule.XLSX_CALC = mymodule

module.exports = mymodule;
