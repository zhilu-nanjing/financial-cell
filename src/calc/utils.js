var exp = require("../core/alphabet");

exports.isEqual = function(v1, v2) {
  v1 = v1 + "";
  v2 = v2 + "";
  v1 = v1.toUpperCase();
  v2 = v2.toUpperCase();
  if (v1 === v2) {
    return true;
  }
  return false;
}

exports.isHave = function(param) {
  if (typeof param === "undefined") {
    return false;
  }
  if (param === null) {
    return false;
  }
  return true;
}


exports.Rows2Workbook = function (rows) {
  var cells = rows._
  var workbook = {
    Sheets:{},
    error_cells: []
  };
  let {data} = rows;
  let name = data['name']
  workbook.Sheets[name] = {}
  Object.keys(cells).forEach(ri => {
    Object.keys(cells[ri].cells).forEach(ci => {
      var cell = rows.getCell(ri, ci)
      var cell_name = exp.xy2expr(ci, ri)
      if(exports.isHave(cell)) {
        workbook.Sheets[name][cell_name] = {
          v: cell.text,
          f: cell.formulas,
          multivalueRefsCell: cell.multivalueRefsCell,
          source_v: cell.source_v
        }
      }
    });
  });
  return workbook
};