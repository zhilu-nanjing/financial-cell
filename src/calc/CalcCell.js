const checker = require('./formula_check.js');
const error = require('./formulajs/lib/error');
const exp = require("../core/alphabet");

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
  constructor(formulas_i) {
    this.cell = formulas_i.cell
    this.f = isHave(formulas_i.cell)? formulas_i.cell.f: null
    this.name = formulas_i.name
    this.sheet = formulas_i.sheet
  }

  //检测是否合法
  check_valid() {
    var text = this.f
    if (!isHave(text)){
      return ""
    }
    //==A1报错
    if (text[1] === '='){
      return error.name
    }
    var params = text.match('=[a-z|A-Z]{2,100}')
    if (params != null && this.f.indexOf('(') <0 && this.f.indexOf(')')<0){
      return error.name
    }
    // 处理"" 中""的转义
    if (this.f.indexOf('""') >= 1 && this.f.indexOf('(') < 0 && this.f.indexOf(')') < 0) {
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
  trans_formula(rows) {
    var zb = exp.expr2xy(this.name)
    var fml = this.f
    if (isHave(rows)){
      var source = rows.getCell(zb[1], zb[0])
      if (isHave(source) && isHave(source.formatText)){//如果有formatText(如日期会转为excel数字），将f设为对应值
        fml = source.formatText
      }
    }
    if (typeof fml === 'number'){
      return fml
    }
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
}

module.exports = CalcCell;