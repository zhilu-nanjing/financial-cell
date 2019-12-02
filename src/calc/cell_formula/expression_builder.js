const FormulaExp = require('./Exp.js');
const RawValue = require('./RawValue.js');
const UserFnExecutor = require('../UserFnExecutor.js');
const UserRawFnExecutor = require('../UserRawFnExecutor.js');
const common_operations = {
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
module.exports = function (formula, opts) {
  let exp_builder =  new ExpressionBuilder(formula, opts);
  return exp_builder.do_jobs();
};

class ExpressionBuilder {
  constructor(formula, opts) {
    formula.status = 'working';
    this.formula = formula ;
    this.xlsx_Fx = opts.xlsx_Fx || {};
    this.xlsx_raw_Fx = opts.xlsx_raw_Fx || {};
    let str_formula = formula.cell.f;
    if (str_formula[0] === '=') {
      str_formula = str_formula.substr(1); // =adsf 会变为adsf
    }
    this.str_formula = str_formula;
    this.exp_obj = this.root_exp = new FormulaExp(formula);  // 封装公式实例
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
    let o,
      trim_buffer = this.buffer.trim(), // buffer 是一个字符串，代表一个语义单元，例如average
      special = this.xlsx_Fx[trim_buffer]; // this.xlsx_Fx是一个函数列表

    let special_raw = this.xlsx_raw_Fx[trim_buffer]; // this.xlsx_raw_Fx = {OFFSET; IFERROR; IF; AND}
    let self = this;
    if (special_raw !== undefined) {
      special = new UserRawFnExecutor(special_raw, self.formula);
    } else if (special) {
      special = new UserFnExecutor(special, self.formula);
    } else if (trim_buffer) {
      //Error: "Worksheet 1"!D145: Function INDEX not found
      throw new Error('"' + self.formula.sheet_name + '"!' + self.formula.name + ': Function ' + self.buffer + ' not found');
    }
    o = new FormulaExp(self.formula);
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
      fn_stack[fn_stack.length - 1].exp = this.exp_obj = new FormulaExp(this.formula);
      this.buffer = '';
    } else {
      this.buffer += char;
    }
  }

  do_jobs() {
    // 主执行语句在这里，上面是定义一系列方法
    let self = this;
    for (; this.position_i < this.str_formula.length; this.position_i++) {
      self.state(self.str_formula[self.position_i]); // 逐字符解析函数; self.state代表当前的解析状态
    }
    this.root_exp.push(this.buffer, this.position_i); // root_exp 是一个Exp实例，这个实例会引用一个Exp数组
    return this.root_exp;
  }
}
