// 这里是公式解析算法
import { StructuralExp } from '../../calc_data_proxy/structural_exp';
import { RawValue } from '../../calc_data_proxy/syntax_unit_raw_value';
import { MARK_OBJ, SINGLE_CHAR_OPERATOR } from '../../calc_utils/config';
import { SUnitRangeRef } from '../../calc_data_proxy/syntax_unit_range';
import { SUnitRefValue } from '../../calc_data_proxy/syntax_unit_ref_value';
import { BoolParser } from '../../calc_data_proxy/parser_proxy';
import {
  ERROR_NON_SOLVED,
  ERROR_SYNTAX,
  ERROR_VALUE,
  PARSE_FAIL
} from '../../calc_utils/error_config';
import { CellVBool } from '../../cell_value_type/cell_value';
import { RawArray } from '../../calc_data_proxy/matrix_math';

class StackProxy {
  constructor(stackArray = []) {
    this.stackArray = stackArray;
  }

  addStack(expression, fnExecutor = NaN) {
    this.stackArray.push({
      exp: expression,
      fnExecutor: fnExecutor
    });
  }

  popStack() {
    return this.stackArray.pop();
  }

  isFnExecutorValid(fnExecutor) {
    let theType = typeof fnExecutor;
    return ['number', 'undefined'].includes(theType) === false;
  }

  getLastStack() {
    return this.stackArray[this.stackArray.length - 1]; // 最后一个元素
  }

  getLastExpression() {
    let a = this.getLastStack();
    return this.getLastStack().exp;
  }

  getLastFnExecutor() {
    return this.getLastStack().fnExecutor;
  }

  isLastFnExecutorValid() {
    return this.isFnExecutorValid(this.getLastFnExecutor());
  }
}



const OPERATOR = 'operator';
const SPLIT_MARK = 'split_mark'; // 逗号，分号这样分割不同语法单元的标记
const CONTAINER = 'container'; // 括号双引号能包含其他单元这样的标记， 字符串不含有标志起始结尾的双引号
const RAW_VALUE = 'raw_value'; // 直接输入的数字。 {1,2,3}这样的矩阵属于复合型单元。
const SINGLE_REF = 'single_ref'; // 单一引用，associatedValue有isColAbsolute, isRowAbsolute 这样的方法
const RANG_REF = 'range_ref'; // 范围引用associatedValue有isBeginColAbsolute, isBeginRowAbsolute 这样的方法
const TRIMMED_PART = 'trimmed_part'; // 被忽略的部分
const EXP_FN = 'exp_fn'; // 表达式函数
const VALUE_NAME = 'value_name'; // 变量或常量的名字，典型如true，false

const SOLVE_FAIL_OBJ = {msg: "solve_fail"} // 求解不成功

export function isArrayBeginWithOther(aArray, other) {
  return other.every((e, index) => e === aArray[index]);
}

class TypeArray{ // 对应一个类型
  constructor(aArray){
    this.aArray = aArray
  }
  isIncludeType(aType) {
    return this.aArray.includes(aType);
  }
  /**
   *
   * @param {Array} aTypeArray
   * @return {*}
   */
  isMarchTypeArray(aTypeArray) {
    return isArrayBeginWithOther(this.aArray, aTypeArray);
  }
}

/**
 * @property {BigInt} pstID 第几个语法单元
 * @property {String} wholeStr
 */
class SyntaxUnitProxy {
  constructor(pstID, wholeStr, aTypeArray) {
    this.pstID = pstID;
    this.wholeStr = wholeStr;
    this.typeArray = new TypeArray(aTypeArray); //归属的类别,因为存在一级，二级目录，所以是一个array
    this.pairedUnit = null; // 配对的unit的属性,例如大小括号配对等
    this.assciatedValue = null; // 对应的RawValue, Range, RefValue等
    this.parentSynUnit = null; // 所属的父语法点
  }


  getLength() {
    return this.wholeStr.length;
  }

