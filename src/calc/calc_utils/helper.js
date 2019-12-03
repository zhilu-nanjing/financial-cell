"use strict";

export function col_str_2_int(col_str) {
    let r = 0;
    let colstr = col_str.replace(/[0-9]+$/, '');
    for (let i = colstr.length; i--;) {
        r += Math.pow(26, colstr.length - i - 1) * (colstr.charCodeAt(i) - 64);
    }
    return r - 1;
};

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
}
