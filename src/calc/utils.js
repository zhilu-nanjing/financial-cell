var exp = require("../core/alphabet");
var helper = require("../core/helper")
exports.get_workbook = function(rows, tileArr) {
  var need_calc_cells = tileArr.findAllNeedCalcCell()
  var workbook = {
    Sheets:{}
  }
  workbook.Sheets.sheet1 = {}
  for (var i=0;i<need_calc_cells.length;i++){
    var cell_name = need_calc_cells[i]
    var zb = exp.expr2xy(cell_name)
    var cell = rows.getCell(zb[1], zb[0])
    if(helper.isHave(cell)){
      workbook.Sheets.sheet1[cell_name] = {v: cell.text, f: cell.formulas, multivalueRefsCell: cell.multivalueRefsCell}
    }
  }
  return workbook
}


exports.calcDoneToSetCells = function(workbook, rows) {
  var sheet = workbook.Sheets.sheet1
  Object.keys(sheet).forEach(i => {
    let arg = exp.expr2xy(i);
    if (helper.isHave(sheet[i]) && helper.isHave(sheet[i].v) && helper.isHave(sheet[i].f) && !helper.isHave(rows.getCell(arg[1], arg[0]).multivalueRefsCell)) {
      rows.setCell(arg[1], arg[0], {text: sheet[i].v, formulas: sheet[i].f}, 'text');
    }
  });
}