  isEmpty() {
    return this.wholeStr === '';
  }

  getSolvedValue() {
    if (typeof this.assciatedValue.solveExpression === 'function') {
      return this.assciatedValue.solveExpression();
    }
    else {
      return SOLVE_FAIL_OBJ
    }
  }
}

class MultiSyntaxUnitProxy { // 复合型节点
  constructor(childrenSynUnit = []) {
    this.typeArray = []; //归属的类别,因为存在一级，二级目录，所以是一个array
    this.childrenSynUnit = this.sortChildren(childrenSynUnit); // 含有的子语法点, 根据pstID的顺序排列
    this.parentSynUnit = null; // 所属的父语法点
  }

  sortChildren(childrenSynUnit) { // 对节点进行排序
    childrenSynUnit.sort((a,b)=> a.pstID - b.pstID)

  }

  addChild(childSynUnit) { // 根据pstID插入到指定位置中
    this.childrenSynUnit.push(childSynUnit);
    this.sortChildren(this.childrenSynUnit)
  }



}

class SyntaxStructureBuilder {
  constructor() {
    this.rootUnit = new MultiSyntaxUnitProxy()

  }

}

/**
 * @property
 * @property {MultiCollExpFn} multiCollFn
 */
export class StructuralExpressionBuilder {
  constructor(calcCell, multiCollFn) {
    this.multiCollFn = multiCollFn;
    this.calcCell = calcCell;
    this.root_exp = new StructuralExp(calcCell);  // 封装公式实例
    // 下面应该是状态
    this.curExpression = this.root_exp;
    this.buffer = '';
    this.stackProxy = new StackProxy();
    this.stackProxy.addStack(this.curExpression);
    this.position_i = 0;
    this.state = this.normalState;
    this.last_arg = '';
  }

  returnToNormalState(char) {
    this.state = this.normalState;
    this.normalState(char);
  }

  // 最后的arg是否是operator
  isLastArgOperator() {
    return this.last_arg !== '' && typeof this.last_arg === 'string';
  }

  isBufferEmpty(isTrim = true) {
    if (isTrim) {
      return this.buffer.trim() === '';
    }
    return this.buffer === '';
  }

  pushOperator2ExpArgs(toAddStr) {
    this.curExpression.args.push(toAddStr);
    this.last_arg = toAddStr;
  }

  /**
   * state pattern in functional way
   */
  stringState(char) {
    if (char === MARK_OBJ.doubleQue) {
      this.state = this.stringMayEndState;
    } else {
      this.buffer += char;
    }
  }

  stringMayEndState(char) {
    if (char === MARK_OBJ.doubleQue) { // 两个双引号代表一个双引号
      this.buffer += MARK_OBJ.doubleQue;
      this.state = this.stringState;
    } else { // 双引号之后不是双引号
      push2ExpArgs(this.curExpression, new RawValue(this.buffer));
      this.buffer = '';
      this.returnToNormalState(char);
    }
  }

  sheetNameState(char) { // 处理单引号
    if (char === '\'') {
      this.state = this.sheetNameMayEndState;
    }
    this.buffer += char;
  }

  sheetNameMayEndState(char) {
    this.buffer += '\'';
    if (char === '\'') { // 两个单引号代表一个但引号
      this.state = this.sheetNameState;
    } else { // 单引号之后不是单引号，使用正常normalState进行处理
      this.returnToNormalState(char);
    }
  }

  initOperator(char) {
    if (this.buffer.trim() !== '') {
      push2ExpArgs(this.curExpression, this.buffer, this.position_i);
    }
    this.buffer = char;
    this.state = this.endOperator;
  }

  endOperator(char) {
    if (this.buffer + char in ['>=', '<=', '<>']) { // 双元运算符
      this.pushOperator2ExpArgs(this.buffer + char);
      this.buffer = '';
    } else {
      this.pushOperator2ExpArgs(this.buffer);// 单元运算符
      this.buffer = '';
      this.returnToNormalState(char);
    }
  }

