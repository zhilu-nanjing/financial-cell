module.exports = function find_all_cells_with_formulas(wb, exec_formula) {//XW: workbook传过来时的值是只有变动的f有值
  let formula_ref = {};
  let cells = [];
  for (let sheet_name in wb.Sheets) {
    let sheet = wb.Sheets[sheet_name];
    for (let cell_name in sheet) {
      if (sheet[cell_name] && sheet[cell_name].f) {
        let formula = formula_ref[sheet_name + '!' + cell_name] = {
          formula_ref: formula_ref,
          wb: wb,
          sheet: sheet,
          sheet_name: sheet_name,
          cell: sheet[cell_name],
          name: cell_name,
          status: 'new',
          exec_formula: exec_formula
        };
        cells.push(formula);
      }
    }
  }
  return cells;
};


var need_calc_cells = tileArr.findAllNeedCalcCell()
var jssheet = window.jsSpreadsheet
var Sheet = jssheet.Sheet;
var sheet = new Sheet();
for (var i=0;i<need_calc_cells.length;i++){
  var cell = need_calc_cells[i]
  sheet.setCell(cell, rows.getCell(exp.expr2xy(cell)[1], exp.expr2xy(cell)[0]))
}
for (var i=0;i<need_calc_cells.length;i++){
  var cell = need_calc_cells[i]
  var a = sheet.getCell(cell).getValue();
  rows.setCell(1, 1, {'text': a, 'formulas': a})
}


var exp = require("../core/alphabet");
var error = require('./formulajs/lib/error');
const checker = require('./formula_check.js');


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

class CalcCell { // 对cell中的参数做转换，判断,多单元格处理等的类
  constructor(formulas_i, rows) {
    this.cell = formulas_i.cell
    this.f = formulas_i.cell.f
    this.name = formulas_i.name
    this.sheet = formulas_i.sheet
    this.rows = rows
    var cell_zb = exp.expr2xy(this.name)
    this.cell_x = cell_zb[0]
    this.cell_y = cell_zb[1]
  }

  //检测是否合法
  check_valid() {
    if (checker.cell_valid(this.cell) !== true) {
      return checker.cell_valid(this.cell)
      //XW: 处理""中"" 的转义
    } else if (this.f.indexOf('""') >= 1 && this.f.indexOf('(') < 0 && this.f.indexOf(')') < 0) {
      return this.f.slice(2, this.f.length - 1).replace('""', '"')
    }
    return true
  }

  //{}用''包起来
  trans_params(fml) {
    var reg = new RegExp('\{(.*?)\}', 'g')
    var arg = fml.match(reg)
    if (arg != null) {
      for (var i = 0; i < arg.length; i++) {
        var param = arg[i]
        var rep = "'" + param + "'"
        fml = fml.replace(param, rep)
      }
    }
    return fml
  }

  //参数转换
  trans_formula() {
    var fml = this.f
    //去除公式开头结尾的空格
    fml = checker.strim(fml)
    //公式参数转换
    fml = checker.trans_formula(fml)
    if (fml.indexOf('{') >= 0 && fml.indexOf('}') >= 0 && fml.indexOf("'{") < 0) {// XW: 大括号参数判断
      fml = this.trans_params(fml)
    }
    return fml
  }

  //将公式还原成原来的样子
  recover_formula() {
    return checker.strim(this.f)
  }

  //判断是否是多值函数的单元格
  is_muti_cell() {
    var zb = exp.expr2xy(this.name)
    var multivalueRefsCell = this.rows.getCell(zb[1], zb[0])
    if (multivalueRefsCell !== null) {
      multivalueRefsCell = multivalueRefsCell.multivalueRefsCell
    }
    return multivalueRefsCell !== undefined ? true : false
  }


  //清除多值函数覆盖的单元格的标记
  clear_cells(ri, ci) {
    this.rows.setCell(ri, ci, {text: "", formulas: ""}, 'all_with_no_workbook');
  }

  //一维数组
  process_arr(wb, cell_v, multivalueRefsCell){
    let enter = true;
    var li = cell_v[0]
    let cell = "", expr = 0;
    var cell_f = this.f
    for (var i = 0; i < li.length; i++) {
      var c = exp.xy2expr(this.cell_x, this.cell_y + i)
      var v = li[i]
      if (i === 0) {
        wb[c] = {
          "v": v,
          "f": cell_f,
          'multivalueRefsCell': multivalueRefsCell
        }
      } else {
        var source = this.rows.getCell( this.cell_y + i,  this.cell_x);
        if (!isHave(source) || !isHave(source.text) || (isHave(source.text) && (isEqual(source.text, v) || source.text === ""))) {
          wb[c] = {
            "v": v,
            'multivalueRefsCell': multivalueRefsCell
          }
        } else {
          enter = false;
          cell = source;
          expr = c;
        }
      }
    }
    if(!enter) {
      this.clean_arr(wb, li, cell, multivalueRefsCell, expr)
    }
    return wb
  }
  //清除一维数组
  clean_arr(wb, li, cell, multivalueRefsCell, expr){
    for (var i = 0; i < li.length; i++) {
      let expr2 = exp.xy2expr( this.cell_x, this.cell_y + i);
      if (wb[expr2].v instanceof Array && expr2 !== multivalueRefsCell){//如果出现多值单元格中嵌套了多值单元格，直接报错
        wb[expr2] = {
          "v": error.ref,
          "f": cell.formulas,
          'multivalueRefsCell': multivalueRefsCell
        }
      } else if(expr === expr2) {
        wb[expr2] = {
          "v": cell.text,
          "f": cell.formulas,
          'multivalueRefsCell': multivalueRefsCell
        }
      } else if(expr2 === multivalueRefsCell) {
        wb[expr2] = {
          "v": error.ref,
          "f": this.f,
          'multivalueRefsCell': multivalueRefsCell
        }
      } else {
        wb[expr2] = {
          "v": "",
          "f": "",
        }
      }
      this.clear_cells( this.cell_y + i, this.cell_x );
    }
  }

