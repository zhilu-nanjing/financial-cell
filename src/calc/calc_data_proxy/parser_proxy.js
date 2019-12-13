////////////////////////////////////  新函数 ///////////////////////////////////////////////////////
import {
  ALL_DIGIT_PATTERN_STR,
  CLEAN_FLOAT_PATTERN,
  d18991230,
  d18991230STR,
  E_PATTERN,
  FLOAT_WITH_COMMA_PATTERN,
  FORCE_STR_MARK,
  INT_WITH_COMMA_PATTERN,
  MARK_OBJ,
  MONEY_UNIT_OBJ
} from '../calc_utils/config';
import { PARSE_FAIL, PARSE_FAIL_OBJ } from '../calc_utils/error_config';

/**
 *@property {String} toParseStr
 */
export class Str2NumberParser { // 把字符串转化为数字的类
  constructor(aStr) {
    this.toParseStr = aStr;
  }

  /**
   *
   * @param allowZeroNum 在起始位置允许出现的0的数量； 如果为-1，代表可以是任意多的0
   * @return {RegExp}
   */
  getIntPattern(allowZeroNum = -1) {
    let reStr;
    console.assert(Number.isInteger(allowZeroNum)); // 确认是整数
    if (allowZeroNum >= 0) {
      reStr = `^0{0,${allowZeroNum}}[1-9]\\d*$`;
    } else {
      reStr = ALL_DIGIT_PATTERN_STR; // 纯数字即可
    }
    return new RegExp(reStr);
  }

  isIntWithCommaPattern(theStr = this.toParseStr) {// 判断是否符合整数的样式; 如果是的话需要过滤逗号
    // 000,123 --> 不行， 0001,123 --> 可以

    return INT_WITH_COMMA_PATTERN.test(theStr);
  }

  isFloatWithCommaPattern(theStr = this.toParseStr) {// 判断是否符合整数的样式; 如果是的话需要过滤逗号
    // 000,123 --> 不行， 0001,123 --> 可以
    return FLOAT_WITH_COMMA_PATTERN.test(theStr);
  }


  isIntPattern(allowZeroNum = -1, theStr = this.toParseStr) { // 判断是否符合整数的样式
    return this.getIntPattern(allowZeroNum)
      .test(theStr);
  }

  isDecimalPart(theStr) {
    return theStr !== '' && this.isIntPattern(-1, theStr) === false;
  }

  isFloatPattern(theStr) {
    return CLEAN_FLOAT_PATTERN.test(theStr);
  }

  parseAllDigitStr2Int(allowZeroNum = -1, theStr = this.toParseStr) {
    if (theStr === '0') {
      return 0;
    }
    if (this.isIntWithCommaPattern(theStr)) {
      return parseInt(theStr.replace(',', ''));
    }
    if (this.isIntPattern(allowZeroNum)) {
      return parseInt(theStr);
    }
    return PARSE_FAIL_OBJ;
  }

  parseScientificNotion2Float(theStr = this.toParseStr) {
    // 解析科学计数法, Excel限制数字最大为1e307，这里没有显示
    // 0001.2e12 -> 1.2e+12 ; 1.2e-12 -> 1.2e-12
    let splitByE = theStr.split(E_PATTERN);
    if (splitByE.length !== 2) {
      return PARSE_FAIL_OBJ;
    }
    if (this.isFloatWithCommaPattern(splitByE[0])) {
      theStr = theStr.replace(/,/g, '');
    } else if (this.isFloatPattern(splitByE[0]) === false) {
      return PARSE_FAIL_OBJ;
    } // 不符合要求
    let powerPart = splitByE[1];
    if (['+', '-'].indexOf(powerPart[0]) > -1) {
      powerPart = powerPart.slice(1);
    }
    if (this.isIntPattern(-1, powerPart) === false) {
      return PARSE_FAIL_OBJ;
    }
    return parseFloat(theStr);
  }

  parseStr2Float(allowZeroNum = -1, theStr = this.toParseStr) { // 字符串转化为浮点数; 如果是空格的话会返回false
    let splitByDotArray = theStr.split('.');
    if (splitByDotArray.length > 2) {
      return PARSE_FAIL_OBJ;
    }
    // 判断整数部分
    if (this.isFloatWithCommaPattern(splitByDotArray[0])) {
      splitByDotArray[0] = splitByDotArray[0].replace(/,/g, '');
    } else if (this.isIntPattern(allowZeroNum, theStr) === false) {
      return PARSE_FAIL_OBJ;
    }

    // 判断小数部分
    if (splitByDotArray.length === 2 && this.isDecimalPart(splitByDotArray[1]) === false) {
      return PARSE_FAIL_OBJ;
    }
    return parseFloat(theStr);
  }

  easyParse2Number() {
    let res = this.parseScientificNotion2Float();
    if (res.msg !== PARSE_FAIL) {
      return res;
    }
    res = this.parseAllDigitStr2Int();
    if (res.msg !== PARSE_FAIL) {
      return res;
    }
    res = this.parseStr2Float();
    return res;
  }
}

export class ForceString {
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

export class DateTimeParser { // todo： 暂时不支持Jan-1这样的形式的日期字符的解析（Excel支持的）
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
        let DateTimeRes = this.dealTimeString(d18991230MS, this.strToParse.slice(lastSpacePst + 1));
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
   * @param {Date} dateString
   * @param timeStr
   * @return {Error}
   */
  dealTimeString(dateString, timeStr) { // 试图解析时间
    let noSpaceStr = timeStr.replace(/\s+/g, ''); // 去掉所有空格
    if (this.isValidTime(noSpaceStr) === false) {
      return PARSE_FAIL_OBJ;
    }
    let wholeStr = dateString + ' ' + timeStr;
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

export class MoneyParser {
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

export class NumberParser {
  constructor(calcCell, strToParse) {
    this.strToParse = strToParse;
    this.calcCell = calcCell; //这里没有用到
  }

  parseString() {
    let newStr = this.strToParse.trim();
    let multiply = 1;
    if (newStr.endsWith('%')) { // 处理百分号的逻辑
      newStr = newStr.slice(0, -1)
        .trim();
      multiply = 0.01;
    }
    let resNum = new Str2NumberParser(newStr).easyParse2Number();
    if (resNum.msg !== PARSE_FAIL) {
      return resNum * multiply;
    }
    return PARSE_FAIL_OBJ;
  }
}
