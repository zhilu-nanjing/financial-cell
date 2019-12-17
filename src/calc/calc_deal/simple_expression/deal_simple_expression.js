import { FORMULA_STATUS } from '../../calc_utils/config';
import { ERROR_NON_SOLVED, PARSE_FAIL } from '../../calc_utils/error_config';
import { CellVEmpty, convertToCellV } from '../../cell_value_type/cell_value';
import { CalcCell } from '../../calc_data_proxy/cell_formula';
import {BoolParser,
  DateTimeParser,
  ForceString,
  MoneyParser,
  NumberParser
} from '../../calc_data_proxy/parser_proxy';

export class SimpleExpressionBuilder { // 解析不含等号的那些表达式
  /**
   *
   */
  constructor(calcCell) {
    this.parseArray = [ForceString, BoolParser, DateTimeParser, MoneyParser, NumberParser]; // 需要遍历的解析器
    this.rootExp = new SimpleExpression(this.calcCell); // 出是话是一个空的
    this.calcCell = calcCell;
  }

  /**
   *
   * @return {*}
   */
  parseFormula() {
    let res;
    this.rootExp = new SimpleExpression(this.calcCell, this.calcCell.formulaString, this.parseArray);
    this.rootExp.parseExpression();
    return this.rootExp;
  }
}

/**
 * @property {CalcCell} calcCell
 */
class SimpleExpression {
  // 拥有解析与计算两个能力
  // calcCell: CalcCell
  constructor(calcCell, strToParse = '', parseArray) {
    this.expStatus = FORMULA_STATUS.created;
    this.calcCell = calcCell;
    this.strToParse = strToParse;
    this.parserArray = parseArray; // 多个解析器尝试解析
    this.parseRes = '';
    this.expSolution = ERROR_NON_SOLVED; // 初始化解决
  }

  parseExpression() {
    let res;
    for (let parserCls of this.parserArray) { // 试图用多个解析器来解析
      res = new parserCls(this.calcCell, this.strToParse).parseString();
      if (res.msg !== PARSE_FAIL) {
        this.parseRes = res;
        return res; // 解析成功
      }
    }
    this.parseRes = this.strToParse;
    return this.strToParse; // 解析为其他类型不成功, 直接当成字符串
  }

  isEmpty() {
    return this.strToParse === '';
  }


  solveExpression() {
    // 首先所有的子参数都要获得结果
    if (this.isEmpty()) {
      this.expSolution = new CellVEmpty(); // 空值,得到这个结果
    } else {
      this.expSolution = convertToCellV(this.parseRes);
    }
    this.expStatus = FORMULA_STATUS.solved;
    return this.expSolution;
  }

  update_cell_value() {
    this.calcCell.cellObj.v = this.solveExpression();
    return this.calcCell.cellObj.v;
  }

}


