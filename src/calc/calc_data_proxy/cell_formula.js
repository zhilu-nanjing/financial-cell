import checker from '../calc_utils/formula_check.js';
import { errorObj } from '../calc_utils/error_config';
import exp from '../../utils/alphabet';
import { FORMULA_STATUS } from '../calc_utils/config';
import { isHave } from '../../helper/check_value';

/**
 *
 * @property {CalcWorkbookProxy} workbookProxy 本workbook
 * @property {CalcSheet}  calcSheet
 * @property {Object} cellObj
 * @property {String}celName 本cell的名字，例如A1
 * @property {String}cellStatus 状态
 */
export class CalcCell{
  constructor(workbookProxy, calcSheet , cellObj, celName, cellStatus){
    this.workbookProxy = workbookProxy;
    this.calcSheet = calcSheet;
    this.cellObj = cellObj;
    this.celName = celName;
    this.cellStatus = cellStatus;
    this.formulaString = this.cellObj.f || ""// 公式字符串,可能为空

  }
  getCellProperty(propertyName){
    return this.cellObj[propertyName]
  }
  isStructuralFormula(){
    // 根据第一个字符是否是等号来判定是是否是simple类型还是normal类型
    return this.formulaString.startsWith("=")
  }

  isFormulaValid(){
    return typeof this.formulaString !== "undefined"
  }

  isEmpty() { // cell 是否为空
    return typeof this.cellObj === "undefined" || this.cellObj === null
  }
  check_valid(){
    return typeof this.formulaString === "string"
  }

  execFormula() {
    if(this.cellStatus === FORMULA_STATUS.solved){
      return this.cellObj.v
    }
    this.cellStatus = FORMULA_STATUS.working; // 当前的状态是working
    let root_exp = this.workbookProxy.parseCalcCell(this);
    /**
     * @type {StructuralExp} root_exp
     */
    root_exp.update_cell_value();
    this.cellStatus = FORMULA_STATUS.solved; // 更新了之后，状态变为done
  }
}


