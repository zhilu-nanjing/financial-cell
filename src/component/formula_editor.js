import SelectorCopy from '../component/selector_copy';
import {
    cutFirst,
    cutStr,
    cutting,
    cutting2,
    cuttingByPos,
    isAbsoluteValue,
    operation,
    value2absolute,
} from '../core/operator';
import {expr2xy, xy2expr} from '../core/alphabet';
import {selectorColor} from './color_palette';
import {h} from './element';

/**
 * 这个文件是sheet.js的衍生文件
 */


function lockCells(evt, _selector, isAb = false, p = -1) {
    const {data, editor} = this;
    const {offsetX, offsetY} = evt;

    const cellRect = data.getCellRectByXY(offsetX, offsetY);
    const {ri, ci} = cellRect;

    let {pos} = editor;
    let inputText = editor.editorText.getText();
    let input = '';

    editor.handler(inputText);
    const {mousedownIndex} = editor;
    if (isAbsoluteValue(cuttingByPos(inputText, pos), 2) || _selector) {
        if (_selector) {
            const {
                sri, sci, eri, eci,
            } = _selector.selector.range;

            const s1 = xy2expr(sci, sri);
            const s2 = xy2expr(eci, eri);
            let text = s1 === s2 ? s1 : `${s1}:${s2}`;

            if (isAb === 2) {
                const es1 = value2absolute(s1);
                const es2 = value2absolute(s2);
                text = es1.s1 === es2.s1 ? es1.s1 : `${es1.s1}:${es2.s1}`;
            } else if (isAb === 1) {
                const es1 = value2absolute(s1);
                const es2 = value2absolute(s2);
                text = es1.s2 === es2.s2 ? es1.s2 : `${es1.s2}:${es2.s2}`;
            } else if (isAb === 3) {
                const es1 = value2absolute(s1);
                const es2 = value2absolute(s2);
                text = es1.s3 === es2.s3 ? es1.s3 : `${es1.s3}:${es2.s3}`;
            }
            _selector.erpx = text;
            let {isCors} = editor;
            if (isCors) {
                pos = 1;
            }

            let sp = p !== -1 ? p : pos - cuttingByPos(inputText, pos).length;
            input = inputText.substring(0, sp) + text + inputText.substring(pos, inputText.length);
            editor.setText(input);
            editor.setCursorPos(inputText.substring(0, sp).length + text.length);
        } else {
            // 此情况是例如: =A1  -> 这时再点A2  则变成: =A2
            let enter = 0;
            for (let i = 0; i < this.selectors.length && enter === 0; i++) {
                const selector = this.selectors[i];
                const {erpx} = selector;
                if (erpx === cuttingByPos(inputText, pos)) {
                    const {ri, ci} = cellRect;
                    this.selectors[i].ri = ri;
                    this.selectors[i].ci = ci;
                    this.selectors[i].erpx = xy2expr(ci, ri);
                    this.selectors[i].selector.set(ri, ci);
                    input = `${inputText.substring(0, pos - erpx.length)}${xy2expr(ci, ri)}${inputText.substring(pos, inputText.length)}`;
                    editor.setText(input);
                    editor.setCursorPos(inputText.substring(0, pos - erpx.length).length + xy2expr(ci, ri).length);
                    enter = 1;
                }
            }
        }
    } else if (mousedownIndex.length > 0) {
        if (operation(mousedownIndex[1][0]) && isAbsoluteValue(cuttingByPos(mousedownIndex[1], mousedownIndex[1].length), 2)) {
            editor.setLock(false);
            return;
        }

        const args = makeSelector.call(this, ri, ci);
        this.selectors.push(args);
        input = `${mousedownIndex[0]}${xy2expr(ci, ri)}${mousedownIndex[1]}`;
        const judgeText = input.substring(mousedownIndex[0].length + xy2expr(ci, ri).length, input.length);
        // 不是的话，需要删除这个
        let number = cutFirst(judgeText.substring(1));
        if (operation(judgeText[0]) && !isAbsoluteValue(number, 2)) {
            editor.setText(input);
            editor.setMouseDownIndex([]);
            return;
        }
        // 不是的话，需要删除这个
        number = cutFirst(mousedownIndex[1]);

        console.log(xy2expr(ci, ri));
        const cut = cutStr(`${mousedownIndex[0]}${xy2expr(ci, ri)}+4${mousedownIndex[1]}`);
        const {selectors_delete, selectors_new} = filterSelectors.call(this, cut);
        Object.keys(selectors_delete).forEach((i) => {
            const selector = selectors_delete[i];
            selector.removeEl();
        });

        this.selectors = selectors_new;

        input = input.replace(number, '');
        editor.setText(input);
        // const content = suggestContent.call(this, pos - 1, cutting(inputText), inputText);
        editor.setCursorPos(mousedownIndex[0].length + xy2expr(ci, ri).length);
    } else {
        const {pos} = editor;

        const args = _selector || makeSelector.call(this, ri, ci);
        if (pos !== -1) {
            let str = '';
            let enter = false;
            let step = pos;
            let first = '';
            for (let i = pos; i < inputText.length; i++) first += inputText[i];
            let len = cutFirst(first).length;
            for (let i = 0; i < inputText.length; i++) {
                if (pos === i) {
                    enter = true;
                    str += xy2expr(ci, ri);
                }

                if (step === i && len > 0) {
                    step += 1;
                    len -= 1;
                } else {
                    str += inputText[i];
                }
            }

            if (_selector) {
                const {
                    sri, sci, eri, eci,
                } = data.selector.range;
                const s1 = xy2expr(sci, sri);
                const s2 = xy2expr(eci, eri);

                input = s1 === s2 ? s1 : `${s1}:${s2}`;
                str = !enter ? str + input : str;
            } else {
                this.selectors.push(args);
                str = !enter ? str + xy2expr(ci, ri) : str;
            }
            editor.setText(str);
            editor.setCursorPos(str.length);
            editor.parse();
        } else {
            this.selectors.push(args);
            input = `${inputText}${xy2expr(ci, ri)}`;
            editor.setText(input);
        }
    }
    editor.parse(editor.pos);
    if (this.selectors.length > 0 || _selector) {
        // const {inputText} = editor;
        let inputText = editor.editorText.getText();
        // 处理 合并单元格
        let it = inputText, enter = false;
        let {merges} = this.data;
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
                        it = it.replace(new RegExp(cut[i], 'g'), a1);
                        enter = true;
                    }
                }
            }
        });


        // clearSelectors.call(this);
        // console.log(it);
        div2span.call(this, cutting(it), cutting2(it));
        if (enter) {
            setTimeout(() => {
                editor.setCursorPos(it.length);
            }, 10);
        }
    }
    // step 3.  在enter或者点击的时候写入到cell中
    // dataSetCellText.call(this, input, 'input');
}

