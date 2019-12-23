import {
  ABSOLUTE_MARK,
  COL_NAME,
  RANG_REF,
  ROW_NAME,
  SHEET_NAME,
  SINGLE_REF,
  SOLVE_FAIL_OBJ,
  SPLIT_MARK
} from '../calc_utils/config';
import { indexAt, stringAt } from '../../utils/alphabet';
import { SyntaxStructureBuilder, TypeArray } from './syntax_unit_proxy';
import { AA } from '../calc_deal/structural_expression/deal_structural_expression';

class CellColNameProxy {
  constructor(aName, isAbsoluteRef) {
    this.aName = aName;
    this.isAbsoluteRef = isAbsoluteRef;
  }

  static fromStrMayWith$(aStr) { // 类似python的class method
    let aColName;
    if (aStr[0] === '$') {
      aColName = new CellColNameProxy(aStr.slice(1));
      aColName.isAbsoluteRef = true;
    } else {
      aColName = new CellColNameProxy(aStr.slice(1));
      aColName.isAbsoluteRef = false;
    }
    return aColName;
  }

  getNumber() {
    return indexAt(this.aName);
  }

  getNameByNumber(index, inplace = false) {
    let aStr = stringAt(index);
    if (inplace === true) {
      this.aName = aStr;
    }
    return stringAt(index);
  }

  updateByShift(aShift, inplace = false) {
    return this.getNameByNumber(this.getNumber() + aShift, inplace);
  }
}

class CellRowNameProxy {
  constructor(aName) {
    this.aName = aName;
    this.isAbsoluteRef = null;
  }

  getNumber() {
    return parseInt(this.aName);
  }

  getNameByNumber(index, inplace = false) {
    let aStr = String(index);
    if (inplace === true) {
      this.aName = aStr;
    }
    return aStr;
  }

  updateByShift(aShift, inplace = false) {
    return this.getNameByNumber(this.getNumber() + aShift, inplace);
  }
}

export class SingleCellRefer { // 对应一个对单元格的引用，考虑绝对引用与相对应用; 用状态模式
  constructor(aStr, typeArray) {
    this.aStr = aStr;
    this.typeArray = typeArray; // A1 or sheet1!A1
    this.syntaxUnitBuilder = new SyntaxStructureBuilder();
    this.buff = '';
    this.char = '';
    this.state = this.normalState;
    this.isAbosulte = false;
    this.rowUnit = null;
    this.colUnit = null;
  }

  getRootUnit() {
    return this.syntaxUnitBuilder.rootUnit;
  }

  // sheetName, rowName, ColName, 3个要素
  /**
   *
   * @param newCol
   * @param newRow
   * @param inplace 是否替换原值
   */
  updateStrByNewLoc(newCol, newRow, inplace = false) { // 用户剪切，插入或删除单元格会变化引用的单元格位置变化
    let acc = '';
    this.syntaxUnitBuilder.rootUnit.childrenSynUnit.map((elm) => {
      if (elm.typeArray.includes(COL_NAME)) {
        acc += elm.assciatedValue.getNameByNumber(newCol, inplace);
      } else if (elm.typeArray.includes(ROW_NAME)) {
        acc += elm.assciatedValue.getNameByNumber(newRow, inplace);
      } else {
        acc += elm.wholeStr;
      }
    });
    return acc;
  }

  updateStrByUserMove(colShift, rowShift, inplace = false) { // 用户复制黏贴，或者自动填充，要考虑绝对引用
    let acc = '';
    this.syntaxUnitBuilder.rootUnit.childrenSynUnit.map((elm) => {
      if (elm.typeArray.includes(COL_NAME)) {
        acc += elm.assciatedValue.updateByShift(colShift, inplace);
      } else if (elm.typeArray.includes(ROW_NAME)) {
        acc += elm.assciatedValue.updateByShift(rowShift, inplace);
      } else {
        acc += elm.wholeStr;
      }
    });
    return acc;
  }

