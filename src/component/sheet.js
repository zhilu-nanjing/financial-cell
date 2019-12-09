/* global window */
import {h} from './element';
import {bind, bindTouch, mouseMoveUp, remove} from './event';
import Resizer from './resizer';
import Scrollbar from './scrollbar';
import Selector from './selector';
import Editor from './editor';
import ContextMenu from './contextmenu';
import Table from './table';
import Toolbar from './toolbar';
import ModalValidation from './modal_validation';
import SortFilter from './sort_filter';
import {xtoast} from './message';
import {cssPrefix, offsetLeft, offsetTop} from '../config';
import {fnNameArrayWithKey} from '../calc/calc_cmd/formula';
import {getFontSizePxByPt} from "../core/font";
// import {baseFormats, multiply} from "../core/format";
import Advice from "../component/advice";
import {clearSelectors, editingSelectors, lockCells, makeSelector} from "../component/formula_editor";
import {deleteImg, hideDirectionArr, mountPaste} from "../event/paste";
import {getChooseImg, mountCopy} from "../event/copy";
import Website from "../component/website";
import {cutStr, cuttingByPos, deepCopy} from "../core/operator";
import {moveCell} from "../event/move";
import CellRange from "../core/cell_range";
import {isHave, isOusideViewRange} from "../helper/dataproxy_helper";
import {expr2xy} from "../utils/alphabet";
import ErrorPopUp from "./error_pop_up";
import RectProxy from "../core/rect_proxy";
import {testValid} from "../utils/test";
import Timer from "../model/Timer";
import PreAction from "../model/pre_action";

function scrollbarMove() {
    const {
        data, verticalScrollbar, horizontalScrollbar,
    } = this;
    const {
        l, t, left, top, width, height,
    } = data.getSelectedRect();
    const tableOffset = this.getTableOffset();
    // console.log(',l:', l, ', left:', left, ', tOffset.left:', tableOffset.width);

    if (Math.abs(left) + width > tableOffset.width) {
        horizontalScrollbar.move({left: l + width - tableOffset.width});
    } else {
        const fsw = data.freezeTotalWidth();
        if (left < fsw) {
            horizontalScrollbar.move({left: l - 1 - fsw});
        }
    }
    // console.log('top:', top, ', height:', height, ', tof.height:', tableOffset.height);
    if (Math.abs(top * 1) + height > tableOffset.height) {
        verticalScrollbar.move({top: t + height - tableOffset.height - 1});
    } else {
        const fsh = data.freezeTotalHeight();
        if (top < fsh) {
            verticalScrollbar.move({top: t - 1 - fsh});
        }
    }
}

function selectorSet(multiple, ri, ci, indexesUpdated = true, moving = false) {
    if (ri === -1 && ci === -1) return;
    // console.log(multiple, ', ri:', ri, ', ci:', ci);
    const {
        table, selector, toolbar,
    } = this;
    /**
     * @type {Table} table
     */

    if (multiple) {
        selector.setEnd(ri, ci, moving, true);
    } else {
        selector.set(ri, ci, indexesUpdated);
    }

    toolbar.reset();

    // add
    clearTimeout(this.render_timer);

    this.render_timer = setTimeout(() => {
        /**
         * @type {Table} table
         */
        table.render();
    }, 100);
}

// multiple: boolean
// direction: left | right | up | down | row-first | row-last | col-first | col-last
function selectorMove(multiple, direction) {
    const {
        selector, data, editor
    } = this;
    const {rows, cols} = data;
    if (editor.isCors) {
        selector.indexes = [editor.ri, editor.ci];
    }
    let [ri, ci] = selector.indexes;
    const { eci} = selector.range;
    if (multiple) {
        [ri, ci] = selector.moveIndexes;
    }


    // console.log("92", ri, ci, editor.ri, editor.ci)
    // if((editor.ri != ri && editor.ri != -1) || (editor.ci != ci && editor.ci != -1)) {
    //     return;
    // }

    // console.log('selector.move:', ri, ci);
    if (direction === 'left') {
        if (ci > 0) ci -= 1;
    } else if (direction === 'right') {
        if (eci !== ci) ci = eci;
        if (ci < cols.len - 1) ci += 1;
    } else if (direction === 'up') {
        if (ri > 0) ri -= 1;
    } else if (direction === 'down') {
        // if (eri !== ri) ri = eri;
        if (ri < rows.len - 1) ri += 1;
    } else if (direction === 'row-first') {
        ci = 0;
    } else if (direction === 'row-last') {
        ci = cols.len - 1;
    } else if (direction === 'col-first') {
        ri = 0;
    } else if (direction === 'col-last') {
        ri = rows.len - 1;
    }

    if (multiple) {
        selector.moveIndexes = [ri, ci];
    }
    selector.selectCell.setData(ri, ci);
    selector.selectCell.resetSelectOffset();
    selectorSet.call(this, multiple, ri, ci);
    // editor.clear();

    editorSetOffset.call(this);
    scrollbarMove.call(this);
}

// private methods
function overlayerMousemove(evt) {
    // console.log('x:', evt.offsetX, ', y:', evt.offsetY);
    if (evt.buttons !== 0) return;
    if (evt.target.className === `${cssPrefix}-resizer-hover`) return;
    const {offsetX, offsetY} = evt;

    const {
        rowResizer, colResizer, tableEl, data, website
    } = this;
    const cRect = data.getCellRectByXY(evt.offsetX, evt.offsetY);

    // moveCell.call(this);

    // url 展开
    website.show(cRect.ri, cRect.ci);
    const {rows, cols} = data;
    if (offsetX > cols.indexWidth && offsetY > rows.height) {
        rowResizer.hide();
        colResizer.hide();
        return;
    }
    const tRect = tableEl.box();
    if (cRect.ri >= 0 && cRect.ci === -1) {
        cRect.width = cols.indexWidth;
        rowResizer.show(cRect, {
            width: tRect.width,
        });
    } else {
        rowResizer.hide();
    }
    if (cRect.ri === -1 && cRect.ci >= 0) {
        cRect.height = rows.height;
        colResizer.show(cRect, {
            height: tRect.height,
        });
    } else {
        colResizer.hide();
    }
}

function overlayerMousescroll(evt) {
    const {verticalScrollbar, data} = this;
    const {autoLoad} = data.settings;
    const {top} = verticalScrollbar.scroll();
    // console.log('evt:::', evt.wheelDelta, evt.detail * 40);
    let delta = evt.deltaY;
    const {rows} = data;
    if (evt.detail) delta = evt.detail * 40;
    if (delta > 0 && autoLoad === true) {
        // up
        const ri = data.scroll.ri + 1;
        if (ri < rows.len) {
            verticalScrollbar.move({top: top + rows.getHeight(ri) - 1});
        }
    } else if (autoLoad === true) {
        // down
        const ri = data.scroll.ri - 1;
        if (ri >= 0) {
            verticalScrollbar.move({top: ri === 0 ? 0 : top - rows.getHeight(ri)});
        }
    }
}

