"use strict";
import { TO_PARA_TYPE } from '../calc_utils/config';
const NOT_CONVERT = "NOT_CONVERT"; // 不转换


/** 对于表达式函数的访问代理
 *@property {Array} args
 *@property {BaseExpFunction} exp_fn
 *@property {String} name
 */
export class UserFnExecutor{
    constructor(user_function, args = []){// 这个就类似于一个装饰器
        this.name = 'UserFn';
        this.args = args; // 这个是表达式函数的参数，在创建以后会赋值过来
        if (typeof user_function === "function"){ // 兼容函数
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

export class BaseExpFunction{ // 默认行为; 如果不符合默认行为的函数，需要继承这个类，然后写相关逻辑。
    constructor(user_function){
        this.isAllowErrorArg = this.getIsAllowErrorArg()
        this.expFnArgConfig = this.getExpFnArgConfig()
        this.user_function = user_function
    }

    getIsAllowErrorArg(){
        return false
    }
    getExpFnArgConfig(){ // 默认没有任何配置

    }

    expresionFunc(args){ // 需要实现这个方法
        return this.user_function(args)
    }

    updateArgArray(){
        let curArg, toTypeName, newArgs = []
        let self = this
        let solvedArgs = self.args.map(f=>f.solveExpression()) // 求解参数
        // 对参数进行类型转化
        let newArg, errorArg = this.errorArg;
        if(typeof this.expFnArgConfig === "undefined"){ // 没有类型转换方式配置
            newArgs = solvedArgs.map(arg=> {newArg = this.convertToStringAndNumber(arg);
                if(newArg instanceof  Error === true){errorArg = newArg}
                return newArg}) // 默认是把所有的arg转化为数字
        }
        else if(this.expFnArgConfig instanceof Array){// 有类型转化方式配置
            let i =0, curArgConfig
            for(; i++; i < this.expFnArgConfig.length){
                curArg = solvedArgs[i]
                curArgConfig = this.expFnArgConfig[i]
                newArg = this.convertCellValueType(curArgConfig, curArg.cellVTypeName, curArg)
                if(newArg instanceof  Error === true){errorArg = newArg}
                newArgs.push(newArg)
            }
            for(;i++; i<self.args.length){ // 其他没有配置的参数不做转换
                newArgs.push(self.args[i])
            }
        }
        else {
            throw new Error("expFnArgConfig")
        }
        // 如果newArgs中存在error类型则直接返回error
        this.errorArg = errorArg
        return newArgs
    }
    convertCellValueType(curArgConfig, cellVTypeName, curArg) {
        let newArg, toTypeName
        if(curArgConfig === NOT_CONVERT){ // 设置为不转换
            return curArg
        }
        if(typeof curArgConfig === "object"){
            toTypeName = curArgConfig[curArg.cellVTypeName];
        }
        else if ((typeof curArgConfig === "string")) {
            toTypeName = curArgConfig
        }
        else {
            throw Error("arg_config has wrong type!")
        }
        if (toTypeName === TO_PARA_TYPE.date) {
            newArg = curArg.toDate();
        } else if (toTypeName === TO_PARA_TYPE.number) {
            newArg = curArg.toNumber();
        } else if (toTypeName === TO_PARA_TYPE.string) {
            newArg = curArg.toString();
        } else {
            newArg = curArg;
        }
        return newArg
    }


    convertToStringAndNumber(arg){ // 这个是函数参数默认转换方式
        let cellVType = arg.cellVTypeName
        if(["string","number"].includes(typeof cellVType)){
            return arg
        }
        else {
            return arg.toNumberOrString() // 转换; 如果遇到其他的一些数据类型会报错
        }
    }

// todo: ['ISBLANK','ISERROR',"ifError"]处理error不返回所碰到的错误
    solveExpresion(){ // 核心的对外接口
        let self = this;
            let newArgArray = self.updateArgArray()// 每个arg元素需要调用他的solveExpression方法
            if(isNaN(this.errorArg) || this.isAllowErrorArg){ // 参数中没有错误的处理
                return this.expresionFunc(newArgArray)
            }
            else {
                return this.errorArg // 参数中存在参数一般直接报错
            }
    }
}

export class AllowErrorExpFunction extends BaseExpFunction{
    getIsAllowErrorArg(){
        return true
    }
}
