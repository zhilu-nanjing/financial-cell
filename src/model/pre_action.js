import {deepCopy, distinct} from "../core/operator";
import {isHave} from '../helper/check_value';
import {expr2xy, xy2expr} from "../utils/alphabet";

function getCellDepend(cells) {
    let arr = [];
    for (let i = 0; i < cells.length; i++) {
        if(isHave(cells[i]) && isHave(cells[i].expr)) {
            arr.push(cells[i].expr);
        }

        if (isHave(cells[i]) && isHave(cells[i].cell) && isHave(cells[i].cell.depend)) {
            arr.push(...cells[i].cell.depend);
        }

        if(isHave(cells[i]) && isHave(cells[i].cell) && isHave(cells[i].cell.multivalueRefsCell)) {
            arr.push(cells[i].cell.multivalueRefsCell);
        }
    }

    return arr;
}

export default class PreAction {
    constructor({type = -1, action = "",  ri = -1, ci = -1, oldData = "", newData = "", expr = "", oldStep = "", cellRange = "", cells = {}, height = -1, width = -1, oldCell = {}, newCell = {}, newMergesData = "", oldMergesData = "", property = "", value = ""}, data) {
        this.type = type;
        this.action = action;
        this.ri = ri;
        this.ci = ci;
        this.expr = expr;
        this.cellRange = cellRange;
        this.cells = cells;
        this.height = height;
        this.width = width;
        this.oldCell = oldCell;
        this.newCell = newCell; // 一个Object记录，更新的值
        this.oldMergesData = oldMergesData;
        this.newMergesData = newMergesData;
        this.property = property;
        this.value = value;
        this.oldStep = oldStep;
        this.oldData = oldData;
        this.newData = newData;
        this.data = data;
    }

    /**
     * 获取所有需要计算的单元格列表
     * @returns {Array}
     */
    isRefresh(){ // jobs; 我加的，判定是否是全量更新
        return this.type === 999;
    }

    isDelete(){
        return this.type === 2 // jobs; 我加的，判定是否是删除
    }

    findAllNeedCalcCell() {
        let changeArr = [];
        let {oldCell, newCell, ri, ci} = this; // 应该得到多个sheet的变更结果
        changeArr.push(...getCellDepend(oldCell));
        changeArr.push(...getCellDepend(newCell));
        if (ri !== -1 && ci !== -1) {
            changeArr.push(xy2expr(ci, ri));
        }
        changeArr = distinct(changeArr);
        return changeArr;
    }

    restore(data, sheet, isRedo) {
        let {type} = this;

        if (type === 1) { // shuru
            let {oldCell, newCell} = this;
            let _cell = "";
            // redo 1  undo 2
            if (isRedo === 1) {
                _cell = deepCopy(oldCell);
            } else {
                _cell = deepCopy(newCell);
            }
            for (let i = 0; i < _cell.length; i++) {
                let {cell, ri, ci} = _cell[i];
                data.rows.setCellText(ri, ci, cell, 'cell');
            }

        } else if(type === 13) {
            let {oldData, newData} = this;
            let _data = "";
            if (isRedo === 1) {
                _data = deepCopy(newData);
            } else {
                _data = deepCopy(oldData);
            }

            data.setData(_data);
        } else if (type === 2 || type === 5 || type === 6 || type === 11 || type === 12) {
            let {newCell, oldCell, oldMergesData, newMergesData, cellRange, property, value} = this;
            let _cells = "";
            if (isRedo === 1) {
                _cells = deepCopy(oldCell);
            } else {
                _cells = deepCopy(newCell);
            }

            if (property === 'merge') {
                if (isRedo === 1) {
                    this.data.merges.setData(oldMergesData);
                } else {
                    this.data.merges.setData(newMergesData);
                }
            }

            for (let i = 0; i < _cells.length; i++) {
                let {cell, ri, ci} = _cells[i];

                data.rows.setCellText(ri, ci, cell, 'cell');
            }
        } else if (type === 3) {
            let {ri, height, oldStep} = this;
            if (isRedo === 1) {
                data.rows.setHeight(ri, oldStep.height);
            } else {
                data.rows.setHeight(ri, height);
            }
        } else if (type === 4) {
            let {ci, width, oldStep} = this;
            if (isRedo === 1) {
                data.cols.setWidth(ci, oldStep.width);
            } else {
                data.cols.setWidth(ci, width);
            }

        }
    }
}
