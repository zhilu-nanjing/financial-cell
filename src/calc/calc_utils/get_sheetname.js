"use strict";

export function getSanitizedSheetName(sheet_name) { //处理单引号内的sheet名称
    let quotedMatch = sheet_name.match(/^'(.*)'$/);
    if (quotedMatch) {
        return quotedMatch[1];
    }
    else {
        return sheet_name;
    }
};