  normalState(char) {
    if (char === '!') {
      this.syntaxUnitBuilder.addStringToCurUnit(this.buff, [SHEET_NAME]);
      this.syntaxUnitBuilder.addStringToCurUnit(char, [SPLIT_MARK]);
      this.buff = '';
    } else if (char === '$') {
      if (this.buff !== '') {
        this.addColNameProxy();
      }
      this.isAbosulte = true;
      this.syntaxUnitBuilder.addStringToCurUnit(char, [ABSOLUTE_MARK]);
    } else if (/[0-9]/.test(char)) {
      if (this.buff !== '') {
        this.addColNameProxy();
      }
      this.state = this.insideRowName;
      this.buff += char;
    } else {
      this.buff += char;
    }
  }

  insideRowName(char) {
    this.buff += char;
  }

  addRowNameProxy() {
    let theValue = new CellRowNameProxy(this.buff);
    theValue.isAbsoluteRef = this.isAbosulte;
    this.rowUnit = this.syntaxUnitBuilder.addValueToCurUnit(theValue, this.buff, [COL_NAME]);
  }

  addColNameProxy() {
    let theValue = new CellColNameProxy(this.buff);
    theValue.isAbsoluteRef = this.isAbosulte;
    this.colUnit = this.syntaxUnitBuilder.addValueToCurUnit(theValue, this.buff, [COL_NAME]);
  }

  parseRefString() {
    for (let i = 0; i < this.aStr.length; i++) {
      this.state(this.aStr[i]);
    }
    this.addRowNameProxy();
  }

}

export class RangeRefer {
  constructor(aStr, typeArray) {
    this.aStr = aStr;
    this.typeArray = typeArray; // A1:A2,  sheet1!A1:A2
    this.firstRef = null;
    this.secondRef = null;
  }

  parseRefString() { // B5:A1 -> A1:B5
    let aArray = this.aStr.split(':');
    let firstRef = new SingleCellRefer(aArray[0]);
    let secondRef = new SingleCellRefer(aArray[1]);
    if (firstRef.colUnit.getNumber() > secondRef.colUnit.getNumber()) { // 交换位置
      let shouldFirst = secondRef.colUnit.aName;
      secondRef.colUnit.aName = firstRef.colUnit.aName;
      firstRef.colUnit.aName = shouldFirst;
    }
    if (firstRef.rowUnit.getNumber() > secondRef.rowUnit.getNumber()) {
      let shouldFirst = secondRef.rowUnit.aName;
      secondRef.rowUnit.aName = firstRef.rowUnit.aName;
      firstRef.rowUnit.aName = shouldFirst;
    }
    this.firstRef = firstRef;
    this.secondRef = secondRef;
  }

  getRefWholeString() {
    return this.firstRef.getRootUnit()
      .getWholeString() + ':' + this.secondRef.getRootUnit()
      .getWholeString();
  }

  // sheetName, rowNameArray, ColNameArray, 3个要素

  updateStrByNewLoc(newCol, newRow, inplace = false) { // newCol, newRow应该是2元素数组(较小的与较大的)，代表四个边角的单元格
    this.firstRef.updateStrByNewLoc(newCol[0], newRow[0], inplace = false);
    this.secondRef.updateStrByNewLoc(newCol[1], newRow[1], inplace = false);
    return this.getRefWholeString();
  }

  //  用户剪切，插入或删除单元格会变化原值，用户复制黏贴，或者自动填充不会改变原值
  /**
   *
   * @param {Array}colShiftArray
   * @param  {Array}rowShiftArray
   * @param {boolean} inplace
   */
  updateByUserMove(colShiftArray, rowShiftArray, inplace = false) {
    this.firstRef.updateStrByUserMove(colShiftArray[0], rowShiftArray[0], inplace = false);
    this.secondRef.updateStrByUserMove(colShiftArray[1], rowShiftArray[1], inplace = false);
    return this.getRefWholeString();
  }

}

/**
 * @property {CellColNameProxy} firstRef
 * @property {CellColNameProxy} secondRef
 */
export class AARangeRefer {
  constructor(aStr, typeArray) {
    this.aStr = aStr;  //  A:B, sheet1!A:B
    this.typeArray = typeArray;
    // sheetName, colNameLeft,colNameRight 2个要素
    this.syntaxUnitBuilder = new SyntaxStructureBuilder();
    this.firstRef = null;
    this.secondRef = null;
  }

