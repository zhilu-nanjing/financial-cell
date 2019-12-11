import { errorObj, PARSE_FAIL, PARSE_FAIL_OBJ } from './error_config';
import { d18991230, MS_PER_DAY } from './config';


const ALL_DIGIT_PATTERN = /^\d+$/
const ALL_DIGIT_PATTERN_STR = `^\\d+$`


////////////////////////////////////  新函数 ///////////////////////////////////////////////////////
/**
 *@property {String} toParseStr
 */
export class Str2NumberParser{ // 把字符串转化为数字的类
  constructor(aStr){
    this.toParseStr = aStr
  }
  /**
   *
   * @param allowZeroNum 在起始位置允许出现的0的数量； 如果为-1，代表可以是任意多的0
   * @return {RegExp}
   */
  getIntPattern(allowZeroNum = -1) {
    let reStr;
    console.assert(Number.isInteger(allowZeroNum)) // 确认是整数
    if(allowZeroNum >= 0){
      reStr =  `^0{0,${allowZeroNum}}[1-9]\\d*$`
    }
    else{
      reStr =  ALL_DIGIT_PATTERN_STR // 纯数字即可
    }
    return new RegExp(reStr)
  }

  isIntWithCommaPattern(theStr = this.toParseStr){// 判断是否符合整数的样式; 如果是的话需要过滤逗号
    // 000,123 --> 不行， 0001,123 --> 可以
    return /^0*[1-9]\d*(,\d{3})+$/.test(theStr)
  }

  isFloatWithCommaPattern(theStr = this.toParseStr){// 判断是否符合整数的样式; 如果是的话需要过滤逗号
    // 000,123 --> 不行， 0001,123 --> 可以
    return /^0*[1-9]\d*(,\d{3})+(\.\d+)?$/.test(theStr)
  }


  isIntPattern(allowZeroNum = -1, theStr = this.toParseStr){ // 判断是否符合整数的样式
    return this.getIntPattern(allowZeroNum).test(theStr)
  }

  isDecimalPart(theStr){
    return theStr!== "" && this.isIntPattern(-1, theStr) === false
  }

  isFloatPattern(theStr){
    return /^\d*(\.\d+)?$/.test(theStr)
  }

  parseAllDigitStr2Int(allowZeroNum  = -1, theStr = this.toParseStr){
    if(theStr === "0"){
      return 0
    }
    if(this.isIntWithCommaPattern(theStr)){
      return parseInt(theStr.replace(",",""))
    }
    if(this.isIntPattern(allowZeroNum)){
      return parseInt(theStr)
    }
    return PARSE_FAIL_OBJ
  }

  parseScientificNotion2Float(theStr = this.toParseStr){
    // 解析科学计数法, Excel限制数字最大为1e307，这里没有显示
    // 0001.2e12 -> 1.2e+12 ; 1.2e-12 -> 1.2e-12
    let splitByE = theStr.split(/[eE]/)
    if(splitByE.length!==2 ){
      return PARSE_FAIL_OBJ
    }
    if(this.isFloatWithCommaPattern(splitByE[0])){
      theStr = theStr.replace(/,/g,"")
    }
    else if(this.isFloatPattern(splitByE[0]) === false){
      return PARSE_FAIL_OBJ} // 不符合要求
    let powerPart = splitByE[1]
    if(['+',"-"].indexOf(powerPart[0]) > -1){
      powerPart = powerPart.slice(1)
    }
    if(this.isIntPattern(-1, powerPart) === false){
      return PARSE_FAIL_OBJ
    }
    return parseFloat(theStr)
  }

  parseStr2Float(allowZeroNum  = -1, theStr = this.toParseStr){ // 字符串转化为浮点数; 如果是空格的话会返回false
    let splitByDotArray = theStr.split(".")
    if(splitByDotArray.length > 2){
      return PARSE_FAIL_OBJ
    }
    // 判断整数部分
    if(this.isFloatWithCommaPattern(splitByDotArray[0])){
      splitByDotArray[0] = splitByDotArray[0].replace(/,/g,"")
    }else if(this.isIntPattern(allowZeroNum, theStr) === false){
      return PARSE_FAIL_OBJ
    }

    // 判断小数部分
    if(splitByDotArray.length === 2 && this.isDecimalPart(splitByDotArray[1]) === false){
      return PARSE_FAIL_OBJ
        }
    return parseFloat(theStr)
    }

