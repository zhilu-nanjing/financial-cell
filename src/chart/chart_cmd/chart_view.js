import {h} from "../../component/element";
import {spreadsheet} from "../../index";
import {cssPrefix} from "../../config";

export default class ChartView {
    constructor() {
        this.el = h('div', `${cssPrefix}-chart`);
    }


}