  parseRefString() {
    let splitArray = this.aStr.split('!');
    let col_name_array;
    if (splitArray.length > 1) {
      this.syntaxUnitBuilder.addStringToCurUnit(splitArray[0], [SHEET_NAME]);
      this.syntaxUnitBuilder.addStringToCurUnit('!', [SPLIT_MARK]);
      col_name_array = splitArray[1].split(':');
    } else {
      col_name_array = this.aStr.split(':');
    }
    if (col_name_array[0].getNumber() > col_name_array[1].getNumber()) { // B:A -> A:B
      col_name_array.reverse();
    }
    this.firstRef = col_name_array[0];
    this.secondRef = col_name_array[1];
    this.dealColRefStr(col_name_array[0]);
    this.syntaxUnitBuilder.addStringToCurUnit(':', [SPLIT_MARK]);
    this.dealColRefStr(col_name_array[1]);
  }

  dealColRefStr(colRefStr) {
    let isAbsolute = false;
    if (colRefStr[0] === '$') {
      colRefStr = colRefStr.slice(1);
      this.syntaxUnitBuilder.addStringToCurUnit('$');
      isAbsolute = true;
    }
    let theValue = new CellColNameProxy(colRefStr, isAbsolute);
    this.syntaxUnitBuilder.addValueToCurUnit(theValue, colRefStr, [COL_NAME]);
  }

  updateStrByNewLoc(newColArray, inplace = false) { // newCol应该是2元素
    if (newColArray.length !== 2) {
      return new Error('newColArray should have two elements.');
    }
    this.firstRef.getNameByNumber(newColArray[0], inplace = true);
    this.secondRef.getNameByNumber(newColArray[1], inplace = true);
  }

  //  用户剪切，插入或删除单元格会变化原值，用户复制黏贴，或者自动填充不会改变原值
  /**
   *
   * @param {Array}colShiftArray
   * @param  {Array}rowShiftArray
   * @param {boolean} inplace
   */
  updateByUserMove(colShiftArray, inplace = false) {
    if (colShiftArray.length !== 2) {
      return new Error('newColArray should have two elements.');
    }
    this.firstRef.updateByShift(colShiftArray[0], inplace = true);
    this.secondRef.updateByShift(colShiftArray[1], inplace = true);
  }
}

/**
 * @property {BigInt} pstID 第几个语法单元
 * @property {String} wholeStr
 */
export class SyntaxUnitProxy { // todo： 需要有个继承体系，防止循环依赖
  constructor(pstID, wholeStr, aTypeArray) {
    this.pstID = pstID;
    this.wholeStr = wholeStr;
    this.typeArray = new TypeArray(aTypeArray); //归属的类别,因为存在一级，二级目录，所以是一个array
    this.pairUnit = null; // 配对的unit的属性,例如大小括号配对等
    this.assciatedValue = null; // 对应的RawValue, Range, RefValue等
    this.parentSynUnit = null; // 所属的父语法点
    this.syntaxParser = this.getParser();

  }

  getParser() {
    let aParser;
    if (this.typeArray.isIncludeType(SINGLE_REF)) {
      aParser = new SingleCellRefer(this.wholeStr, this.typeArray);

    } else if (this.typeArray.isMarchTypeArray([RANG_REF, AA])) {
      aParser = new AARangeRefer(this.wholeStr, this.typeArray);
    } else if (this.typeArray.isIncludeType(RANG_REF)) {
      aParser = new RangeRefer(this.wholeStr, this.typeArray);
    } else {
      return null;
    }
    aParser.parseRefString();
    return aParser;
  }


  addPair(pairUnit) {
    this.pairUnit = pairUnit;
    pairUnit.pairUnit = this;
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
    } else {
      return SOLVE_FAIL_OBJ;
    }
  }

  getWholeString() {
    return this.wholeStr;
  }

  updateByNewLoc(newCol, newRow, inplace = false) {
    return this.syntaxParser.updateStrByNewLoc(newCol, newRow, inplace); // todo: this.syntaxParser可能为null
  }

  updateByUserMove(colShift, rowShift, inplace = false) {
    return this.syntaxParser.updateStrByUserMove(colShift, rowShift, inplace);
  }
}