    easyParse2Number(){
    let res = this.parseScientificNotion2Float()
      if(res.msg!== PARSE_FAIL){
        return res
      }
      res = this.parseAllDigitStr2Int()
      if(res.msg!== PARSE_FAIL){
        return res
      }
      res = this.parseStr2Float()
      return res
    }

}






















////////////////////////////////////  老函数 ///////////////////////////////////////////////////////
export function days_str2date(date) { // "20156" -> Date()
  let theDate
  if (!isNaN(date)) {
    if (date instanceof Date) {
      theDate = date;
    }
    let d = parseInt(date, 10);
    if (d < 0) {
      return errorObj.ERROR_NUM;
    }
    theDate = new Date(d18991230.getTime() + d  * MS_PER_DAY);
  }
  if (typeof date === 'string') {
    theDate = new Date(date);
    if (!isNaN(date)) {
      theDate = date;
    }
  }
  if(theDate instanceof Date){
    return theDate
  }
  return errorObj.ERROR_VALUE;
}
//XW:{}中参数解析,将{1,2,3；4,5,6}这样的参数解析为数组结构
export function str2int(arg) {
  if(!isNaN(parseInt(arg))){
    return parseInt(arg)
  }
  return arg.replace('"', '').replace('"', '') // todo: 这个replace是对的么？
}

//XW：end
//XW: 将参数解析成数字数组，若有不符合要求的报错，default0忽略
export function parse(a) {
  if (a instanceof Error) {
    return a;
  }
  if (a instanceof Array) {
    let arr = [];
    for (let i = 0; i < a.length; i++) {
      if (typeof a[i][0] === 'string' && a[i][0] !== 'default_0') {
        return errorObj.ERROR_NAME;
      }
      if (typeof a[i][0] === 'number') {
        arr.push(a[i][0]);
      }
      if (a[i][0] instanceof Object) {
        return errorObj.ERROR_NAME;
      }
    }
    return arr;
  }
  if (typeof a === 'string') {
    if (a === 'default_0') {
      return 'pass';
    } else {
      return errorObj.ERROR_NAME;
    }
  }
  if (typeof a === 'number') {
    return a;
  }
}

export function parseBool(bool) {
  if (bool === undefined) {
    return true;
  }
  if (typeof bool === 'boolean') {
    return bool;
  }

  if (bool instanceof Error) {
    return bool;
  }

  if (typeof bool === 'number') {
    return bool !== 0;
  }

  if (typeof bool === 'string') {
    let up = bool.toUpperCase();
    if (up === 'TRUE') {
      return true;
    }

    if (up === 'FALSE') {
      return false;
    }
  }

  if (bool instanceof Date && !isNaN(bool)) {
    return true;
  }

  return errorObj.ERROR_VALUE;
}

export function parseNumber(string) {
  if (string === undefined || string === '') {
    return errorObj.ERROR_VALUE;
  }
  if (!isNaN(string)) {
    return parseFloat(string);
  }
  return errorObj.ERROR_VALUE;
}

export function parseNumberArray(arr) {
  let len;
  if (!arr || (len = arr.length) === 0) {
    return errorObj.ERROR_VALUE;
  }
  let parsed;
  while (len--) {
    parsed = parseNumber(arr[len]);
    if (parsed === errorObj.ERROR_VALUE) {
      return parsed;
    }
    arr[len] = parsed;
  }
  return arr;
}

export function parseMatrix(matrix) {
  let n;
  if (!matrix || (n = matrix.length) === 0) {
    return errorObj.ERROR_VALUE;
  }
  let pnarr;
  for (let i = 0; i < matrix.length; i++) {
    pnarr = parseNumberArray(matrix[i]);
    matrix[i] = pnarr;
    if (pnarr instanceof Error) {
      return pnarr;
    }
  }
  return matrix;
}


export function parseDateArray(arr) {
  let len = arr.length;
  let parsed;
  while (len--) {
    parsed = days_str2date(arr[len]);
    if (parsed === errorObj.ERROR_VALUE) {
      return parsed;
    }
    arr[len] = parsed;
  }
  return arr;
}
