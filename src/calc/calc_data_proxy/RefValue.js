"use strict";

import {getSanitizedSheetName} from '../calc_utils/get_sheetname.js';
import * as error_cf from '../calc_utils/error_config.js'
import {FORMULA_STATUS} from '../calc_utils/config'

export class RefValue{
    constructor(str_expression, formula){
        this.name = 'RefValue';
        this.str_expression = str_expression;
        this.formula = formula;
    }

    parseRef() {
        let self = this;
        let formula = this.formula;
        let str_expression = this.str_expression;
        let sheet, sheet_name, cell_name, cell_full_name;
        if (str_expression.indexOf('!') !== -1) {
            let aux = str_expression.split('!');
            sheet_name = getSanitizedSheetName(aux[0]);
            sheet = formula.workbookProxy.Sheets[sheet_name];
            cell_name = aux[1];
        }
        else {
            sheet = formula.belongSheet;
            sheet_name = formula.sheet_name;
            cell_name = str_expression;
        }
        if (!sheet) {
            throw Error("Sheet " + sheet_name + " not found.");
        }
        cell_full_name = sheet_name + '!' + cell_name;
        return {
            sheet: sheet,
            sheet_name: sheet_name,
            cell_name: cell_name,
            cell_full_name: cell_full_name
        };
    };

    solveExpression() {
        let self = this;
        let curCellFormulaProxy = this.formula;
        let resolved_ref = self.parseRef();
        // 一个Object， {
        //   "belongSheet": {
        //     "A28": {
        //       "v": 10
        //     },
        //     "A29": {
        //       "f": "=A28+1"
        //     },
        //     "A30": {
        //       "v": 9
        //     },
        //     "A31": {
        //       "v": 27
        //     },
        //     "A32": {
        //       "v": 2
        //     },
        //     "A5": {
        //       "f": "=AVERAGE($A$28:$A$32)"
        //     }
        //   },
        //   "sheet_name": "Sheet1",
        //   "cell_name": "A28",
        //   "cell_full_name": "Sheet1!A28"
        // }
        let sheet = resolved_ref.sheet;
        let cell_name = resolved_ref.cell_name;
        let cell_full_name = resolved_ref.cell_full_name;
        let ref_cell = sheet[cell_name]; // 引用的cell
        if (!ref_cell) { // 获取这个cell，如果为空的话返回Null
            return null;
        }
        let formula_ref = curCellFormulaProxy.formula_ref[cell_full_name]; // 判断引用是否是另一个公式，如果是的话还可能还需要进一步计算，如果不是的话直接返回值
        if (formula_ref) {
            if (formula_ref.status === FORMULA_STATUS.new) { // 如果发现这个公式还没有被计算出来，那么去计算这个公式
                formula_ref.execFormula(); // 碰到了还没有解出来的公式。这里存在着递归。
                if (ref_cell.t === 'e') { //  如果self对应的单元格得到的结果是错误。t属性代表类型，如果为e 代表error
                    console.log('ref is an error at', cell_full_name);
                    throw new Error(ref_cell.w);
                }
                return ref_cell.v;
            }
            else if (formula_ref.status === FORMULA_STATUS.working) {// 循环依赖
                throw new Error(error_cf.ERROR_CIRCULAR);
            }
            else if (formula_ref.status === FORMULA_STATUS.done) {
                if (ref_cell.t === 'e') {
                    console.log('ref is an error after cellFormulaProxy eval');
                    throw new Error(ref_cell.w);
                }
                return ref_cell.v;
            }
        }
        else {
            if (ref_cell.t === 'e') { // 依赖的值是错误
                console.log('ref is an error ', cell_name);
                throw new Error(ref_cell.w);
            }
            return ref_cell.v;
        }
    };
};
