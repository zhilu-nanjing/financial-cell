"use strict";

const int_2_col_str = require('./expression/int_2_col_str.js');
const col_str_2_int = require('./expression/col_str_2_int.js');
const exec_formula = require('./cell_formula/exec_formula.js');
const finder = require('./calc_cmd/finder');
const Calculator = require('./calc_cmd/Calculator.js');
const CellFormulaProxy = require('./cell_formula/cellFormulaProxy.js');
const checker = require('./cell_formula/formula_check.js');
const helper = require("../core/helper");
const CalcWorkBook = require('./calc_cmd/CalcWorkBook');
const Rows2Workbook = require('./calc_cmd/row2workbook').Rows2Workbook;

function calculateFormulas(formulas) { // 核心的计算引擎 formulas是数组，应该转化为cellFormula类。
    for (let i = formulas.length - 1; i >= 0; i--) { // 遍历所有需要计算的formulas; 从后向前遍历
        try {
            let curCellFormula = formulas[i];
            if (!helper.isHave(curCellFormula.cell)) {//如果该单元格为空，设置f,v为空
                curCellFormula.cell = {
                    'f': '',
                    'v': ''
                };
            }
            let valid_res = curCellFormula.check_valid(); // 确定是否是合法公式
            if (valid_res !== true) {//如果公式不合法，将公式值设为相应值
                curCellFormula.cell.v = valid_res;
            } else {
                //对cell和sheet进行处理和转换({}参数加上'',未定义单元格置为default_0等)，计算完成后需将多余变动部分还原
                curCellFormula.pre_process_formula(null);
                checker.trans_sheet(curCellFormula.sheet); // 转化sheet
                exec_formula(curCellFormula); // 执行公式
                curCellFormula.cell.f = curCellFormula.recover_formula(); // 还原
                checker.recover_sheet(curCellFormula.sheet); // 还原
            }
        } catch (e) {
            console.log(e);
        }
    }
}

export function calc(rows, tileArr) {
    if (helper.isHave(tileArr)){
        if (tileArr.action.indexOf("删除")>=0){ // 删除时同步workbook
            rows.workbook= Rows2Workbook(rows); // 转化一次
        }
        let Calc_WorkBook = new CalcWorkBook(rows, tileArr);
        let workbook = rows.workbook;
        workbook = Calc_WorkBook.get_workbook(workbook);
        let formulas = finder.find_all_need_calc_cell(workbook, tileArr, exec_formula);//找到所有需要计算的单元格
        calculateFormulas(formulas);
        Calc_WorkBook.calcDoneToSetCells(workbook, rows) // 把workbook的值再转化为rows的形式
    }
}

let calculateWorkbook = function(workbook) {
    let formulaArray = finder.find_all_cells_with_formulas(workbook, exec_formula);//找到所有需要计算的单元格
    calculateFormulas(formulaArray); // 计算所有的formulas
};


calc.calculator = function calculator(workbook) {
    return new Calculator(workbook, exec_formula);
};

calc.set_fx = exec_formula.set_fx;
calc.exec_fx = exec_formula.exec_fx;
calc.col_str_2_int = col_str_2_int;
calc.int_2_col_str = int_2_col_str;
calc.import_functions = exec_formula.import_functions;
calc.import_raw_functions = exec_formula.import_raw_functions;
calc.xlsx_Fx = exec_formula.xlsx_Fx;
calc.localizeFunctions = exec_formula.localizeFunctions;
// calc.XLSX_CALC = calc
calc.calculateWorkBook = calculateWorkbook;
