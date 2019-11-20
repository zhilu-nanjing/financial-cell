export function textReplace(text) {
    return text.replace(/\"/g, "\"").replace(/\"\"\"\"&/g, "\"'\"&");
}

export function textReplaceAndToUpperCase(text) {
    return text.replace(/ /g, '').toUpperCase().replace(/\"/g, "\"");
}


// quotation mark
export function textReplaceQM(text, number = false) {
    if (number == true) {
        return text.replace(/\"/g, "\"") * 1
    }

    return text.replace(/\"/g, "\"");
}