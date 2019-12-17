import { isValueValid } from '../../helper/dataproxy_helper';
import * as checker from '../calc_utils/formula_check';
import { CalcCell } from './cell_formula';
import { FnCollection, MultiCollExpFn } from './fn_collection';
import { fnObjArray } from '../expression_fn/normal_fn';
import * as rawFnObj from '../expression_fn/raw_fn';
import { SimpleExpressionBuilder } from '../calc_deal/simple_expression/deal_simple_expression';
import { StructuralExpressionBuilder } from '../calc_deal/structural_expression/deal_structural_expression';
import {FORMULA_STATUS} from '../calc_utils/config';
import {convertToCellV} from '../cell_value_type/cell_value';


/**
 * 用来代表一个计算引擎中的cell
 * @property {string} name
 * @property {CalcWorkbookProxy} workbookProxy
 * @property {Object} name2CellProxy
 */
export class CalcSheet {
  constructor(name, workbookProxy, name2CellObj) {
    this.name = name
    this.workbookProxy = workbookProxy
    this.name2CellProxy = this.createName2CellProxy(name2CellObj)
  }

  createName2CellProxy(name2CellObj){
    let name2CellProxy = {}
    let cellName, cellStatus
    for (cellName of Object.getOwnPropertyNames(name2CellObj)){
      let cellObj = name2CellObj[cellName]
      if(typeof cellObj.v == "undefined"){
        cellStatus = FORMULA_STATUS.created
      }
      else {
        cellObj.v = convertToCellV(cellObj.v) // 封装的单元格数值
        cellStatus = FORMULA_STATUS.solved
      }

      name2CellProxy[cellName] = new CalcCell(
        this.workbookProxy,
        this,
        cellObj,
        cellName,
        cellStatus// 存在v的时候代表已经计算好了
      )
    }
    return name2CellProxy
  }

  getCellNames(){
    return Object.getOwnPropertyNames(this.name2CellProxy)
  }

  /**
   *
   * @param cellName
   * @return {CalcCell}
   */
  getCellByName(cellName) {
    return this.name2CellProxy[cellName]
  }

  addCalcCell(cellName, cellObj, status = FORMULA_STATUS.created){
    this.name2CellProxy[cellName] = new CalcCell(
      this.workbookProxy,
      this,
      cellObj,
      cellName,
      status
    )

  }
}
/**
 * @property{SimpleExpressionBuilder} simpleExpressionBuilder
 * @property{StructuralExpressionBuilder} structuralExpressionBuilder
 * @property{MultiCollExpFn}
 */
export class CalcWorkbookProxy { // 对workbook的数据代理
  /**
   *
   * @param {Object} workbookObj
   */
  constructor(workbookObj) {
    this.name2SheetProxy = this.createName2SheetProxy(workbookObj); // 实例化sheet与cell
    this.multiCollExpFn  = createDefaultFnCollection()
  }

  updateByWorkbookObj(workbookObj){
    this.name2SheetProxy = this.createName2SheetProxy(workbookObj); // 实例化sheet与cell
  }

  createName2SheetProxy(workbookObj) {
    if(typeof workbookObj.Sheets === "undefined"){
      workbookObj.Sheets = { Sheet1: {A1: ""}} // 默认的空文件
    }
    let name2SheetProxy = {}
    for (let sheetName of Object.getOwnPropertyNames(workbookObj.Sheets)) {
      let name2CellObj = workbookObj.Sheets[sheetName];
      name2SheetProxy[sheetName] = new CalcSheet(sheetName, this, name2CellObj)
    }
    return name2SheetProxy
  }

  getSheetNames(){
    return Object.getOwnPropertyNames(this.name2SheetProxy)
  }

  /**
   *
   * @param sheetName
   * @return {CalcSheet}
   */
  getSheetByName(sheetName){
    return this.name2SheetProxy[sheetName]
  }

  /**
   *
   * @param sheetName
   * @param cellName
   * @return {CalcCell}
   */
  getCellByName(sheetName, cellName){
    let theSheet = this.getSheetByName(sheetName)
    return theSheet.getCellByName(cellName)
  }


  getCellPropertyByName(sheetName, cellName, propertyName){
    let theCell = this.getCellByName(sheetName, cellName)
    return theCell.getCellProperty(propertyName)
  }


  /**
   *
   * @param {CalcCell} calcCell
   */
  parseCalcCell(calcCell){
    let builder
    if(calcCell.isStructuralFormula()){
      builder = new StructuralExpressionBuilder(calcCell, this.multiCollExpFn)
      /**
       * @type {StructuralExpressionBuilder} builder
       */
      return  builder.parseFormula();
    }
    else {
      builder = new SimpleExpressionBuilder(calcCell)
      return  builder.parseFormula()
    }
  }


