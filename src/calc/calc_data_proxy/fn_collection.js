// todo: 需要把FLOOR.MATH这样的公式解析为FLOOR_MATH这样的函数

import { UserRawFnExecutor } from './exp_raw_fn_executor';
import { UserFnExecutor } from './exp_fn_executor';
import { BaseExpFunction } from './exp_function_proxy';

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
      if( (typeof curFunc === "function")||(curFunc instanceof BaseExpFunction)){
        this.fnObj[toAddFnName] = toAddFnObj[fnName];
      }
      else if(typeof curFunc === "object"){
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
    this.rawFnExecutor = UserRawFnExecutor;
    this.normalFnExecutor = UserFnExecutor;
  }
  isValidExpFn(foundExpFn){
    return typeof foundExpFn === 'function' || foundExpFn instanceof BaseExpFunction
  }

  getFnExecutorByName(fnName, isToUpperCase = true){
    let fnType
    fnName = isToUpperCase? fnName.toUpperCase(): fnName // 转换为大写
    let foundExpFn = this.raw_fn_coll.getExpFunction(fnName); // this.xlsx_raw_Fx = {OFFSET; IFERROR; IF; AND}
    if (this.isValidExpFn(foundExpFn)) {
      return new this.rawFnExecutor(foundExpFn)

    }
    else{
      foundExpFn = this.normal_fn_coll.getExpFunction(fnName);
      if (this.isValidExpFn(foundExpFn)) {
        return new this.normalFnExecutor(foundExpFn) // UserFnExecutor
      }
      else{
        // 到这一步是exp_fn没有找到
        return  new Error(' expression function ' + fnName + ' not found');
      }
    }
  }

  getAllFnObj(){
    let allFnObj = {}
    Object.assign(allFnObj, this.raw_fn_coll.fnObj)
    Object.assign(allFnObj, this.normal_fn_coll.fnObj)
    return allFnObj
  }
}
