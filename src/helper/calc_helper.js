"use strict";

export function isEqualWithUpperCase(v1, v2) {
    v1 = v1 + '';
    v2 = v2 + '';
    v1 = v1.toUpperCase();
    v2 = v2.toUpperCase();
    if (v1 === v2) {
        return true;
    }
    return false;
}


