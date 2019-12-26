// 这里是公式解析算法
import { StructuralExp } from '../../calc_data_proxy/structural_exp';
import { RawValue } from '../../calc_data_proxy/syntax_unit_raw_value';
import {
  A1A2,
  AA,
  BOOL,
  CONTAINER,
  EXP_FN,
  MARK_OBJ,
  OPERATOR,
  RANG_REF,
  RAW_VALUE,
  SHEET1A1,
  SHEET1A1A2,
  SHEET1AA,
  SINGLE_CHAR_OPERATOR,
  SINGLE_REF,
  SPLIT_MARK, A1
} from '../../calc_utils/config';
import { SUnitRangeRef } from '../../calc_data_proxy/syntax_unit_range';
import { SUnitRefValue } from '../../calc_data_proxy/syntax_unit_ref_value';
import { BoolParser } from '../../calc_data_proxy/parser_proxy';
import { ERROR_SYNTAX, PARSE_FAIL } from '../../calc_utils/error_config';
import { CellVBool } from '../../cell_value_type/cell_value';
import { RawArray } from '../../calc_data_proxy/matrix_math';
import { SyntaxStructureBuilder } from '../../calc_data_proxy/syntax_builder_core';
import { ExpSyntaxUnitProxy } from '../../calc_data_proxy/syntax_builder_for_exp';

class StackProxy {
  constructor(stackArray = []) {
    this.stackArray = stackArray;
  }

  addStack(expressionORFnExecutor) {
    this.stackArray.push(expressionORFnExecutor);
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
    return this.getLastStack();
  }

  getLastFnExecutor() {
    return this.getLastStack();
  }

  isLastFnExecutorValid() {
    return this.isFnExecutorValid(this.getLastFnExecutor());
  }
}