function filterSelectors(cut) {
    const selectors_new = [];
    const selectors_delete = [];
    Object.keys(this.selectors).forEach((i) => {
        const selector = this.selectors[i];
        const {erpx} = selector;
        let enter = 0;
        for (let i2 = 0; i2 < cut.length && enter === 0; i2++) {
            if (cut[i2].replace(/\$/g, '') === erpx) {
                enter = 1;
                selectors_new.push(selector);
            }
        }

        if (enter === 0) {
            selectors_delete.push(selector.selector.el);
        }
    });
    return {
        selectors_delete,
        selectors_new,
    };
}

function makeSelector(ri, ci, selectors = this.selectors, multiple = false, _selector, mergeSelector) {
    const {data} = this;
    let selector = null;
    // const {inputText} = this.editor;
    let inputText = this.editor.editorText.getText();
    const {color, index} = selectorColor(selectors.length);
    if (_selector) {
        selector = _selector;
    } else {
        const className = `selector${Math.random() * 999999}`;
        selector = new SelectorCopy(data, this, className);
        selector.el.attr('class', `${className} clear_selector`);
        selector.setCss(color);
    }

    if (multiple) {
        if (mergeSelector) {
            selector.setEnd(ri, ci);
        } else {
            selector.set(ri, ci, true);
        }
    } else {
        selector.set(ri, ci, false);
    }

    selector.el.css('z-index', '100');
    const len = inputText.split(xy2expr(ci, ri)).length - 2;

    let it = xy2expr(ci, ri);
    let {merges} = data;
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
                    it = it.replace(new RegExp(cut[i], 'g'), a1);
                }
            }
        }
    });

    const args = {
        ri,
        ci,
        index: len,
        color,
        index2: index,
        className: selector.el.el.className,
        erpx: it,
        selector,
    };
    if (!mergeSelector) {
        selector.el.show();
        this.selectorsEl.child(selector.el);
    }

    if (multiple) {
        return args;
    }

    this.selectorsEl.child(selector.el);
    return args;
}

function clearSelectors() {
    this.selectorsEl.html('');
    this.selectors = [];
    const {editor, selector} = this;
    editor.setLock(false);

    // // 这行是在 @~esc的时候加的 原因是要把ri ci赋值为-1
    // editor.setRiCi(-1, -1);
    editor.state = 1;
    selector.el.show();
}

