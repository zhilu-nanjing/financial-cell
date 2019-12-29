// 双元运算符的统一封装
import { ERROR_SYNTAX } from '../calc_utils/error_config';
import {
  opAdd,
  opDivide,
  OPERATOR_OBJ,
  opIsEqual,
  opIsGreaterOrEqual,
  opIsGreaterThan,
  opIsLessOrEqual,
  opIsLessThan,
  opIsNotEqual,
  opJoinString,
  opMultiply,
  opPower,
  opSubtract
} from './operator_single_func';

// 特殊转换


export class TwoArgOperatorColl {
  constructor() {
    this.operatorObj = OPERATOR_OBJ
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
    let self = this
    if(this.isTwoArgOperator(aStr) === false){
      return new Error(ERROR_SYNTAX)
    }
    return this.operatorFunOBj[aStr]
  }
}