function overlayerTouch(direction, distance) {
    const {verticalScrollbar, horizontalScrollbar} = this;
    const {top} = verticalScrollbar.scroll();
    const {left} = horizontalScrollbar.scroll();
    // console.log('direction:', direction, ', distance:', distance, left);
    if (direction === 'left' || direction === 'right') {
        horizontalScrollbar.move({left: left - distance});
    } else if (direction === 'up' || direction === 'down') {
        verticalScrollbar.move({top: top - distance});
    }
}

function verticalScrollbarSet() {
    const {data, verticalScrollbar} = this;
    const {height} = this.getTableOffset();
    verticalScrollbar.set(height, data.rows.totalHeight());
}

function horizontalScrollbarSet() {
    const {data, horizontalScrollbar} = this;
    const {width} = this.getTableOffset();
    if (data) {
        horizontalScrollbar.set(width, data.cols.totalWidth());
    }
}

function sheetFreeze() {
    const {
        selector, data, editor,
    } = this;
    const [ri, ci] = data.freeze;
    if (ri > 0 || ci > 0) {
        const fwidth = data.freezeTotalWidth();
        const fheight = data.freezeTotalHeight();
        editor.setFreezeLengths(fwidth, fheight);
    }
    selector.resetAreaOffset();
}

function sheetReset() {
    // debugger
    const {
        tableEl,
        overlayerEl,
        overlayerCEl,
        table,
        toolbar,
        selector,
        el,
    } = this;
    const tOffset = this.getTableOffset();
    const vRect = this.getRect();
    tableEl.attr(vRect);
    overlayerEl.offset(vRect);
    overlayerCEl.offset(tOffset);
    el.css('width', `${vRect.width}px`);
    renderAutoAdapt.call(this);
    autoRowResizer.call(this);

    verticalScrollbarSet.call(this);
    horizontalScrollbarSet.call(this);
    sheetFreeze.call(this);
    selector.selectCell.toolbarChangeSelectorCell();
    table.render();
    toolbar.reset();
    selector.reset();
}

function clearClipboard() {
    const {data, selector} = this;
    data.clearClipboard();
    selector.hideClipboard();
}

function copy() {
    const {data, selector} = this;
    data.copy();
    selector.showClipboard();
}

function cut() {
    const {data, selector} = this;
    data.cut();
    selector.showClipboard();
}

// const a = () => {
// }

function paste(what, cb = (p) => {
    if (p) {
        clearClipboard.call(this);
        sheetReset.call(this);
    }
}) {
    const {data} = this;
    let p = data.paste(what, msg => xtoast('Tip', msg));
    cb(p);

    return p;
}

function autofilter() {
    const {data} = this;
    data.autofilter();
    sheetReset.call(this);
}

function toolbarChangePaintformatPaste() {
    const {toolbar, data} = this;
    if (toolbar.paintformatActive()) {
        // paste.call(this, 'format');
        data.paintFormatChange((ri, ci) => {
            selectorSet.call(this, true, ri, ci, true, true);
        });
        clearClipboard.call(this);
        toolbar.paintformatToggle();
        toolbar.reset();
    }
}

function getPoint(obj) { //获取某元素以浏览器左上角为原点的坐标
    let t = obj.offsetTop; //获取该元素对应父容器的上边距
    let l = obj.offsetLeft; //对应父容器的上边距
    //判断是否有父容器，如果存在则累加其边距
    while (obj = obj.offsetParent) {//等效 obj = obj.offsetParent;while (obj != undefined)
        t += obj.offsetTop; //叠加父容器的上边距
        l += obj.offsetLeft; //叠加父容器的左边距
    }

    return {
        t: t,
        l: l
    }
}

function dropDown(e, isAutofillEl, selector, data, verticalScrollbar, rows, evt, pos = 0, offset, horizontalScrollbar, cols) {
    this.selector.setBoxinner("none");
    this.container.css('pointer-events', 'none');
    let dstRect = data.getCellRectByXYWithNotTotalResult(e.layerX || e.clientX, e.layerY || e.clientY);
    let {ri, ci} = dstRect;

    if (isAutofillEl) {
        let {rpos, ey, ex,} = dropGetPos.call(this, data, selector, verticalScrollbar, horizontalScrollbar, offset, e, rows, cols, ri, ci, pos);

        let orien = selector.showAutofill(ri, ci, rpos);
        if (isOusideViewRange(this.data.settings.view.height(), this.data.settings.view.width(), ey, ex, orien)) {
            // if (Math.round(Math.random()) === 1) {
            continueMove.call(this, orien, verticalScrollbar, horizontalScrollbar, cols, rows, data);
            // }
        }

    } else if (e.buttons === 1 && !e.shiftKey) {
        ri = ri <= 0 ? 0 : ri;
        ci = ci <= 0 ? 0 : ci;
        let cell = data.viewRange();
        let pos = cell.getMovePos(ri, ci);

        selectorBeyondMove.call(this, pos, verticalScrollbar, horizontalScrollbar, cols, rows, data);

        console.log("ri: ", ri, "ci: ", ci);
        selectorSet.call(this, true, ri, ci, true, true);
    }
}


function dropGetPos(data, selector, verticalScrollbar, horizontalScrollbar, offset, e, rows, cols, ri, ci, pos) {
    let rect = data.getRect(selector.range);
    let rectProxy = new RectProxy(rect);
    let clientX = rect.width + rect.left;
    let clientY = rect.height + rect.top + offsetTop;
    let ex = e.clientX - offset.l - offsetLeft;
    let ey = e.clientY;

    if (rectProxy.isLocInside(ex, ey)) {
        pos = -1;
        selector.arange = null;
    } else {
        pos = rectProxy.getUpDownLeftRight(ex, ey, clientX, clientY)
    }

    return {
        rpos: pos,
        ex,
        ey
    };
}

function selectorBeyondMove(orien, verticalScrollbar, horizontalScrollbar, cols, rows, data) {
    if (orien === 2) {   //往下
        scrollTo.call(this, 1, verticalScrollbar, horizontalScrollbar, rows, data, cols);
    } else if (orien === 6) {    // 往上
        scrollTo.call(this, 2, verticalScrollbar, horizontalScrollbar, rows, data, cols);
    } else if (orien === 3) {        //往右
        scrollTo.call(this, 4, verticalScrollbar, horizontalScrollbar, rows, data, cols);
    } else if (orien === 5) {    // 往左
        scrollTo.call(this, 3, verticalScrollbar, horizontalScrollbar, rows, data, cols);
    } else if (orien === 1) { // 往下往右
        scrollTo.call(this, 1, verticalScrollbar, horizontalScrollbar, rows, data, cols);
        scrollTo.call(this, 4, verticalScrollbar, horizontalScrollbar, rows, data, cols);
    } else if (orien === 7) {         // 往下往左
        scrollTo.call(this, 1, verticalScrollbar, horizontalScrollbar, rows, data, cols);
        scrollTo.call(this, 3, verticalScrollbar, horizontalScrollbar, rows, data, cols);
    } else if (orien === 8) {     // 往上往右
        scrollTo.call(this, 2, verticalScrollbar, horizontalScrollbar, rows, data, cols);
        scrollTo.call(this, 4, verticalScrollbar, horizontalScrollbar, rows, data, cols);
    } else if (orien === 4) {       // 往上往左
        scrollTo.call(this, 2, verticalScrollbar, horizontalScrollbar, rows, data, cols);
        scrollTo.call(this, 3, verticalScrollbar, horizontalScrollbar, rows, data, cols);
    }
}

