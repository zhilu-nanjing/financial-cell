import {Element, h} from './element';
import {bindClickoutside, unbindClickoutside} from './event';
import {cssPrefix} from '../config';

export default class Dropdown extends Element {
    constructor(title, width, showArrow, placement, {type, change, arrowChange, historyBorder}, ...children) {
        super('div', `${cssPrefix}-dropdown ${placement}`);

        this.title = title;
        this.change = () => {
        };
        if (typeof title === 'string') {
            this.title = h('div', `${cssPrefix}-dropdown-title`).child(title);
        } else if (showArrow) {
            this.title.addClass('arrow-left');
        }
        this.contentEl = h('div', `${cssPrefix}-dropdown-content`)
            .children(...children)
            .css('width', width)
            .hide();

        if (type) {
            this.headerEl = h('div', `${cssPrefix}-dropdown-header`).on('click', change);
            this.headerEl.children(
                this.title,
                showArrow ? h('div', `${cssPrefix}-icon arrow-right_d`).child(
                    h('div', `${cssPrefix}-icon-img arrow-down`).on('click.stop', (evt) => {
                        arrowChange(historyBorder);
                        if (this.contentEl.css('display') !== 'block') {
                            this.show();
                        } else {
                            this.hide();
                        }
                    }),
                ) : '',
            );
            this.children(this.headerEl, this.contentEl);
        } else {
            this.headerEl = h('div', `${cssPrefix}-dropdown-header`);
            this.headerEl.on('click', () => {
                if (this.contentEl.css('display') !== 'block') {
                    this.show();
                } else {
                    this.hide();
                }
            }).children(
                this.title,
                showArrow ? h('div', `${cssPrefix}-icon arrow-right`).child(
                    h('div', `${cssPrefix}-icon-img arrow-down`),
                ) : '',
            );
            this.children(this.headerEl, this.contentEl);
        }
    }

    setTitle(title) {
        this.title.html(title);
        this.hide();
    }

    show() {
        const {contentEl} = this;
        contentEl.show();
        this.parent().active();
        bindClickoutside(this.parent(), () => {
            this.hide();
        });
    }

    hide() {
        this.parent().active(false);
        this.contentEl.hide();
        unbindClickoutside(this.parent());
    }
}