  calculateFormulas(calcCellArray) { // 核心的计算引擎; formulas是数组，应该转化为cellFormula类。
    for (let i = calcCellArray.length - 1; i >= 0; i--) { // 遍历所有需要计算的formulas; 从后向前遍历
      try {
        let calcCell = calcCellArray[i];
        /**
         * @type {CalcCell} calcCell
         */
        if (calcCell.check_valid() !== true) {//如果公式不合法
          throw Error("not a valid formula")
        } else {
          calcCell.execFormula(); // 核心方法，执行公式
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  /**
   *  遍历所有的cell属性，然后返回结果
   * @param{function} callback
   */
  applyToAllCells(callback){ // 不过滤
    let wb = this.name2SheetProxy;
    let callBackRes
    let formulaArray = [];
    for (let sheet_name of this.getSheetNames()) { // todo 提供类似python中的dict.iterms()的方法
      let sheetProxy = this.getSheetByName(sheet_name);
      for (let cell_name of sheetProxy.getCellNames()) {
        callBackRes = callback(sheetProxy.getCellByName(cell_name)) // 遍历cell
        formulaArray.push(callBackRes); // 之后可以直接把null过滤掉
      }
    }
    return formulaArray;
  }
  applyToAllCellsFilterEmpty(callback){ // 过滤Null
    let wb = this.name2SheetProxy;
    let callBackRes
    let formulaArray = [];
    for (let sheet_name of this.getSheetNames()) {
      let sheetProxy = this.getSheetByName(sheet_name);
      for (let cell_name of sheetProxy.getCellNames()) {
        callBackRes = callback(sheetProxy.getCellByName(cell_name)) // 遍历cell
        if(typeof callBackRes !== 'undefined'){
          formulaArray.push(callBackRes); // 之后可以直接把null过滤掉
        }
      }
    }
    return formulaArray;
  }


  find_all_cells_with_formulas() {
    /**
     *
     * @param {CalcCell} cellProxy
     * @constructor
     */
    function filterCellProxy(cellProxy){
      if(cellProxy.isFormulaValid() && cellProxy.cellStatus !== FORMULA_STATUS.solved){ // 获取没有被解决的formula
        return cellProxy
      }
    }
    let cellWithFormulaArray = this.applyToAllCellsFilterEmpty(filterCellProxy)
    return cellWithFormulaArray;
  }

  find_all_need_calc_cell(preAction) { // todo: preAction.findAllNeedCalcCell 应该返回workbook中多个sheet的变化结果； 需要筛选出那些需要重新计算的formulas
    console.log('find_all_need_calc_cell');
    let wb = this.name2SheetProxy;
    let to_calc_cell_names = preAction.findAllNeedCalcCell(); // 获取所有需要计算的单元格； 可能有很多null; 不存在多sheet的情况
    let formula_ref = {};
    let cells = [];
    let sheet_name = Object.getOwnPropertyNames(wb.Sheets)[0] // todo: 之后要支持多sheet
    let sheet = wb.Sheets[sheet_name]; // 当前的sheet
    for (let i = 0; i < to_calc_cell_names.length; i++) {
      let cell_name = to_calc_cell_names[i];
      if(cell_name in sheet === false){ // 不包含这个sheet
        continue
      }
      let cell = sheet[cell_name];
      let formula = formula_ref[sheet_name + '!' + cell_name] = new CalcCell(
        this,
        sheet,
        sheet_name,
        sheet[cell_name],
        formula_ref,
        cell_name,
        'created',
      );
      cells.push(formula);
    }
    return cells;
  };
}

/**
 *
 * @return {MultiCollExpFn}
 */
export function createDefaultFnCollection() { // 创建默认的exp_fn collection类
  let normal_fn_coll = new FnCollection();
  normal_fn_coll.addFnObjArray(fnObjArray);
  let normalFnObj = normal_fn_coll.fnObj; // 从expression_fn/normal_fn获取normalFnObj

  let raw_fn_coll = new FnCollection();
  raw_fn_coll.addFnObj(rawFnObj);
  let resRawFnObj = raw_fn_coll.fnObj; // 从expression_fn/raw_fn获取rawFnObj

  let multiCollExpFn = new MultiCollExpFn(normal_fn_coll, raw_fn_coll);
  return multiCollExpFn;
}
