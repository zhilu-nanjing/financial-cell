import { StructuralExp } from './structural_exp.js';
import { RawValue } from './RawValue.js';
import { common_operations } from '../calc_utils/config';
import { Range } from './Range';
import { RefValue } from './RefValue';

export class BaseExpressionBuilder{
  constructor(formula, opts){
  }
}

export class SimpleExpressionBuilder{ // 解析不含等号的那些表达式

}

export function str_2_val(astNodeStr, formula, position_i) { // astNodeStr 在这里是但一个字符串表达式
  let v;
  if (!isNaN(astNodeStr)) {
    v = new RawValue(+astNodeStr);
  } else if (astNodeStr === 'TRUE') {
    v = new RawValue(1);
  } else if (typeof astNodeStr === 'string' && astNodeStr.trim()
    .replace(/\$/g, '')
    .match(/^[A-Z]+[0-9]+:[A-Z]+[0-9]+$/)) {

    v = new Range(astNodeStr.trim()
      .replace(/\$/g, ''), formula, position_i);
  } else if (typeof astNodeStr === 'string' && astNodeStr.trim()
    .replace(/\$/g, '')
    .match(/^[^!]+![A-Z]+[0-9]+:[A-Z]+[0-9]+$/)) {
    v = new Range(astNodeStr.trim()
      .replace(/\$/g, ''), formula, position_i);
  } else if (typeof astNodeStr === 'string' && astNodeStr.trim()
    .replace(/\$/g, '')
    .match(/^[A-Z]+:[A-Z]+$/)) {
    v = new Range(astNodeStr.trim()
      .replace(/\$/g, ''), formula, position_i);
  } else if (typeof astNodeStr === 'string' && astNodeStr.trim()
    .replace(/\$/g, '')
    .match(/^[^!]+![A-Z]+:[A-Z]+$/)) {
    v = new Range(astNodeStr.trim()
      .replace(/\$/g, ''), formula, position_i);
  } else if (typeof astNodeStr === 'string' && astNodeStr.trim()
    .replace(/\$/g, '')
    .match(/^[A-Z]+[0-9]+$/)) {
    v = new RefValue(astNodeStr.trim()
      .replace(/\$/g, ''), formula);
    v.end_pst = position_i; // 后面一个字符的位置
    v.buffer = astNodeStr;
    v.start_pst = position_i - astNodeStr.length;


  } else if (typeof astNodeStr === 'string' && astNodeStr.trim()
    .replace(/\$/g, '')
    .match(/^[^!]+![A-Z]+[0-9]+$/)) {
    v = new RefValue(astNodeStr.trim()
      .replace(/\$/g, ''), formula);
    v.end_pst = position_i; // 后面一个字符的位置
    v.buffer = astNodeStr;
    v.start_pst = position_i - astNodeStr.length;

  } else if (typeof astNodeStr === 'string' && !isNaN(astNodeStr.trim()
    .replace(/%$/, ''))) { // 处理公式中的百分号
    v = new RawValue(+(astNodeStr.trim()
      .replace(/%$/, '')) / 100.0);
  } else {
    v = astNodeStr;
    // v.end_pst = position_i // 后面一个字符的位置
  }
  return v;
}

export class StructuralExpressionBuilder {
  /**
   *
   * @param formulaProxy: CellFormulaProxy
   */
  constructor(formulaProxy) {
    this.formulaProxy = formulaProxy ;
    this.multiCollFn = formulaProxy.workbookProxy.multiCollExpFn
    this.exp_obj = this.root_exp = new StructuralExp(formulaProxy);  // 封装公式实例
    this.buffer = '';
    this.was_string = false;
    this.fn_stack = [{ // 这个是函数调用栈？
      exp: this.exp_obj
    }];
    this.position_i = 0;
    this.state = this.deal1Char
  }

  /**
   * state pattern in functional way
   */
  string(char) {
    if (char === '"') {
      this.exp_obj.push(new RawValue(this.buffer));
      this.was_string = true;
      this.buffer = '';
      this.state = this.deal1Char;
    } else {
      this.buffer += char;
    }
  }

  single_quote(char) {
    if (char === '\'') {
      this.state = this.deal1Char;
    }
    this.buffer += char;
  }

  ini_parentheses() {
    let o,
      trim_buffer = this.buffer.trim(), // buffer 是一个字符串，代表一个语义单元，例如average
      special = this.multiCollFn.getFnExecutorByName(trim_buffer) // 获取expression 函数
    o = new StructuralExp(this.formulaProxy);
    this.fn_stack.push({
      exp: o,
      special: special
    });
    this.exp_obj = o;
    this.buffer = '';
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

  deal1Char(char) { // 处理一个字符
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
    for (; this.position_i < self.formulaProxy.formula_str.length; this.position_i++) {
      self.state(self.formulaProxy.formula_str[self.position_i]); // 逐字符解析函数; self.state代表当前的解析状态
    }
    this.push2Args(this.buffer, this.position_i); // root_exp 是一个Exp实例，这个实例会引用一个Exp数组
    return this.root_exp;
  }
  push2Args(astNodeStr, position_i) {
    let root_exp = this.root_exp;
    if (astNodeStr) {
      let v = str_2_val(astNodeStr, self.cellFormulaProxy, position_i);
      if (((v === '=') && (self.last_arg === '>' || self.last_arg === '<')) || (self.last_arg === '<' && v === '>')) {
        self.args[self.args.length - 1] += v;
      } else {
        self.args.push(v);
      }
      self.last_arg = v;
      //console.log(self.id, '-->', v);
    }
  };

}
