import {CellRange} from "../../src/core/cell_range";

export function copyPasteTemplate(cell, data) {
    data.rows.setCell(3, 4, cell, 'all_with_no_workbook');
    const srcCellRange = new CellRange(3, 4, 3, 4, 0, 0);
    const dstCellRange = new CellRange(4, 4, 12, 4, 0, 0);
    data.rows.copyPaste(srcCellRange, dstCellRange, 'all', true);
}


export function cellTypeRandom(type) {
    let cell = {};
    if (type === 'number') {
        let num = Math.floor(Math.random() * (100000 - 1 + 1) + 1);
        cell = {
            "text": num,
            "formulas": num,
        };
    } else if (type === 'formulaNumber') {
        let num = Math.floor(Math.random() * (100000 - 1 + 1) + 1);
        cell = {
            "text": "=" + num,
            "formulas": "=" + num,
        };
    } else if (type === 'abs_refs') {
        let ranNum = Math.ceil(Math.random() * 10);
        let ranNum2 = Math.ceil(Math.random() * 1000);
        let num = "$" + String.fromCharCode(65 + ranNum) + "$" + ranNum2;
        cell = {
            "text": "=" + num,
            "formulas": "=" + num,
        }
    } else if (type === 'rel_refs') {
        let ranNum = Math.ceil(Math.random() * 10);
        let ranNum2 = Math.ceil(Math.random() * 1000);
        let num = String.fromCharCode(65 + ranNum) + "" + ranNum2;
        cell = {
            "text": "=" + num,
            "formulas": "=" + num,
        }
    } else if(type === 'string') {
        let str = "";
        let ranNum2 = Math.ceil(Math.random() * 100);
        for (let i = 0; i < ranNum2; i++) {
            let ranNum = Math.ceil(Math.random() * 10);
            str += String.fromCharCode(65 + ranNum).toLowerCase();
        }
        cell = {
            "text": "=" + str,
            "formulas": "=" + str,
        }
    }
    return cell;
}

// export function compareCell() {
//
// }