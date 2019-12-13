"use strict";

import { d18991230MS, MS_PER_DAY } from '../calc/calc_utils/config';

export function col_str_2_int(col_str) { // A -> 0 AA -> 26
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

export function isEqual(v1, v2) {
    v1 = v1 + '';
    v2 = v2 + '';
    v1 = v1.toUpperCase();
    v2 = v2.toUpperCase();
    if (v1 === v2) {
        return true;
    }
    return false;
}

export function stamp2DayNum(timeStamp) {
    return (timeStamp - d18991230MS) / MS_PER_DAY ;
}

export function compareFloat(a, b, toleration = 0.001) {
    return Math.abs(a - b) < toleration;
}
