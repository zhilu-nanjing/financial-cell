import { StructuralExp } from '../../calc_data_proxy/structural_exp';
import { RawValue } from '../../calc_data_proxy/raw_value';
import { common_operations } from '../../calc_utils/config';

export class StructuralExpressionBuilder {
  /**
   *
   * @param formulaProxy: CellFormulaProxy
   */
  constructor(formulaProxy) {
    this.formulaProxy = formulaProxy;
    this.multiCollFn = formulaProxy.workbookProxy.multiCollExpFn;
    this.exp_obj = this.root_exp = new StructuralExp(formulaProxy);  // 封装公式实例

    // 下面应该是状态
    this.buffer = '';
    this.was_string = false;
    this.fn_stack = [{ // 这个是函数调用栈？
      exp: this.exp_obj
    }];
    this.position_i = 0;
    this.state = this.deal1Char;
  }

  /**
   * state pattern in functional way
   */
  string(char) {
    if (char === '"') {
      this.exp_obj.push2ExpArgs(new RawValue(this.buffer));
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
      special = this.multiCollFn.getFnExecutorByName(trim_buffer); // 获取expression 函数
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
    let v,
      stack = this.fn_stack.pop();
    this.exp_obj = stack.exp;
    this.exp_obj.push2ExpArgs(this.buffer,);
    v = this.exp_obj;
    this.buffer = '';
    this.exp_obj = fn_stack[fn_stack.length - 1].exp;
    if (stack.special) {
      stack.special.push(v);
      this.exp_obj.push2ExpArgs(stack.special, this.position_i);
    } else {
      this.exp_obj.push2ExpArgs(v, this.position_i);
    }
  }

  add_operation(char) {
    if (!this.was_string) {
      this.exp_obj.push2ExpArgs(this.buffer, this.position_i);
    }
    this.was_string = false;
    this.exp_obj.push2ExpArgs(char, this.position_i);
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
      fn_stack[fn_stack.length - 1].exp.push2ExpArgs(this.buffer, this.position_i);
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
    let toParseStr = self.formulaProxy.formula_str.slice(1); // 去掉首字符（'='）
    for (; this.position_i < toParseStr.length; this.position_i++) {
      self.state(toParseStr[self.position_i]); // 逐字符解析函数; self.state代表当前的解析状态
    }
    this.root_exp.push2ExpArgs(this.buffer, this.position_i); // root_exp 是一个Exp实例，这个实例会引用一个Exp数组
    return this.root_exp;
  }
}
