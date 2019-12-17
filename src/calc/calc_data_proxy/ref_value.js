'use strict';

import { getSanitizedSheetName } from '../calc_utils/get_sheetname.js';
import * as error_cf from '../calc_utils/error_config.js';
import { FORMULA_STATUS } from '../calc_utils/config';

/**
 *@property {CalcCell} calcCell
 * @property {String} str_expression
 */
export class RefValue {
  constructor(str_expression, calcCell) {
    this.name = 'RefValue';
    this.str_expression = str_expression;
    this.calcCell = calcCell;
  }

  /**
   *
   * @return {CalcCell}
   */

  getRefCalcCell() {
    let self = this;
    let calcCell = this.calcCell;
    /**
     * @type {CalcCell} calcCell
     */
    let str_expression = this.str_expression;
    let calcSheet,
      sheet_name,
      cell_name,
      cell_full_name;
    if (str_expression.indexOf('!') !== -1) {
      let aux = str_expression.split('!');
      sheet_name = getSanitizedSheetName(aux[0]);
      calcSheet = calcCell.workbookProxy.getSheetByName(sheet_name);
      cell_name = aux[1];
    } else {
      calcSheet = calcCell.calcSheet;
      sheet_name = calcCell.calcSheet.name;
      cell_name = str_expression;
    }
    if (!calcSheet) {
      throw Error('Sheet ' + sheet_name + ' not found.');
    }
    return this.calcCell.workbookProxy.getCellByName(sheet_name, cell_name);
  };

  solveExpression() {
    let self = this;
    let curCellFormulaProxy = this.calcCell;
    let refCalcCell = self.getRefCalcCell();
    if (!refCalcCell.cellObj) { // 获取这个cell，如果为空的话返回Null
      return null;
    }
    if (refCalcCell.cellStatus === FORMULA_STATUS.created) { // 如果发现这个公式还没有被计算出来，那么去计算这个公式
      refCalcCell.execFormula(); // 碰到了还没有解出来的公式。这里存在着递归。
      if (refCalcCell.cellObj.t === 'e') { //  如果self对应的单元格得到的结果是错误。t属性代表类型，如果为e 代表error
        console.log('ref is an error at', refCalcCell);
        throw new Error(refCalcCell.cellObj.w);
      }
      return refCalcCell.cellObj.v;
    } else if (refCalcCell.cellStatus === FORMULA_STATUS.working) {// 循环依赖
      throw new Error(error_cf.ERROR_CIRCULAR);
    } else if (refCalcCell.cellStatus === FORMULA_STATUS.solved) {
      if (refCalcCell.cellObj.t === 'e') {
        console.log('ref is an error after cellFormulaProxy eval');
        throw new Error(refCalcCell.cellObj.w);
      }
      return refCalcCell.cellObj.v;
    }
  }
}