/**
 * @property {CalcCell} calcCell
 * @property {MultiCollExpFn} multiCollFn
 * @property {SyntaxStructureBuilder} synUnitBuilder
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
    this.lastUnitTypeArray = [];
    // ExpSyntaxUnitProxy会依赖synatx_builder_for_reference,做更细的解析
    this.synUnitBuilder = new SyntaxStructureBuilder(ExpSyntaxUnitProxy);
    this.char = '';
  }

  addInitContainer(char) {
    this.synUnitBuilder.addUseLessUnit(this.buffer);
    this.synUnitBuilder.addContainerUnit(char, [CONTAINER], false);
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

  ////////////////////////// all state method
  initDoubleQuo() {
    this.state = this.stringState;
    this.addInitContainer(this.char);
    this.buffer = '';
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
  dealStringEnd(){
    let theRawValue = new RawValue(this.buffer);
    this.push2ExpArgs(this.curExpression, theRawValue);
    this.synUnitBuilder.addValueToCurUnit(theRawValue, this.buffer, [RAW_VALUE]);
    this.synUnitBuilder.addContainerUnit('"', [CONTAINER], true);
    this.buffer = ""
  }


  stringMayEndState(char) {
    if (char === MARK_OBJ.doubleQue) { // 两个双引号代表一个双引号
      this.buffer += MARK_OBJ.doubleQue;
      this.state = this.stringState;
    } else { // 双引号之后不是双引号
      this.dealStringEnd()
      this.returnToNormalState(char);
    }
  }

  initSingleQuo(char) {
    this.buffer += char;
    this.state = this.sheetNameState;
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
      this.push2ExpArgs(this.curExpression, this.buffer, this.position_i);
      this.synUnitBuilder.addValueToCurUnit(this.last_arg, this.buffer, this.lastUnitTypeArray);
    }
    this.buffer = char;
    this.state = this.endOperator;
  }

  endOperator(char) {
    if (this.buffer + char in ['>=', '<=', '<>']) { // 双元运算符
      let wholeStr = this.buffer + char;
      this.pushOperator2ExpArgs(wholeStr);
      this.synUnitBuilder.addStringToCurUnit(wholeStr, [OPERATOR]);
      this.buffer = '';
    } else {
      this.pushOperator2ExpArgs(this.buffer);// 单元运算符
      this.synUnitBuilder.addStringToCurUnit(this.buffer, [OPERATOR]);
      this.buffer = '';
      this.returnToNormalState(char);
    }
  }

  initParentheses() { // 情况1：之前是运算符或一开头就是左括号的时候this.buff为空。情况3：之前是一个字符表达式
    let trim_buffer,
      fnExecutor;
    if (this.isBufferEmpty()) {
      fnExecutor = NaN;
    } else {
      trim_buffer = this.buffer.trim(); // buffer 是一个字符串，代表一个语义单元，例如average,不改变this.buff
      fnExecutor = this.multiCollFn.getFnExecutorByName(trim_buffer); // 获取expression 函数; todo: 没有获取到怎么办？
      this.synUnitBuilder.addValueToCurUnit(fnExecutor, this.buffer, [EXP_FN]);
    }
    this.synUnitBuilder.addContainerUnit(this.char, [CONTAINER]);
    this.stackProxy.addStack(fnExecutor);
    this.curExpression = new StructuralExp(this.calcCell);
    this.stackProxy.addStack(this.curExpression);
    this.synUnitBuilder.createNewChild();
    this.buffer = '';
  }


  endFnArg() { // 逗号结束
    this.push2ExpArgs(this.curExpression, this.buffer, this.position_i);  // (arg1,arg2)中的arg1 todo: 如果arg1中含有operator，就不对了
    this.synUnitBuilder.addValueToCurUnit(this.last_arg, this.buffer, this.lastUnitTypeArray);
    this.stackProxy.popStack();

    this.stackProxy.getLastFnExecutor()
      .push(this.curExpression);
    this.curExpression = new StructuralExp(this.calcCell); // this.curExpression 状态变为一个新的expression
    this.stackProxy.addStack(this.curExpression);
    this.synUnitBuilder.returnToPreStack();
    this.synUnitBuilder.addStringToCurUnit(this.char, [SPLIT_MARK]);
    this.synUnitBuilder.createNewChild();
    this.buffer = '';
  }

  endParentheses() { // 小括号结束
    // 处理 （arg1， arg2）中的arg2
    let lastExp = this.stackProxy.popStack();
    this.push2ExpArgs(this.curExpression, this.buffer);
    this.synUnitBuilder.addValueToCurUnit(this.last_arg, this.buffer, this.lastUnitTypeArray);


    let fnExecutor = this.stackProxy.popStack(); // 当前栈结束
    this.curExpression = this.stackProxy.getLastStack(); // 改变当前exp_obj的状态
    if (this.stackProxy.isFnExecutorValid(fnExecutor)) {
      fnExecutor.push(lastExp);
      this.push2ExpArgs(this.curExpression, fnExecutor, this.position_i);
    } else {
      this.push2ExpArgs(this.curExpression, lastExp, this.position_i);
    }
    this.synUnitBuilder.returnToPreStack();
    this.synUnitBuilder.addContainerUnit(this.char, [CONTAINER], true);
    this.buffer = '';
  }

  initBrace() {
    if (this.buffer.trim() !== '') {
      this.push2ExpArgs(this.curExpression, this.buffer);
    }
    this.addInitContainer(this.char);
    this.state = this.insideBrace;
    this.buffer = '';
  }

  insideBrace(char) { // todo:
    if (char === '}') {
      let theRawArray = new RawArray(this.buffer);
      this.push2ExpArgs(this.curExpression, theRawArray);
      this.synUnitBuilder.addValueToCurUnit(this.last_arg, this.buffer, this.lastUnitTypeArray);
      this.synUnitBuilder.addContainerUnit(char, [CONTAINER], true);
      this.buffer = '';
      this.state = this.normalState; // 恢复到正常的结果
    } else {
      this.buffer += char;
    }
  }


  endWholeFormula() {
    if (this.state.name === this.stringMayEndState.name) { // 字符串结束
      this.dealStringEnd()
    } else if (this.buffer !== '') {
      this.push2ExpArgs(this.curExpression, this.buffer, this.position_i); // root_exp 是一个Exp实例，这个实例会引用一个Exp数组; 最后的处理
      this.synUnitBuilder.addValueToCurUnit(this.last_arg, this.buffer, this.lastUnitTypeArray);
    }
  }

  normalState(char) { // 处理一个字符
    if (char === '"') { // 双引号 --> 进入string状态
      this.initDoubleQuo();
    } else if (char === '\'') { // 单引号 --> 进入single_quote状态
      this.initSingleQuo(char);
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

  str2Value(astNodeStr, calcCell, position_i) { // todo: 可以设计parseArray
    console.assert(typeof astNodeStr === 'string');
    let v;
    let res1 = new BoolParser(calcCell, astNodeStr).parseString();
    if (res1.msg !== PARSE_FAIL) { // true, false --> boll 变量
      v = new RawValue(new CellVBool(res1));
      this.lastUnitTypeArray = [RAW_VALUE, BOOL];

    } else if (astNodeStr.trim() // 表示一个Range
      .replace(/\$/g, '')
      .match(/^[A-Z]+[0-9]+:[A-Z]+[0-9]+$/)) {
      this.lastUnitTypeArray = [RANG_REF, A1A2];
      v = new SUnitRangeRef(astNodeStr.trim()
        .replace(/\$/g, ''), calcCell, position_i); // todo: 把绝对引用去掉了

    } else if (astNodeStr.trim() // 跨sheet引用的Range
      .replace(/\$/g, '')
      .match(/^[^!]+![A-Z]+[0-9]+:[A-Z]+[0-9]+$/)) {
      this.lastUnitTypeArray = [RANG_REF, SHEET1A1A2];
      v = new SUnitRangeRef(astNodeStr.trim()
        .replace(/\$/g, ''), calcCell, position_i);

    } else if (astNodeStr.trim() // A:A 这样形式的Range
      .replace(/\$/g, '')
      .match(/^[A-Z]+:[A-Z]+$/)) {
      this.lastUnitTypeArray = [RANG_REF, AA];
      v = new SUnitRangeRef(astNodeStr.trim()
        .replace(/\$/g, ''), calcCell, position_i);

    } else if (astNodeStr.trim() // sheet1!A:A 这样形式的Range
      .replace(/\$/g, '')
      .match(/^[^!]+![A-Z]+:[A-Z]+$/)) {
      this.lastUnitTypeArray = [RANG_REF, SHEET1AA];
      v = new SUnitRangeRef(astNodeStr.trim()
        .replace(/\$/g, ''), calcCell, position_i);

    } else if (astNodeStr.trim() // 单元格引用
      .replace(/\$/g, '')
      .match(/^[A-Z]+[0-9]+$/)) {
      this.lastUnitTypeArray = [SINGLE_REF, A1];
      v = new SUnitRefValue(astNodeStr.trim()
        .replace(/\$/g, ''), calcCell);

    } else if (astNodeStr.trim() // 跨sheet单元格引用
      .replace(/\$/g, '')
      .match(/^[^!]+![A-Z]+[0-9]+$/)) {
      this.lastUnitTypeArray = [SINGLE_REF, SHEET1A1];
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

  push2ExpArgs(structuralExp, toAddUnit, position_i) { // 这个使用来做解析； todo：考虑把这个转移
    let self = structuralExp;
    if (toAddUnit !== '') {
      let v = toAddUnit;
      if (!isNaN(toAddUnit)) { // 数字
        v = new RawValue(+toAddUnit);
      } else if (typeof toAddUnit === 'string') {
        v = this.str2Value(toAddUnit, self.calcCell, position_i);
      } else {
        v = toAddUnit;
      }
      self.args.push(v); // 只有运算符号保持string形式
      self.last_arg = v;
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
    if (toParseStr[0] === '{' && toParseStr[toParseStr.length - 1] === '}') { // todo: 可以转化为arrayformula
      this.push2ExpArgs(this.root_exp, new RawValue(new Error(ERROR_SYNTAX)));
      return this.root_exp;
    }
    for (; this.position_i < toParseStr.length; this.position_i++) {
      self.char = toParseStr[self.position_i];
      self.state(self.char); // 逐字符解析函数; self.state代表当前的解析状态
    }
    this.endWholeFormula();
    this.calcCell.rootSyntaxUnit = this.synUnitBuilder.rootUnit;
    return this.root_exp;
  }

}
