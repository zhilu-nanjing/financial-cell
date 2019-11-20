import CellProp from "./cell_prop";
import {isHave} from "../core/helper";
import {xy2expr} from "../core/alphabet";

function getType(dType, sType) {
    if (dType === 1 && sType === 1) {
        return 1;           // 1行多列 * 1行多列
    } else if (dType === 1 && sType === 2) {
        return 2;
    } else if (dType === 1 && sType === 3) {    // 多行多列 * 一行多列
        return 3;
    } else if (dType === 2 && sType === 1) {
        return 4;
    } else if (dType === 3 && sType === 1) {
        return 5;
    } else if (dType === 2 && sType === 2) {
        return 6;
    } else if (dType === 2 && sType === 3) {
        return 7;
    } else if (dType === 3 && sType === 2) {
        return 8;
    } else if (dType === 3 && sType === 3) {
        return 9;
    }
}

function changeDarrToDoubleArr(darr, selectorRange) {
    let ri = selectorRange.sri;
    let _darr = [];
    let arr = [];
    let index = 0;
    selectorRange.each((i, j) => {
        if (ri !== i) {
            ri = i;
            _darr.push(arr);
            arr = [];
        }
        arr.push(darr[index]);
        index += 1;
    });
    _darr.push(arr);

    return _darr;
}

export default class PaintFormat {
    constructor(selectorRange, dstRange) {
        this.selectorRange = selectorRange;
        this.dstRange = dstRange;
    }

    getPaintType() {
        let {dstRange, selectorRange} = this;

        let dType = dstRange.getType();
        let sType = selectorRange.getType();

        let paintType = getType(dType, sType);

        return paintType;
    }

    makePaintArr(type, darr) {
        let {dstRange, selectorRange} = this;
        let pArr = [];
        // if (type === 1 || type === 6) {  // 1行多列 // 1列多行
        //     let index = 0;
        //     dstRange.each((i, j) => {
        //         let {cell} = darr[index];
        //         let cellProp = new CellProp(i, j, cell);
        //         pArr.push(cellProp);
        //
        //         index += 1;
        //         if (index === darr.length) {
        //             index = 0;
        //         }
        //     });
        // } else if (type === 3) {        // 3 多行多列 * 1行多列
        //     let dci = selectorRange.eci - selectorRange.sci, index = 0, recordRi = dstRange.sri;
        //
        //     let _darr = changeDarrToDoubleArr(darr, selectorRange);
        //
        //     dstRange.each((i, j) => {
        //         let {cell} = _darr[0][index];
        //         let cellProp = new CellProp(i, j, cell);
        //         pArr.push(cellProp);
        //
        //         if (index === dci) {
        //             index = 0;
        //         } else {
        //             index += 1;
        //         }
        //     });
        // } else if(type === 7) {
        //     let recordRi = dstRange.sri;
        //     let rowIndex = 0;
        //
        //     let _darr = changeDarrToDoubleArr(darr, selectorRange);
        //
        //     dstRange.each((i, j) => {
        //         if (recordRi !== i) {
        //             rowIndex += 1;
        //
        //             if (rowIndex === _darr.length) {
        //                 rowIndex = 0;
        //             }
        //         }
        //
        //         let {cell} = _darr[rowIndex][0];
        //         let cellProp = new CellProp(i, j, cell);
        //         pArr.push(cellProp);
        //
        //         recordRi = i;
        //     });
        // }else if (type === 4 || type === 2) {   // 4: 1行多列 * 1列多行    6: 1列多行 * 1行多列
        //     dstRange.each((i, j) => {
        //         let {cell} = darr[0];
        //         let cellProp = new CellProp(i, j, cell);
        //         pArr.push(cellProp);
        //     });
        // } else if (type === 5) {
        //     let dci = selectorRange.eci - selectorRange.sci, index = 0, recordRi = dstRange.sri;
        //
        //     dstRange.each((i, j) => {
        //         if (recordRi !== i) {
        //             index = 0;
        //         }
        //
        //         let {cell} = darr[index];
        //         let cellProp = new CellProp(i, j, cell);
        //         pArr.push(cellProp);
        //
        //         if (index === dci) {
        //             index = 0;
        //         } else {
        //             index += 1;
        //         }
        //         recordRi = i;
        //     });
        // } else if (type === 8) {
        //     let rowIndex = 0, recordRi = dstRange.sri;
        //
        //     dstRange.each((i, j) => {
        //         if (recordRi !== i) {
        //             rowIndex += 1;
        //
        //             if (rowIndex === darr.length) {
        //                 rowIndex = 0;
        //             }
        //         }
        //
        //         let {cell} = darr[rowIndex];
        //         let cellProp = new CellProp(i, j, cell);
        //         pArr.push(cellProp);
        //
        //         recordRi = i;
        //     });
        // } else if (type === 9) {
            let dci = selectorRange.eci - selectorRange.sci, index = 0, recordRi = dstRange.sri;
            let rowIndex = 0;

            let _darr = changeDarrToDoubleArr(darr, selectorRange);

            dstRange.each((i, j) => {
                if (recordRi !== i) {
                    rowIndex += 1;
                    index = 0;
                    if (rowIndex === _darr.length) {
                        rowIndex = 0;
                    }
                }

                let {cell} = _darr[rowIndex][index];

                let cellProp = new CellProp(i, j, cell, xy2expr(i, j));
                pArr.push(cellProp);

                if (index === dci) {
                    index = 0;
                } else {
                    index += 1;
                }
                recordRi = i;
            });
        // }

        return pArr;
    }
}