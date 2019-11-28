var exp = require("../core/alphabet");
var error = require('./formulajs/lib/error');
const PreAction = require('../model/pre_action').default


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
    let name = data['name']
    var need_calc_cells = this.tileArr.findAllNeedCalcCell()
    for (var i=0;i<need_calc_cells.length;i++){
      var cell_name = need_calc_cells[i]
      var zb = exp.expr2xy(cell_name)
      var cell = this.rows.getCell(zb[1], zb[0])
      if(isHave(cell)){
        if (!isHave(workbook.Sheets[name][cell_name])){
          workbook.Sheets[name][cell_name] = {}
        }
        workbook.Sheets[name][cell_name].v = cell.text
        workbook.Sheets[name][cell_name].f = cell.formulas
      }
    }
    return workbook
  }

  //workbook填入rows
  calcDoneToSetCells(workbook, rows, recalc) {
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
        cell.multivalueRefsCell = sheet[i].from_multivalue
        if (isHave(sheet[i].source_v) && sheet[i].source_v instanceof Array){
          cell.source_v = sheet[i].source_v
        }else{
          cell.source_v = null
        }
        rows.setCell(arg[1], arg[0], cell);
      }
    });
    rows.workbook = workbook
    //如果有错误单元格，重新触发计算冲突单元格(设置recalc为true防止死循环)
    if (recalc === false){
      let error_cells = workbook.error_cells
      if (error_cells.length>0){
        var a = new PreAction({
          type: 11,
          action: "重新计算"
        }, rows.data);
        //重写发现需计算单元格函数，使其等于错误单元格列表
        a.findAllNeedCalcCell = function() {
          return error_cells
        }
        data.calc(rows, a, true);
      }
    }
  }

  // 判断是否是多值函数的单元格
  is_muti_cell(formulas_i) {
    var multivalueRefsCell = formulas_i.cell
    if (multivalueRefsCell !== null) {
      multivalueRefsCell = multivalueRefsCell.from_multivalue
    }

    return isHave(multivalueRefsCell) ? true : false
  }
  //处理一维数组
  process_arr(formulas_i, multivalueRefsCell){
    var cell_v = formulas_i.cell.v
    var cell_zb = exp.expr2xy(multivalueRefsCell)
    var cell_x = cell_zb[0]
    var cell_y = cell_zb[1]
    var wb = formulas_i.sheet
      for (var j = 0; j < cell_v.length ; j++) {
        var c = exp.xy2expr(cell_x, cell_y + j)
        var v = cell_v[j]
        if (j === 0) {
          wb[c] = {
            "v": v,
            "f": formulas_i.cell.f,
            'multivalueRefsCell': multivalueRefsCell,
            'from_multivalue':multivalueRefsCell
          }
        } else {
          //判断是否是冲突单元格（有值或有别的多值函数已占用）
          if (!isHave(wb[c]) || wb[c].f === "" && wb[c].v === "" || !isHave(wb[c].v)&&isHave(wb[c].f) || isEqual(wb[c].v, cell_v[j]) && isEqual(wb[c].f, wb[c].v) && isEqual(wb[c].from_multivalue, multivalueRefsCell)) {
            wb[c] = {
              "v": cell_v[j],
              "f": cell_v[j],
              'from_multivalue':multivalueRefsCell
            }
          } else {
            return false
          }
        }
    }
    return wb
  }
  //处理二维数组
  process_matrix(formulas_i, multivalueRefsCell){
    var cell_v = formulas_i.cell.v
    var cell_zb = exp.expr2xy(multivalueRefsCell)
    var cell_x = cell_zb[0]
    var cell_y = cell_zb[1]
    var wb = formulas_i.sheet
    for (var i = 0; i < cell_v.length; i++) {
      for (var j = 0; j < cell_v[i].length ; j++) {
        var c = exp.xy2expr(cell_x + i, cell_y + j)
        var v = cell_v[i][j]
        if (i === 0 && j === 0) {
          wb[c] = {
            "v": v,
            "f": formulas_i.cell.f,
            'multivalueRefsCell': multivalueRefsCell,
            'from_multivalue':multivalueRefsCell
          }
        } else {
          //判断是否是冲突单元格（有值或有别的多值函数已占用）
          if (!isHave(wb[c]) || wb[c].f === "" && wb[c].v === "" || !isHave(wb[c].v)&&isHave(wb[c].f) || isEqual(wb[c].v, cell_v[i][j]) && isEqual(wb[c].f, wb[c].v) && isEqual(wb[c].from_multivalue, multivalueRefsCell)) {
            wb[c] = {
              "v": cell_v[i][j],
              "f": cell_v[i][j],
              'from_multivalue':multivalueRefsCell
            }
          } else {
            return false
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
    if (!isHave(cell_v)){
      cell_v = formulas_i.cell.v
    }
    let len = cell_v.length
    if (cell_v[0] instanceof Array){//判断一维数组还是二维数组， 分开处理
      for (var i = 0; i < len; i++) {
        for (var j = 0; j < cell_v[i].length ; j++) {
          var c = exp.xy2expr(cell_x + i, cell_y + j)
          if (i === 0 && j === 0) {
            if (isHave(formulas_i.cell.v)){
              wb[c] = {
                "v": error.ref,
                "f": formulas_i.cell.f,
              }
            }else{
              wb[c] = {
                "v": "",
                "f": ""
              }
            }
            //判断是否是冲突单元格（有值或有别的多值函数已占用）
          } else if(!(!isHave(wb[c]) || wb[c].f === "" && wb[c].v === "" || isEqual(wb[c].v, cell_v[i][j]) && isEqual(wb[c].f, wb[c].v) && isEqual(wb[c].from_multivalue, multivalueRefsCell))){
            if (!isHave(wb[c].v)){
              wb[c].v = ""
            }
            wb[c] = {
              "v": wb[c].v,
              "f": wb[c].f,
            }
            //如果是其他多值单元格，直接返回
          }else if (isHave(wb[c]) && isHave(wb[c].from_multivalue) && wb[c].from_multivalue !== multivalueRefsCell) {
            return wb
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
        if (j === 0) {
          if (isHave(formulas_i.cell.v)){
            wb[c] = {
              "v": error.ref,
              "f": formulas_i.cell.f,
            }
          }else{
            wb[c] = {
              "v": "",
              "f": ""
            }
          }
          //判断是否是冲突单元格（有值或有别的多值函数已占用）
        } else if(!(!isHave(wb[c]) || wb[c].f === "" && wb[c].v === "" || isEqual(wb[c].v, cell_v[j]) && isEqual(wb[c].f, wb[c].v) && isEqual(wb[c].from_multivalue, multivalueRefsCell))){
          if (!isHave(wb[c].v)){
            wb[c].v = ""
          }
          wb[c] = {
            "v": wb[c].v,
            "f": wb[c].f,
          }
          //如果是其他多值单元格，直接返回
        }else if (isHave(wb[c]) && isHave(wb[c].from_multivalue) && wb[c].from_multivalue !== multivalueRefsCell) {
          return wb
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
    let {data} = this.rows;
    let name = data['name']
    let cell_name = formulas_i.name
    let error_cells = workbook.error_cells
    var cell_v = formulas_i.cell.v
    if (!(cell_v instanceof Array)){//如果值不是array，清除标记
      workbook.Sheets[name] = this.clean_all_flag(formulas_i, cell_name)
      if (error_cells.indexOf(cell_name) >=0 && !isHave(cell_v)){
        workbook.error_cells.pop(cell_name)
      }
    }else{
      let result = false
      if (!(cell_v[0] instanceof Array)){//判断是一维数组还是二维数组
        result = this.process_arr(formulas_i, cell_name)
      }else{
        result = this.process_matrix(formulas_i, cell_name)
      }
      if (result !== false){//如果没有冲突单元格，修改workbook，将单元格从错误单元格列表取消
        workbook.Sheets[name] = result
        if (error_cells.indexOf(cell_name) >=0){
          workbook.error_cells.pop(cell_name)
        }
      }else{//如果有冲突单元格，清除标记，将其加入错误单元格列表
        workbook.Sheets[name] = this.clean_all_flag(formulas_i, cell_name)
        if (error_cells.indexOf(cell_name)<0){
          workbook.error_cells.push(cell_name)
        }
      }
      workbook.Sheets[name][cell_name].source_v = cell_v
    }
  }
}

module.exports = CalcWorkBook;
