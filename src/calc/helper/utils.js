var exp = require("../../core/alphabet");
const helper = require("../../core/helper");

exports.Rows2Workbook = function (rows) {
  var cells = rows._
  var workbook = null
  let {data} = rows;
  let name = data['name']
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
      var cell = rows.getCell(ri, ci)
      var cell_name = exp.xy2expr(ci, ri)
      if(helper.isHave(cell)) {
        workbook.Sheets[name][cell_name] = {
          v: cell.text,
          f: cell.formulas
        }
      }
    });
  });
  return workbook
};
