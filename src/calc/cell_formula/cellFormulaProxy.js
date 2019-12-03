
import checker from './formula_check.js'
import {errorObj} from '../calc_utils/error_config'
import exp from "../../utils/alphabet"

class CalcBhv { // 对cell中的参数做转换，判断,多单元格处理等的类; 不对外暴露
  constructor(formulas_i) {
    this.cell = formulas_i.cell;
    this.f = isHave(formulas_i.cell)? formulas_i.cell.f: null;
    this.name = formulas_i.name;
    this.sheet = formulas_i.sheet
  }

  //检测是否合法; 如果不合法的话范围错误，如果合法的话返回true
  check_valid() {
    let text = this.f;
    if (!isHave(text)){
      return ""
    }
    //==A1报错 todo: 这个判定应该交给解析那一步来做
    if (text[1] === '='){
      return errorObj.ERROR_NAME
    }
    let params = text.match('=[a-z|A-Z]{2,100}'); // todo: 这个判定应该交给解析那一步来做
    if (params !== null && this.f.indexOf('(') <0 && this.f.indexOf(')')<0){
      return errorObj.ERROR_NAME
    }
    // 处理"" 中""的转义  todo: 这个判定应该交给解析那一步来做
    if (this.f.indexOf('""') >= 1 && this.f.indexOf('(') < 0 && this.f.indexOf(')') < 0) {
      return this.f.slice(2, this.f.length - 1).replace('""', '"')
    }
    return true
  }

  //{}用''包起来 =MDETERM({3,6,1;1,1,0;3,10,2})   这样的大括号代表一个2维array
  trans_params(fml) {
    let reg = new RegExp('\{(.*?)\}', 'g');
    let arg = fml.match(reg);
    if (arg !== null) {
      for (let i = 0; i < arg.length; i++) {
        let param = arg[i];
        let rep = "'" + param + "'";
        fml = fml.replace(param, rep)
      }
    }
    return fml
  }

  //参数转换
  pre_process_formula(rows) {
    let xy = exp.expr2xy(this.name);
    let fml = this.f;
    if (isHave(rows)){ //如果有formatText(如日期会转为excel数字），将f设为对应值
      let source = rows.getCell(xy[1], xy[0]);
      if (isHave(source) && isHave(source.formatText)){
        fml = source.formatText
      }
    }
    if (typeof fml === 'number'){ // 如果是数字类型，直接范围fml
      return fml
    }
    //去除公式开头结尾的空格
    fml = checker.strim(fml);
    //公式参数转换
    fml = checker.trans_formula(fml);
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


export class CellFormulaProxy{
  constructor(wb,sheet,sheet_name,cell,formula_ref,name, status,exec_formula){
    this.wb = wb;
    this.sheet = sheet;
    this.sheet_name = sheet_name;
    this.cell = cell;
    this.formula_ref = formula_ref;
    this.name = name;
    this.status = status;
    this.exec_formula = exec_formula;
    this.calcBhv = new CalcBhv(this); // 作为行为类
  }
  isEmpty() { // cell 是否为空
    return typeof this.cell === "undefined" || this.cell === null
  }
  check_valid(){
    return this.calcBhv.check_valid()
  }
  trans_params(fml){
    return this.calcBhv.trans_params(fml)
  }
  pre_process_formula(rows){
    this.cell.f =  this.calcBhv.pre_process_formula(rows)
  }
  recover_formula(){
    return this.calcBhv.recover_formula()
  }

};

function isHave(param) {
  if (typeof param === "undefined") {
    return false;
  }
  if (param === null) {
    return false;
  }
  return true;
}


