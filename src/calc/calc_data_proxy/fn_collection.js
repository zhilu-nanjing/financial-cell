// todo: 需要把FLOOR.MATH这样的公式解析为FLOOR_MATH这样的函数

import { UserRawFnExecutor } from './exp_raw_fn_executor';
import { UserFnExecutor } from './exp_fn_executor';

export class FnCollection { // 封装的统一管理exp_fn的函数。
  constructor() {
    this.fnObj = {};
  }

  /**
   * @param toAddFnObj
   * @param ignoreDuplicate 是否允许重复定义通用的fn_name
   * @param prefix: exp_fn的key值上需要加入的前缀
   */
  addFnObj(toAddFnObj, ignoreDuplicate = true, prefix = "") {
    let fnName;
    for (fnName of Object.getOwnPropertyNames(toAddFnObj)) {
      let toAddFnName = prefix + fnName
      if (toAddFnName in this.fnObj) { // 重复的fn名字
        if (ignoreDuplicate === true) {
          continue;
        } else {
          throw new Error('define fn again:', fnName);
        }
      }
      let curFunc = toAddFnObj[fnName];
      if(typeof curFunc === "function"){
        this.fnObj[toAddFnName] = toAddFnObj[fnName];
      }
      else {
        this.addFnObj(toAddFnObj[fnName], ignoreDuplicate, fnName + "."); // fnName加一个点作为前缀
      }
    }
  }

  updateFnObj(toAddFnObj) { // 允许重复定义，后面的定义会覆盖之前的定义
    let fnName;
    for (fnName of Object.getOwnPropertyNames(toAddFnObj)) {
      this.fnObj[fnName] = toAddFnObj[fnName];
    }
  }

  addFnObjArray(fnObjArray) {
    for (let fnObj of fnObjArray) {
      this.addFnObj(fnObj);
    }
  }

  getExpFunction(fnName) { // 如果找不到这个fnName返回obj，能找到的话返回一个函数
    if(fnName in this.fnObj === false){
      return {'isEmpty': true}
    }
    let expFunction = this.fnObj[fnName];
    console.assert(typeof expFunction === 'function');
    return expFunction
  }

}

/**
 * 访问多个fn集合的代理变量
 */
export class MultiCollExpFn {
  constructor(normal_fn_coll, raw_fn_coll) {
    this.normal_fn_coll = normal_fn_coll; // 属于FnCollection类
    this.raw_fn_coll = raw_fn_coll;
    this.fnType2FnExecutor = {'raw': UserRawFnExecutor, 'normal': UserFnExecutor}
  }
  getFnExecutorByName(fnName){
    let fnType
    let self = this
    let foundExpFn = this.raw_fn_coll.getExpFunction(fnName); // this.xlsx_raw_Fx = {OFFSET; IFERROR; IF; AND}
    if (typeof foundExpFn === 'function') {
      fnType = 'raw'
    }
    else{
      foundExpFn = this.normal_fn_coll.getExpFunction(fnName);
      if (typeof foundExpFn === 'function') {
        fnType = 'normal'
      }
      else{
        // 到这一步是exp_fn没有找到
        throw new Error('"' + self.formulaProxy.sheet_name + '"!' + self.formulaProxy.name + ': expression function ' + self.buffer + ' not found');
      }
    }
    return new self.fnType2FnExecutor[fnType](foundExpFn) // 找到了函数
  }

  getAllFnObj(){
    let allFnObj = {}
    Object.assign(allFnObj, this.raw_fn_coll.fnObj)
    Object.assign(allFnObj, this.normal_fn_coll.fnObj)
  }
}
