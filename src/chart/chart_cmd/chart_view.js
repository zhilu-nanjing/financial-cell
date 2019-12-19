import {h} from "../../component/element";
import {cssPrefix} from "../../config";

export default class ChartView {
    constructor() {
        this.el = h('div', `${cssPrefix}-chart`);
    }


}