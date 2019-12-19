import { RANG_REF, SINGLE_REF, SOLVE_FAIL_OBJ, USELESS } from '../calc_utils/config';
import { isArrayBeginWithOther } from '../calc_utils/helper';
import { AA } from '../calc_deal/structural_expression/deal_structural_expression';
import {stringAt, indexAt} from '../../utils/alphabet';

class CellColNameProxy {
  constructor(aName) {
    this.aName = aName
    this.isabsoluteRef = null
  }

  getNumber() {
    return indexAt(this.aName)
  }

  getNameByNumber(index) {
    return stringAt(index)
  }
}

class SingleCellRefer{ // 对应一个对单元格的引用，考虑绝对引用与相对应用; 用状态模式还是正则表达式？
  constructor(aStr, typeArray) {
    this.aStr = aStr
    this.typeArray = typeArray // A1 or sheet1!A1
    this.syntaxUnitBuilder = new SyntaxStructureBuilder()
  }
  // sheetName, rowName, ColName, 3个要素
  /**
   *
   * @param newCol
   * @param newRow
   * @param inplace 是否替换原值
   */
  updateStrByNewLoc(newCol, newRow, inplace = false){ // 用户剪切，插入或删除单元格会变化引用的单元格位置变化

  }

  updateByUserMove(colShift, rowShift, inplace = false){ // 用户复制黏贴，或者自动填充，要考虑绝对引用

  }

}
class RangeRefer{
  constructor(aStr, typeArray){
    this.aStr = aStr
    this.typeArray = typeArray // A1:A2,  sheet1!A1:A2
  }
  // sheetName, rowNameArray, ColNameArray, 3个要素

  updateStrByNewLoc(newCol, newRow, inplace = false){ // newCol, newRow应该是4元素数组，代表四个边角的单元格

  }
  //  用户剪切，插入或删除单元格会变化原值，用户复制黏贴，或者自动填充不会改变原值
  /**
   *
   * @param {Array}colShiftArray
   * @param  {Array}rowShiftArray
   * @param {boolean} inplace
   */
  updateByUserMove(colShiftArray, rowShiftArray, inplace = false){

  }


}

class AARangeRefer{
  constructor(aStr, typeArray){
    this.aStr = aStr
    this.typeArray = typeArray //  A:A,
    // sheetName, colName, 2个要素

  }
  updateStrByNewLoc(newCol, newRow, inplace = false){ // newCol, newRow应该是4元素数组，代表四个边角的单元格

  }
  //  用户剪切，插入或删除单元格会变化原值，用户复制黏贴，或者自动填充不会改变原值
  /**
   *
   * @param {Array}colShiftArray
   * @param  {Array}rowShiftArray
   * @param {boolean} inplace
   */
  updateByUserMove(colShiftArray, rowShiftArray, inplace = false){

  }


}



export class TypeArray { // 对应一个类型
  constructor(aArray) {
    this.aArray = aArray;
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
export class SyntaxUnitProxy {
  constructor(pstID, wholeStr, aTypeArray) {
    this.pstID = pstID;
    this.wholeStr = wholeStr;
    this.typeArray = new TypeArray(aTypeArray); //归属的类别,因为存在一级，二级目录，所以是一个array
    this.pairUnit = null; // 配对的unit的属性,例如大小括号配对等
    this.assciatedValue = null; // 对应的RawValue, Range, RefValue等
    this.parentSynUnit = null; // 所属的父语法点
    this.syntaxParser = this.getParser()

  }
  getParser(){
    if (this.typeArray.isIncludeType(SINGLE_REF)) {
      return  new SingleCellRefer(this.wholeStr, this.typeArray)

    } else if (this.typeArray.isMarchTypeArray([RANG_REF, AA])) {
      return  new AARangeRefer(this.wholeStr, this.typeArray)
    }
    else if(this.typeArray.isIncludeType(RANG_REF)){
      return  new RangeRefer(this.wholeStr, this.typeArray)
    }
    return null
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

  getWholeString(){
    return this.wholeStr;
  }

  updateByNewLoc(newCol, newRow, inplace = false) {
    return this.syntaxParser.updateStrByNewLoc(newCol, newRow, inplace)
  }

  updateByUserMove(colShift, rowShift, inplace = false){
    return this.syntaxParser.updateByUserMove(colShift, rowShift, inplace)
  }
}

export class MultiSyntaxUnitProxy { // 复合型节点
  constructor(childrenSynUnit = []) {
    this.typeArray = []; //归属的类别,因为存在一级，二级目录，所以是一个array
    this.childrenSynUnit = this.sortChildren(childrenSynUnit); // 含有的子语法点, 根据pstID的顺序排列
    this.parentSynUnit = null; // 所属的父语法点
  }

  sortChildren(childrenSynUnit) { // 对节点进行排序
    childrenSynUnit.sort((a, b) => a.pstID - b.pstID);
    return childrenSynUnit;
  }

  addChild(childSynUnit) { // 根据pstID插入到指定位置中
    childSynUnit.parentSynUnit = this;
    this.childrenSynUnit.push(childSynUnit);
    this.sortChildren(this.childrenSynUnit);
  }

  getWholeString() {
    let acc = '';
    this.childrenSynUnit.map((child) => acc += child.getWholeString());
    return acc;
  }

  updateByNewLoc(newCol, newRow) {
    this.childrenSynUnit.map((child) => child.updateByNewLoc(newCol, newRow));
  }


}

export class SyntaxStructureBuilder {
  constructor() {
    this.rootUnit = new MultiSyntaxUnitProxy();
    this.curUnit = this.rootUnit; // 当前unit
    this.curExpID = -1; // 表达式ID
    this.containerStack = [];
    this.curUnitStack = [this.rootUnit];
  }

  getAndAddExpId() {
    this.curExpID += 1;
    return this.curExpID;
  }

  getLastUnit() {
    return this.curUnitStack[this.curUnitStack.length - 1];
  }

  createNewChild() {
    let multiSyntaxUnit = new MultiSyntaxUnitProxy();
    multiSyntaxUnit.parentSynUnit = this.getLastUnit();
    this.getLastUnit()
      .addChild(multiSyntaxUnit);
    this.curUnit = multiSyntaxUnit;
    this.curUnitStack.push(multiSyntaxUnit);
  }

  returnToPreStack() {
    this.curUnitStack.pop();
    this.curUnit = this.getLastUnit();
  }


  addStringToCurUnit(wholeStr, aTypeArray) {
    let syntaxUnitProxy = new SyntaxUnitProxy(this.getAndAddExpId(), wholeStr, aTypeArray);
    this.curUnit.addChild(syntaxUnitProxy);
    return syntaxUnitProxy;
  }

  addContainerUnit(wholeStr, aTypeArray, isEnd = false) {
    let syntaxUnitProxy = this.addStringToCurUnit(wholeStr, aTypeArray);
    if (isEnd === true) {
      syntaxUnitProxy.addPair(this.containerStack.pop()); // 减少container栈
    } else {
      this.containerStack.push(syntaxUnitProxy);  // 增加container栈
    }

  }

  addValueToCurUnit(syntaxValue, wholeStr, aTypeArray) {
    let syntaxUnitProxy = this.addStringToCurUnit(wholeStr, aTypeArray);
    syntaxUnitProxy.assciatedValue = syntaxValue;
    return syntaxUnitProxy;
  }

  addUseLessUnit(theStr) {
    if (theStr === '') {
      return;
    }
    let syntaxUnitProxy = this.addStringToCurUnit(theStr, [USELESS]);
  }


}
