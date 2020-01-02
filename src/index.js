/* global window, document */
import {h} from './component/element';
import DataProxy from './core/data_proxy';
import Sheet from './component/sheet';
import {cssPrefix} from './config';
import {locale} from './locale/locale';
import './index.less';
import zhCN from './locale/zh-cn';
import {bugout} from "./log/log_proxy";
import Drag from "./external/drag";

class Spreadsheet {
    constructor(selectors, options = {}, methods = {}, alias = 'sheet1') {
        let targetEl = selectors;
        if (typeof selectors === 'string') {
            targetEl = document.querySelector(selectors);
        }
        this.locale('zh-cn', zhCN);
        this.data = new DataProxy(alias, options, methods);
        const rootEl = h('div', `${cssPrefix}`)
            .on('contextmenu', evt => evt.preventDefault());
        // create canvas element
        targetEl.appendChild(rootEl.el);

        this.sheet = new Sheet(rootEl, this.data);
        this.data.belongSheet = this.sheet;
    }

    setDataSettings(value) {
        this.data.settings.showEditor = value;
    }

    loadData(data) {
        this.sheet.loadData(data);
        return this;
    }

    getData() {
        return this.data.getData();
    }

    validate() {
        const {validations} = this.data;
        return validations.errors.size <= 0;
    }

    change(cb) {
        this.data.change = cb;
        return this;
    }

    static locale(lang, message) {
        locale(lang, message);
    }

    locale(lang, message) {
        locale(lang, message);
    }

    // getEditorStatus() {
    //     let {editor} = this.belongSheet;
    //     let { ri, ci, pos} = editor;
    //     let inputText = editor.editorText.getText();
    //
    //     return  {
    //         "cellStatus": editor.isDisplay(),
    //         "inputText": inputText,
    //         "ri": ri,
    //         "ci": ci,
    //         "pos": pos,
    //     };
    // }

    // setEditorText(text = '', pos = 1) {
    //     let {editor} = this.belongSheet;
    //     text = text !== '' ? text : '=';
    //     editor.inputEventHandler(text, pos, true);
    // }
    //
    // setTextEnd(cell, ri, ci) {
    //     let {editor, data} = this.belongSheet;
    //     editor.setCellEnd({
    //         text: cell.text,
    //         formulas: cell.formulas
    //     });
    //     data.setCellAll(ri, ci, cell.formulas + "", cell.formulas + "", '');
    //
    //     this.belongSheet.selectorEditorReset(ri, ci);
    //
    //     setTimeout(() => {
    //         editor.setCursorPos(cell.formulas.length);
    //     }, 100)
    // }

    insertRows(len) {
        this.sheet.insertRows(len);
    }

    initFinancialCellFooter() {
        let xs = this;
        let footComp = Vue.extend({
            template: `<div id="foot-container" @click.stop @mousedown.stop @mouseup.stop @keydown.stop @keyup.stop @copy.stop @paste.stop
             style="height: 1000px; display: none; width: 100%; position: absolute; ">
                  <div style="color: #222; float: left; padding: 6px 0 0 45px; direction: ltr;">
                      <div @click.stop="textInputClick"
                           class="foot-container-btn"
                           style="display: inline-block; -webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none; font-family: 'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;font-weight: 500; background-color: #f5f5f5;-webkit-border-radius: 2px;-moz-border-radius: 2px;border-radius: 2px;cursor: default;font-size: 11px;font-weight: bold;text-align: center;white-space: nowrap;margin-right: 16px;height: 27px;line-height: 27px;min-width: 54px;outline: 0px;padding: 0 8px;background-image: -webkit-linear-gradient(top,#f5f5f5,#f1f1f1);background-image: -moz-linear-gradient(top,#f5f5f5,#f1f1f1);background-image: -ms-linear-gradient(top,#f5f5f5,#f1f1f1);background-image: -o-linear-gradient(top,#f5f5f5,#f1f1f1);background-image: linear-gradient(top,#f5f5f5,#f1f1f1);color: #333;border: 1px solid #dcdcdc;border: 1px solid rgba(0,0,0,0.1);">
                          添加
                      </div>
                      <input class="textinput addRowsInput" type="text" v-model="inputValue"
                             style="-webkit-border-radius: 1px; width: 60px; width: 60px; -moz-border-radius: 1px; border-radius: 1px; border: 1px solid #d9d9d9; border-top: 1px solid #c0c0c0; font-size: 13px; height: 25px; padding: 1px 8px;"
                             aria-label="要添加的行数">
                      <div class="addRowsText goog-inline-block"
                           style="display: inline-block; color: #000000; padding-top: 5px; vertical-align: middle; font-weight: normal; font-size: 13px;">
                          行（在底部添加）。
                      </div>
                      <div v-if="msg !== ''" class="addRowsText goog-inline-block"
                           style="display: inline-block; color: red; font-weight: 500; padding-top: 5px; vertical-align: middle; font-weight: normal; font-size: 13px;">
                          {{msg}}
                      </div>
                  </div>
              </div>`,
            data() {
                return {
                    inputValue: 10,
                    msg: '',
                    maxRows: 0,
                    total: 5000,
                }
            },
            methods: {
                textInputClick() {
                    if (isNaN(this.inputValue)) {
                        this.msg = '请输入数字';
                        return;
                    }
                    console.log(xs.data.settings.row.len);
                    this.maxRows = this.total - xs.data.rows.len;
                    if (this.maxRows <= 0) {
                        this.msg = '超出最大单元格数量';
                        return;
                    }

                    if (this.inputValue * 1 > this.maxRows) {
                        this.msg = "请输入" + this.maxRows + "行内的数值";
                        return;
                    }

                    xs.insertRows(this.inputValue);
                    this.msg = '';
                },
            }
        });
        // let sheet = this.sheet['el'];
        let fc = this.sheet['overlayerEl']['el'];
        let footCompDom = new footComp().$mount();
        this.sheet.footEl = footCompDom.$el;
        fc.appendChild(footCompDom.$el);
    }


    getText(alias, inputText, pos) {
        let {selectors, data, table} = this.sheet;
        let text = "";
        for (let i = 0; i < selectors.length; i++) {
            let {erpx} = selectors[i];
            text += erpx;
        }

        return data.getCellByExpr(text, table, alias, inputText, pos);
    }

    removeEvent() {
        this.sheet.removeEvent();
    }
}


const spreadsheet = (el, options = {}) => new Spreadsheet(el, options);

if (window) {
    window.drag = Drag;
    window.x = window.x || {};
    window.bugout = bugout;
    window.x.spreadsheet = spreadsheet;
    window.x.spreadsheet.locale = (lang, message) => locale(lang, message);
}

// export default Spreadsheet;
export {
    spreadsheet,
};
