"use strict";

import {col_str_2_int,int_2_col_str} from '../../helper/calc_helper.js'
import {RawValue} from '../calc_data_proxy/raw_value.js'
import {Range} from '../calc_data_proxy/range_ref.js'
import {RefValue} from '../calc_data_proxy/ref_value.js'

export function raw_offset(cell_ref, rows, columns, height, width) {
    height = (height || new RawValue(1)).solveExpression();
    width = (width || new RawValue(1)).solveExpression();
    if (cell_ref.args.length === 1 && cell_ref.args[0].name === 'RefValue') {
        let ref_value = cell_ref.args[0];
        let parsed_ref = ref_value.parseRef();
        let col = col_str_2_int(parsed_ref.cell_name) + columns.solveExpression();
        let col_str = int_2_col_str(col);
        let row = +parsed_ref.cell_name.replace(/^[A-Z]+/g, '') + rows.solveExpression();
        let cell_name = col_str + row;
        if (height === 1 && width === 1) {
            return new RefValue(cell_name, ref_value.cellFormulaProxy).solveExpression();
        }
        else {
            let end_range_col = int_2_col_str(col + width - 1);
            let end_range_row = row + height - 1;
            let end_range = end_range_col + end_range_row;
            let str_expression = parsed_ref.sheet_name + '!' + cell_name + ':' + end_range;
            return new Range(str_expression, ref_value.cellFormulaProxy).solveExpression();
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
