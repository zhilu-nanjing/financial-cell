let exp = require("../../utils/alphabet");


function isEqual(v1, v2) {
  v1 = v1 + "";
  v2 = v2 + "";
  v1 = v1.toUpperCase();
  v2 = v2.toUpperCase();
  if (v1 === v2) {
    return true;
  }
  return false;
}

function isHave(param) {
  if (typeof param === "undefined") {
    return false;
  }
  if (param === null) {
    return false;
  }
  return true;
}
class CalcWorkBook { // 对workbook处理的类
  constructor(rows, tileArr) {
    this.rows = rows;
    this.tileArr = tileArr
  }

  // 变动数据传入workbook
  get_workbook(workbook){
    let {data} = this.rows;
    let name = data['name'];
    let need_calc_cells = this.tileArr.findAllNeedCalcCell();//找到需要变更的单元格
    for (let i=0;i<need_calc_cells.length;i++){
      let cell_name = need_calc_cells[i];
      let zb = exp.expr2xy(cell_name);
      let cell = this.rows.getCell(zb[1], zb[0]);
      if(isHave(cell)){
        workbook.Sheets[name][cell_name] = {v: cell.text, f: cell.formulas}//将原始数据赋给workbook
      }
    }
    return workbook
  }

  //workbook填入rows
  calcDoneToSetCells(workbook, rows) {
    let {data} = rows;
    let name = data['name'];
    let sheet = workbook.Sheets[name];
    Object.keys(sheet).forEach(i => {
      let arg = exp.expr2xy(i);//单元格坐标
      if (isHave(sheet[i]) && isHave(sheet[i].v) && isHave(sheet[i].f)) {//如果单元格不为空，workbook数据填回rows原始数据
        let cell = rows.getCell(arg[1], arg[0]);//获取原始单元格
        if (!isHave(cell)){
          cell = {}
        }
        cell.text = sheet[i].v;
        cell.formulas = sheet[i].f;
        if (cell.formulas === "" && cell.text === 0){//未定义单元格置为空
          cell.text = ""
        }
        rows.setCell(arg[1], arg[0], cell);
      }
    });
    rows.workbook = workbook
  }
}

module.exports = CalcWorkBook;
