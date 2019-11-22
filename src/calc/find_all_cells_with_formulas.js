"use strict";
module.exports = function find_all_need_calc_cell(wb, tileArr, exec_formula) {
    var need_calc_cells = tileArr.findAllNeedCalcCell()
    let formula_ref = {};
    let cells = [];
    for (let sheet_name in wb.Sheets) {
        let sheet = wb.Sheets[sheet_name];
        for(let i=0; i<need_calc_cells.length; i++){
            let cell_name = need_calc_cells[i]
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
    return cells;
};
