import {
  MARK_OBJ,
  FORCE_STR_MARK,
  FORMULA_STATUS,
  d18991230,
  MONEY_UNIT_OBJ
} from '../../calc_utils/config';
import { ERROR_NON_SOLVED, PARSE_FAIL, PARSE_FAIL_OBJ } from '../../calc_utils/error_config';
import { CellVEmpty, CellVDateTime, convertToCellV } from '../../cell_value_type/cell_value';
import { CalcCell } from '../../calc_data_proxy/cell_formula';
import { Str2NumberParser } from '../../calc_utils/parse_helper';


export class SimpleExpressionBuilder { // 解析不含等号的那些表达式
  /**
   *
   */
  constructor(calcCell) {
    this.parseArray = [ForceString, DateTimeParser, MoneyParser, NumberParser]; // 需要遍历的解析器
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

class EmptyNode {
  constructor() {
  }

  solveNode() {
    return new CellVEmpty();
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

class ForceString {
  constructor(calcCell, strToParse) {
    this.strToParse = strToParse;
    this.calcCell = calcCell; //这里没有用到
  }

  parseString() { // asdf+as ;
    if (this.strToParse.startsWith(FORCE_STR_MARK)) {
      return this.strToParse.slice(1);
    } else {
      return PARSE_FAIL_OBJ;
    }
  }

}


class DateTimeParser { // todo： 暂时不支持Jan-1这样的形式的日期字符的解析（Excel支持的）
  /**
   * @param {CalcCell} calcCell
   * @param {string} strToParse
   */
  constructor(calcCell, strToParse) {
    this.strToParse = strToParse;
    this.calcCell = calcCell; //这里没有用到
  }

  /**
   * 解析字符串
   * @return {Error|Date}
   */
  convertStrToDate() {
    let firstColonPst = this.strToParse.indexOf(MARK_OBJ.colon);
    let lastSpacePst,
      dateRes;
    if (firstColonPst > 0) { // 存在冒号
      let lastSpacePst = this.strToParse.slice(0, firstColonPst)
        .lastIndexOf(MARK_OBJ.space);
      if (lastSpacePst > 0) { // 存在date与time两个部分
        dateRes = this.convertDateStrToDate(this.strToParse.slice(0, lastSpacePst));
        if (dateRes.msg === PARSE_FAIL) {
          return PARSE_FAIL_OBJ;
        }
        let DateTimeRes = this.dealTimeString(dateRes, this.strToParse.slice(lastSpacePst + 1));
        if (DateTimeRes.msg === PARSE_FAIL) {
          return PARSE_FAIL_OBJ;
        }
        return DateTimeRes;
      } else { // 只存在time
        let DateTimeRes = this.dealTimeString(d18991230, this.strToParse.slice(lastSpacePst + 1));
        if (DateTimeRes.msg === PARSE_FAIL) {
          return PARSE_FAIL_OBJ;
        }
        return DateTimeRes;
      }
    } else {
      // 只可能存在date
      dateRes = this.convertDateStrToDate(this.strToParse.slice(0, lastSpacePst));
      if (dateRes.msg === PARSE_FAIL) {
        return PARSE_FAIL_OBJ;
      }
      return dateRes;
    }
  }

  isValidTime(aStr) {
    return /^\d+:\d+(:\d+(.\d+)?)?$/.test(aStr);
  }

  isSimpleForm(aStr) {
    return /^\d+[-/]\d+([-/]\d+)?$/.test(aStr);

  }

  isNianYueRi(aStr) {
    return /^\d+年\d+月(\d+日)?$/.test(aStr);
  }

  yearStr2Int(yearStr) {
    let theInt = parseInt(yearStr);
    // 29-2-3 ==> 2029/2/3 ; 30/2/3 ==> 1930/2/3; 100/2/3 ==> 不转换, 1899/1/1==> 不转换， 1900/1/1==> 转换
    if ((theInt >= 100 && theInt < 1900) || theInt >= 10000) {
      return PARSE_FAIL_OBJ;
    }
    return theInt;
  }

  monthStr2Int(monthStr) {
    let theInt = parseInt(monthStr);
    if (theInt >= 1 && theInt <= 12) {
      return theInt;
    }
    return PARSE_FAIL_OBJ;

  }


  convertDateStrToDate(dateStr) { // 试图解析日期
    let noSpaceStr = dateStr.replace(/\s+/g, ''); // 去掉所有空格
    let splitArray;
    if (this.isSimpleForm(noSpaceStr)) {
      splitArray = noSpaceStr.split(/[-/]/); // 用这个做切割的；之后还要做年月日的切割
    } else {
      if (this.isNianYueRi(noSpaceStr) === false) { // 使用年月日来切割
        return PARSE_FAIL_OBJ;
      } else {
        splitArray = noSpaceStr.split(/[年月日]/);
      }
    }
    let theYearInt = this.yearStr2Int(splitArray[0]);
    if (theYearInt.msg === PARSE_FAIL) {
      return PARSE_FAIL_OBJ;
    }
    let theMonthInt = this.monthStr2Int(splitArray[1]);
    if (theMonthInt.msg === PARSE_FAIL) {
      return PARSE_FAIL_OBJ;
    }
    let theDayInt;
    if (splitArray.length === 3) {
      theDayInt = parseInt(splitArray[2]);
    } else {
      theDayInt = 1;
    }
    let theDateInstance = new Date(theYearInt, theMonthInt - 1, theDayInt);
    if (isNaN(theDateInstance)) {
      return PARSE_FAIL_OBJ;
    }
    return theDateInstance;
  }

  /**
   *
   * @param {Date} theDate
   * @param timeStr
   * @return {Error}
   */
  dealTimeString(theDate, timeStr) { // 试图解析时间
    let noSpaceStr = timeStr.replace(/\s+/g, ''); // 去掉所有空格
    if (this.isValidTime(noSpaceStr) === false) {
      return PARSE_FAIL_OBJ;
    }
    let wholeStr = theDate.toLocaleDateString() + ' ' + timeStr;
    let resDate = new Date(wholeStr);
    if (isNaN(resDate)) {
      return PARSE_FAIL_OBJ;
    }
    return resDate;
  }

  parseString() { // asdf+as ;
    return this.convertStrToDate();
  }
}

class MoneyParser {
  constructor(calcCell, strToParse) {
    this.strToParse = strToParse;
    this.calcCell = calcCell; //这里没有用到
  }

  isStartWithMoneyMark() {
    return this.strToParse.startsWith(MONEY_UNIT_OBJ.dollar);
  }

  getStrToParseAsNum() { // "$  1.5  " ==> "$1.5"
    return this.strToParse.slice(1)
      .trim();
  }

  parseString() {
    if (this.isStartWithMoneyMark() === false) {
      return PARSE_FAIL_OBJ;
    }
    let newStr = this.getStrToParseAsNum();
    if (newStr.length === 0) {
      return PARSE_FAIL_OBJ;
    }
    let numParser = new Str2NumberParser(newStr);
    return numParser.easyParse2Number();
  }

}

class NumberParser {
  constructor(calcCell, strToParse) {
    this.strToParse = strToParse;
    this.calcCell = calcCell; //这里没有用到
  }

  parseString() {
    let newStr = this.strToParse.trim();
    let multiply = 1
    if(newStr.endsWith("%")){ // 处理百分号的逻辑
      newStr = newStr.slice(0,-1).trim()
      multiply = 0.01
    }
    let resNum = new Str2NumberParser(newStr).easyParse2Number();
    if(resNum.msg !== PARSE_FAIL){
      return resNum* multiply;
    }
    return PARSE_FAIL_OBJ
  }
}
