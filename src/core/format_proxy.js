import {formatNumberRender} from "./format";
import {isFormula} from "./row";

export default class FormatProxy {
    constructor() {
    }

    makeFormatCell({text, formula}, {symbol, position}, cb) {
        let cText = cb(formatNumberRender(text, -1));
        formula = isFormula(formula) ? formula : cText;
        if (!isNaN(cText)) {
            return {
                "text": position === 'begin' ? symbol + cText : cText + symbol,
                "value": text,
                "formulas": formula,
            };
        } else {
            return null;
        }
    }
}