function scrollTo(orien, verticalScrollbar, horizontalScrollbar, rows, data, cols) {
    if (Math.round(Math.random()) !== 1) {
        return;
    }
    // 1 下 2 上 3左 4 右
    let ri = 0, ci = 0;
    if (orien === 1) {
        const {top} = verticalScrollbar.scroll();  // 可见视图上边缘距离toolbar的像素
        ri = data.scroll.ri + 1;
        verticalScrollbar.move({top: top + rows.getHeight(ri) - 1});
    } else if (orien === 2) {
        const {top} = verticalScrollbar.scroll();
        ri = data.scroll.ri - 1;

        verticalScrollbar.move({top: ri === 0 ? 0 : top - rows.getHeight(ri)});
    } else if (orien === 4) {
        const {left} = horizontalScrollbar.scroll();
        ci = data.scroll.ci + 1;
        horizontalScrollbar.move({left: left + cols.getWidth(ci)});
    } else if (orien === 3) {
        const {left} = horizontalScrollbar.scroll();
        ci = data.scroll.ci - 1;
        horizontalScrollbar.move({left: left - cols.getWidth(ci)});
    }
}

function continueMove(orien, verticalScrollbar, horizontalScrollbar, cols, rows, data) {
    let ri = 0, ci = 0;
    if (orien === 44) {
        const {top} = verticalScrollbar.scroll();  // 可见视图上边缘距离toolbar的像素
        ri = data.scroll.ri + 1;
        verticalScrollbar.move({top: top + rows.getHeight(ri) - 1});
    } else if (orien === 22) {
        const {top} = verticalScrollbar.scroll();
        ri = data.scroll.ri - 1;
        if (ri >= 0) {
            verticalScrollbar.move({top: ri === 0 ? 0 : top - rows.getHeight(ri)});
        }
    } else if (orien === 33 && Math.round(Math.random()) === 1 && Math.round(Math.random()) === 1) {
        const {left} = horizontalScrollbar.scroll();
        ci = data.scroll.ci + 1;
        horizontalScrollbar.move({left: left + cols.getWidth(ci)});
    } else if (orien === 11 && Math.round(Math.random()) === 1 && Math.round(Math.random()) === 1) {
        const {left} = horizontalScrollbar.scroll();
        ci = data.scroll.ci - 1;
        horizontalScrollbar.move({left: left - cols.getWidth(ci)});
    }
}


function overlayerMousedown(evt) {
    // console.log(':::::overlayer.mousedown:', evt.detail, evt.button, evt.buttons, evt.shiftKey);
    // console.log('evt.target.className:', evt.target.className);
    const {
        selector, data,  sortFilter, editor, advice
    } = this;
    const {offsetX, offsetY} = evt;
    const isAutofillEl = evt.target.className === `${cssPrefix}-selector-corner`;
    const cellRect = data.getCellRectByXY(offsetX, offsetY);
    const {
        left, top, width, height,
    } = cellRect;
    let {ri, ci} = cellRect;
    editor.setRiCi(ri, ci);

    // sort or filter
    const {autoFilter} = data;

    // trait add
    hideDirectionArr.call(this);
    advice.el.hide();

    if (autoFilter.includes2(ri, ci)) {
        autoFilter.getSet(data.exceptRowSet, ri);
    }

    if (autoFilter.includes(ri, ci)) {
        if (left + width - 20 < offsetX && top + height - 20 < offsetY) {
            const items = autoFilter.items(ci, (r, c) => data.rows.getCell(r, c));
            sortFilter.set(ci, items, autoFilter.getFilter(ci), autoFilter.getSort(ci));
            sortFilter.setOffset({left, top: top + height + 2});
            return;
        }
    }

    // console.log('ri:', ri, ', ci:', ci);
    if (!evt.shiftKey) {
        // console.log('selectorSetStart:::');
        if (isAutofillEl) {
            selector.showAutofill(ri, ci);
        } else {
            selectorSet.call(this, false, ri, ci);
        }


        // let {pageX, pageY} = evt;
        let {verticalScrollbar, horizontalScrollbar} = this;
        const {rows, cols} = data;
        // const {top} = verticalScrollbar.scroll();
        ri = data.scroll.ri + 1;
        // let ttop = top + rows.getHeight(ri) - 1;

        let point = getPoint(this.el.el);
        // mouse move up
        mouseMoveUp(window, (e) => {
            console.log("dropdown");
            clearStopTimer.call(this);

            continueDropDown.call(this, e, isAutofillEl, selector, data, verticalScrollbar, rows, evt, point, horizontalScrollbar, cols);

            dropDown.call(this, e, isAutofillEl, selector, data, verticalScrollbar, rows, evt, 0, point, horizontalScrollbar, cols);
        }, () => {
            clearStopTimer.call(this);

            if (isAutofillEl) {
                if (data.autofill(selector.arange, 'all', msg => xtoast('Tip', msg))) {
                    testValid.call(this);
                    autofillNext.call(this);
                }
            }
            this.selector.setBoxinner("auto");

            selector.hideAutofill();
            toolbarChangePaintformatPaste.call(this);
            this.container.css('pointer-events', 'auto');
        });
    }

    if (!isAutofillEl && evt.buttons === 1) {
        if (evt.shiftKey) {
            // console.log('shiftKey::::');
            selectorSet.call(this, true, ri, ci);
        }
    }
}

function continueDropDown(e, isAutofillEl, selector, data, verticalScrollbar, rows, evt, point, horizontalScrollbar, cols) {
    let stopTimer = setTimeout(() => {
        let stopTimer2 = setInterval(() => {
            dropDown.call(this, e, isAutofillEl, selector, data, verticalScrollbar, rows, evt, 0, point, horizontalScrollbar, cols,);
        }, 50);
        this.stopTimer2.push(stopTimer2);
    }, 200);

    this.stopTimer.push(stopTimer);
}

function clearStopTimer() {
    this.stopTimer.clear();
    this.stopTimer2.clear();
}

function autofillNext() {
    const {
        data, table, editor
    } = this;
    editor.display = true;
    let enter = false;
    // this.selector.arange.each((ri, ci) => {
    //     // let cell = data.rows.getCell(ri, ci);
    //     // if (cell && cell.formulas) {
    //     //     let enter2 = this.editorProxy.change(ri, ci, cell.formulas, data.rows, data, true);
    //     //     if (enter2 === true) {
    //     //         enter = true;
    //     //     }
    //     // }
    // });
    if (enter) {
        data.change(data.getData());
    }
    this.selector.arange = null;
    loadFormula.call(this);
    table.render();
}

