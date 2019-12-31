import { SOLVE_FAIL_OBJ, USELESS } from '../calc_utils/config';
import { isArrayBeginWithOther } from '../calc_utils/helper';


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
  getAllBaseSyntaxUnit(){ // 获取所有基本单元
    let syntaxUnitArray = []
    this.childrenSynUnit.map(child =>{
      if(child instanceof MultiSyntaxUnitProxy){
        syntaxUnitArray = syntaxUnitArray.concat(child.getAllBaseSyntaxUnit())
      }
      else {
        syntaxUnitArray.push(child)
      }
    })
    return syntaxUnitArray
  }

  getRefSyntaxUnit(){

  }

}


export class BaseSyntaxUnitProxy {
  constructor(pstID, wholeStr, aTypeArray) {
    this.pstID = pstID;
    this.wholeStr = wholeStr;
    this.typeArray = new TypeArray(aTypeArray); //归属的类别,因为存在一级，二级目录，所以是一个array
    this.pairUnit = null; // 配对的unit的属性,例如大小括号配对等
    this.parentSynUnit = null; // 所属的父语法点
    // 对应的RawValue, Range, RefValue等； 具备计算功能，但不具备公式字符串修改功能
    this.assciatedValue = null;
    // 可以用来做公式字符串修改，但是不具备计算功能
    this.syntaxParser = this.getParser();

  }

  getParser() {
    return null;
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

  updateByNewLoc(args, inplace = false) {
    let resStr = this.syntaxParser.updateStrByNewLoc(...args, inplace); // todo: this.syntaxParser可能为null
    this.wholeStr = inplace? resStr: this.wholeStr
    return resStr
  }

  updateByUserMove(args, inplace = false) {
    let resStr = this.syntaxParser.updateStrByUserMove(...args, inplace);
    this.wholeStr = inplace? resStr: this.wholeStr
    return resStr
  }
}

export class SyntaxStructureBuilder {
  constructor(SyntaxUnitCls) {
    this.rootUnit = new MultiSyntaxUnitProxy();
    this.curUnit = this.rootUnit; // 当前unit
    this.curExpID = -1; // 表达式ID
    this.containerStack = [];
    this.curUnitStack = [this.rootUnit];
    if(typeof SyntaxUnitCls === "undefined"){
      SyntaxUnitCls = BaseSyntaxUnitProxy
    }
    this.SyntaxUnitCls = SyntaxUnitCls
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
    let syntaxUnitProxy = new this.SyntaxUnitCls(this.getAndAddExpId(), wholeStr, aTypeArray);
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

  addParserToCurUnit(syntaxParser, wholeStr, aTypeArray) {
    let syntaxUnitProxy = this.addStringToCurUnit(wholeStr, aTypeArray);
    syntaxUnitProxy.syntaxParser = syntaxParser;
    syntaxParser.associateWithSyntaxUnit(syntaxUnitProxy)
    return syntaxUnitProxy;
  }


  addUseLessUnit(theStr) {
    if (theStr === '') {
      return;
    }
    let syntaxUnitProxy = this.addStringToCurUnit(theStr, [USELESS]);
  }

}

