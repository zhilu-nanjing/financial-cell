import {h} from "../component/element";
import {bindClickoutside2, unbindClickoutside} from "../component/event";
import {tf} from "../locale/locale";
import {cssPrefix} from "../config";

const menuItems = [
    { key: 'recover', title: tf('contextmenu.recover'), label: '' },

];

function buildMenuItem(item) {
    if (item.key === 'divider') {
        return h('div', `${cssPrefix}-item divider`);
    }
    return h('div', `${cssPrefix}-item`)
        .on('click', (evt) => {
            this.itemClick(item.key, evt);
            this.hide();
        })
        .children(
            item.title(),
            h('div', 'label').child(item.label || ''),
        );
}

function buildMenu() {
    return menuItems.map(it => buildMenuItem.call(this, it));
}

export default class ContextMenu {
    constructor(viewFn, isHide = false) {
        this.el = h('div', `${cssPrefix}-contextmenu`)
            .children(...buildMenu.call(this))
            .hide();
        this.el.css('width', '100px');
        this.viewFn = viewFn;
        this.itemClick = () => {};
        this.isHide = isHide;
    }

    hide() {
        const { el } = this;
        el.hide();
        unbindClickoutside(el);
    }

    setPosition(x, y, revision) {
        if (this.isHide) return;
        const { el } = this;
        el.show();
        let top = y;
        let left = x;

        el.offset({ left, top });
        bindClickoutside2(el, revision);
    }
}
