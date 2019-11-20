import {h} from './element';
import {cssPrefix} from '../config';
import {CellRange} from '../core/cell_range';
import {mouseMoveUp} from "../component/event";
import {lockCells} from "../component/formula_editor";
import {cuttingByPos} from "../core/operator";
import {expr2xy} from "../core/alphabet";
import {cuttingByPosEnd, isAbsoluteValue} from "../core/operator";
import SelectorMove from "./selector_move";

const selectorHeightBorderWidth = 2 * 2 - 1;
let startZIndex = 10;

class SelectorElement {
    constructor(data, selector, sheet) {
        // this.cornerEl = h('div', `${cssPrefix}-selector-corner`);
        // this.box = h('div', `${cssPrefix}-selector-box`);
        this.data = data;
        this._selector = selector;
        this.sheet = sheet;
        this.l = h('div', `${cssPrefix}-selector-box-l`)
            .on('mousedown.stop', evt => {
                this.moveEvent(evt);
            });
        this.r = h('div', `${cssPrefix}-selector-box-r`)
            .on('mousedown.stop', evt => {
                this.moveEvent(evt);
            });
        this.t = h('div', `${cssPrefix}-selector-box-t`)
            .on('mousedown.stop', evt => {
                this.moveEvent(evt);
            });
        this.b = h('div', `${cssPrefix}-selector-box-b`)
            .on('mousedown.stop', evt => {
                this.moveEvent(evt);
            });


        this.boxinner = h('div', `${cssPrefix}-selector-boxinner`)
            .children(this.b, this.t, this.r, this.l);
        this.selectorMove = new SelectorMove(this.boxinner, data, sheet, selector);
        this.areaEl = h('div', `${cssPrefix}-selector-area`)
            .child(this.boxinner)
            .hide();            // this.boxinner
        this.clipboardEl = h('div', `${cssPrefix}-selector-clipboard`).hide();
        this.autofillEl = h('div', `${cssPrefix}-selector-autofill`).hide();
        this.el = h('div', `${cssPrefix}-selector`)
            .css('z-index', `${startZIndex}`)
            .children(this.areaEl, this.clipboardEl, this.autofillEl)
            .hide();
        startZIndex += 1;
    }

    find(str, cha, num) {
        let x = str.lastIndexOf(cha);
        return x;
    }

    moveEvent(evt) {
        let {data, _selector, sheet} = this;
        let _move_selectors = null;
        let {selector} = data;
        let {sri, sci, eri, eci, w, h} = selector.range;
        let cellRange = new CellRange(sri, sci, eri, eci, w, h);
        let p = -1;
        mouseMoveUp(window, (e) => {
            let {selectors} = this.sheet;
            sheet.container.css('pointer-events', 'none');
            for (let i = 0; i < selectors.length; i++) {
                let selector = selectors[i];
                selector.selector.setBoxinner("none");
            }

            let {ri, ci} = data.getCellRectByXY(e.layerX, e.layerY);
            if (ri != -1 && ci != -1) {
                let { pos} = this.sheet.editor;
                let inputText = this.sheet.editor.editorText.getText();
                let _erpx = cuttingByPos(inputText, pos - 1, true);
                if (inputText.length > pos - 1) {
                    let c = cuttingByPosEnd(inputText, pos - 1);
                    _erpx += c;
                }
                for (let i = 0; i < selectors.length; i++) {
                    let selector = selectors[i];
                    let {className, erpx} = selector;

                    if (erpx === _erpx && className === _selector.className + " clear_selector") {
                        _move_selectors = _move_selectors ? _move_selectors : selector;
                        if (erpx.search(/^[A-Za-z]+\d+:[A-Za-z]+\d+$/) != -1) {
                            let arr = erpx.split(":");
                            let e1 = expr2xy(arr[0]);
                            let e2 = expr2xy(arr[1]);
                            cellRange = new CellRange(e1[1], e1[0], e2[1], e2[0], w, h);
                            cellRange.move(ri, ci);
                            const rect = data.getMoveRect(cellRange);
                            _move_selectors.selector.range = cellRange;
                            _move_selectors.selector.setMove(rect);
                        } else {
                            _move_selectors.selector.set(ri, ci, true);
                        }
                        break;
                    } else if (erpx !== _erpx && className === _selector.className + " clear_selector") {
                        p = p != -1 ? p :this.find(inputText, selector.erpx, selector.index);
                        this.sheet.editor.setCursorPos(p + selector.erpx.length);
                        _move_selectors = _move_selectors ? _move_selectors : selector;

                        if (selector.erpx.search(/^[A-Za-z]+\d+:[A-Za-z]+\d+$/) != -1) {
                            let arr = erpx.split(":");
                            let e1 = expr2xy(arr[0]);
                            let e2 = expr2xy(arr[1]);
                            cellRange = new CellRange(e1[1], e1[0], e2[1], e2[0], w, h);
                            cellRange.move(ri, ci);
                            const rect = data.getMoveRect(cellRange);
                            _move_selectors.selector.range = cellRange;
                            _move_selectors.selector.setMove(rect);
                        } else {
                            _move_selectors.selector.set(ri, ci, true);
                        }
                        break;
                    }
                }
                if (_move_selectors) {
                    _move_selectors.selector.setCss(_move_selectors.color, false)
                    lockCells.call(this.sheet, evt, _move_selectors, isAbsoluteValue(_move_selectors.erpx), p);
                }
            }
        }, (e) => {
            // 加这个的原因是  e.layerX, e.layerY， 如果不加的话 会点到单元格内的 xy坐标进行结算
            let {selectors} = this.sheet;
            sheet.container.css('pointer-events', 'auto');
            for (let i = 0; i < selectors.length; i++) {
                let selector = selectors[i];
                selector.selector.setBoxinner("all");
            }
            p = -1;
            if (_move_selectors && _move_selectors.selector)
                _move_selectors.selector.setCss(_move_selectors.color, true)
            _move_selectors = null;
        });
    }