function loadFormula(load = false) {
    // this.table.proxy.diff = 305;
    // this.table.proxy.oldData = "";
    // sheetReset.call(this);
    // clearTimeout(this.formulaTime);
    // let {data, table} = this;
    // this.formulaTime = setTimeout(() => {
    //     let {date_formula} = data.settings;
    //     if (date_formula && typeof date_formula.wland == "function") {
    //         date_formula.wland(date_formula, data, table, load);
    //     }
    // }, 1500);
}

function firstRowToWidth(width) {
    let cRect = {ri: -1, ci: 0, left: 60, top: 0, width: 100};
    colResizerFinished.call(this, cRect, width);
}

function adviceSetOffset() {
    const {data} = this;
    const rect = data.getSelectedRect();
    let left = rect.left + rect.width + 60;
    let top = rect.top + rect.height + 31;

    this.advice.el.el.style['top'] = `${top}px`;
    this.advice.el.el.style['left'] = `${ left}px`;
}

function pictureSetOffset() {
    const {data} = this;
    let {pictureOffsetLeft, pictureOffsetTop} = this;


    this.data.pasteDirectionsArr.forEach(i => {
        const sOffset = data.getMoveRect(i.range);

        i.img.el.style['top'] = `${sOffset.top + pictureOffsetTop + i.number * 15 + i.offsetTop }px`;
        i.img.el.style['left'] = `${sOffset.left + pictureOffsetLeft + i.number * 15 + i.offsetLeft}px`;
    });
}


function editorSetOffset(show = true, cri = -1, cci = -1) {
    const {
        selector, data, editor
    } = this;
    let [ri, ci] = selector.indexes;
    ri = cri === -1 ? ri : cri;
    ci = cci === -1 ? ci : cci;

    const sOffset = data.getMoveRect(new CellRange(ri, ci, selector.range.eri, selector.range.eci));
    const tOffset = this.getTableOffset();

    let sPosition = 'top';
    // console.log('sOffset:', sOffset, ':', tOffset);
    if (sOffset.top > tOffset.height / 2) {
        sPosition = 'bottom';
    }

    editor.setOffset(sOffset, sPosition, show);
    setTimeout(() => {
        editor.setCursorPos(editor.editorText.getText().length);
    });
}

function selectorsSetOffset() {
    for (let i = 0; i < this.selectors.length; i++) {
        let selector = this.selectors[i];
        selector.selector.resetSelectorBRLAreaOffset(new CellRange(selector.ri, selector.ci, selector.ri, selector.ci));
    }
}

function hasEditor(showEditor = true) {
    // let {selector} = this;
    if (showEditor === true) {
        return this.overlayerCEl = h('div', `${cssPrefix}-overlayer-content`)
            .children(
                this.editor.el,
                this.selectorMoveEl.el,
                this.selector.el,
            );
    } else {
        return this.overlayerCEl = h('div', `${cssPrefix}-overlayer-content`)
            .children(
                // this.editor.el,
                // this.selector.el,
                this.selectorMoveEl.el
            );
    }
}

function editorSet() {
    const {editor, data, selector} = this;
    editorSetOffset.call(this);
    editor.setCellEnd(data.getSelectedCell());
    // editor.setCell(data.getSelectedCell(), data.getSelectedValidator(), type);
    if (this.data.settings.showEditor) {
        selector.el.hide();
    }
    clearClipboard.call(this);

    setTimeout(() => {
        editor.setCursorPos(editor.editorText.getText().length);
    });
}

function verticalScrollbarMove(distance) {
    const {data, table, selector, editor} = this;
    data.scrolly(distance, () => {
        editor.display = false;
        selector.resetBRLAreaOffset();
        pictureSetOffset.call(this);
        adviceSetOffset.call(this);
        selectorsSetOffset.call(this);
        editorSetOffset.call(this, false);
        table.render();
    });
}

function horizontalScrollbarMove(distance) {
    const {data, table, selector, editor} = this;
    data.scrollx(distance, () => {
        editor.display = false;
        selector.resetBRTAreaOffset();
        pictureSetOffset.call(this);
        adviceSetOffset.call(this);
        selectorsSetOffset.call(this);
        editorSetOffset.call(this, false);
        table.render();
    });
}

function renderAutoAdapt() {
    let {data, table} = this;
    const viewRange = data.viewRange2();
    let {autoAdapt} = data.settings.style;
    let {ignoreRi} = data.settings;
    let viewWidth = 0;

    if (autoAdapt) {
        viewRange.each((ri, ci) => {
            let txt = table.getCellTextContent(ri, ci);
            const dbox = table.getDrawBox(ri, ci);

            if (txt !== undefined) {
                const style = table.getCellTextStyle(ri, ci);
                const font = Object.assign({}, style.font);
                font.size = getFontSizePxByPt(font.size);
                // 得到当前文字最宽的width
                let txtWidth = null;
                if (style.format !== undefined) {
                    // txtWidth = table.draw.selfAdaptionTxtWidth(formatm[style.format].render(txt), font, dbox);

                } else {
                    txtWidth = table.draw.selfAdaptionTxtWidth(txt, font, dbox);
                }
                if ((table.autoAdaptList[ci] === undefined || table.autoAdaptList[ci] < txtWidth) && ri > ignoreRi - 1) {
                    table.autoAdaptList[ci] = txtWidth;
                }
            }
        });
        if (table.autoAdaptList.length < 0) {
            return;
        }
        let {ignore} = data.settings;
        for (let i = 0; i < table.autoAdaptList.length; i++) {
            let _ignore = false;
            for (let j = 0; j < ignore.length; j++) {
                if (i === ignore[j]) _ignore = true;
            }
            if (_ignore === false) {
                if (table.autoAdaptList[i] === undefined) {
                    viewWidth += 50;
                    data.cols.setWidth(i, 50);
                } else {
                    if (table.autoAdaptList[i] < 30) {
                        table.autoAdaptList[i] = 30;
                    }
                    data.cols.setWidth(i, table.autoAdaptList[i]);
                }
            }
            viewWidth += table.autoAdaptList[i];

        }
        if (viewWidth > 0)
            data.settings.cellWidth = () => viewWidth;
    }
}

