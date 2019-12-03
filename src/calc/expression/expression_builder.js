import { StructuralExp } from './structural_exp.js';
import { RawValue } from '../calc_data_proxy/RawValue.js';

const common_operations = { // todo: 需要把这个常数放到config里面
  '*': 'multiply',
  '+': 'plus',
  '-': 'subtractDays',
  '/': 'divide',
  '^': 'power',
  '&': 'concat',
  '<': 'lt',
  '>': 'gt',
  '=': 'eq'
};
;

export class FormulaParser{
  constructor(opts){
    this.opts = opts;
  }

  parseFormula(formula_str){
    console.assert(typeof formula_str === "string")
    if(formula_str === "" || formula_str.slice(0,1)!== "="){
      let exp = SimpleExpressionBuilder(formula_str, opts)
      return
    }
    if(formula_str.slice(0,1)){
      return;
    }

  }
}

export class BaseExpressionBuilder{
  constructor(formula, opts){

  }
}

export class SimpleExpressionBuilder{ // 解析不含等号的那些表达式

}

export class StructuralExpressionBuilder {
  constructor(formulaProxy, multiCollExpFn) {
    formulaProxy.status = 'working';
    this.formulaProxy = formulaProxy ;
    this.multiCollExpFn = multiCollExpFn;
    let str_formula = formulaProxy.cell.f;
    if (str_formula[0] === '=') {
      str_formula = str_formula.substr(1); // =adsf 会变为adsf
    }
    this.str_formula = str_formula;
    this.exp_obj = this.root_exp = new StructuralExp(formulaProxy);  // 封装公式实例
    this.buffer = '';
    this.was_string = false;
    this.fn_stack = [{ // 这个是函数调用栈？
      exp: this.exp_obj
    }];
    this.position_i = 0;
    this.state = this.start
  }

  /**
   * state pattern in functional way
   */
  string(char) {
    if (char === '"') {
      this.exp_obj.push(new RawValue(this.buffer));
      this.was_string = true;
      this.buffer = '';
      this.state = this.start;
    } else {
      this.buffer += char;
    }
  }

  single_quote(char) {
    if (char === '\'') {
      this.state = this.start;
    }
    this.buffer += char;
  }

  ini_parentheses() {
    let self = this;
    let o,
      trim_buffer = this.buffer.trim(), // buffer 是一个字符串，代表一个语义单元，例如average
      special = this.multiCollExpFn.getFnExecutorByName(trim_buffer) // this.xlsx_Fx是一个函数列表
    o = new StructuralExp(self.formulaProxy);
    self.fn_stack.push({
      exp: o,
      special: special
    });
    self.exp_obj = o;
    self.buffer = '';
  }

  end_parentheses() {
    let fn_stack = this.fn_stack;
    let v, stack = this.fn_stack.pop();
    this.exp_obj = stack.exp;
    this.exp_obj.push(this.buffer, );
    v = this.exp_obj;
    this.buffer = '';
    this.exp_obj = fn_stack[fn_stack.length - 1].exp;
    if (stack.special) {
      stack.special.push(v);
      this.exp_obj.push(stack.special, this.position_i);
    } else {
      this.exp_obj.push(v, this.position_i);
    }
  }

  add_operation(char) {
    if (!this.was_string) {
      this.exp_obj.push(this.buffer, this.position_i);
    }
    this.was_string = false;
    this.exp_obj.push(char, this.position_i);
    this.buffer = '';
  }

  start(char) {
    let fn_stack = this.fn_stack;
    if (char === '"') {
      this.state = this.string;
      this.buffer = '';
    } else if (char === '\'') {
      this.state = this.single_quote;
      this.buffer = '\'';
    } else if (char === '(') {
      this.ini_parentheses();
    } else if (char === ')') {
      this.end_parentheses();
    } else if (common_operations[char]) {
      this.add_operation(char);
    } else if (char === ',' && fn_stack[fn_stack.length - 1].special) {
      this.was_string = false;
      fn_stack[fn_stack.length - 1].exp.push(this.buffer, this.position_i);
      fn_stack[fn_stack.length - 1].special.push(fn_stack[fn_stack.length - 1].exp);
      fn_stack[fn_stack.length - 1].exp = this.exp_obj = new StructuralExp(this.formulaProxy);
      this.buffer = '';
    } else {
      this.buffer += char;
    }
  }

  parseExpression() {
    // 主执行语句在这里，上面是定义一系列方法
    let self = this;
    for (; this.position_i < this.str_formula.length; this.position_i++) {
      self.state(self.str_formula[self.position_i]); // 逐字符解析函数; self.state代表当前的解析状态
    }
    this.root_exp.push(this.buffer, this.position_i); // root_exp 是一个Exp实例，这个实例会引用一个Exp数组
    return this.root_exp;
  }
}