// 输入 input
function editingSelectors(text = '') {
    if (typeof text === 'number') {
        return;
    }
    const selectors_new = [];
    const cut = cutStr(text, true);
    // case 1  过滤 selectors
    const {selectors_delete} = filterSelectors.call(this, cut);

    Object.keys(selectors_delete).forEach((i) => {
        const selector = selectors_delete[i];
        selector.removeEl();
    });


    const selectors_valid = selectors_new;
    // case 2  验证 selectors
    Object.keys(cut).forEach((i) => {
        let enterCode = 1;
        Object.keys(this.selectors).forEach((i) => {
            const {selector} = this.selectors[i];
            selector.el.removeEl();
        });

        // 绝对值
        let arr = '';
        let sc = cut[i].replace(/\$/g, "");
        if (isAbsoluteValue(cut[i])) {
            const notTrueValue = cut[i].replace(/\$/g, '');
            arr = expr2xy(notTrueValue);
        } else if (sc.search(/^[A-Za-z]+\d+:[A-Za-z]+\d+$/) !== -1) {
            enterCode = 2;
        } else {
            arr = expr2xy(cut[i]);
        }

        if (enterCode === 1) {
            const ri = arr[1];
            const
                ci = arr[0];
            const args = makeSelector.call(this, ri, ci, selectors_valid);
            args.erpx = cut[i];
            selectors_valid.push(args);
        } else if (enterCode === 2) {
            const prx = cut[i].replace(/\$/g, '').split(':')[0];
            const lax = cut[i].replace(/\$/g, '').split(':')[1];

            const prx_index = expr2xy(prx);
            const lax_index = expr2xy(lax);
            let args = makeSelector.call(this, prx_index[1], prx_index[0], selectors_valid, true, null, false);
            args = makeSelector.call(this, lax_index[1], lax_index[0], selectors_valid, true, args.selector, true);
            args.erpx = cut[i];
            selectors_valid.push(args);
        }
    });
    this.selectors = selectors_valid;

    if (this.selectors.length > 0 || text[0] === '=') {
        div2span.call(this, cutting(text), cutting2(text));
    }
}

// 找 ( 的index
function findBracketLeft(cut, i) {
    let begin = -1;
    let has = 0;
    let stop = false;

    for (let j = i - 1; j > 0 && stop === false; j--) {
        if (cut[j] === '(') {
            stop = true;
        }
        if (cut[j] === ')') {
            has++;
        }
    }

    for (let j = i; j > 0 && begin === -1; j--) {
        if (cut[j] === '(') {
            if (has === 0) {
                begin = j;
            }
            has--;
        }
    }

    return begin;
}

// => { left: 0, right: 0,  exist: false }
function findBracket(pos, cut, text) {
    let args = {left: 0, right: 0, exist: false};
    if (text[pos] !== ')') {
        return args;
    }
    const right = pos;
    const left = findBracketLeft.call(this, cut, right);

    if (left !== -1 && right !== -1) {
        args = {left, right, exist: true};
    }
    return args;
}


// 找 ) 的 index
function findBracketRight(cut, i) {
    let begin = -1;
    let has = 0;
    let stop = false;

    for (let j = i + 1; j < cut.length && stop === false; j++) {
        if (cut[j] === ')') {
            stop = true;
        }
        if (cut[j] === '(') {
            has++;
        }
    }

    for (let j = i; j < cut.length && begin === -1; j++) {
        if (cut[j] === ')') {
            if (has === 0) {
                begin = j;
            }
            has--;
        }
    }

    return begin;
}


function suggestContent(pos, cut, inputText) {
    // 如果在括号内
    // step 1. 找到距离pos最近的左、右括号的index
    // step 2. 若1成立，找到该函数名
    // step 3. 找光标前有几个逗号
    const content = {suggestContent: false, cut: '', pos: 1};
    const begin = pos - 1;
    const left = findBracketLeft.call(this, cut, begin);
    const right = findBracketRight.call(this, cut, left);

    if (left <= begin && left !== -1 && (right >= begin || right === -1)) {
        content.suggestContent = true;
        content.cut = cuttingByPos(inputText, left);
    }

    for (let i = left; i < begin + 1; i++) {
        if (inputText[i] === ',') {
            content.pos += 2;
        }
    }

    return content;
}

function div2span(cut, cutcolor) {
    const {editor} = this;

    const spanArr = [];
    let begin = -1;
    let end = -1;

    Object.keys(cut).forEach((i) => {
        const spanEl = h('span', `formula_span${i}`);
        Object.keys(cutcolor).forEach(() => {
            if (cutcolor[i] && cutcolor[i].code !== -1 && cutcolor[i].data === cut[i]) {
                const {color} = selectorColor(cutcolor[i].code);
                spanEl.css('color', color);
            }
        });
        spanEl.css('display', 'inline-block');
        spanEl.css('cursor', 'text');

        if (cut[i] === ' ') {
            spanEl.html('&emsp;');
        } else {
            spanEl.html(cut[i]);
        }

        spanArr.push(spanEl);
    });

    // 高亮
    const {pos} = editor;
    let inputText = editor.editorText.getText();
    let content = {suggestContent: false, cut: ''};
    if (inputText[pos - 1] === ')') {
        begin = pos - 1;
        end = findBracketLeft.call(this, cut, begin);
    } else {
        content = suggestContent.call(this, pos + 1, cut, inputText);
    }


    if (inputText !== '' && spanArr.length <= 0) {
        const spanEl = h('span', 'formula_span');
        spanArr.push(spanEl);
    }
    // 挂载
    editor.mount2span(spanArr, begin, end, content);
}


export {
    lockCells,
    clearSelectors,
    editingSelectors,
    findBracket,
    suggestContent,
    makeSelector,
};
