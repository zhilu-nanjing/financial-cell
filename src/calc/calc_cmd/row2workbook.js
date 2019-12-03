import exp from "../../utils/alphabet"
import helper from "../../core/helper"

export function Rows2Workbook (rows) {
  let cells = rows._;
  let workbook = null;
  let {data} = rows;
  let name = data['name'];
  if (helper.isHave(rows.workbook)){//如果是第一次加载（rows中没有workbook），则初始化workbook，否则更新workbook
    workbook = rows.workbook
  }else{
    workbook = {
      Sheets:{}
    };
    workbook.Sheets[name] = {}
  }
  //遍历原始数据加入workbook
  Object.keys(cells).forEach(ri => {
    Object.keys(cells[ri].cells).forEach(ci => {
      let cell = rows.getCell(ri, ci);
      let cell_name = exp.xy2expr(ci, ri);
      if(helper.isHave(cell)) {
        workbook.Sheets[name][cell_name] = {
          v: cell.text, // todo: cell.text不应该直接赋值给v，因为text只是字符串。
          f: cell.formulas
        }
      }
    });
  });
  return workbook
};
