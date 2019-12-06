import { isValueValid } from '../../helper/dataproxy_helper';
import { CalcRowsProxy } from '../calc_data_proxy/calc_rows';
import { CalcWorkbookProxy } from '../calc_data_proxy/calc_workbook';


export class Calc { // 整个模块对外服务的类
  constructor() {
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
    workbook = calcRowsProxy.updateWorkbook(workbook);
    let calcWorkbookProxy = new CalcWorkbookProxy(workbook)
    let formulas = calcWorkbookProxy.find_all_need_calc_cell(preAction);//找到所有需要计算的单元格
    calcWorkbookProxy.calculateFormulas(formulas);
    calcRowsProxy.calcDoneToSetCells(workbook, rows); // 把workbook的值再转化为rows的形式
  }

  calculateWorkbook(workbook){ // 计算测试用例中直接给到的workbook
    let calcWorkbookProxy = new CalcWorkbookProxy(workbook)
    let formulas = calcWorkbookProxy.find_all_cells_with_formulas();//找到所有需要计算的单元格
    calcWorkbookProxy.calculateFormulas(formulas);
  }
}
