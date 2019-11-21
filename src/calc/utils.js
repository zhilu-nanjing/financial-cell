var exp = require("../core/alphabet");
const helper = require("../core/helper");

exports.Rows2Workbook = function (rows) {
  var cells = rows._
  var workbook = {
    Sheets:{}
  };
  let {data} = rows;
  let name = data['name']
  workbook.Sheets[name] = {}
  Object.keys(cells).forEach(ri => {
    Object.keys(cells[ri].cells).forEach(ci => {
      var cell = rows.getCell(ri, ci)
      var cell_name = exp.xy2expr(ci, ri)
      if(helper.isHave(cell)) {
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


exports.Rows2Workbook = function (rows) {
  var cells = rows._
  var workbook = {
    Sheets:{}
  };
  let {data} = rows;
  let name = data['name']
  workbook.Sheets[name] = {}
  Object.keys(cells).forEach(ri => {
    Object.keys(cells[ri].cells).forEach(ci => {
      var cell = rows.getCell(ri, ci)
      var cell_name = exp.xy2expr(ci, ri)
      if(helper.isHave(cell)) {
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