  endFnArg() { // 逗号结束
    push2ExpArgs(this.stackProxy.getLastExpression(), this.buffer, this.position_i);  // (arg1,arg2)中的arg1
    this.stackProxy.getLastFnExecutor()
      .push(this.stackProxy.getLastExpression());
    this.stackProxy.getLastStack().exp = this.curExpression = new StructuralExp(this.calcCell); // this.curExpression 状态变为一个新的expression
    this.buffer = '';
  }

  initParentheses() { // 情况1：之前是运算符或一开头就是左括号的时候this.buff为空。情况3：之前是一个字符表达式
    let structuralExp = new StructuralExp(this.calcCell);
    let trim_buffer,
      fnExecutor;
    if (this.isBufferEmpty()) {
      fnExecutor = NaN;
    } else {
      trim_buffer = this.buffer.trim(); // buffer 是一个字符串，代表一个语义单元，例如average
      fnExecutor = this.multiCollFn.getFnExecutorByName(trim_buffer); // 获取expression 函数; todo: 没有获取到怎么办？
    }
    this.stackProxy.addStack(structuralExp, fnExecutor);
    this.curExpression = structuralExp;
    this.buffer = '';
  }

  endParentheses() { // 小括号结束
    let stack = this.stackProxy.popStack();
    let curExp = stack.exp; // 当前栈结束
    push2ExpArgs(curExp, this.buffer);

    this.curExpression = this.stackProxy.getLastExpression(); // 改变当前exp_obj的状态
    if (this.stackProxy.isFnExecutorValid(stack.fnExecutor)) {
      stack.fnExecutor.push(curExp);
      push2ExpArgs(this.curExpression, stack.fnExecutor, this.position_i);
    } else {
      push2ExpArgs(this.curExpression, curExp, this.position_i);
    }
    this.buffer = '';
  }

  initBrace() {
    if (this.buffer.trim() !== '') {
      push2ExpArgs(this.curExpression, this.buffer);
    }
    this.state = this.insideBrace;
    this.buffer = '';
  }

  insideBrace(char) { // todo:
    if (char === '}') {
      push2ExpArgs(this.curExpression, new RawArray(this.buffer));
      this.buffer = '';
      this.state = this.normalState; // 恢复到正常的结果
    } else {
      this.buffer += char;
    }
  }

  normalState(char) { // 处理一个字符
    if (char === '"') { // 双引号 --> 进入string状态
      this.state = this.stringState;
      this.buffer = '';
    } else if (char === '\'') { // 单引号 --> 进入single_quote状态
      this.buffer += char;
      this.state = this.sheetNameState;
    } else if (char === '{') { // 左大括号 --> 进入single_quote状态
      this.initBrace();
    } else if (char === '(') { // 左括号 --> 进入ini_parentheses状态
      this.initParentheses();
    } else if (char === ')') { // 右括号 --> 进入end_parentheses状态
      this.endParentheses();
    } else if (char !== '%' && Object.values(SINGLE_CHAR_OPERATOR)
      .includes(char)) { // 百分号会push2ExpArgs中解析，在运算符 --> 进入add_operation状态
      this.initOperator(char);
    } else if (char === ',' && this.stackProxy.isLastFnExecutorValid()) { // 逗号且fn_stack存在special属性， 此时应该要结束掉逗号前的哪个参数
      this.endFnArg();
    } else {
      this.buffer += char;
    }
  }

  dealEnd() {
    if (this.state.name === this.stringMayEndState.name) { // 字符串结束
      push2ExpArgs(this.curExpression, new RawValue(this.buffer));
    } else {
      push2ExpArgs(this.root_exp, this.buffer, this.position_i); // root_exp 是一个Exp实例，这个实例会引用一个Exp数组; 最后的处理
    }
  }

