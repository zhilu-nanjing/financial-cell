import * as cf from '../calc_utils/config';
import { d18991230MS, d18991230STR } from '../calc_utils/config';
import {
  ERROR_VALUE,
  PARSE_FAIL_OBJ,
  reportConvertFail,
  reportError
} from '../calc_utils/error_config';
import { dayNum2Date } from '../calc_utils/parse_helper';

// 如果格式转化失败，会调用reportConvertFail方法来汇报错误
/**
 * 代表一个日期概念
 * @property {Date} dateInstance
 */
export class CellVDateTime{ // 单元格值的值属性
  constructor(aDate){ // 加法, 加入天数
    this.dateInstance = aDate
    this.isCellV = true
    this.cellVTypeName = "CellVDateTime"
  };


  subtractOther(other){
    // 两个日期之间的差
    console.assert( other instanceof CellVDateTime)
    return this.toNumber() - other.toNumber()
  }
  toString(){
    return this.dateInstance.toLocaleDateString("Chinese")
  }
  toNumber(){ // 转化为数字，逻辑与Excel保持一致
    let diff = (this.dateInstance.getTime() - d18991230MS)
    return diff / cf.MS_PER_DAY;
  }
  toDate(){
    return this.dateInstance
  }
  toNumberOrString(){
    return this.toNumber()
  }

  /**
   *
   * @return {CellVEmpty}
   */
  getACopy(){
    return new CellVEmpty(this.dateInstance)
  }
}

/**
 * 代表一个Error
 * @property {Error} errInstance
 */
export class CellVError {
  constructor(errInstance) {
    this.err = errInstance; //
    this.isCellV = true
    this.cellVTypeName = "CellVError"
  }

  toNumber() {
    return this.err; // 报错
  }

  toString() {
    return this.err.message; // 把error信息拿到
  }

  toDate() {
    return this.err; // 报错
  }

  toObject(){
    return {msg: this.err.message, isError: true} // 转化为一个objct
  }

  toNumberOrString(){
    return this.toString()
  }

}

/**
 * 代表一个空值，空值在运算的时候可以转化为0，或一个空字符串，或者在average中不进入计算
 */
export class CellVEmpty {
  constructor() {
    this.isCellV = true
    this.cellVTypeName = "CellVEmpty"
  }

  toString() {
    return '';
  }

  toNumber() {
    return 0;
  }

  toDate(){
    return new Date(d18991230STR)
  }
  toNumberOrString(){
    return this.toNumber()
  }

}

/**
 * @property {Number} number
 */
export class CellVNumber{
  constructor(aNum){
    this.number = aNum
    this.isCellV = true
    this.cellVTypeName = "CellVNumber"
  }
  toNumber(){
    return this.number
  }
  toString(){
    return String(parseFloat(this.number.toPrecision(6))) // 转化为字符串,保留6位有效数字，去掉末尾的0
  }

  toStringWithDecimal(decimal_num = 2){
    return this.number.toFixed(decimal_num)// 转化为字符串,保留decimal_num那么位小数
  }

  toDate(){ // 转化日期
    return dayNum2Date(this.number)
  }
  toNumberOrString(){
    return this.toNumber()
  }

}

/**
 * @property {String} theString
 */
export class CellVString{
  constructor(aString){
    this.theString = aString
    this.isCellV = true
    this.cellVTypeName = "CellVString"
  }
  toNumber(){
    let theRes = parseFloat(this.theString) // 转化为浮点数
    return isNaN(theRes)? PARSE_FAIL_OBJ:res
  }
  toString(){
    return this.theString // 转化为字符串
  }// 只支持2019/01/01这样的形式； Excel中不支持直接用字符串的方式输入日期

  toDate(){
    let theDate = Date(this.theString)
    return isNaN(theDate.getTime()) ? PARSE_FAIL_OBJ:theDate
  }
  toNumberOrString(){
    return this.toString()
  }

}

/**
 * 代表一个超链接类型
 */
export class CellVHyperLink{
  constructor(linkStr, showStr = ""){
    this.isCellV = true
    this.cellVTypeName = "CellVHyperLink"
    this.linkStr = linkStr
    if(showStr === ""){
      this.showStr = linkStr
    }
    else {
      this.showStr = showStr
    }
  }

  toString(){
    return this.showStr
  }
  toNumber(){
    let res =  parseInt(this.showStr)
    return isNaN(res)? PARSE_FAIL_OBJ:res
  }
  toDate(){
    let res =   dayNum2Date(this.toNumber())
    return isNaN(res)? PARSE_FAIL_OBJ:res
  }
  joinWithStr(aStr){
    this.showStr = this.showStr + aStr
    this.linkStr = this.linkStr + aStr
  }
  toNumberOrString(){
    return this.toString()
  }

}

/**
 * @property {Boolean} aBool
 */
export class CellVBool{
  constructor(aBool){
    this.aBool = aBool
    this.isCellV = true
    this.cellVTypeName = "CellVBool"


  }
  toNumber(){
    return this.aBool? 1 : 0
  }
  toString(){
    return this.aBool.toString().toUpperCase()
  }
  toDate(){
    return dayNum2Date(this.toNumber())
  }
  toNumberOrString(){
    return this.toNumber()
  }

}


/** todo: 未来可以做成多值函数
 * @property {Array} aArray
 */
export class CellVArray{
  constructor(aArray){
    this.aArray = aArray // 最多支持2维数组
    this.isCellV = true
    this.cellVTypeName = "CellVArray"
  }
  applyToAll(func){
    return this.aArray.map(f =>{
      if(f instanceof Array){
        return f.map(func)
      }
      else {
        return func(f)
      }
    })
  }
  toNumber(){
    return this.applyToAll(aValue => {let res;
    try{
      return  aValue.toNumber();
    }
    catch (e) {
      return reportConvertFail(this)
    }
    }) // 转化为浮点数
  }
  toString(){
    return  this.applyToAll(aValue => aValue.toString()) // 转化为字符串
  }// 只支持2019/01/01这样的形式； Excel中不支持直接用字符串的方式输入日期
  toDate(){
    return  this.applyToAll(aValue => aValue.toDate())
  }
  toNumberOrString(){
    return this.applyToAll(aValue => aValue.toNumberOrString())
  }
}



export function convertToCellV(originValue){
  if(originValue instanceof Date){
    return new CellVDateTime(originValue)
  }
  else if (typeof originValue === "string"){
    return new CellVString(originValue)
  }
  else if (originValue instanceof Array){
    return new CellVArray(originValue)
  }
  else if (typeof originValue === 'number' && !isNaN(originValue)){
    return new CellVNumber(originValue)
  }
  else if (typeof originValue === 'boolean'){ // 布尔类型
    return new CellVBool(originValue)
  }
  if(originValue.isCellV === true){
    return originValue // 不进行转换
  }
  else {
    reportError(ERROR_VALUE) // 无法返回cellV的类型
  }
}

