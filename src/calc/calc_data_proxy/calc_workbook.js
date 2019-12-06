import { isValueValid } from '../../helper/dataproxy_helper';
import * as checker from '../calc_utils/formula_check';
import { CellFormulaProxy } from './cell_formula';
import { FnCollection, MultiCollExpFn } from './fn_collection';
import { fnObjArray } from '../expression_fn/normal_fn';
import * as rawFnObj from '../expression_fn/raw_fn';

export class CalcWorkbookProxy { // 对workbook的数据代理
  constructor(workbook) {
    this.workbookObj = workbook;
    this.multiCollExpFn  = createDefaultFnCollection()
  }

  calculateFormulas(formulas) { // 核心的计算引擎; formulas是数组，应该转化为cellFormula类。
    for (let i = formulas.length - 1; i >= 0; i--) { // 遍历所有需要计算的formulas; 从后向前遍历
      try {
        let curCellFormula = formulas[i];
        if (!isValueValid(curCellFormula.cell)) {//如果该单元格为空，设置f,v为空
          curCellFormula.cell = {
            'f': '',
            'v': ''
          };
        }
        let valid_res = curCellFormula.check_valid(); // 确定是否是合法公式
        if (valid_res !== true) {//如果公式不合法，将公式值设为相应值
          curCellFormula.cell.v = valid_res;
        } else {
          //对cell和sheet进行处理和转换({}参数加上'',未定义单元格置为default_0等)，计算完成后需将多余变动部分还原
          curCellFormula.pre_process_formula(null);
          checker.trans_sheet(curCellFormula.belongSheet); // 转化sheet
          curCellFormula.execFormula(); // 核心方法，执行公式
          curCellFormula.cell.f = curCellFormula.recover_formula(); // 还原
          checker.recover_sheet(curCellFormula.belongSheet); // 还原
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  find_all_cells_with_formulas() {
    let wb = this.workbookObj;
    let formula_ref = {}; // 把workbook转化为formulas的形式
    let formulaArray = [];
    for (let sheet_name of Object.getOwnPropertyNames(wb.Sheets)) {
      let sheet = wb.Sheets[sheet_name];
      for (let cell_name of Object.getOwnPropertyNames(sheet)) {
        if (sheet[cell_name] && sheet[cell_name].f) { // 存在f属性，就会进来，放到formulaArray中
          let formula = formula_ref[sheet_name + '!' + cell_name] = new CellFormulaProxy(
            this,
            sheet,
            sheet_name,
            sheet[cell_name],
            formula_ref,
            cell_name,
            'new',
          );
          formulaArray.push(formula);
        }
      }
    }
    return formulaArray;
  }

  find_all_need_calc_cell(preAction) { // todo: preAction.findAllNeedCalcCell 应该返回workbook中多个sheet的变化结果； 需要筛选出那些需要重新计算的formulas
    console.log('find_all_need_calc_cell');
    let wb = this.workbookObj;
    let need_calc_cells = preAction.findAllNeedCalcCell(); // 获取所有需要计算的单元格
    let formula_ref = {};
    let cells = [];
    for (let sheet_name of Object.getOwnPropertyNames(wb.Sheets)) {
      let sheet = wb.Sheets[sheet_name]; // 当前的sheet
      for (let i = 0; i < need_calc_cells.length; i++) {
        let cell_name = need_calc_cells[i];
        let cell = sheet[cell_name];
        let formula = formula_ref[sheet_name + '!' + cell_name] = new CellFormulaProxy(
          this,
          sheet,
          sheet_name,
          sheet[cell_name],
          formula_ref,
          cell_name,
          'new',
        );
        cells.push(formula);
      }
    }
    return cells;
  };
}

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
