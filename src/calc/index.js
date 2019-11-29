"use strict";

const int_2_col_str = require('./helper/int_2_col_str.js');
const col_str_2_int = require('./helper/col_str_2_int.js');
const exec_formula = require('./exec_formula.js');
const finder = require('./finder');
const Calculator = require('./Calculator.js');
const CalcCell = require('./CalcCell.js');
const checker = require('./cell_formula/formula_check.js');
const helper = require("../core/helper")
const CalcWorkBook = require('./CalcWorkBook')
const utils = require('./helper/utils')
var mymodule = function(rows, tileArr) {
    if (helper.isHave(tileArr)){
        if (tileArr.action.indexOf("删除")>=0){ // 删除时同步workbook
            rows.workbook= utils.Rows2Workbook(rows); // 转化一次
        }
        var Calc_WorkBook = new CalcWorkBook(rows, tileArr)
        var workbook = rows.workbook
        workbook = Calc_WorkBook.get_workbook(workbook)
        var formulas = finder.find_all_need_calc_cell(workbook, tileArr, exec_formula)//找到所有需要计算的单元格
        for (var i = formulas.length - 1; i >= 0; i--) {
            try {
                if(!helper.isHave(formulas[i].cell)){//如果该单元格为空，设置f,v为空
                    formulas[i].cell = {
                        "f": "",
                        "v": ""
                    }
                }
                var calc_cell = new CalcCell(formulas[i])
                var valid_res = calc_cell.check_valid()
                if (valid_res !== true){//如果公式不合法，将公式值设为相应值
                    formulas[i].cell.v = valid_res
                }else{
                    //对cell和sheet进行处理和转换({}参数加上'',未定义单元格置为default_0等)，计算完成后需将多余变动部分还原
                    formulas[i].cell.f = calc_cell.trans_formula(rows)
                    checker.trans_sheet(formulas[i].sheet)
                    exec_formula(formulas[i]);
                    formulas[i].cell.f = calc_cell.recover_formula()
                    checker.recover_sheet(formulas[i].sheet)
                }
            } catch (e) {
                console.log(e)
            }
        }
        Calc_WorkBook.calcDoneToSetCells(workbook, rows)
    }

};

var test = function(workbook) { //公式模块测试
    var formulas = finder.find_all_cells_with_formulas(workbook, exec_formula)//找到所有需要计算的单元格
    for (var i = formulas.length - 1; i >= 0; i--) {
        try {
            if(!helper.isHave(formulas[i].cell)){//如果该单元格为空，设置f,v为空
                formulas[i].cell = {
                    "f": "",
                    "v": ""
                }
            }
            var calc_cell = new CalcCell(formulas[i])
            var valid_res = calc_cell.check_valid()
            if (valid_res !== true){//如果公式不合法，将公式值设为相应值
                formulas[i].cell.v = valid_res
            }else{
                //对cell和sheet进行处理和转换({}参数加上'',未定义单元格置为default_0等)，计算完成后需将多余变动部分还原
                formulas[i].cell.f = calc_cell.trans_formula(null)
                checker.trans_sheet(formulas[i].sheet)
                exec_formula(formulas[i]);
                formulas[i].cell.f = calc_cell.recover_formula()
                checker.recover_sheet(formulas[i].sheet)
            }
        } catch (e) {
            console.log(e)
        }
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
mymodule.CALC_TEST = test

module.exports = mymodule;