function autoRowResizer() {
    let {data, table} = this;
    let viewRange = data.viewRange2();
    let record_rc = 0, max = 0;
    let r_h = data.settings.row.height;
    let {autoAdapt} = data.settings.style;
    let viewHeight = 0;

    if (autoAdapt) {
        viewRange.each((ri, ci) => {
            const txt = table.getCellTextContent(record_rc, ci);
            const style = table.getCellTextStyle(ri, ci);
            const font = Object.assign({}, style.font);
            font.size = getFontSizePxByPt(font.size);
            const dbox = table.getDrawBox(record_rc, ci);
            // 1. 自适应调整一行的高度
            // 2. 进入下一行 得到 本行的max
            if (record_rc !== ri && txt !== undefined) {
                let record_h = data.rows.getHeight(record_rc);
                if (r_h * max !== record_h) {
                    let c_h = font.size * max + dbox.padding * 2 + 2 * max;
                    // console.log("451", view.height(r_h * max));
                    data.rows.setHeight(record_rc, c_h);
                    viewHeight += c_h;
                } else {
                    viewHeight += record_h;
                }
                max = 0;
            } else if (txt !== undefined && record_rc === ri) {
                if (txt !== undefined) {
                    const n = table.draw.selfAdaptionHeight(dbox, txt, font);
                    if (n > max || max === 0) {
                        max = n;
                    }
                }
            }
            record_rc = ri;
        });
        let record_h = data.rows.getHeight(record_rc);
        const style = table.getCellTextStyle(record_h, 0);
        const font = Object.assign({}, style.font);
        font.size = getFontSizePxByPt(font.size);
        const dbox = table.getDrawBox(record_rc, 0);
        if (r_h * max !== record_h && viewHeight > 0) {
            let c_h = font.size * max + dbox.padding * 2;
            viewHeight += c_h;
            data.rows.setHeight(record_rc, c_h);
        } else if (viewHeight > 0) {
            viewHeight += record_h;
        }
    }
    console.log(503, viewHeight);
    if (viewHeight > 0)
        data.settings.view.height = () => viewHeight + 40;
}

function clickSelectorChangeRiCi(evt) {
    const overlayer = evt.target.className === `${cssPrefix}-overlayer`;
    if (!overlayer) {
        return;
    }

    let {selector, data} = this;

    const {offsetX, offsetY} = evt;
    const cellRect = data.getCellRectByXY(offsetX, offsetY);

    selector.selectCell.setData(cellRect.ri, cellRect.ci);
    selector.selectCell.resetSelectOffset();
}

function rowResizerFinished(cRect, distance) {
    const {ri} = cRect;
    const {table, selector, data, toolbar} = this;
    data.setRowHeight(ri, distance);
    data.change(data.getData());
    toolbar.reset();
    table.render();
    selector.resetAreaOffset();
    verticalScrollbarSet.call(this);
    editorSetOffset.call(this);
}

function colResizerFinished(cRect, distance) {
    const {ci} = cRect;
    const {table, selector, data, toolbar} = this;
    data.setColWidth(ci, distance);
    data.change(data.getData());
    toolbar.reset();
    // console.log('data:', data);
    table.render();
    selector.resetAreaOffset();
    horizontalScrollbarSet.call(this);
    editorSetOffset.call(this);
}

function errorPop(enter, msg) {
    const {errorPopUp} = this;

    if (enter && !errorPopUp.open) {
        errorPopUp.show(msg);
        return {
            "state": true,
            "msg": msg
        };
    } else if (errorPopUp.open) {
        errorPopUp.hide();
        return {
            "state": true,
            "msg": msg
        };
    }
    return {
        "state": false,
        "msg": msg
    };
}

export function selectorCellText(ri, ci, {text, style}, state) {
    const {data, editor,} = this;
    let args = data.selectorCellText(ri, ci, text + "", state);
    if (args.state) {
        args = errorPop.call(this, true, args.msg);
        if (args.state) {
            return true;
        }
    }

    data.setCellText(ri, ci, {text, style});
    editor.setRiCi(-1, -1);

    return false;
}

function dataSetCellText(text, state = 'finished') {
    const {data, table, editor} = this;
    // const [ri, ci] = selector.indexes;
    let {ri, ci} = data.selector;
    if ((editor.ri !== ri && editor.ri !== -1) || (editor.ci !== ci && editor.ci !== -1)) {
        return;
    }

    data.setSelectedCellText(text, state);
    if (state === 'finished') table.render();
}

function throwFormula() {
    const {data} = this;
    data.throwFormula();
    // sheetReset.call(this);
}

export function insertDeleteRowColumn(type) {
    const {data} = this;
    if (type === 'insert-row') {
        data.insert('row');
    } else if (type === 'delete-row') {
        data.delete('row');
    } else if (type === 'insert-column') {
        data.insert('column');
    } else if (type === 'delete-column') {
        data.delete('column');
    } else if (type === 'delete-cell') {
        data.deleteCell();
    } else if (type === 'delete-cell-format') {
        data.deleteCell('format');
    } else if (type === 'delete-cell-text') {
        data.deleteCell('text');
    }
    clearClipboard.call(this);
    sheetReset.call(this);
}

function toolbarChange(type, value) {
    const {data} = this;
    if (type === 'undo') {
        this.undo();
    } else if (type === 'undoList') {
        value.setContent(data.historyList(1));
    } else if (type === 'redoList') {
        value.setContent(data.historyList(2));
    } else if (type === 'redo') {
        this.redo();
    } else if (type === 'print') {
        // print
    } else if (type === 'paintformat') {
        if (value === true) copy.call(this);
        else clearClipboard.call(this);
    } else if (type === 'clearformat') {
        insertDeleteRowColumn.call(this, 'delete-cell-format');
    } else if (type === 'link') {
        // link
    } else if (type === 'chart') {
        // chart
    } else if (type === 'autofilter') {
        // filter
        autofilter.call(this);
    } else if (type === 'throwFormula') {
        throwFormula.call(this);
    } else if (type === 'close') {
        let {mri, mci} = data.getMax();

        data.changeDataForCalc = new PreAction({
            type: 999,
            action: "重新计算", ri: -1, ci: -1, oldCell: {}, newCell: data.rows.eachRange(new CellRange(0, 0, mri, mci))
        }, this.data);
        sheetReset.call(this);
        // loadFormula.call(this, true);
    } else if (type === 'freeze') {
        let {showFreeze} = data.settings;
        if (value && showFreeze === true) {
            const {ri, ci} = data.selector;
            this.freeze(ri, ci);
        } else {
            this.freeze(0, 0);
        }
    } else if (type === 'add') {
        data.showEquation = !data.showEquation;
        sheetReset.call(this, true);
    } else {
        //format percent 473
        data.setSelectedCellAttr(type, value);
        if (type === 'border') {
            borderResSet.call(this, 'none');
        }
        if (type === 'cellFormulaProxy') {
            editorSet.call(this);
        }
        sheetReset.call(this);
    }
}

function borderResSet(value = "1px solid rgb(75, 137, 255") {
    this.selector.br.border(value);
}

function sortFilterChange(ci, order, operator, value) {
    this.data.setAutoFilter(ci, order, operator, value);
    sheetReset.call(this);
}

function afterSelector(editor) {
    if (editor.getLock() || editor.state === 2) {
        let {ri, ci} = editor;
        let inputText = editor.editorText.getText();
        let {selector} = this;
        selector.indexes = [ri, ci];
        return selectorCellText.call(this, ri, ci, {text: inputText}, 'input');
    }
    return false;
}

