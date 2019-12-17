import {isHave} from "../helper/check_value";
import {expr2xy} from "../utils/alphabet";

export default class CellProp {
    constructor(ri, ci, cell, expr, empty) {
        this.ri = ri;
        this.ci = ci;
        this.cell = cell;
        this.expr = expr;
        this.empty = empty;
    }

    isInclude() {

    }


    each(cb) {
        let {cell} = this;
        if(isHave(cell.depend) === false) {
            return;
        }
        for(let i = 0; i < cell.depend.length; i++) {
            let expr = cell.depend[i];
            let [ci, ri] = expr2xy(expr);
            cb(ri, ci);
        }
    }
}
