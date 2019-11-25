"use strict";
var exp = require("../core/alphabet");
var utils = require("./utils")
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
    var need_calc_cells = tileArr.findAllNeedCalcCell()
    let formula_ref = {};
    let cells = [];
    for (let sheet_name in wb.Sheets) {
        let sheet = wb.Sheets[sheet_name];
        for(let i=0; i<need_calc_cells.length; i++){
            let cell_name = need_calc_cells[i]
            let cell = sheet[cell_name]
            if (utils.isHave(cell) && utils.isHave(cell.clash_cells)){
                let clash_cells = cell.clash_cells
                for (let j=0;j<clash_cells.length;j++){
                    let clash_cell = formula_ref[sheet_name + '!' + clash_cells[j]] = {
                        formula_ref: formula_ref,
                        wb: wb,
                        sheet: sheet,
                        sheet_name: sheet_name,
                        cell: sheet[clash_cells[j]],
                        name: clash_cells[j],
                        status: 'new',
                        exec_formula: exec_formula
                    };
                    cells.push(clash_cell);
                }
            }
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