function pasteEvent(evt) {
    clearClipboard.call(this);
    mountPaste.call(this, evt, () => {
        sheetReset.call(this);
        let {data} = this;
        data.change(data.getData());
    });
}

function sheetInitEvents() {
    const {
        overlayerEl,
        rowResizer,
        colResizer,
        verticalScrollbar,
        horizontalScrollbar,
        editor,
         contextMenu,
        data,
        toolbar,
        modalValidation,
        sortFilter,
    } = this;

    // pasteOverlay.on('mousedown', evt => {
    //   console.log("669");
    //   pasteOverlay.hide();
    // });

    // overlayer
    overlayerEl
        .on('mousemove', (evt) => {
            overlayerMousemove.call(this, evt);
        })
        .on('mousedown', (evt) => {
            // renderAutoAdapt.call(this);
            // autoRowResizer.call(this);
            // the left mouse button: mousedown → mouseup → click
            // the right mouse button: mousedown → contenxtmenu → mouseup
            if (evt.buttons === 2) {
                if (data.xyInSelectedRect(evt.offsetX, evt.offsetY)) {
                    contextMenu.setPosition(evt.offsetX, evt.offsetY);
                    evt.stopPropagation();
                } else {
                    contextMenu.hide();
                    overlayerMousedown.call(this, evt);
                    setTimeout(() => {
                        contextMenu.setPosition(evt.offsetX, evt.offsetY);
                        evt.stopPropagation();
                    }, 100);
                }
                clickSelectorChangeRiCi.call(this, evt);
            } else if (evt.detail === 2) {
                clearTimeout(this.render_timer);
                editor.setMouseDownIndex([]);

                if (editor.getLock()) {
                    return;
                }
                editorSet.call(this);
            } else {
                if (editor.getLock() || editor.isCors) {
                    let _selector = null;
                    let change = 0;
                    mouseMoveUp(window, (e) => {
                        this.container.css('pointer-events', 'none');
                        if (_selector && _selector.selector) {
                            _selector.selector.setBoxinner("none");
                        }

                        let enter = true;
                        let {merges} = data;
                        // let {inputText} = editor;
                        let inputText = editor.editorText.getText();
                        let it = inputText;

                        Object.keys(merges._).forEach(i => {
                            let m = merges._[i];
                            const cut = cutStr(it, true);
                            for (let i = 0; i < cut.length; i++) {
                                if (cut[i].indexOf(":") !== -1) {
                                    let a1 = cut[i].split(":")[0];
                                    let a2 = cut[i].split(":")[1];
                                    let e1 = expr2xy(a1);
                                    let e2 = expr2xy(a2);

                                    if (m.sci >= e1[0] && m.sri >= e1[1] && m.eci <= e2[0] && m.eri <= e2[1]) {
                                        enter = false;
                                    }
                                }
                            }
                        });

                        if (enter) {
                            if (e.buttons === 1 && !e.shiftKey) {
                                let {ri, ci} = data.getCellRectByXY(e.offsetX, e.offsetY);
                                if (_selector && _selector.selector) {
                                    _selector = makeSelector.call(this, ri, ci, this.selectors, true, _selector.selector, true);
                                    lockCells.call(this, evt, _selector);
                                    this.mergeSelector = true;
                                } else {
                                    let {pos} = editor;
                                    let inputText = editor.editorText.getText();
                                    for (let i = 0; i < this.selectors.length; i++) {
                                        let selector = this.selectors[i];
                                        let {erpx} = selector;

                                        if (erpx === cuttingByPos(inputText, pos)) {
                                            _selector = selector;
                                            change = 1;
                                            _selector.selector.set(ri, ci, true);
                                            break;
                                        }
                                    }

                                    _selector = _selector ? _selector : makeSelector.call(this, ri, ci, this.selectors, true, null, false);
                                }
                            }
                        }
                    }, () => {
                        this.container.css('pointer-events', 'auto');
                        if (_selector && _selector.selector) {
                            _selector.selector.setBoxinner("auto");
                        }

                        if (this.mergeSelector === false) {
                            if (_selector && !change) {
                                this.selectors.push(_selector);
                            }
                            lockCells.call(this, evt, _selector);
                        } else if (_selector && !change && _selector.selector) {
                            this.selectors.push(_selector);
                        }
                        if (_selector) {
                            for (let i = 0; i < this.selectors.length; i++) {
                                let selector = this.selectors[i];

                                if (selector.className === _selector.className) {
                                    selector.erpx = _selector.erpx;
                                    break;
                                }
                            }
                        }
                        _selector = null;
                        change = 0;
                        this.mergeSelector = false;
                    });
                }

                console.time("dbclick time1");

                if (!editor.getLock() && !editor.isCors) {
                    console.time("dbclick time2");

                    let {ri, ci} = editor;
                    let inputText = editor.editorText.getText();
                    if (ri !== -1 && ci !== -1 && inputText[0] === "=") {
                        let error = selectorCellText.call(this, ri, ci, {text: inputText}, 'input');

                        if (error) {
                            return;
                        }
                    }
                    console.timeEnd("dbclick time2");

                    let state = editor.clear();

                    if (state) {

                        // let cell = data.rows.getCell(ri, ci);
                        // if (cell && cell.formulas) {
                        //     this.editorProxy.change(ri, ci, cell.formulas, data.rows, data);
                        // }
                        loadFormula.call(this);

                    }


                    this.selector.longTimeBefore();
                    overlayerMousedown.call(this, evt);
                    clickSelectorChangeRiCi.call(this, evt);
                    borderResSet.call(this);
                    clearSelectors.call(this);
                    editorSetOffset.call(this);
                }
                testValid.call(this);
                console.timeEnd("dbclick time1");

            }
        }).on('mousewheel.stop', (evt) => {
        overlayerMousescroll.call(this, evt);
    });

    // slide on mobile
    bindTouch(overlayerEl.el, {
        move: (direction, d) => {
            overlayerTouch.call(this, direction, d);
        }
    });

    // toolbar change
    toolbar.change = (type, value) => toolbarChange.call(this, type, value);

    // sort filter ok
    sortFilter.ok = (ci, order, o, v) => sortFilterChange.call(this, ci, order, o, v);

    // resizer finished callback
    rowResizer.finishedFn = (cRect, distance) => {
        rowResizerFinished.call(this, cRect, distance);
    };
    colResizer.finishedFn = (cRect, distance) => {
        colResizerFinished.call(this, cRect, distance);
    };
    // scrollbar move callback
    verticalScrollbar.moveFn = (distance, evt) => {
        verticalScrollbarMove.call(this, distance, evt);
    };
    horizontalScrollbar.moveFn = (distance, evt) => {
        horizontalScrollbarMove.call(this, distance, evt);
    };
    // editor
    editor.change = (state, itext) => {
        if (state === 'finish') { //  用户输入
            data.editorChangeToHistory(editor.editorText.getOldCell(), editor.editorText.getRICI(), 1);
            editor.editorText.setOldCell({}, {ri: -1, ci: -1});
            return;
        }

        // 如果是 esc
        if (itext === "@~esc") {
            let {text, formulas} = editor.editorText.getOldCell();
            editor.editorText.setOldCell({
                text: '',
                formulas: '',
            });
            let {ri, ci} = editor;
            data.setSelectedCell(text, 'input', formulas, ri, ci);
            editor.setText("");
            clearSelectors.call(this);
            editor.clear(true);
            // editor.setRiCi(-1, -1);
            return;
        }

        if (state === "format") {
            data.setSelectedCellAttr(state, "rmb");
            // return;
        }
        // let {selector} = this;
        // selector.el.hide();
        //实时更新this.selectors
        let {lock} = editor;
        editor.setMouseDownIndex(data.rows, []);
        editingSelectors.call(this, itext);

        if (lock && itext !== '=') {
            return;
        }

        // if (this.selectors.length > 0) {
        //     return;
        // }

        if (state === "format") {
            return;
        }

        dataSetCellText.call(this, itext, state);
    };
    // modal validation
    modalValidation.change = (action, ...args) => {
        if (action === 'save') {
            data.addValidation(...args);
        } else {
            data.removeValidation();
        }
    };
    // contextmenu
    contextMenu.itemClick = (type) => {
        // console.log('type:', type);
        if (type === 'validation') {
            modalValidation.setValue(data.getSelectedValidation());
        } else if (type === 'copy') {
            copy.call(this);
        } else if (type === 'cut') {
            cut.call(this);
        } else if (type === 'paste') {
            // paste.call(this, 'all');
            // process.call(this, document.execCommand("sheetCopy"));
            // createEvent(1, false, "paste");
            // console.log(  document.execCommand("paste"));
        } else if (type === 'paste-value') {
            paste.call(this, 'text');
        } else if (type === 'paste-format') {
            paste.call(this, 'format');
        } else {
            insertDeleteRowColumn.call(this, type);
        }
    };


    // let windows = this.el.el;
    bind(window, 'resize', () => {
        this.reload();
    });

    bind(window, 'click', (evt) => {
        overlayerEl.contains(evt.target);
        // this.focusing = overlayerEl.contains(evt.target);
    });

    bind(window, 'copy', (evt) => {
        mountCopy.call(this, evt);
        // data.history.add(data.getData());
    });

    bind(window, 'cut', (evt) => {
        console.log("cut", evt);
        cut.call(this);
        mountCopy.call(this, evt);
        let {data} = this;
        data.history.add(data.getData());
    });

    bind(window, 'paste', (evt) => {
        pasteEvent.call(this, evt);
    });

    // for selector
    bind(window, 'keydown', evt => {
        // if (!this.focusing) return;
        const keyCode = evt.keyCode || evt.which;
        const {
            key, ctrlKey, shiftKey,   metaKey,
        } = evt;
        // console.log('keydown.evt: ', keyCode);
        if (getChooseImg.call(this)) {
            console.log(keyCode);
            switch (keyCode) {
                case 8:         // delete
                    data.history.addPic(data.getData().pictures, "add");
                    deleteImg.call(this);
                    break;
                // case 90:         // delete
                //     data.history.addPic(data.getData().pictures, "add");
                //     deleteImg.call(this);
                //     break;
            }

            if (ctrlKey || metaKey) {
                if (90 === keyCode) {
                    this.undo();
                    evt.preventDefault();
                }
            }
        } else if (ctrlKey || metaKey) {
            // const { sIndexes, eIndexes } = selector;
            // let what = 'all';
            // if (shiftKey) what = 'text';
            // if (altKey) what = 'format';
            switch (keyCode) {
                case 90:
                    // undo: ctrl + z
                    this.undo();
                    evt.preventDefault();
                    break;
                case 89:
                    // redo: ctrl + y
                    this.redo();
                    evt.preventDefault();
                    break;
                case 67:
                    // ctrl + c
                    //  加上这里是因为 需要展示虚线
                    if (getChooseImg.call(this))
                        return;
                    copy.call(this);
                    // table.render();
                    // sheetReset.call(this);
                    evt.preventDefault();
                    break;
                case 88:
                    // ctrl + x
                    cut.call(this);
                    evt.preventDefault();
                    break;
                case 85:
                    // ctrl + u
                    toolbar.trigger('underline');
                    evt.preventDefault();
                    break;
                case 86:
                    // ctrl + v
                    // paste.call(this, what, () => {
                    //     console.log("837")
                    // });
                    break;
                case 37:
                    // ctrl + left

                    selectorMove.call(this, shiftKey, 'row-first');
                    evt.preventDefault();
                    break;
                case 38:
                    // ctrl + up
                    selectorMove.call(this, shiftKey, 'col-first');
                    evt.preventDefault();
                    break;
                case 39:
                    // ctrl + right
                    selectorMove.call(this, shiftKey, 'row-last');
                    evt.preventDefault();
                    break;
                case 40:
                    // ctrl + down
                    selectorMove.call(this, shiftKey, 'col-last');
                    evt.preventDefault();
                    break;
                case 32:
                    // ctrl + space, all cells in col
                    selectorSet.call(this, false, -1, data.selector.ci, false);
                    evt.preventDefault();
                    break;
                case 66:
                    // ctrl + B
                    toolbar.trigger('font-bold');
                    break;
                case 73:
                    // ctrl + I
                    toolbar.trigger('font-italic');
                    break;
                default:
                    break;
            }
        } else {
            // console.log('evt.keyCode:', evt.keyCode);
            switch (keyCode) {
                case 32:
                    if (shiftKey) {
                        // shift + space, all cells in row
                        selectorSet.call(this, false, data.selector.ri, -1, false);
                    }
                    break;
                case 27: // esc
                    contextMenu.hide();
                    clearClipboard.call(this);
                    break;
                case 37: // left
                    selectorMove.call(this, shiftKey, 'left');
                    evt.preventDefault();
                    break;
                case 38: // up
                    selectorMove.call(this, shiftKey, 'up');
                    evt.preventDefault();
                    break;
                case 39: // right
                    selectorMove.call(this, shiftKey, 'right');
                    evt.preventDefault();
                    break;
                case 40: // down
                    selectorMove.call(this, shiftKey, 'down');
                    evt.preventDefault();
                    break;
                case 9: // tab
                    // lockCells
                    // this.editorProxy.change(editor.ri, editor.ci, editor.editorText.getText(), data.rows, data);
                    let error = afterSelector.call(this, editor);
                    if (error) {
                        return;
                    }

                    editor.clear();
                    // shift + tab => move left
                    // tab => move right
                    selectorMove.call(this, false, shiftKey ? 'left' : 'right');
                    evt.preventDefault();
                    // 清除各种属性
                    clearSelectors.call(this);
                    break;
                case 13: // enter
                    // lockCells
                    // this.editorProxy.change(editor.ri, editor.ci, editor.editorText.getText(), data.rows, data);
                    let error2 = afterSelector.call(this, editor);
                    if (error2) {
                        return;
                    }
                    editor.clear();
                    renderAutoAdapt.call(this);
                    autoRowResizer.call(this);
                    selectorMove.call(this, false, shiftKey ? 'up' : 'down');
                    loadFormula.call(this);

                    evt.preventDefault();
                    editorSetOffset.call(this, true);
                    // 清除各种属性
                    clearSelectors.call(this);
                    break;
                case 8: // backspace
                    insertDeleteRowColumn.call(this, 'delete-cell-text');
                    // evt.preventDefault();
                    break;
                default:
                    break;
            }

            if (key === 'Delete') {
                insertDeleteRowColumn.call(this, 'delete-cell-text');
                evt.preventDefault();
            } else if ((keyCode >= 65 && keyCode <= 90)
                || (keyCode >= 48 && keyCode <= 57)
                || (keyCode >= 96 && keyCode <= 105)
                || evt.key === '='
            ) {
                // dataSetCellText.call(this, evt.key, 'input');
                // editorSet.call(this);
                // editor.inputEventHandler();
            } else if (keyCode === 113) {
                // F2
                editorSet.call(this);
            }
        }
    });
}

