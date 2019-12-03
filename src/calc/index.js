"use strict";
import CalcWorkBook from './calc_cmd/CalcWorkBook' // todo: 需要跟陶涛商量好，让是如何调用的
import Calculator from './calc_cmd/Calculator.js'
import {find_all_cells_with_formulas, find_all_need_calc_cell} from './calc_cmd/finder'


import {FormulaExecutor} from './calc_data_proxy/formula_executor.js'
import checker from './cell_formula/formula_check.js'
import {isValueValid} from "../core/helper"
import {Rows2Workbook} from './calc_cmd/row2workbook'

export class Calc{ // 整个模块对外服务的类
    constructor(){
        this.formulaExecutor = new FormulaExecutor()
    }
    calculateFormulas(formulas) { // 核心的计算引擎; formulas是数组，应该转化为cellFormula类。
        let formulaExecutor = this.formulaExecutor
        for (let i = formulas.length - 1; i >= 0; i--) { // 遍历所有需要计算的formulas; 从后向前遍历
            try {
                let curCellFormula = formulas[i];
                if (!isValueValid(curCellFormula.cell)) {//如果该单元格为空，设置f,v为空
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
                    formulaExecutor.execFormula(curCellFormula); // 执行公式
                    curCellFormula.cell.f = curCellFormula.recover_formula(); // 还原
                    checker.recover_sheet(curCellFormula.sheet); // 还原
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
    calcRows(rows, tileArr){
        if (isValueValid(tileArr)){
            if (tileArr.action.indexOf("删除")>=0){ // 删除时同步workbook
                rows.workbook= Rows2Workbook(rows); // 转化一次
            }
            let Calc_WorkBook = new CalcWorkBook(rows, tileArr);
            let workbook = rows.workbook;
            workbook = Calc_WorkBook.get_workbook(workbook);
            let formulas = find_all_need_calc_cell(workbook, tileArr, this.formulaExecutor.execFormula);//找到所有需要计算的单元格
            this.calculateFormulas(formulas);
            Calc_WorkBook.calcDoneToSetCells(workbook, rows) // 把workbook的值再转化为rows的形式
        }
    }
    calculator(workbook) {
        return new Calculator(workbook, this.formulaExecutor);
    };

    calculateWorkbook(workbook) {
        let formulaArray = find_all_cells_with_formulas(workbook, this.formulaExecutor.execFormula);//找到所有需要计算的单元格
        this.calculateFormulas(formulaArray); // 计算所有的formulas
    };

}
