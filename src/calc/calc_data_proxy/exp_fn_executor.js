"use strict";
import { BaseExpFunction } from './exp_function_warp';

// 不转换


/** 对于表达式函数的访问代理
 *@property {Array} args
 *@property {BaseExpFunction} exp_fn
 *@property {String} name
 */
export class UserFnExecutor{
    constructor(user_function, args = []){// 这个就类似于一个装饰器
        this.name = 'UserFn';
        this.args = args; // 这个是表达式函数的参数，在创建以后会赋值过来
        if (typeof user_function === "function"){ // 默认使用BaseExpFunction来封装
            this.exp_fn = new BaseExpFunction(user_function)
        }
        else{
            this.exp_fn = user_function;
        }
    }

    push(buffer) {
        this.args.push(buffer);
    };

    solveExpression(){
        return this.exp_fn.solveExpression(this.args)
    }
}



export function easySolve(func, args){
    let userFnExecutor = new UserFnExecutor(func, args)
    return userFnExecutor.solveExpression()
}
