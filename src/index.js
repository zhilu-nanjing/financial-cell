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
    /**
     * 初始化Spreadsheet类，在初始化的过程中引入Sheet和DataProxy实例
     * @param selectors
     * @param options
     * @param methods
     * @param alias
     */
    constructor(selectors, options = {}, methods = {}, alias = 'sheet1') {
        let targetEl = selectors;//let是一个域变量，仅限本{}内有效
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

    /**
     * 利用Sheet载入数据
     * @param data
     * @returns {Spreadsheet}
     */
    loadData(data) {
        this.sheet.loadData(data);//这里是Sheet的实例。调用了Sheet下面的一个方法：loadData
        return this;
    }

    /**
     * 利用DataProxy获取数据
     * @returns {{editor: boolean, freeze: *, name: *, autofilter: *, styles: *, validations: *, rows: *, cols: *, pictures: *, merges: *}}
     */
    getData() {
        return this.data.getData();//data是DataProxy的实例，调用了它下面的getData()方法
    }

    validate() {
        const {validations} = this.data;//todo:这个是要干嘛？
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
    //     let {editor} = this.sheet;
    //     let { ri, ci, pos} = editor;
    //     let inputText = editor.editorText.getText();
    //
    //     return  {
    //         "status": editor.isDisplay(),
    //         "inputText": inputText,
    //         "ri": ri,
    //         "ci": ci,
    //         "pos": pos,
    //     };
    // }

    // setEditorText(text = '', pos = 1) {
    //     let {editor} = this.sheet;
    //     text = text !== '' ? text : '=';
    //     editor.inputEventHandler(text, pos, true);
    // }
    //
    // setTextEnd(cell, ri, ci) {
    //     let {editor, data} = this.sheet;
    //     editor.setCellEnd({
    //         text: cell.text,
    //         formulas: cell.formulas
    //     });
    //     data.setCellAll(ri, ci, cell.formulas + "", cell.formulas + "", '');
    //
    //     this.sheet.selectorEditorReset(ri, ci);
    //
    //     setTimeout(() => {
    //         editor.setCursorPos(cell.formulas.length);
    //     }, 100)
    // }

    getText(alias, inputText, pos) {
        let {selectors, data, table} = this.sheet;
        let text = "";
        for(let i = 0; i < selectors.length; i++) {
            let {erpx} = selectors[i];
            text += erpx;
        }

        return data.getCellByExpr(text, table, alias, inputText, pos);
    }

    removeEvent() {
        this.sheet.removeEvent();
    }
}


const spreadsheet = (el, options = {}) => new Spreadsheet(el, options);//箭头函数，（el,options={})是自变量，后面的new的实例是基于前面这个自变量得到的一个实例，最后将实例赋值给spreadsheet这个变量

if (window) {
    window.jsSpreadsheet = require('js-spreadsheet');
    window.drag = Drag;
    window.x = window.x || {};//||的一种方法，window.x如果没有赋值，就将{}赋给window.x
    window.bugout = bugout;
    window.x.spreadsheet = spreadsheet;
    window.x.spreadsheet.locale = (lang, message) => locale(lang, message);//将locale函数的返回值赋给window.x.spreadsheet.locale
}

// export default Spreadsheet;
export {
    spreadsheet,
};


