"use strict";

export function int_2_col_str(n) {
    let dividend = n + 1;
    let columnName = '';
    let modulo;
    let guard = 10;
    while (dividend > 0 && guard--) {
        modulo = (dividend - 1) % 26;
        columnName = String.fromCharCode(modulo + 65) + columnName;
        dividend = (dividend - modulo - 1) / 26;
    }
    return columnName;
};
