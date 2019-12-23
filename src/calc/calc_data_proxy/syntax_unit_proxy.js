import { USELESS } from '../calc_utils/config';
import { isArrayBeginWithOther } from '../calc_utils/helper';
import { SyntaxUnitProxy } from './sheet_row_cell_name'; // todo: 循环依赖！


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


}


export class SyntaxStructureBuilder {
  constructor(SyntaxUnitCls) {
    this.rootUnit = new MultiSyntaxUnitProxy();
    this.curUnit = this.rootUnit; // 当前unit
    this.curExpID = -1; // 表达式ID
    this.containerStack = [];
    this.curUnitStack = [this.rootUnit];
    if(typeof SyntaxUnitCls === "undefined"){
      SyntaxUnitCls = SyntaxUnitProxy
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

  addUseLessUnit(theStr) {
    if (theStr === '') {
      return;
    }
    let syntaxUnitProxy = this.addStringToCurUnit(theStr, [USELESS]);
  }

}

