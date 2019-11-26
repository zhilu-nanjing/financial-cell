import {h} from './element';
import {cssPrefix} from '../config';
import {sheetReset} from './sheet';

/**
 * 复制单元格，然后粘贴到其他位置的时候，右下角会出现提示，提示是否保留文本等。这个提示就是advice
 */
export default class Advice {
    constructor(data, sheet) {
        this.el = h('div', `${cssPrefix}-advice`)
            .children(
                this.save = h('div', `${cssPrefix}-advice-style`)
                    .css('border-bottom', '1px solid'),
                this.text = h('div', `${cssPrefix}-advice-style`),
            )
            .hide();
        this.save.children(
            this.saveCheck = h('span', 'check').hide('visibility', 'hidden'),
            h('span', '').html('保留样式'),
        );
        this.text.children(
            this.textCheck = h('span', 'check').hide('visibility', 'hidden'),
            h('span', '').html('仅文本'),
        );
        this.data = data;
        this.sheet = sheet;
        this.left = 0;
        this.top = 0;

        this.save.on('mousedown.stop', () => {
            this.saveCheck.show('visibility', 'initial');
            this.textCheck.hide('visibility', 'hidden');
            this.sheet.setCellRange(this.reference, this.tableProxy, true);
            sheetReset.call(this.sheet);
        });

        this.text.on('mousedown.stop', () => {
            this.sheet.setCellRange(this.reference, this.tableProxy, false);
            this.saveCheck.show('visibility', 'hidden');
            this.textCheck.hide('visibility', 'initial');
            sheetReset.call(this.sheet);
        });
    }

    show(left, top, type = 1, reference, tableProxy ) {
        this.el.css('left', `${left}px`);
        this.el.css('top', `${top}px`);
        if (type === 1) {
            this.saveCheck.show('visibility', 'initial');
            this.textCheck.hide('visibility', 'hidden');
        }
        this.left = parseInt(left);
        this.top = parseInt(top);
        this.tableProxy = tableProxy;
        this.reference = reference;
        this.el.show();
    }
}