  //二维数组
  process_matrix(wb, cell_v, multivalueRefsCell){
    let enter = true
    let len = cell_v.length
    let cell = "", expr = 0;
    for (var i = 0; enter && i < len; i++) {
      for (var j = 0; enter && j < cell_v[i].length ; j++) {
        var c = exp.xy2expr(this.cell_x + i, this.cell_y + j)
        var v = cell_v[i][j]
        if (i === 0 && j === 0) {
          wb[c] = {
            "v": v,
            "f": this.f,
            'multivalueRefsCell': multivalueRefsCell
          }
        } else {
          var source = this.rows.getCell( this.cell_y + j,  this.cell_x + i);
          if (!isHave(source) || !isHave(source.text) || (isHave(source.text) && (isEqual(source.text, v) || source.text === ""))) {
            wb[c] = {
              "v": v,
              "f": v,
              'multivalueRefsCell': multivalueRefsCell
            }
          } else {
            enter = false;
            cell = source;
            expr = c;
          }
        }
      }
    }
    if(!enter) {
      this.clean_matrix(wb, cell_v, cell, multivalueRefsCell, expr)
    }else{
      for (var i = 0; enter && i < len; i++) {
        for (var j = 0; enter && j < cell_v[i].length ; j++) {
          this.rows.setCell(this.cell_y + j, this.cell_x + i, {'text': cell_v[i][j], 'formulas': cell_v[i][j], 'multivalueRefsCell': multivalueRefsCell})
        }
      }
    }
    return wb
  }
  //清除二维数组标记
  clean_matrix(wb, cell_v, cell, multivalueRefsCell, expr){
    let len = cell_v.length
    for (let i = 0; i < len; i++) {
      for (let j = 0;  j < cell_v[i].length; j++) {
        let expr2 = exp.xy2expr( this.cell_x + i, this.cell_y + j);
        if (wb[expr2].v instanceof Array && expr2 !== multivalueRefsCell){//如果出现多值单元格中嵌套了多值单元格，直接报错
          this.rows.setCell(this.cell_y + j, this.cell_x + i, {'text': error.ref, 'formulas': cell.formulas, 'multivalueRefsCell': multivalueRefsCell})
          wb[expr2] = {
            "v": error.ref,
            "f": cell.formulas,
            'multivalueRefsCell': multivalueRefsCell
          }
        } else if(expr === expr2) {
          wb[expr2] = {
            "v": wb[expr2].v,
            "f": cell.formulas,
            'multivalueRefsCell': multivalueRefsCell
          }
          this.rows.setCell(this.cell_y + j, this.cell_x + i, {'text': wb[expr2].v, 'formulas': cell.formulas, 'multivalueRefsCell': multivalueRefsCell})
        } else if(expr2 === multivalueRefsCell) {
          wb[expr2] = {
            "v": error.ref,
            "f": this.f,
            'multivalueRefsCell': multivalueRefsCell
          }
          this.rows.setCell(this.cell_y + j, this.cell_x + i, {'text': error.ref, 'formulas': this.f, 'multivalueRefsCell': multivalueRefsCell})
        } else {
          wb[expr2] = {
            "v": "",
            "f": "",
          }
          this.rows.setCell(this.cell_y + j, this.cell_x + i, {'text': "", 'formulas': "", 'multivalueRefsCell': multivalueRefsCell})
        }
        // this.clear_cells( this.cell_y + j, this.cell_x + i);
      }
    }
  }
  //验证单元格
  valid_cell_v(cell_v){

  }
  //处理多值函数单元格
  deal_muti_cell() {
    var zb = exp.expr2xy(this.name)
    var multivalueRefsCell = this.rows.getCell(zb[1], zb[0])
    if (isHave(multivalueRefsCell) && isHave(multivalueRefsCell.multivalueRefsCell)) {
      multivalueRefsCell = multivalueRefsCell.multivalueRefsCell
    } else {
      multivalueRefsCell = this.name;
    }
    var cell_zb = exp.expr2xy(multivalueRefsCell)
    this.cell_x = cell_zb[0]
    this.cell_y = cell_zb[1]
    var cell_v = this.cell.v
    var cell_f = this.f
    let wb = this.sheet
    if (!(cell_v instanceof Array) && cell_f.indexOf('=') < 0) {
      return false
    }
    if (!(cell_v instanceof Array) && this.name !== multivalueRefsCell){

    }
    if (cell_v instanceof Array && this.name !== multivalueRefsCell){
      return false
    }
    var len = cell_v.length
    if (len === 1){
      wb = this.process_arr(wb, cell_v, multivalueRefsCell)
    }else{
      wb = this.process_matrix(wb, cell_v, multivalueRefsCell)
    }
    return wb
  }
}

module.exports = CalcCell;
