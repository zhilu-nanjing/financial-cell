import exp from '../../utils/alphabet';
import { isHave } from '../../helper/check_value';

export class CalcRowsProxy { // 代理对于rows的数据获取与数据更新
  constructor(rows, tileArr) {
    this.rows = rows;
    this.tileArr = tileArr;
  }

  // 变动数据传入workbook
  updateWorkbook(workbook) {
    let { data } = this.rows;
    let name = data['name'];
    let need_calc_cells = this.tileArr.findAllNeedCalcCell();//找到需要变更的单元格
    for (let i = 0; i < need_calc_cells.length; i++) {
      let cell_name = need_calc_cells[i];
      let zb = exp.expr2xy(cell_name);
      let cell = this.rows.getCell(zb[1], zb[0]);
      if (isHave(cell)) {
        workbook.Sheets[name][cell_name] = {
          v: cell.text,
          f: cell.formulas
        };//将原始数据赋给workbook
      }
    }
    return workbook;
  }

  rows2workbook() { // 把rows中的数据转化为workbook的形式
    let rows = this.rows
    let cells = rows._;
    let workbook = null;
    let { data } = rows;
    let name = data['name'];
    if (isHave(rows.workbookObj)) {//如果是第一次加载（rows中没有workbook），则初始化workbook，否则更新workbook
      workbook = rows.workbookObj;
    } else {
      workbook = {
        Sheets: {}
      };
      workbook.Sheets[name] = {};
    }
    //遍历原始数据加入workbook
    Object.keys(cells)
      .forEach(ri => {
        Object.keys(cells[ri].cells)
          .forEach(ci => {
            let cell = rows.getCell(ri, ci);
            let cell_name = exp.xy2expr(ci, ri);
            if (isHave(cell)) {
              workbook.Sheets[name][cell_name] = {
                v: cell.text, // todo: cell.text不应该直接赋值给v，因为text只是字符串。
                f: cell.formulas
              };
            }
          });
      });
    return workbook;
  }


  //workbook填入rows
  calcDoneToSetCells(workbook, rows) {
    let { data } = rows;
    let name = data['name'];
    let sheet = workbook.Sheets[name];
    Object.keys(sheet)
      .forEach(i => {
        let arg = exp.expr2xy(i);//单元格坐标
        if (isHave(sheet[i]) && isHave(sheet[i].v) && isHave(sheet[i].f)) {//如果单元格不为空，workbook数据填回rows原始数据
          let cell = rows.getCell(arg[1], arg[0]);//获取原始单元格
          if (!isHave(cell)) {
            cell = {};
          }
          cell.text = sheet[i].v;
          cell.formulas = sheet[i].f;
          if (cell.formulas === '' && cell.text === 0) {//未定义单元格置为空
            cell.text = '';
          }
          rows.setCell(arg[1], arg[0], cell);
        }
      });
    rows.workbook = workbook;
  }
}
