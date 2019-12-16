import {
  ALL_DIGIT_PATTERN_STR,
  CLEAN_FLOAT_PATTERN,
  E_PATTERN,
  FLOAT_WITH_COMMA_PATTERN,
  INT_WITH_COMMA_PATTERN
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

export class RawValueParser { // 解析为数字或字符串，字符串是以双引号开始与结尾的
  constructor(aStr) {
    this.toParseStr = aStr.trim(); // 需要把首尾空格去掉
  }

  parse2String(){
    let newStr = this.toParseStr.slice(1, -1).replace('""','"')
    if(newStr.includes('"')){
      return PARSE_FAIL
    }
    else{return newStr}
  }

  parse2NumberOrString(){
    if(this.toParseStr[0] === '"' && this.toParseStr[this.toParseStr.length -1] ===  '"'){
      return this.parse2String
    }
    else {return new Str2NumberParser(this.toParseStr).easyParse2Number()}
  }
}
