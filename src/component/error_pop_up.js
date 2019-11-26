import Modal from "./modal";
import {h} from "./element";
import Button from "./button";
import {t} from "../locale/locale";
import {cssPrefix} from "../config";

/**
 * 弹出错误
 */
export default class ErrorPopUp extends Modal {
    constructor() {
        let tip = h('span', '').html("您输入的公式好像至少缺少一个左括号");
        super(t('contextmenu.errorPop'), [
            h('div', `${cssPrefix}-form-fields`).children(
                tip,
            ),
            h('div', `${cssPrefix}-form-fields`),
            h('div', `${cssPrefix}-buttons`).children(
                new Button('ok', 'primary')
                    .on('click', () => this.btnClick('ok')),
            ),
        ]);
        this.tip = tip;
    }

    show(t) {
        this.tip.html(t);
        super.show();
    }

    btnClick(action) {
        if (action === 'ok') {
            this.hide();
        }
    }

}
