import {cssPrefix} from "../config";
import {h} from "../component/element";
import {helpFormula} from "../utils/help_formula";
import {bind} from "./event";

function variableElement(content, txt, pos, className, s = "", s2 = "") {
    let item = h('div', className);
    for (let i = 0; i < content[txt].length; i++) {
        let ct = content[txt][i];
        let {name, editor, index} = ct;

        if (pos === i) {
            item.child(h('span', s).child(name));
        } else if (editor === true && pos >= index) {
            item.child(h('span', s).child(name));
        } else {
            item.child(h('span', s2).child(name));
        }
    }

    return item;
}

export default class SuggestContent {
    constructor(width = "300px") {
        this.el = h('div', `${cssPrefix}-suggest-content`).css('width', width).css('z-index', "10000").css('position', "absolute").hide();
        this.el.attr('tabindex', 0);
        bind(this.el.el, 'paste', evt => {
            evt.stopPropagation();
        });
        bind(this.el.el, 'copy', evt => {
            evt.stopPropagation();
        });
        bind(this.el.el, 'keydown', evt => {
            evt.stopPropagation();
        });
        bind(this.el.el, 'keyup', evt => {
            evt.stopPropagation();
        });
    }

    hide() {
        const {el} = this;
        el.hide();
    }

    content(cut = "", pos = -1) {
        const {el} = this;

        cut = cut.toUpperCase();
        // cut 找到内容
        let content = {};
        Object.keys(helpFormula).forEach(i => {
            if (i === cut) {
                content = helpFormula[i];
            }
        });

        if (!content || JSON.stringify(content) === '{}') {
            return;
        }

        let items = [];
        let title = variableElement.call(this, content, "title", pos, `${cssPrefix}-help-title`, `${cssPrefix}-help-span-title`, `${cssPrefix}-help-span2-title`);
        let exampleName = h('div', `${cssPrefix}-help-section-title`).child("示例");
        let example = variableElement.call(this, content, "example", pos, `${cssPrefix}-help-section-content`, `${cssPrefix}-help-span3-title`);
        items.push(...[title, exampleName, example]);
        Object.keys(content.content).forEach(i => {
            let c = content.content[i];
            let item = h('div', `${cssPrefix}-help-section-title`).child(i);
            let item2 = h('div', `${cssPrefix}-help-section-content`).child(c);
            items.push(...[item, item2]);
        });

        el.html('').children(...items).show();
    }
}