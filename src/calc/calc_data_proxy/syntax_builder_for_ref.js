import { ABSOLUTE_MARK, COL_NAME, ROW_NAME, SHEET_NAME, SPLIT_MARK } from '../calc_utils/config';
import { indexAt, stringAt } from '../../utils/alphabet';
import { BaseSyntaxUnitProxy, SyntaxStructureBuilder } from './syntax_builder_core';
import { ColIndexProxy } from './col_index';

/**
 * @property {BaseSyntaxUnitProxy|null} syntaxUnit
 */
class BaseNameParser { // 可以用来重构的类
  constructor(aName, isAbsoluteRef) {
    this.aName = aName;
    this.isAbsoluteRef = isAbsoluteRef;
    this.syntaxUnit = null; //关联的语法单元
  }

  getNumber() {
    return 0;
  }

  dealInplace(res, inplace){
    if(inplace){
      this.syntaxUnit.wholeStr = res; // 更新
    }
    return res;


  }

  getNameByNumber(index, inplace = false) {
    return '';
  }

  associateWithSyntaxUnit(aSyntaxUnit) {
    this.syntaxUnit = aSyntaxUnit;
  }

  updateByShift(aShift, inplace = false) {
    let res = this.getNameByNumber(this.getNumber() + aShift, inplace);
    return this.dealInplace(res, inplace)
  }

}

class CellColNameParser extends BaseNameParser {
  static fromStrMayWith$(aStr) { // 类似python的class method
    let aColName;
    if (aStr[0] === '$') {
      aColName = new CellColNameParser(aStr.slice(1));
      aColName.isAbsoluteRef = true;
    } else {
      aColName = new CellColNameParser(aStr);
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
    return this.dealInplace(aStr, inplace)
  }

}

class CellRowNameParser extends BaseNameParser {
  static fromStrMayWith$(aStr) { // 类似python的class method
    let aColName;
    if (aStr[0] === '$') {
      aColName = new CellRowNameParser(aStr.slice(1));
      aColName.isAbsoluteRef = true;
    } else {
      aColName = new CellRowNameParser(aStr);
      aColName.isAbsoluteRef = false;
    }
    return aColName;
  }

  getNumber() {
    return parseInt(this.aName);
  }

  getNameByNumber(index, inplace) {
    let aStr = String(index);
    if (inplace === true) {
      this.aName = aStr;
    }
    return this.dealInplace(aStr, inplace)
  }
}

export class SingleCellRefer { // 对应一个对单元格的引用，考虑绝对引用与相对应用; 用状态模式
  constructor(aStr, typeArray) {
    this.aStr = aStr;
    this.typeArray = typeArray; // A1 or sheet1!A1
    this.syntaxUnitBuilder = new SyntaxStructureBuilder(BaseSyntaxUnitProxy);
    this.buff = '';
    this.char = '';
    this.state = this.normalState;
    this.isAbosulte = false;
    this.cellRowNameParser = null;
    this.cellColNameParser = null;

  }
  isLeftTopToOther(other){
    return this.cellRowNameParser.getNumber() < other.cellRowNameParser.getNumber() && this.cellColNameParser.getNumber() < other.cellColNameParser.getNumber()
  }

  getRootUnit() {
    return this.syntaxUnitBuilder.rootUnit;
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
    this.cellRowNameParser = new CellRowNameParser(this.buff);
    this.cellRowNameParser.isAbsoluteRef = this.isAbosulte;
    this.syntaxUnitBuilder.addParserToCurUnit(this.cellRowNameParser, this.buff, [ROW_NAME]);
    this.buff = ""
  }

  addColNameProxy() {
    this.cellColNameParser = new CellColNameParser(this.buff);
    this.cellColNameParser.isAbsoluteRef = this.isAbosulte;
    this.syntaxUnitBuilder.addParserToCurUnit(this.cellColNameParser, this.buff, [COL_NAME]);
    this.buff = ""
  }

  parseRefString() {
    for (let i = 0; i < this.aStr.length; i++) {
      this.state(this.aStr[i]);
    }
    this.addRowNameProxy();
  }

  // 重构逻辑
  dealInplace(inplace) {
    let res = this.syntaxUnitBuilder.rootUnit.getWholeString();
    this.aStr = inplace ? res : this.aStr;
    return res;
  }

  /**
   *
   * @param newCol
   * @param newRow
   * @param inplace 是否替换原值
   */
  updateStrByNewLoc(newCol, newRow, inplace = false) { // 用户剪切，插入或删除单元格会变化引用的单元格位置变化
    this.cellColNameParser.getNameByNumber(newCol, inplace);
    this.cellRowNameParser.getNameByNumber(newRow, inplace);
    return this.dealInplace(inplace);
  }