export {
    sheetReset,
    selectorSet,
}

export default class Sheet {
    constructor(targetEl, data) {
        const {view, showToolbar, showContextmenu, showEditor, rowWidth} = data.settings;
        this.el = h('div', `${cssPrefix}-sheet`);
        this.toolbar = new Toolbar(data, view.width, !showToolbar);

        targetEl.children(this.toolbar.el, this.el);
        this.pictureOffsetLeft = 10;
        this.pictureOffsetTop = 10;

        this.data = data;
        // table
        this.tableEl = h('canvas', `${cssPrefix}-table`);
        // resizer
        this.rowResizer = new Resizer(false, data.rows.height);
        this.colResizer = new Resizer(true, data.cols.minWidth);
        // scrollbar
        this.verticalScrollbar = new Scrollbar(true);
        this.horizontalScrollbar = new Scrollbar(false);
        // editor
        this.editor = new Editor(
            fnNameArrayWithKey,
            () => this.getTableOffset(),
            data.rows.height,
            data.cols.width,
            data,
            this,
        );
        this.stopTimer = new Timer();
        this.stopTimer2 = new Timer();
        this.website = new Website(data, this.editor);

        // data validation
        this.modalValidation = new ModalValidation();
        this.errorPopUp = new ErrorPopUp();
        // contextMenu
        this.contextMenu = new ContextMenu(() => this.getTableOffset(), !showContextmenu);
        // selector
        this.selector = new Selector(data, this, true);
        this.selectorMoveEl = new Selector(data, this, false);
        // this.editorProxy = created EditorProxy();

        this.advice = new Advice(data, this);
        // this.pasteDirectionsArr = [];
        // this.pasteOverlay = h('div', `${cssPrefix}-paste-overlay-container`).hide();

        this.overlayerCEl = hasEditor.call(this, showEditor);
        this.selectors = [];
        this.container = h('div', '');
        this.selectorsEl = h('div', `selector_clear`).attr("id", "selector_clear");

        // 把图片容器移到了 overlayerCEl 下面，原因是 如果在 overlayerEl下面 会遮挡表头
        this.overlayerCEl.children(this.selectorsEl, this.container);

        this.mergeSelector = false;

        this.overlayerEl = h('div', `${cssPrefix}-overlayer`)
            .children(this.overlayerCEl);
        // sortFilter
        this.sortFilter = new SortFilter();
        this.direction = false;   // 图片移动

        // root element
        this.el.children(
            this.tableEl,
            this.rowResizer.el,
            this.overlayerEl.el,
            this.colResizer.el,
            this.verticalScrollbar.el,
            this.horizontalScrollbar.el,
            this.contextMenu.el,
            this.modalValidation.el,
            this.errorPopUp.el,
            this.sortFilter.el,
            this.advice.el,
            this.website.el,
            this.website.tableEl,
            // this.pasteOverlay.el,
        );

        // table
        this.table = new Table(this.tableEl.el, data, this.editor);
        sheetInitEvents.call(this);
        sheetReset.call(this, false);
        // init selector [0, 0]
        selectorSet.call(this, false, 0, 0);

        if (rowWidth && rowWidth.state) {
            firstRowToWidth.call(this, rowWidth.width)
        }
    }

