"use strict";

export function getSanitizedSheetName(sheet_name) {
    let quotedMatch = sheet_name.match(/^'(.*)'$/);
    if (quotedMatch) {
        return quotedMatch[1];
    }
    else {
        return sheet_name;
    }
};