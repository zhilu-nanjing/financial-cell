var exp = require("../core/alphabet");
var error = require('./formulajs/lib/error');
const es6 = require('./es6');

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

  // 变动数据传入workbook
  get_workbook(workbook){
    let {data} = this.rows;
    let name = data['name']
    var need_calc_cells = this.tileArr.findAllNeedCalcCell()
    for (var i=0;i<need_calc_cells.length;i++){
      var cell_name = need_calc_cells[i]
      var zb = exp.expr2xy(cell_name)
      var cell = this.rows.getCell(zb[1], zb[0])
      if(isHave(cell)){
        let clash_cells = isHave(workbook.Sheets[name][cell_name]) && isHave(workbook.Sheets[name][cell_name].clash_cells) ? workbook.Sheets[name][cell_name].clash_cells: null
        workbook.Sheets[name][cell_name] = {v: cell.text, f: cell.formulas, multivalueRefsCell: cell.multivalueRefsCell, source_v: cell.source_v, clash_cells: clash_cells}
      }
    }
    return workbook
  }

  //workbook填入rows
  calcDoneToSetCells(workbook, rows, clash_cells) {
    let {data} = rows;
    let name = data['name']
    var sheet = workbook.Sheets[name]
    Object.keys(sheet).forEach(i => {
      let arg = exp.expr2xy(i);
      if(isHave(sheet[i].source_v) && sheet[i].source_v === "" && !isHave(sheet[i].v)){
        sheet[i].v = ""
      }
      if (isHave(sheet[i]) && isHave(sheet[i].v) && isHave(sheet[i].f)) {
        var cell = rows.getCell(arg[1], arg[0])
        if (!isHave(cell)){
          cell = {}
        }
        cell.text = sheet[i].v
        cell.formulas = sheet[i].f
        if (cell.formulas === "" && cell.text === 0){
          cell.text = ""
        }
        cell.multivalueRefsCell = sheet[i].multivalueRefsCell
        if (isHave(sheet[i].source_v) && sheet[i].source_v instanceof Array){
          cell.source_v = sheet[i].source_v
        }else{
          cell.source_v = null
        }
        rows.setCell(arg[1], arg[0], cell);
      }
    });
    rows.workbook = workbook
    //如果有冲突单元格，重新触发计算冲突单元格
    if (isHave(clash_cells)){
      var a = new es6.PreAction({
          type: 11,
          action: "重新计算",
          ri: -1,
          ci: -1,
          oldCell: {},
          newCell: {}
      }, rows.data);
      //重写发现需计算单元格函数，使其等于冲突单元格列表
      a.findAllNeedCalcCell = function() {
        return clash_cells
      }
      data.calc(rows, a);
    }
  }

  // 判断是否是多值函数的单元格
  is_muti_cell(formulas_i) {
    var multivalueRefsCell = formulas_i.cell
    if (multivalueRefsCell !== null) {
      multivalueRefsCell = multivalueRefsCell.multivalueRefsCell
    }
    return isHave(multivalueRefsCell) ? true : false
  }

  //判断是否已经是别的多值函数的占用了的单元格
  al_have_muti(source, multivalueRefsCell){
    if (isHave(source) && isHave(source.multivalueRefsCell) && source.multivalueRefsCell !== multivalueRefsCell){
      return true
    }
    return false
  }

  //一维数组
  process_arr(formulas_i, multivalueRefsCell){
    let enter = true
    var cell_v = formulas_i.cell.v
    var cell_zb = exp.expr2xy(multivalueRefsCell)
    var cell_x = cell_zb[0]
    var cell_y = cell_zb[1]
    let cell = "", expr = 0;
    var wb = formulas_i.sheet
    for (var j = 0; j < cell_v.length ; j++) {
      var c = exp.xy2expr(cell_x, cell_y + j)
      var v = cell_v[j]
      if (j === 0) {
        wb[c] = {
          "v": v,
          "f": formulas_i.cell.f,
          'multivalueRefsCell': multivalueRefsCell
        }
      } else {
        var source = this.rows.getCell( cell_y + j,  cell_x);
        if ((!isHave(source) || !isHave(source.text) || (isHave(source.text) && (isEqual(source.text, v) || source.text === ""))) && !this.al_have_muti(source, multivalueRefsCell)) {
          wb[c] = {
            "v": cell_v[j],
            "f": cell_v[j],
            'multivalueRefsCell': multivalueRefsCell
          }
        } else {
          enter = false;
          cell = source;
          expr = c;
          if (this.al_have_muti(source, multivalueRefsCell)){//如果需要占用的单元格已经是其他函数的多值单元格， 将冲突单元格标记，然后直接报错。。
            if (isHave( wb[source.multivalueRefsCell].clash_cells) &&  wb[source.multivalueRefsCell].clash_cells.indexOf(multivalueRefsCell) < 0){
              wb[source.multivalueRefsCell].clash_cells.push(multivalueRefsCell)
            }else{
              wb[source.multivalueRefsCell].clash_cells = [multivalueRefsCell]
            }
            return this.clean_arr(wb, cell_v, cell, multivalueRefsCell, expr)
          }
          wb[c] = {
            "v": source.v,
            "f": source.f,
            'multivalueRefsCell': multivalueRefsCell
          }
        }
      }
    }
    if(!enter) {
      return this.clean_arr(wb, cell_v, cell, multivalueRefsCell, expr)
    }else{
      return wb
    }
  }

  //清除一维数组标记
  clean_arr(wb, cell_v, cell, multivalueRefsCell, expr){
    var cell_zb = exp.expr2xy(multivalueRefsCell)
    var cell_x = cell_zb[0]
    var cell_y = cell_zb[1]
    for (var j = 0; j < cell_v.length ; j++) {
      var c = exp.xy2expr(cell_x, cell_y + j)
      if (wb[c].multivalueRefsCell === multivalueRefsCell) {
        if (j === 0) {
          wb[c] = {
            "v": error.ref,
            "f": wb[c].f,
            'multivalueRefsCell': multivalueRefsCell,
            'clash_cells': (isHave(wb[c]) && isHave(wb[c].clash_cells))? wb[c].clash_cells: null
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
            'multivalueRefsCell': multivalueRefsCell,
            'clash_cells': (isHave(wb[c]) && isHave(wb[c].clash_cells))? wb[c].clash_cells: null
          }
        } else {
          var source = this.rows.getCell( cell_y + j,  cell_x + i);
          if ((!isHave(source) || !isHave(source.text) || (isHave(source.text) && (isEqual(source.text, v) || source.text === ""))) && (!this.al_have_muti(source, multivalueRefsCell))) {
            wb[c] = {
              "v": cell_v[i][j],
              "f": cell_v[i][j],
              'multivalueRefsCell': multivalueRefsCell
            }
          } else {
            enter = false;
            cell = source;
            expr = c;
            if (this.al_have_muti(source, multivalueRefsCell)){//如果需要占用的单元格已经是其他函数的多值单元格， 将冲突单元格标记，然后直接报错。。
              if (isHave( wb[source.multivalueRefsCell].clash_cells) &&  wb[source.multivalueRefsCell].clash_cells.indexOf(multivalueRefsCell) < 0){
                wb[source.multivalueRefsCell].clash_cells.push(multivalueRefsCell)
              }else{
                wb[source.multivalueRefsCell].clash_cells = [multivalueRefsCell]
              }
              return this.clean_matrix(wb, cell_v, cell, multivalueRefsCell, expr)
            }
            wb[c] = {
              "v": source.v,
              "f": source.f,
              'multivalueRefsCell': multivalueRefsCell
            }
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
        if (isHave(wb[c]) && wb[c].multivalueRefsCell === multivalueRefsCell) {
          if (i === 0 && j === 0) {
            wb[c] = {
              "v": error.ref,
              "f": wb[c].f,
              'multivalueRefsCell': multivalueRefsCell,
              'clash_cells': (isHave(wb[c]) && isHave(wb[c].clash_cells))? wb[c].clash_cells: null
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
    }
    return wb
  }


  //如果多值原始单元格发生变动，清除所有该多值函数生成的单元格中的标记,并重新计算
  clean_all_flag(formulas_i, multivalueRefsCell){
    var wb = formulas_i.sheet
    var clash_cells  = isHave(wb[multivalueRefsCell].clash_cells) ? wb[multivalueRefsCell].clash_cells : []
    var zb = exp.expr2xy(multivalueRefsCell)
    var cell_x = zb[0]
    var cell_y = zb[1]
    var cell = this.rows.getCell(zb[1], zb[0])
    var cell_v = cell.source_v
    let len = cell_v.length
    if (cell_v[0] instanceof Array){
      for (var i = 0; i < len; i++) {
        for (var j = 0; j < cell_v[i].length ; j++) {
          var c = exp.xy2expr(cell_x + i, cell_y + j)
          clash_cells.push(c)
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
    }else{
      for (var j = 0; j < cell_v.length ; j++) {
        var c = exp.xy2expr(cell_x, cell_y + j)
        clash_cells.push(c)
        if (j === 0) {
          wb[c] = {
            "v": formulas_i.cell.v,
            "f": formulas_i.cell.f,
            "source_v": ""
          }
        } else if (this.rows.getCell(cell_y + j, cell_x).text !== cell_v[j]) {
          wb[c] = {
            "v": this.rows.getCell(cell_y + j, cell_x).text,
            "f": this.rows.getCell(cell_y + j, cell_x).formulas,
          }
        } else {
          wb[c] = {
            "v": "",
            "f": ""
          }
        }
      }
    }
   //删除单元格时触发计算所有与之相关的单元格
    return [wb, clash_cells]
  }



  //处理多值函数单元格
  deal_muti_cell(workbook, formulas_i) {
    var multivalueRefsCell = formulas_i.cell
    let {data} = this.rows;
    let name = data['name']
    if (isHave(multivalueRefsCell) && isHave(multivalueRefsCell.multivalueRefsCell)) {
      multivalueRefsCell = multivalueRefsCell.multivalueRefsCell
    } else {
      multivalueRefsCell = formulas_i.name;
    }
    var cell_v = formulas_i.cell.v
    if (formulas_i.name !== multivalueRefsCell){
      if (cell_v instanceof Array){
        workbook.Sheets[name][formulas_i.name].v = error.ref
        workbook.Sheets[name][formulas_i.name].source_v = cell_v
      }else if(isHave(cell_v)){
        workbook.Sheets[name][formulas_i.name].v = cell_v
      }
    }else {
      if(!(cell_v instanceof Array)) {
        let result = this.clean_all_flag(formulas_i, multivalueRefsCell)
        workbook.Sheets[name] = result[0]
        return result[1]
      }else{
        var zb = exp.expr2xy(multivalueRefsCell)
        if (isHave(this.rows.getCell(zb[1], zb[0]).source_v) && this.rows.getCell(zb[1], zb[0]).source_v.toString() !== cell_v.toString()){
          let result = this.clean_all_flag(formulas_i, multivalueRefsCell)
          workbook.Sheets[name] = result[0]
          return result[1]
        }
        if (!(cell_v[0] instanceof Array)){//判断是一维数组还是二维数组
          workbook.Sheets[name] = this.process_arr(formulas_i, multivalueRefsCell)
          workbook.Sheets[name][formulas_i.name].source_v = cell_v
        }else{
          workbook.Sheets[name] = this.process_matrix(formulas_i, multivalueRefsCell)
          workbook.Sheets[name][formulas_i.name].source_v = cell_v
        }
      }
    }
  }
}

module.exports = CalcWorkBook;