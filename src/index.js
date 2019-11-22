/* global window, document */
import {h} from './component/element';//导入经过命名导出的常量h,h是一个函数，所以颜色是橙色
import DataProxy from './core/data_proxy';//从核心模块导入类DataProxy，这是一个类，所以颜色是白色
import Sheet from './component/sheet';//从核心模块导入类Sheet
import {cssPrefix} from './config';//颜色是紫色，这是一个对象变量，这里是一个字符串
import {locale} from './locale/locale';
import './index.less';
import zhCN from './locale/zh-cn';
import {bugout} from "./log/log_proxy";
import Drag from "./external/drag";
class Spreadsheet {
    constructor(selectors, options = {}, methods = {}, alias = 'sheet1') {
        let targetEl = selectors;
          if (typeof selectors === 'string') {
            targetEl = document.querySelector(selectors);//文档对象模型Document引用的querySelector()方法返回文档中与指定选择器或选择器组匹配的第一个 html元素Element。 如果找不到匹配项，则返回null。
        }
        this.locale('zh-cn', zhCN);
        this.data = new DataProxy(alias, options, methods);
        const rootEl = h('div', `${cssPrefix}`)
            .on('contextmenu', evt => evt.preventDefault());
        // create canvas element
        targetEl.appendChild(rootEl.el);

        this.sheet = new Sheet(rootEl, this.data);
        this.data.sheet = this.sheet;
    }

    setDataSettings(value) {
        this.data.settings.showEditor = value;
    }

    loadData(data) {
        this.sheet.loadData(data);//这里是Sheet的实例。调用了Sheet下面的一个方法：loadData
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

    getEditorStatus() {
        let {editor} = this.sheet;
        let { ri, ci, pos} = editor;
        let inputText = editor.editorText.getText();
        let args = {
            "status": editor.isDisplay(),
            "inputText": inputText,
            "ri": ri,
            "ci": ci,
            "pos": pos,
        }
        return args;
    }

    setEditorText(text = '', pos = 1) {
        let {editor} = this.sheet;
        text = text != '' ? text : '=';
        editor.inputEventHandler(text, pos, true);
    }

    setTextEnd(cell, ri, ci) {
        let {editor, data} = this.sheet;
        editor.setCellEnd({
            text: cell.text,
            formulas: cell.formulas
        });
        data.setCellAll(ri, ci, cell.formulas + "", cell.formulas + "", '');

        this.sheet.selectorEditorReset(ri, ci);

        setTimeout(() => {
            editor.setCursorPos(cell.formulas.length);
        }, 100)
    }

    getText(alias, inputText, pos) {
        let {selectors, data, table} = this.sheet;
        let text = "";
        for(let i = 0; i < selectors.length; i++) {
            let {erpx} = selectors[i];
            text += erpx;
        }
        let t = data.getCellByExpr(text, table, alias, inputText, pos);

        return t;
    }

    removeEvent() {
        this.sheet.removeEvent();
    }
}

const spreadsheet = (el, options = {}) => new Spreadsheet(el, options);

if (window) {
    window.jsSpreadsheet = require('js-spreadsheet');
    window.drag = Drag;
    window.x = window.x || {};//todo:这是一个逻辑值？
    window.bugout = bugout;
    window.x.spreadsheet = spreadsheet;
    window.x.spreadsheet.locale = (lang, message) => locale(lang, message);
}

export default Spreadsheet;
export {
    spreadsheet,
};