    selectorMoveReset() {
        editorSetOffset.call(this);
        this.editor.setRiCi(this.data.selector.ri, this.data.selector.ci)
        sheetReset.call(this);
    }

    getTable() {
        let {table} = this;
        return {
            recalc: false,
            table: table
        }
    }

    clickCopyPaste() {
        let {data} = this;
        let args = data.clickCopyPaste();
        if (args.enter) {
            this.selector.arange = args.dstCellRange;
            data.clickAutofill(args.srcCellRange, args.dstCellRange, "all", msg => xtoast('Tip', msg));
            autofillNext.call(this);
        }
    }

    setCellRange(reference, tableProxy, styleBool, cellRange) {
        let {  data} = this;
        data.paste(cellRange);
        for (let i = 0; i < reference.length; i++) {
            let {ri, ci} = reference[i];
            let cell = deepCopy(tableProxy.rows.getCellOrNew(ri, ci));
            if (styleBool === false) {
                delete cell['style'];
            }
            selectorCellText.call(this, ri, ci, cell, 'style');
            selectorSet.call(this, true, ri, ci, true, true);
        }
    }

    selectorEditorReset(ri, ci) {
        let {selector} = this;
        editorSetOffset.call(this, true, ri, ci);
        this.editor.setRiCi(ri, ci);
        selector.hide();
        sheetReset.call(this);
    }

    loadData(data) {
        this.data.setData(data, this);
        // 把所有后端计算的公式过滤出来
        // this.editorProxy.associatedArr(this.data.rows);
        sheetReset.call(this);
        return this;
    }

    // freeze rows or cols
    freeze(ri, ci) {
        const {data} = this;
        data.setFreeze(ri, ci);
        sheetReset.call(this);
        return this;
    }

    undo() {
        this.data.undo(this);
        sheetReset.call(this);
    }

    redo() {
        this.data.redo();
        sheetReset.call(this);
    }

    reload() {
        sheetReset.call(this);
        return this;
    }

    removeEvent() {
        remove.call(this);
    }

    getRect() {
        const {data} = this;
        return {width: data.viewWidth(), height: data.viewHeight()};
    }

    getTableOffset() {
        const {rows, cols} = this.data;
        const {width, height} = this.getRect();
        return {
            width: width - cols.indexWidth,
            height: height - rows.height,
            left: cols.indexWidth,
            top: rows.height,
        };
    }
}

