// 关于矩阵的定义与算法都在这里
import { INVALID_MATRIX, NOT_NUMBER, NOT_SUPPORT, SHAPE_DIFF } from '../calc_utils/config';
import { ERROR_SYNTAX, PARSE_FAIL } from '../calc_utils/error_config';
import { RawValueParser, Str2NumberParser } from './base_parser';
import { CellVError } from '../cell_value_type/cell_value';
import {TwoArgOperatorColl} from './two_arg_operator';

export class MatrixValue { // 二维数组
  constructor(aArray) { // 使用
    this.aArray = aArray;
    this.shape = this.getShape(aArray);
    this.twoArgOperator = new TwoArgOperatorColl()
  }

  applyEachElement(func) {
    return this.aArray.map(f => f.map(func));
  }

  convertNumberToMatrix(aNumber) {
    return this.applyEachElement(e => aNumber);
  }

  getACopy() {
    return new MatrixValue(this.aArray.slice());
  }

  repeatCol(num) { // 当col长度为1的时候会重复填充
    if (this.shape[1] === 1 && num > 1) {
      this.aArray = this.aArray.map(f => Array(num)
        .fill(f[0]));
      this.shape[1] = num;
    }
  }

  repeatRow(num) { // 当col长度为1的时候会重复填充
    if (this.shape[0] === 1 && num > 1) {
      this.aArray = Array(num)
        .fill(this.aArray[0]);
      this.shape[0] = num;
    }
  }

  repeatRowOrCol(num, colOrRow) {
    if (colOrRow === 0) {
      this.repeatRow(num);
    } else {
      this.repeatCol(num);
    }
  }


  getShape(aArray) { // 获取矩阵的形状，第一维对应row，第二维对应col
    let lenArray = aArray.map(f => f.length);
    if (Math.max(...lenArray) === Math.min(...lenArray)) {
      return [aArray.length, lenArray[0]]; // 行，与列的数量
    } else {
      return new Error(INVALID_MATRIX);
    }
  }

  checkAllNumber(aArray) { // 判断一个矩阵是否都是number类型; Excel中允许为string
    aArray.forEach(f => {
      f.forEach(e => {
        if (typeof e !== 'number') {
          return new Error(NOT_NUMBER);
        }
      });
    });
  }

  checkSameShape(other) {
    if (other.shape !== this.shape) {
      return new Error(SHAPE_DIFF);
    }
  }

  convertArgToMatrix(aArg) {
    if (typeof aArg === 'number') {
      return this.convertNumberToMatrix(aArg);
    } else if (aArg instanceof Array) {
      return MatrixValue(aArg);
    } else if (aArg instanceof MatrixValue) {
      return aArg;
    } else {
      return new Error(INVALID_MATRIX);
    }
  }

  getElement(ri, ci) {
    return this.aArray[ri][ci];
  }

  growToLargeShape(other) { // 当成长到一个更大的shape
    for (let rowOrCol of [0, 1]) {
      if (other.shape[rowOrCol] > this.shape[rowOrCol]) {
        this.repeatRowOrCol(other.shape[rowOrCol], rowOrCol);
      } else if (this.shape[rowOrCol] > other.shape[rowOrCol]) {
        other.repeatRowOrCol(this.shape[rowOrCol], rowOrCol);
      }
    }
  }

  exeElementWiseFunc(other, func) {
    let otherMat = this.convertArgToMatrix(other);
    let thisMat = this.getACopy();
    thisMat.growToLargeShape(otherMat);
    let resRowNum = Math.min(thisMat.shape[0], otherMat.shape[0]);
    let resColNum = Math.min(thisMat.shape[1], otherMat.shape[1]);
    let resArray = Array(resRowNum);
    for (let ri = 0; ri < resRowNum; ri++) {
      resArray[ri] = Array(0)
      for (let ci = 0; ci < resColNum; ci++) {
        resArray[ri].push(func(thisMat.getElement(ri, ci), otherMat.getElement(ri, ci)));
      }
    }
    return resArray;
  }
  exeElementWiseOperator(other, operator) {
    let theFunc =  this.twoArgOperator.getFunc(operator)
    if (theFunc instanceof Error){
      return theFunc
    }
    return this.exeElementWiseFunc(other, theFunc);
  }


}

/**
 * 直接写出来的数组，例如：{1,3,4}
 */
export class RawArray {
  constructor(rawStr) { // "1,3" 或 1,3;3,4
    this.rawStr = rawStr;
    this.cellVError = null;
    this.solution = null
  }

  parse2Array() {
    let rowStrArray = this.rawStr.split(';');
    return  rowStrArray.map((rowStr) => {
        let elementStrArray = rowStr.split(',');
        let elementArray = elementStrArray.map((elementStr) => {
          let res = new RawValueParser(elementStr).parse2NumberOrString();
          this.cellVError = res === PARSE_FAIL ? new CellVError(new Error(ERROR_SYNTAX)) : this.cellVError; // 解析出错时返回错误
          return res;
        })
        return elementArray;
      }
    );
  }

  solveExpression() { // 得到结果
    let res = this.parse2Array()
    if(this.cellVError instanceof CellVError){
      return this.cellVError
    }
    this.solution = res
    return res
  }
}
