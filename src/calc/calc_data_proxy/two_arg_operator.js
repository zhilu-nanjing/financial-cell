// 双元运算符的统一封装
import {TO_PARA_TYPE} from '../calc_utils/config';
import {UserFnExecutor} from './exp_fn_executor';

class TwoArgOperatorColl {
  constructor() {
    this.operatorObj = {
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
    this.operatorFunOBj = { // todo: 在运算之前，应该要做相应的格式转换
      '+': opAdd,
      '-': opSubtract,
      '*': opMultiply,
      '/': opDivide,
      '^': opPower,
      '&': opJoinString,
      '<': opIsLessThan, // 只有数字才可以比较
      '=': opIsEqual,
      '>': opIsGreaterThan,
      '<=': opIsLessOrEqual,
      '>=': opIsGreaterOrEqual,
      '<>': opIsNotEqual,
    };
  }

  isTwoArgOperator(aStr) {
    return Object.values(this.operatorObj)
      .includes(aStr);
  }

  getFunc(aStr) {
    return this.operatorFunOBj[aStr];
  }

  exeOperator(a, b, operator = '+') {
    // 处理empty

    let theFunc = this.getFunc(operator);
    return new UserFnExecutor(theFunc, [a,b]).solveExpression()
  }
}

export function opAdd(a,b){
  return a + b
}

export function opSubtract(a,b){
  return a - b
}

export function opMultiply(a,b){
  return a * b
}

export function opDivide(a,b){
  return a / b
}

export function opPower(a,b){
  return Math.pow(a, b)
}

export function opJoinString(a,b){
  return String(a) + String(b)
}
opJoinString.argConfig = [TO_PARA_TYPE.string, TO_PARA_TYPE.string] // 参数需要都转换为string 类型

export function opIsLessThan(a, b){
  return a < b
}

export function opIsEqual(a, b){
  return Math.abs(a - b)< 0.001 // 可能存在浮点数的问题
}
opJoinString.argConfig = []

export function opIsGreaterThan(a, b){
  return a > b
}

export function opIsGreaterOrEqual(a, b){
  return a >= b
}
export function opIsLessOrEqual(a, b){
  return a <= b
}
export function opIsNotEqual(a, b){
  return opIsEqual(a,b) === false
}