  /**
   *
   * @param {CalcCell} calcCell
   * @return {StructuralExp}
   */
  parseFormula() { // 实际的解析逻辑
    // 主执行语句在这里，上面是定义一系列方法
    let self = this;
    let toParseStr = this.calcCell.formulaString.slice(1); // 去掉首字符（'='）
    if (toParseStr[0] === '{' && toParseStr[toParseStr.length - 1] === '}') {
      push2ExpArgs(this.root_exp, new RawValue(new Error(ERROR_SYNTAX))); // 不支持数组公式
      return this.root_exp;
    }
    for (; this.position_i < toParseStr.length; this.position_i++) {
      self.state(toParseStr[self.position_i]); // 逐字符解析函数; self.state代表当前的解析状态
    }
    this.dealEnd();
    return this.root_exp;
  }
}

export function str2Value(astNodeStr, calcCell, position_i) { // todo: 可以设计parseArray
  console.assert(typeof astNodeStr === 'string');
  let v;
  let res1 = new BoolParser(calcCell, astNodeStr).parseString();
  if (res1.msg !== PARSE_FAIL) { // true, false --> boll 变量
    v = new RawValue(CellVBool(res1));
  } else if (astNodeStr.trim() // 表示一个Range
    .replace(/\$/g, '')
    .match(/^[A-Z]+[0-9]+:[A-Z]+[0-9]+$/)) {

    v = new SUnitRangeRef(astNodeStr.trim()
      .replace(/\$/g, ''), calcCell, position_i);
  } else if (astNodeStr.trim() // 跨sheet引用的Range
    .replace(/\$/g, '')
    .match(/^[^!]+![A-Z]+[0-9]+:[A-Z]+[0-9]+$/)) {
    v = new SUnitRangeRef(astNodeStr.trim()
      .replace(/\$/g, ''), calcCell, position_i);
  } else if (astNodeStr.trim() // A:A 这样形式的Range
    .replace(/\$/g, '')
    .match(/^[A-Z]+:[A-Z]+$/)) {
    v = new SUnitRangeRef(astNodeStr.trim()
      .replace(/\$/g, ''), calcCell, position_i);
  } else if (astNodeStr.trim() // sheet1!A:A 这样形式的Range
    .replace(/\$/g, '')
    .match(/^[^!]+![A-Z]+:[A-Z]+$/)) {
    v = new SUnitRangeRef(astNodeStr.trim()
      .replace(/\$/g, ''), calcCell, position_i);
  } else if (astNodeStr.trim() // 单元格引用
    .replace(/\$/g, '')
    .match(/^[A-Z]+[0-9]+$/)) {
    v = new SUnitRefValue(astNodeStr.trim()
      .replace(/\$/g, ''), calcCell);
  } else if (astNodeStr.trim() // 跨sheet单元格引用
    .replace(/\$/g, '')
    .match(/^[^!]+![A-Z]+[0-9]+$/)) {
    v = new SUnitRefValue(astNodeStr.trim()
      .replace(/\$/g, ''), calcCell);
  } else if (!isNaN(astNodeStr.trim() // 数字，允许百分号
    .replace(/%$/, ''))) { // 处理公式中的百分号
    v = new RawValue(+(astNodeStr.trim()
      .replace(/%$/, '')) / 100.0);
  } else {
    v = new Error(ERROR_SYNTAX); //  不属于以上任何一种情况，则说明出现语法错误
  }
  return v;
}


export function push2ExpArgs(structuralExp, toAddUnit, position_i) { // 这个使用来做解析； todo：考虑把这个转移
  let self = structuralExp;
  if (toAddUnit !== '') {
    let v = toAddUnit;
    if (!isNaN(toAddUnit)) { // 数字
      v = new RawValue(+toAddUnit);
    } else if (typeof toAddUnit === 'string') {
      v = str2Value(toAddUnit, self.calcCell, position_i);
    } else {
      v = toAddUnit;
    }
    self.args.push(v); // 只有运算符号保持string形式
    self.last_arg = v;
  }
}
