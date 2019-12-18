// 所有的算符都会转化为函数
import { CellVTypeObj } from '../cell_value_type/cell_value';
import { ERROR_DIV0 } from '../calc_utils/error_config';
import {
  NotConvertEmptyExpFunction,
  StringExpFunction
} from './exp_function_proxy';

export function opIsLessThan(a, b) {
  return a < b;
}

function opIsEqualF(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a - b) < 0.001; // 可能存在浮点数的问题
  } else if (a.cellVTypeName === b.cellVTypeName === CellVTypeObj.CellVEmpty) {
    return true;
  }
  return a === b;
}

export const opIsEqual = new NotConvertEmptyExpFunction(opIsEqualF);

export function opIsGreaterThan(a, b) {
  return a > b;
}

export function opIsGreaterOrEqual(a, b) {
  return a >= b;
}

export function opIsLessOrEqual(a, b) {
  return a <= b;
}

export function opIsNotEqual(a, b) {
  return opIsEqual(a, b) === false;
}

export function opAdd(a, b) {
  return a + b;
}

export function opSubtract(a, b) {
  return a - b;
}

export function opMultiply(a, b) {
  return a * b;
}

export function opDivide(a, b) {
  if (b === 0) {
    return new Error(ERROR_DIV0);
  }
  return a / b;
}

export function opPower(a, b) {
  return Math.pow(a, b);
}

function opJoinString_(a, b) {
  return String(a) + String(b);
}

export const opJoinString = new StringExpFunction(opJoinString_);
export const OPERATOR_OBJ = {
  plus: '+', //双元运算符
  dash: '-', //双元运算符 或单元运算符
  star: '*', //双元运算符
  slash: '/', //双元运算符
  caret: '^', //双元运算符
  ampersand: '&', //双元运算符
  lessThen: '<', //双元运算符
  greaterThen: '>', //双元运算符
  equal: '=', // 双元运算符是否等于
  notEqual: '<>',
  greaterEqual: '>=',
  lessEqual: '<=',
};