  updateStrByUserMove(colShift, rowShift, inplace = false) { // 用户复制黏贴，或者自动填充，要考虑绝对引用
    this.cellColNameParser.getNameByNumber(colShift + this.cellColNameParser.getNumber(), inplace);
    this.cellRowNameParser.getNameByNumber(rowShift + this.cellRowNameParser.getNumber(), inplace);
    return this.dealInplace(inplace);
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
    firstRef.parseRefString()
    secondRef.parseRefString()
    if (firstRef.cellColNameParser.getNumber() > secondRef.cellColNameParser.getNumber()) { // 交换位置
      let shouldFirst = secondRef.cellColNameParser.aName;
      secondRef.cellColNameParser.aName = firstRef.cellColNameParser.aName;
      firstRef.cellColNameParser.aName = shouldFirst;
    }
    if (firstRef.cellRowNameParser.getNumber() > secondRef.cellRowNameParser.getNumber()) {
      let shouldFirst = secondRef.cellRowNameParser.aName;
      secondRef.cellRowNameParser.aName = firstRef.cellRowNameParser.aName;
      firstRef.cellRowNameParser.aName = shouldFirst;
    }
    this.firstRef = firstRef;
    this.secondRef = secondRef;
  }

  getRefWholeString() {
    return this.firstRef.getRootUnit()
      .getWholeString() + ':' + this.secondRef.getRootUnit()
      .getWholeString();
  }

  dealInplace(inplace) {
    let res = this.getRefWholeString();
    this.aStr = inplace ? res : this.aStr;
    return res;
  }

  // 重构逻辑
  updateStrByNewLoc(newCol, newRow, inplace = false) { // newCol, newRow应该是2元素数组(较小的与较大的)，代表四个边角的单元格
    this.firstRef.updateStrByNewLoc(newCol[0], newRow[0], inplace);
    this.secondRef.updateStrByNewLoc(newCol[1], newRow[1], inplace);
    return this.dealInplace(inplace);
  }

  //  用户剪切，插入或删除单元格会变化原值，用户复制黏贴，或者自动填充不会改变原值
  /**
   *
   * @param {Array}colShiftArray
   * @param  {Array}rowShiftArray
   * @param {boolean} inplace
   */
  updateByUserMove(colShiftArray, rowShiftArray, inplace = false) {
    this.firstRef.updateStrByUserMove(colShiftArray[0], rowShiftArray[0], inplace);
    this.secondRef.updateStrByUserMove(colShiftArray[1], rowShiftArray[1], inplace);
    return this.dealInplace(inplace);
  }

}

/**
 * @property {CellColNameParser} firstRef
 * @property {CellColNameParser} secondRef
 */
export class AARangeRefer { // 不支持Excel的average(1:4)这样的语法。
  constructor(aStr, typeArray) {
    this.aStr = aStr;  //  A:B, sheet1!A:B
    this.typeArray = typeArray;
    // sheetName, colNameLeft,colNameRight 2个要素
    this.syntaxUnitBuilder = new SyntaxStructureBuilder(BaseSyntaxUnitProxy);
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
    let cellColNameProxyArray = col_name_array.map(colStr => CellColNameParser.fromStrMayWith$(colStr));
    if (cellColNameProxyArray[0].getNumber() > cellColNameProxyArray[1].getNumber()) { // B:A -> A:B
      cellColNameProxyArray.reverse();
    }
    this.firstRef = cellColNameProxyArray[0];
    this.secondRef = cellColNameProxyArray[1];
    this.dealColRefStr(cellColNameProxyArray[0]);
    this.syntaxUnitBuilder.addStringToCurUnit(':', [SPLIT_MARK]);
    this.dealColRefStr(cellColNameProxyArray[1]);
  }

  /**
   *
   * @param {CellColNameParser}cellColNameProxy
   */

  dealColRefStr(cellColNameProxy) {
    if (cellColNameProxy.isAbsoluteRef === true) {
      this.syntaxUnitBuilder.addStringToCurUnit('$');
    }
    this.syntaxUnitBuilder.addParserToCurUnit(cellColNameProxy, cellColNameProxy.aName, [COL_NAME]);
  }

  // 重构逻辑
  dealInplace(inplace) {
    let res = this.syntaxUnitBuilder.rootUnit.getWholeString();
    this.aStr = inplace ? res : this.aStr;
    return res;
  }

  updateStrByNewLoc(newColArray, inplace = false) { // newCol应该是2元素
    if (newColArray.length !== 2) {
      return new Error('newColArray should have two elements.');
    }
    this.firstRef.getNameByNumber(newColArray[0], inplace);
    this.secondRef.getNameByNumber(newColArray[1], inplace);
    return this.dealInplace(inplace);
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
    this.firstRef.updateByShift(colShiftArray[0], inplace);
    this.secondRef.updateByShift(colShiftArray[1], inplace);
    return this.dealInplace(inplace);
  }
}



