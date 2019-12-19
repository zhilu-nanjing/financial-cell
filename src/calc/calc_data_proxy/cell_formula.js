import checker from '../calc_utils/formula_check.js';
import { errorObj } from '../calc_utils/error_config';
import { expr2xy } from '../../utils/alphabet';
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
    this.formulaString = this.getFormulaString()// 公式字符串,可能为空
    this.syntaxRootUnit = null
  }
  getFormulaString(){
    return  this.cellObj.f || ""// 公式字符串,可能为空
  }

  getRiCi(){  // A1 => 0,0
    return expr2xy(this.celName).reverse()
  }

  getCellObjForRendering(){
    return {v: this.cellObj.v,
    formulas: this.cellObj.f,
      text: this.cellObj.v.toString()
    }
  }

  updateByCellObj(newCellObj){ // 更新之后改变状态 todo: 只有要维护dependent的状态
    Object.assign(this.cellObj, newCellObj)
    this.formulaString = this.getFormulaString()// 公式字符串,可能为空
    this.cellStatus = FORMULA_STATUS.created
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


