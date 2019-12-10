import {MARK_OBJ, FORMULA_STATUS} from "../../calc_utils/config"
import {ERROR_NON_SOLVED} from '../../calc_utils/error_config';
import { CellVEmpty,CellVDateTime } from '../../cell_value_type/cell_value';

export class SimpleExpressionBuilder { // 解析不含等号的那些表达式
  /**
   *
   */
  constructor(calcCell) {
    this.parseArray = [DateTimeParser, ] // 需要遍历的解析器
    this.rootExp = new SimpleExpression()
    this.calcCell = calcCell
  }

  /**
   *
   * @return {*}
   */
  parseFormula() {
    let res
    if(this.calcCell.formulaString === ""){
      return new SimpleExpression() // 空值，返回一个空的表达式
    }
    else {
      this.rootExp = new SimpleExpression(this.calcCell.formulaString, this.parseArray)
      this.rootExp.parseExpression()
    }
  }
}

class EmptyNode{
  constructor(){
}
  solveNode(){
    return new CellVEmpty()
  }

}

/**
 * @property {string} strToParse
 */
class SimpleExpression{
  // 拥有解析与计算两个能力
  constructor(strToParse = "", parseArray){
    this.expStatus = FORMULA_STATUS.created
    this.strToParse = strToParse
    this.parserArray = parseArray // 多个解析器尝试解析
    this.errorMsg = "" // 解析中的问题
    this.astNode = new EmptyNode() // 对args要做的函数运算，对应的根节点，一般对应Add，Average这样的表达式函数
    this.fnParamArray = [] // 参数列表，所有的参数都有solveExpression方法
    this.expSolution = ERROR_NON_SOLVED // 没有解决
  }
  parseExpression(){
    let res
    for(let parserCls of this.parserArray){ // 试图用多个解析器来解析
      res = new parserCls(this.strToParse).parseString()
      if(res.isEmpty() === false){ // 正确解析了
        return res // 解析成功
      }
    }

  }
  isEmpty(){
    return this.strToParse === ""
  }
  isNodeEmpty(){
    return this.astNode instanceof EmptyNode
  }
  update_cell_value(){
    return this.solveExpression()
  }
  solveExpression(){
    // 首先所有的子参数都要获得结果
    if(this.isEmpty()){
      this.expSolution = new CellVEmpty() // 空值,得到这个结果
    }
    else if(this.isNodeEmpty() === false){ // 需要进行计算
      if(this.fnParamArray.length > 0){
        let solvedParamArray = this.fnParamArray.reduce((solvedArray  ,fnParam) => {solvedArray.push(fnParam.solveExpression())})
        this.expSolution = this.astNode.solveNode(...solvedParamArray)
      }
      else{
        this.expSolution = this.astNode.solveNode()
      }
    }
    else{
      console.assert(this.fnParamArray.length === 1)
      this.expSolution = solvedParamArray[0] // 此时应该只有一个节点
    }
    this.expStatus = FORMULA_STATUS.solved
    return this.expSolution
  }
}


class DateTimeParser{
  /**
   * @param {string} strToParse
   */
  constructor(strToParse){
    this.strToParse = strToParse
    this.resExp = new SimpleExpression() // 初始是一个空的; 最终得到一个expression，这个expression会被解析为一个小语法树，有.astNode属性
  }
  dealSpace(){
    let firstColonPst = this.strToParse.indexOf(MARK_OBJ.colon)
    let lastSpacePst
    if(firstColonPst > 0){ // 存在冒号
      let lastSpacePst = this.strToParse.slice(0,firstColonPst).lastIndexOf(MARK_OBJ.space)
        if(lastSpacePst > 0){ // 存在空格
        }
    }
    if(this.strToParse.includes(":")){ // 解析冒号

    }

  }

  parseString(){ // asdf+as ;
    let res1 = this.dealSpace()
    console.log()
    return this // 获得的结果
  }
}
