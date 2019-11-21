var exp = require("../core/alphabet");
var error = require('./formulajs/lib/error');


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
    this.rows = rows
    this.tileArr = tileArr
  }

  // rows 转workbook
  get_workbook(){
    var need_calc_cells = this.tileArr.findAllNeedCalcCell()
    var workbook = {
      Sheets:{}
    }
    workbook.Sheets.sheet1 = {}
    for (var i=0;i<need_calc_cells.length;i++){
      var cell_name = need_calc_cells[i]
      var zb = exp.expr2xy(cell_name)
      var cell = this.rows.getCell(zb[1], zb[0])
      if(isHave(cell)){
        workbook.Sheets.sheet1[cell_name] = {v: cell.text, f: cell.formulas, multivalueRefsCell: cell.multivalueRefsCell}
      }
    }
    return workbook
  }

  //workbook填入rows
  calcDoneToSetCells(workbook, rows) {
    var sheet = workbook.Sheets.sheet1
    Object.keys(sheet).forEach(i => {
      let arg = exp.expr2xy(i);
      if (isHave(sheet[i]) && isHave(sheet[i].v) && isHave(sheet[i].f)) {
        var cell = rows.getCell(arg[1], arg[0])
        cell.text = sheet[i].v
        cell.formulas = sheet[i].f
        cell.multivalueRefsCell = sheet[i].multivalueRefsCell
        if (isHave(sheet[i].source_v)){
          cell.source_v = sheet[i].source_v
        }
        rows.setCell(arg[1], arg[0], cell);
      }
    });
  }

  // 判断是否是多值函数的单元格
  is_muti_cell(formulas_i) {
    var multivalueRefsCell = formulas_i.cell
    if (multivalueRefsCell !== null) {
      multivalueRefsCell = multivalueRefsCell.multivalueRefsCell
    }
    return isHave(multivalueRefsCell) ? true : false
  }

  //一维数组
  process_arr(){

  }


  //二维数组
  process_matrix(formulas_i, multivalueRefsCell){
    let enter = true
    var cell_v = formulas_i.cell.v
    var cell_zb = exp.expr2xy(multivalueRefsCell)
    var cell_x = cell_zb[0]
    var cell_y = cell_zb[1]
    let len = cell_v.length
    let cell = "", expr = 0;
    var wb = formulas_i.sheet
    for (var i = 0; i < len; i++) {
      for (var j = 0; j < cell_v[i].length ; j++) {
        var c = exp.xy2expr(cell_x + i, cell_y + j)
        var v = cell_v[i][j]
        if (i === 0 && j === 0) {
          wb[c] = {
            "v": v,
            "f": formulas_i.cell.f,
            'multivalueRefsCell': multivalueRefsCell
          }
        } else {
          var source = this.rows.getCell( cell_y + j,  cell_x + i);
          if (!isHave(source) || !isHave(source.text) || (isHave(source.text) && (isEqual(source.text, v) || source.text === ""))) {
            wb[c] = {
              "v": cell_v[i][j],
              "f": cell_v[i][j],
              'multivalueRefsCell': multivalueRefsCell
            }
          } else {
            wb[c] = {
              "v": source.v,
              "f": source.f,
              'multivalueRefsCell': multivalueRefsCell
            }
            enter = false;
            cell = source;
            expr = c;
          }
        }
      }
    }
    if(!enter) {
      return this.clean_matrix(wb, cell_v, cell, multivalueRefsCell, expr)
    }else{
      return wb
    }
  }


  //清除二维数组标记
  clean_matrix(wb, cell_v, cell, multivalueRefsCell, expr){
    var cell_zb = exp.expr2xy(multivalueRefsCell)
    var cell_x = cell_zb[0]
    var cell_y = cell_zb[1]
    let len = cell_v.length
    for (var i = 0; i < len; i++) {
      for (var j = 0; j < cell_v[i].length ; j++) {
        var c = exp.xy2expr(cell_x + i, cell_y + j)
        if (i === 0 && j === 0) {
          wb[c] = {
            "v": error.ref,
            "f": wb[c].f,
            'multivalueRefsCell': multivalueRefsCell
          }
        } else if (expr === c) {
          wb[c] = {
            "v": cell.text,
            "f": cell.formulas,
            'multivalueRefsCell': multivalueRefsCell
          }
        } else {
          wb[c] = {
            "v": "",
            "f": ""
          }
        }
      }
    }
    return wb
  }


  //如果多值原始单元格发生变动，清除所有该多值函数生成的单元格中的标记
  clean_all_flag(formulas_i, multivalueRefsCell){
    var wb = formulas_i.sheet
    var zb = exp.expr2xy(multivalueRefsCell)
    var cell_x = zb[0]
    var cell_y = zb[1]
    var cell = this.rows.getCell(zb[1], zb[0])
    var cell_v = cell.source_v
    let len = cell_v.length
    for (var i = 0; i < len; i++) {
      for (var j = 0; j < cell_v[i].length ; j++) {
        var c = exp.xy2expr(cell_x + i, cell_y + j)
        if (i === 0 && j === 0) {
          wb[c] = {
            "v": formulas_i.cell.v,
            "f": formulas_i.cell.f,
            "source_v": ""
          }
        } else if (this.rows.getCell(cell_y + j, cell_x + i).text !== cell_v[i][j]) {
          wb[c] = {
            "v": this.rows.getCell(cell_y + j, cell_x + i).text,
            "f": this.rows.getCell(cell_y + j, cell_x + i).formulas,
          }
        } else {
          wb[c] = {
            "v": "",
            "f": ""
          }
        }
      }
    }
    return wb
  }



  //处理多值函数单元格
  deal_muti_cell(workbook, formulas_i) {
    var multivalueRefsCell = formulas_i.cell
    if (isHave(multivalueRefsCell) && isHave(multivalueRefsCell.multivalueRefsCell)) {
      multivalueRefsCell = multivalueRefsCell.multivalueRefsCell
    } else {
      multivalueRefsCell = formulas_i.name;
    }
    var cell_v = formulas_i.cell.v
    if (formulas_i.name !== multivalueRefsCell){
      if (cell_v instanceof Array){
        workbook.Sheets.sheet1[formulas_i.name].v = error.ref
        workbook.Sheets.sheet1[formulas_i.name].source_v = cell_v
      }else if(isHave(cell_v)){
        workbook.Sheets.sheet1[formulas_i.name].v = cell_v
      }
    }else {
      if(!(cell_v instanceof Array)) {
        workbook.Sheets.sheet1 = this.clean_all_flag(formulas_i, multivalueRefsCell)
      }else{
        var zb = exp.expr2xy(multivalueRefsCell)
        if (isHave(this.rows.getCell(zb[1], zb[0]).source_v) && this.rows.getCell(zb[1], zb[0]).source_v !== cell_v){
          workbook.Sheets.sheet1 = this.clean_all_flag(formulas_i, multivalueRefsCell)
        }
        var len = cell_v.length
        if (len === 1){
          workbook.Sheets.sheet1 = this.process_arr(formulas_i, multivalueRefsCell)
          workbook.Sheets.sheet1[formulas_i.name].source_v = cell_v
        }else{
          workbook.Sheets.sheet1 = this.process_matrix(formulas_i, multivalueRefsCell)
          workbook.Sheets.sheet1[formulas_i.name].source_v = cell_v
        }
      }
    }
  }
}

module.exports = CalcWorkBook;