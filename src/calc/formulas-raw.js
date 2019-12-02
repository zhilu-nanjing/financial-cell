"use strict";

const int_2_col_str = require('./calc_utils/int_2_col_str.js');
const col_str_2_int = require('./calc_utils/col_str_2_int.js');
const RawValue = require('./cell_formula/RawValue.js');
const Range = require('./cell_formula/Range.js');
const RefValue = require('./cell_formula/RefValue.js');

function raw_offset(cell_ref, rows, columns, height, width) {
    height = (height || new RawValue(1)).calc();
    width = (width || new RawValue(1)).calc();
    if (cell_ref.args.length === 1 && cell_ref.args[0].name === 'RefValue') {
        let ref_value = cell_ref.args[0];
        let parsed_ref = ref_value.parseRef();
        let col = col_str_2_int(parsed_ref.cell_name) + columns.calc();
        let col_str = int_2_col_str(col);
        let row = +parsed_ref.cell_name.replace(/^[A-Z]+/g, '') + rows.calc();
        let cell_name = col_str + row;
        if (height === 1 && width === 1) {
            return new RefValue(cell_name, ref_value.cellFormulaProxy).calc();
        }
        else {
            let end_range_col = int_2_col_str(col + width - 1);
            let end_range_row = row + height - 1;
            let end_range = end_range_col + end_range_row;
            let str_expression = parsed_ref.sheet_name + '!' + cell_name + ':' + end_range;
            return new Range(str_expression, ref_value.cellFormulaProxy).calc();
        }
    }
}

function iferror(cell_ref, onerrorvalue) {
    try {
        let value = cell_ref.calc();
        if (typeof value === 'number' && (isNaN(value) || value === Infinity || value === -Infinity)) {
            return onerrorvalue.calc();
        }
        return value;
    } catch(e) {
        return onerrorvalue.calc();
    }
}

function _if(condition, _then, _else) {
    if (condition.calc()) {
        return _then.calc();
    }
    else {
        return _else.calc();
    }
}

function and() {
    for (let i = 0; i < arguments.length; i++) {
        if(!arguments[i].calc()) return false;
    }
    return true;
}

module.exports = {
    'OFFSET': raw_offset,
    'IFERROR': iferror,
    'IF': _if,
    'AND': and
};