    setBoxinner(pointer) {
        this.l.css("pointer-events", pointer);
        this.r.css("pointer-events", pointer);
        this.t.css("pointer-events", pointer);
        this.b.css("pointer-events", pointer);
        this.selectorMove.l.css("pointer-events", pointer);
        this.selectorMove.r.css("pointer-events", pointer);
        this.selectorMove.t.css("pointer-events", pointer);
        this.selectorMove.b.css("pointer-events", pointer);
    }

    setCss(b, key = true) {
        if (!key) {
            this.areaEl.css("border", `2px solid ${b}`);
        } else {
            this.areaEl.css("border", `2px dashed ${b}`);
        }
        this.el.css("z-index", "-1");
    }

    setOffset(v) {
        this.el.offset(v).show();
        return this;
    }

    hide() {
        this.el.hide();
        return this;
    }

    setAreaOffset(v) {
        const {
            left, top, width, height,
        } = v;
        this.areaEl.offset({
            width: width - selectorHeightBorderWidth + 0.8,
            height: height - selectorHeightBorderWidth + 0.8,
            left: left - 0.8,
            top: top - 0.8,
        }).show();
    }

    setClipboardOffset(v) {
        const {
            left, top, width, height,
        } = v;
        this.clipboardEl.offset({
            left,
            top,
            width: width - 5,
            height: height - 5,
        });
    }

    showAutofill(v) {
        const {
            left, top, width, height,
        } = v;
        this.autofillEl.offset({
            width: width - selectorHeightBorderWidth,
            height: height - selectorHeightBorderWidth,
            left,
            top,
        }).show();
    }

    hideAutofill() {
        this.autofillEl.hide();
    }

    showClipboard() {
        this.clipboardEl.show();
    }

    hideClipboard() {
        this.clipboardEl.hide();
    }
}

function calBRAreaOffset(offset) {
    const {data} = this;
    const {
        left, top, width, height, scroll, l, t,
    } = offset;
    const ftwidth = data.freezeTotalWidth();
    const ftheight = data.freezeTotalHeight();
    let left0 = left - ftwidth;
    if (ftwidth > l) left0 -= scroll.x;
    let top0 = top - ftheight;
    if (ftheight > t) top0 -= scroll.y;
    return {
        left: left0,
        top: top0,
        width,
        height,
    };
}

function calTAreaOffset(offset) {
    const {data} = this;
    const {
        left, width, height, l, t, scroll,
    } = offset;
    const ftwidth = data.freezeTotalWidth();
    let left0 = left - ftwidth;
    if (ftwidth > l) left0 -= scroll.x;
    return {
        left: left0, top: t, width, height,
    };
}

function calLAreaOffset(offset) {
    const {data} = this;
    const {
        top, width, height, l, t, scroll,
    } = offset;
    const ftheight = data.freezeTotalHeight();
    let top0 = top - ftheight;
    // console.log('ftheight:', ftheight, ', t:', t);
    if (ftheight > t) top0 -= scroll.y;
    return {
        left: l, top: top0, width, height,
    };
}

