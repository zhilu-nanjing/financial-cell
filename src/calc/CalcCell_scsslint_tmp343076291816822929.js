const checker = require('./formula_check.js');
const error = require('./formulajs/lib/error');
class CalcCell { // 对cell中的参数做转换，判断,多单元格处理等的类
  constructor(formulas_i, rows) {
    this.cell = formulas_i.cell
    this.rows = rows
    this.f = formulas_i.cell.f
    this.name = formulas_i.name
    this.sheet = formulas_i.sheet
  }

  //检测是否合法
  check_valid() {
    var text = this.f
    //==A1报错
    if (text[1] === '='){
      return error.name
    }
    var params = text.match('=[a-z|A-Z]{2,100}')
    if (params != null && this.f.indexOf('(') <0 && this.f.indexOf(')')<0){
      return error.name
    }
    // 处理"中""的转义
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
}

module.exports = CalcCell;