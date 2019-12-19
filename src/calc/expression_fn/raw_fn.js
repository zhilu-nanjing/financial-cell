"use strict";
import {RawValue} from '../calc_data_proxy/syntax_unit_raw_value.js'
import {SUnitRangeRef} from '../calc_data_proxy/syntax_unit_range.js'
import {SUnitRefValue} from '../calc_data_proxy/syntax_unit_ref_value.js'
import { ColIndexProxy } from '../calc_data_proxy/col_index';

export function raw_offset(cell_ref, rows, columns, height, width) {
    height = (height || new RawValue(1)).solveExpression();
    width = (width || new RawValue(1)).solveExpression();
    if (cell_ref.args.length === 1 && cell_ref.args[0] instanceof SUnitRefValue) {
        let ref_value = cell_ref.args[0];
        let parsed_ref = ref_value.getRefCalcCell();
        let col = new ColIndexProxy(parsed_ref.cell_name).colNum + columns.solveExpression();
        let col_str = new ColIndexProxy(col).colStr;
        let row = +parsed_ref.cell_name.replace(/^[A-Z]+/g, '') + rows.solveExpression();
        let cell_name = col_str + row;
        if (height === 1 && width === 1) {
            return new SUnitRefValue(cell_name, ref_value.cellFormulaProxy).solveExpression();
        }
        else {
            let end_range_col = new ColIndexProxy(col + width - 1).colStr;
            let end_range_row = row + height - 1;
            let end_range = end_range_col + end_range_row;
            let str_expression = parsed_ref.sheet_name + '!' + cell_name + ':' + end_range;
            return new SUnitRangeRef(str_expression, ref_value.cellFormulaProxy).solveExpression();
        }
    }
}

export function iferror(cell_ref, onerrorvalue) {
    try {
        let value = cell_ref.solveExpression();
        if (typeof value === 'number' && (isNaN(value) || value === Infinity || value === -Infinity)) {
            return onerrorvalue.solveExpression();
        }
        return value;
    } catch(e) {
        return onerrorvalue.solveExpression();
    }
}

export function _if(condition, _then, _else) {
    if (condition.solveExpression()) {
        return _then.solveExpression();
    }
    else {
        return _else.solveExpression();
    }
}

export function and() {
    for (let i = 0; i < arguments.length; i++) {
        if(!arguments[i].solveExpression()) return false;
    }
    return true;
}