function setBRAreaOffset(offset) {
    const {br} = this;
    br.setAreaOffset(calBRAreaOffset.call(this, offset));
}

function setTLAreaOffset(offset) {
    const {tl} = this;
    tl.setAreaOffset(offset);
}

function setTAreaOffset(offset) {
    const {t} = this;
    t.setAreaOffset(calTAreaOffset.call(this, offset));
}

function setLAreaOffset(offset) {
    const {l} = this;
    l.setAreaOffset(calLAreaOffset.call(this, offset));
}

function setLClipboardOffset(offset) {
    const {l} = this;
    l.setClipboardOffset(calLAreaOffset.call(this, offset));
}

function setBRClipboardOffset(offset) {
    const {br} = this;
    br.setClipboardOffset(calBRAreaOffset.call(this, offset));
}

function setTLClipboardOffset(offset) {
    const {tl} = this;
    tl.setClipboardOffset(offset);
}

function setTClipboardOffset(offset) {
    const {t} = this;
    t.setClipboardOffset(calTAreaOffset.call(this, offset));
}

function setAllAreaOffset(offset) {
    setBRAreaOffset.call(this, offset);
    setTLAreaOffset.call(this, offset);
    setTAreaOffset.call(this, offset);
    setLAreaOffset.call(this, offset);
}

function setAllClipboardOffset(offset) {
    setBRClipboardOffset.call(this, offset);
    setTLClipboardOffset.call(this, offset);
    setTClipboardOffset.call(this, offset);
    setLClipboardOffset.call(this, offset);
}

export default class SelectorCopy {
    constructor(data, sheet, className) {
        this.data = data;
        this.className = className;
        this.br = new SelectorElement(data, this, sheet);
        this.t = new SelectorElement(data, this, sheet);
        this.l = new SelectorElement(data, this, sheet);
        this.tl = new SelectorElement(data, this, sheet);
        this.br.el.show();
        this.offset = null;
        this.areaOffset = null;
        this.indexes = null;
        this.range = null;
        this.arange = null;
        this.el = h('div', `${cssPrefix}-selectors`)
            .children(
                this.tl.el,
                this.t.el,
                this.l.el,
                this.br.el,
            ).hide();

        // for performance
        this.lastri = -1;
        this.lastci = -1;

        startZIndex += 1;
    }

    setCss(b, key = true) {
        this.br.setCss(b, key);
        this.t.setCss(b, key);
        this.l.setCss(b, key);
        this.tl.setCss(b, key);
    }

    hide() {
        this.el.hide();
    }

    resetOffset() {
        const {
            data, tl, t, l, br,
        } = this;
        const freezeHeight = data.freezeTotalHeight();
        const freezeWidth = data.freezeTotalWidth();
        if (freezeHeight > 0 || freezeWidth > 0) {
            tl.setOffset({width: freezeWidth, height: freezeHeight});
            t.setOffset({left: freezeWidth, height: freezeHeight});
            l.setOffset({top: freezeHeight, width: freezeWidth});
            br.setOffset({left: freezeWidth, top: freezeHeight});
        } else {
            tl.hide();
            t.hide();
            l.hide();
            br.setOffset({left: 0, top: 0});
        }
    }

    resetAreaOffset() {
        // console.log('offset:', offset);
        const offset = this.data.getSelectedRect();
        const coffset = this.data.getClipboardRect();
        setAllAreaOffset.call(this, offset);
        setAllClipboardOffset.call(this, coffset);
        this.resetOffset();
    }

    resetBRTAreaOffset() {
        const offset = this.data.getSelectedRect();
        const coffset = this.data.getClipboardRect();
        setBRAreaOffset.call(this, offset);
        setTAreaOffset.call(this, offset);
        setBRClipboardOffset.call(this, coffset);
        setTClipboardOffset.call(this, coffset);
        this.resetOffset();
    }

    resetSelectorBRLAreaOffset(range) {
        const offset = this.data.getMoveRect(range);
        const coffset = this.data.getClipboardRect();
        setBRAreaOffset.call(this, offset);
        setLAreaOffset.call(this, offset);
        setBRClipboardOffset.call(this, coffset);
        setLClipboardOffset.call(this, coffset);
        this.resetOffset();
    }

    resetBRLAreaOffset() {
        const offset = this.data.getSelectedRect();
        const coffset = this.data.getClipboardRect();
        setBRAreaOffset.call(this, offset);
        setLAreaOffset.call(this, offset);
        setBRClipboardOffset.call(this, coffset);
        setLClipboardOffset.call(this, coffset);
        this.resetOffset();
    }

