import {h} from './element';
import {bind, bindClickoutside, createEvent, unbindClickoutside} from './event';
import {cssPrefix} from '../config';
import CellRange from "../core/cell_range";

function inputMovePrev(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    const {filterItems} = this;
    if (filterItems.length <= 0) return;
    if (this.itemIndex >= 0) filterItems[this.itemIndex].toggle();
    this.itemIndex -= 1;
    if (this.itemIndex < 0) {
        this.itemIndex = filterItems.length - 1;
        this.el.el.scrollTop = this.el.el.scrollHeight;
    }
    this.el.el.scrollTop = (this.itemIndex - 9) * 33;

    filterItems[this.itemIndex].toggle();
}

function inputMoveNext(evt) {
    evt.stopPropagation();
    const {filterItems} = this;
    if (filterItems.length <= 0 || filterItems.length < this.itemIndex) return;
    if (this.itemIndex >= 0) filterItems[this.itemIndex].toggle();
    this.itemIndex += 1;
    if (this.itemIndex > filterItems.length - 1) {
        this.itemIndex = 0;
        this.el.el.scrollTop = 0;
    }
    this.el.el.scrollTop = (this.itemIndex - 9) * 33;
    console.log(filterItems.length);
    filterItems[this.itemIndex].toggle();
}

function inputEnter(evt) {
    evt.preventDefault();
    const {filterItems} = this;
    if (filterItems.length <= 0) return;
    evt.stopPropagation();
    if (this.itemIndex < 0) {
        this.itemIndex = 0;
        this.hide();
             createEvent.call(this, 13, false);

        return
    }

    filterItems[this.itemIndex].el.click();
    this.hide();
}

function inputKeydownHandler(evt) {
    const {keyCode} = evt;
    if (evt.ctrlKey) {
        evt.stopPropagation();
    }
    switch (keyCode) {
        case 37: // left
            evt.stopPropagation();
            break;
        case 38: // up
            inputMovePrev.call(this, evt);
            evt.stopPropagation();
            break;
        case 39: // right
            evt.stopPropagation();
            break;
        case 40: // down
            inputMoveNext.call(this, evt);
            evt.stopPropagation();
            break;
        case 13: // enter
            inputEnter.call(this, evt);
            break;
        case 9:
            inputEnter.call(this, evt);
            break;
        default:
            evt.stopPropagation();
            break;
    }
}

/**
 * 函数提示-查看一共都有哪些函数
 */
export default class Suggest {
    constructor(items, itemClick, data, editor, width = '200px') {
        this.filterItems = [];
        this.items = items;
        this.data = data;
        this.editor = editor;
        this.el = h('div', `${cssPrefix}-suggest`)
            .css('width', width)
            .css('overflow-y', 'auto')
            .css('max-height', '306px').hide();
        this.el.attr('tabindex', 0);


        this.itemClick = itemClick;
        this.itemIndex = -1;
        this.show = false;
    }

    setOffset(v) {
        this.el.cssRemoveKeys('top', 'bottom')
            .offset(v);
    }

    hide() {
        const {el} = this;
        this.filterItems = [];
        this.itemIndex = -1;
        el.hide();
        this.show = false;
        unbindClickoutside(this.el.parent());
    }

    setItems(items) {
        this.items = items;
        // this.search('');
    }

    search(word) {
        let {items, data, editor} = this;
        if (!/^\s*$/.test(word)) {
            items = items.filter(it => (it.key.toUpperCase() || it.toUpperCase()).startsWith(word.toUpperCase()));
        }
        items = items.map((it) => {
            let {title} = it;
            if (title) {
                if (typeof title === 'function') {
                    title = title();
                }
            } else {
                title = it;
            }
            const item = h('div', `${cssPrefix}-item`)
                .child(title)
                .on('click.stop', () => {
                    this.itemClick(it);
                });
            if (it.label) {
                item.child(h('div', 'label').html(it.label));
            }
            return item;
        });
        this.filterItems = items;
        if (items.length <= 0) {
            this.hide();
            this.show = false;
            return;
        }
        const {el} = this;
        // items[0].toggle();
        let rect = data.getRect(new CellRange(editor.ri, editor.ci, editor.ri, editor.ci));
        let left = rect.left + 55;
        let top = rect.top + 50;

        if( items.length >= 9 && rect.top - 306 >= 50) {
            top -= 306;
            top -= rect.height;
        }
        el.css('left', `${left}px`);
        el.css('top', `${top}px`);

        el.html('').children(...items).show();
        this.show = true;
        bindClickoutside(el.parent(), () => {
            this.hide();
            this.show = false;
        });
    }

    bindInputEvents(input) {
        input.on('keydown', evt => inputKeydownHandler.call(this, evt));
    }
}
