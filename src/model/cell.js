import {isHave} from "../core/helper";

export default class Cell {
    constructor() {
        this.text = "";
        this.depend = [];
        this.formulas = "";

        this.style = null;
        this.merge = null;
        this.formatText = null;
        this.multivalueRefsCell = null;
    }

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

    setFormatText(args) {
        if(args.state) {
            this.formatText = args.text;
        }
    }
}