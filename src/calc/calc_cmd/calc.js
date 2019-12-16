import { isValueValid } from '../../helper/dataproxy_helper';
import { CalcRowsProxy } from '../calc_data_proxy/calc_rows';
import { CalcWorkbookProxy } from '../calc_data_proxy/calc_workbook';

/**
 * @property {CalcWorkbookProxy} calcWorkbookProxy
 */
export class Calc { // 整个模块对外服务的类
  constructor() {
    this.calcWorkbookProxy  =  new CalcWorkbookProxy({})
  }

  /**
   * @param {Rows} rows
   * @param {PreAction} preAction
   * @return {undefined}
   */
  calculateRows(rows, preAction) { // 计算陶涛那边给到的rows
    let calcRowsProxy = new CalcRowsProxy(rows, preAction);
    if (preAction.isRefresh() === true) { // 重新计算
      rows.workbook = calcRowsProxy.rows2workbook(); // 转化一次
    }

    let workbook = rows.workbook;
    let updatedCellArray = this.calculateWorkbook(workbook)
    calcRowsProxy.calcDoneToSetCells(workbook, rows); // todo: 把workbook的值再转化为rows的形式； 把需要计算的那些单元格的状态变为edited
    return updatedCellArray
  }

  calculateWorkbook(workbook){ // 计算测试用例中直接给到的workbook
    this.calcWorkbookProxy.updateByWorkbookObj(workbook)
    let calcCellArray = this.calcWorkbookProxy.find_all_cells_with_formulas();//找到所有需要计算的单元格
    this.calcWorkbookProxy.calculateFormulas(calcCellArray);
    return calcCellArray // 发生更新的单元格列表
  }
}

export function easyCalcWorkbook(workbook) {
  let aCalc = new Calc()
  aCalc.calculateWorkbook(workbook)
}
