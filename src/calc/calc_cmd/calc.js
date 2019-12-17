import { isValueValid } from '../../helper/dataproxy_helper';
import { CalcRowsProxy } from '../calc_data_proxy/calc_rows';
import { CalcWorkbookProxy } from '../calc_data_proxy/calc_workbook';

/**
 * @property {CalcWorkbookProxy} calcWorkbookProxy
 */
export class Calc { // 整个模块对外服务的类
  constructor() {
    this.calcWorkbookProxy  =  new CalcWorkbookProxy({})
    this.calcRowsProxy = null
  }

  /**
   * @param {Rows} rows
   * @param {PreAction} preAction
   * @return {undefined}
   */
  calculateRows(rows, preAction) { // 计算陶涛那边给到的rows todo: 单元格数据更新会有问题
    if(this.calcRowsProxy instanceof CalcRowsProxy === false){
      this.calcRowsProxy = new CalcRowsProxy(rows, preAction);
      let workbookObj = this.calcRowsProxy.rows2workbook(); // 转化一次
      this.calculateWorkbook(workbookObj)
      this.calcRowsProxy.calcDoneToSetCells(workbookObj, rows); // todo: 把workbook的值再转化为rows的形式
    }
    else {
      // todo: 之后preAction需要支持多sheet
      let calcCellArray = this.calcWorkbookProxy.updateByPreAction(preAction) // 根据preAction来更新获得更新后的值
      this.calcRowsProxy.updateRowsByCalcCellArray(calcCellArray, rows);
    }
  }

  calculateWorkbook(workbook){ // 计算测试用例中直接给到的workbook
    this.calcWorkbookProxy.updateByWorkbookObj(workbook)
    let calcCellArray = this.calcWorkbookProxy.find_all_cells_with_formulas();//找到所有需要计算的单元格
    this.calcWorkbookProxy.calculateFormulas(calcCellArray);
    return calcCellArray // 发生更新的单元格列表
  }

  updateByMultiSheetObj(multiSheetObj){
    let sheet2CalcArray = this.calcWorkbookProxy.updateByMultiSheetObj(multiSheetObj)
    return this.calcWorkbookProxy.getMultiSheetObjFromSheet2CalcArray(sheet2CalcArray)
  }
}

export function easyCalcWorkbook(workbook) {
  let aCalc = new Calc()
  aCalc.calculateWorkbook(workbook)
}
