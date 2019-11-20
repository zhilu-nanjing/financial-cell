import {isHave} from "../core/helper";


/**
 * Cell类，代表一个单元格的数据格式。
 */
export default class Cell {
    /**
     * @constructor
     * @param text - 单元格的文本。
     * @param formulas - 单元格的公式
     * @param style - 单元格的样式, 如果为null,则表示是默认样式
     * @param depend - 其他单元格依赖
     * @param merge - 为null表示不是合并单元格，否则为一个合并单元格
     * @param formatText - 单元格的格式，若为null，则表明没有格式
     * @param multivalueRefsCell - 用来标记多值单元格
     */
    constructor() {
        this.text = "";
        this.depend = [];
        this.formulas = "";

        this.style = null;
        this.merge = null;
        this.formatText = null;
        this.multivalueRefsCell = null;
    }

    /**
     * 设置单元格信息
     */
    setCell(cell) {
        if (!isHave(cell)) {
            return;
        }

        if (isHave(cell.text)) {
            this.text = cell.text;
        }

        if (isHave(cell.formulas)) {
            this.formulas = cell.formulas;
        }

        if(isHave(cell.formatText)) {
            this.formatText = cell.formatText;
        }

        if (isHave(cell.depend)) {
            this.depend = cell.depend;
        }

        if (isHave(cell.style)) {
            this.style = cell.style;
        }

        if (isHave(cell.multivalueRefsCell)) {
            this.multivalueRefsCell = cell.multivalueRefsCell;
        }

        if (isHave(cell.merge)) {
            this.merge = cell.merge;
        }
    }

    /**
     * 设置单元格的格式
     * @param args args.state 为true表示存在格式，为false不存在格式, text 具体格式信息
     */
    setFormatText(args) {
        if(args.state) {
            this.formatText = args.text;
        }
    }
}