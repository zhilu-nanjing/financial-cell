import {CellRange} from "../core/cell_range";
import {cssPrefix} from "../config";
import {h} from "./element";
import {selectorHeightBorderWidth} from "./selector";

export default class SelectorCell {
    constructor(data) {
        this.el = h('div', `${cssPrefix}-selector-cell`);
        this.data = data;
        // this.direction = 1;     // 1 左上 2 右上 3左下 4右下
        this._ = new CellRange(0, 0, 0, 0);
    }

    resetSelectOffset() {
        let rect = this.data.getRect(this._);
        this.setOffset(rect);
    }

    setData(ri, ci) {
        ri = ri === -1 ? 0 : ri;
        ci = ci === -1 ? 0 : ci;

        let {data} = this;
        let {merges} = data;

        console.log(this._);
        let enter = false;
        merges.each(range => {
            if (range.includeByRiCi(ri, ci)) {
                this._ = range;
                enter = true;
            }
        });

        if (!enter) {
            this._ = new CellRange(ri, ci, ri, ci);
        }
    }

    toolbarChangeSelectorCell() {
        let ri = this._.sri;
        let ci = this._.sci;

        this.setData(ri, ci);
    }

    setOffset(v) {
        const {
            left, top, width, height,
        } = v;
        this.el.offset({
            width: width - selectorHeightBorderWidth + 0.8,
            height: height - selectorHeightBorderWidth + 0.8,
            left: left - 0.8,
            top: top - 0.8,
        }).show();
    }
}
