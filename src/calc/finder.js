"use strict";
import PreAction from '../model/pre_action';

exports.find_all_cells_with_formulas = function(wb, exec_formula) {
    let formula_ref = {};
    let cells = [];
    for (let sheet_name in wb.Sheets) {
        let sheet = wb.Sheets[sheet_name];
        for (let cell_name in sheet) {
            if (sheet[cell_name] && sheet[cell_name].f) {
                let formula = formula_ref[sheet_name + '!' + cell_name] = {
                    formula_ref: formula_ref,
                    wb: wb,
                    sheet: sheet,
                    sheet_name: sheet_name,
                    cell: sheet[cell_name],
                    name: cell_name,
                    status: 'new',
                    exec_formula: exec_formula
                };
                cells.push(formula);
            }
        }
    }
    return cells;
};

exports.find_all_need_calc_cell = function (wb, rows, tileArr, exec_formula) {
    console.log("find_all_need_calc_cell");
    console.assert(tileArr instanceof PreAction)
    var need_calc_cells = tileArr.findAllNeedCalcCell();
    let formula_ref = {};
    let cells = [];
    for (let sheet_name in wb.Sheets) {
        let sheet = wb.Sheets[sheet_name];
        for(let i=0; i<need_calc_cells.length; i++){
            let cell_name = need_calc_cells[i];
            let cell = sheet[cell_name];
            let formula = formula_ref[sheet_name + '!' + cell_name] = {
                formula_ref: formula_ref,
                wb: wb,
                sheet: sheet,
                sheet_name: sheet_name,
                cell: cell,
                name: cell_name,
                status: 'new',
                exec_formula: exec_formula
            };
            cells.push(formula);
        }
    }
    return cells;
};
