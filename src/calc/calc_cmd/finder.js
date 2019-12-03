"use strict";
import {CellFormulaProxy} from '../cell_formula/cellFormulaProxy.js'

export function find_all_cells_with_formulas(wb, exec_formula) {
    let formula_ref = {}; // 把workbook转化为formulas的形式
    let formulaArray = [];
    for (let sheet_name in wb.Sheets) {
        let sheet = wb.Sheets[sheet_name];
        for (let cell_name in sheet) {
            if (sheet[cell_name] && sheet[cell_name].f) { // 存在f属性，就会进来，放到formulaArray中
                let formula = formula_ref[sheet_name + '!' + cell_name] = new CellFormulaProxy(
                    wb,
                    sheet,
                    sheet_name,
                    sheet[cell_name],
                    formula_ref,
                    cell_name,
                    'new',
                     exec_formula,
                );
                formulaArray.push(formula);
            }
        }
    }
    return formulaArray;
};

export function find_all_need_calc_cell(wb, tileArr, exec_formula) { // todo: tileArr.findAllNeedCalcCell 应该返回workbook中多个sheet的变化结果； 需要筛选出那些需要重新计算的formulas
    console.log("find_all_need_calc_cell");
    let need_calc_cells = tileArr.findAllNeedCalcCell(); // 获取所有需要计算的单元格
    let formula_ref = {};
    let cells = [];
    for (let sheet_name in wb.Sheets) {
        let sheet = wb.Sheets[sheet_name]; // 当前的sheet
        for(let i=0; i<need_calc_cells.length; i++){
            let cell_name = need_calc_cells[i];
            let cell = sheet[cell_name];
            let formula = formula_ref[sheet_name + '!' + cell_name] = new CellFormulaProxy(
                  wb,
                  sheet,
                  sheet_name,
                  sheet[cell_name],
                  formula_ref,
                  cell_name,
                  'new',
                  exec_formula,
                );
            cells.push(formula);
        }
    }
    return cells;
};
