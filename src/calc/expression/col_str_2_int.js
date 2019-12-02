"use strict";

export function col_str_2_int(col_str) {
    let r = 0;
    let colstr = col_str.replace(/[0-9]+$/, '');
    for (let i = colstr.length; i--;) {
        r += Math.pow(26, colstr.length - i - 1) * (colstr.charCodeAt(i) - 64);
    }
    return r - 1;
};