    set(ri, ci, indexesUpdated = true) {
        const {data} = this;
        const cellRange = data.calSelectedRangeByStart(ri, ci);
        const {sri, sci} = cellRange;
        if (indexesUpdated) {
            let [cri, cci] = [ri, ci];
            if (ri < 0) cri = 0;
            if (ci < 0) cci = 0;
            data.selector.setIndexes(cri, cci);
            this.indexes = [cri, cci];
        }

        this.moveIndexes = [sri, sci];
        // this.sIndexes = sIndexes;
        // this.eIndexes = eIndexes;
        this.range = cellRange;
        this.resetAreaOffset();
        this.el.show();
    }

    setMove(rect) {
        setAllAreaOffset.call(this, rect);
    }

    setEnd(ri, ci, moving = true) {
        const {data, lastri, lastci} = this;
        if (moving) {
            if (ri === lastri && ci === lastci) return;
            this.lastri = ri;
            this.lastci = ci;
        }
        this.range = data.calSelectedRangeByEnd(ri, ci);

        setAllAreaOffset.call(this, this.data.getSelectedRect());

    }

    setBoxinner(pointer) {
        this.br.setBoxinner(pointer);
        this.t.setBoxinner(pointer);
        this.l.setBoxinner(pointer);
        this.tl.setBoxinner(pointer);
    }

    reset() {
        // console.log('::::', this.data);
        const {eri, eci} = this.data.selector.range;
        this.setEnd(eri, eci);
    }

    showAutofill(ri, ci) {
        if (ri === -1 && ci === -1) return;
        // console.log('ri:', ri, ', ci:', ci);
        // const [sri, sci] = this.sIndexes;
        // const [eri, eci] = this.eIndexes;
        const {
            sri, sci, eri, eci,
        } = this.range;
        const [nri, nci] = [ri, ci];
        // const rn = eri - sri;
        // const cn = eci - sci;
        const srn = sri - ri;
        const scn = sci - ci;
        const ern = eri - ri;
        const ecn = eci - ci;
        if (scn > 0) {
            // left
            // console.log('left');
            this.arange = new CellRange(sri, nci, eri, sci - 1);
            // this.saIndexes = [sri, nci];
            // this.eaIndexes = [eri, sci - 1];
            // data.calRangeIndexes2(
        } else if (srn > 0) {
            // top
            // console.log('top');
            // nri = sri;
            this.arange = new CellRange(nri, sci, sri - 1, eci);
            // this.saIndexes = [nri, sci];
            // this.eaIndexes = [sri - 1, eci];
        } else if (ecn < 0) {
            // right
            // console.log('right');
            // nci = eci;
            this.arange = new CellRange(sri, eci + 1, eri, nci);
            // this.saIndexes = [sri, eci + 1];
            // this.eaIndexes = [eri, nci];
        } else if (ern < 0) {
            // bottom
            // console.log('bottom');
            // nri = eri;
            this.arange = new CellRange(eri + 1, sci, nri, eci);
            // this.saIndexes = [eri + 1, sci];
            // this.eaIndexes = [nri, eci];
        } else {
            // console.log('else:');
            this.arange = null;
            // this.saIndexes = null;
            // this.eaIndexes = null;
            return;
        }
        if (this.arange !== null) {
            // console.log(this.saIndexes, ':', this.eaIndexes);
            const offset = this.data.getRect(this.arange);
            offset.width += 2;
            offset.height += 2;
            const {
                br, l, t, tl,
            } = this;
            br.showAutofill(calBRAreaOffset.call(this, offset));
            l.showAutofill(calLAreaOffset.call(this, offset));
            t.showAutofill(calTAreaOffset.call(this, offset));
            tl.showAutofill(offset);
        }
    }

    hideAutofill() {
        ['br', 'l', 't', 'tl'].forEach((property) => {
            this[property].hideAutofill();
        });
    }

    showClipboard() {
        const coffset = this.data.getClipboardRect();
        setAllClipboardOffset.call(this, coffset);
        ['br', 'l', 't', 'tl'].forEach((property) => {
            this[property].showClipboard();
        });
    }

    showClipboard2(coffset) {
        setAllClipboardOffset.call(this, coffset);
        ['br', 'l', 't', 'tl'].forEach((property) => {
            this[property].showClipboard();
        });
    }

    hideClipboard() {
        ['br', 'l', 't', 'tl'].forEach((property) => {
            this[property].hideClipboard();
        });
    }
}
