import {h} from "./element";
import {cssPrefix} from "../config";

export default class HistoryBorder {
    constructor() {
        this.el = h('div', `${cssPrefix}-history-border`);
        this.history = h('div', `${cssPrefix}-history-content`).html('暂无内容');
        this.el.child( this.history);
    }

    setContent(items) {
        items = items.slice(items.length - 100 < 0 ? 0 : items.length, items.length);
        this.el.html('');
        let els = [];
        for(let i = items.length - 1; i >= 0; i--) {
            let d = h('div', '');
            let {action} = items[i];
            d.html(action);
            els.push(d);
        }

        console.log(this, this.el);
        this.el.children(...els);
    }
}