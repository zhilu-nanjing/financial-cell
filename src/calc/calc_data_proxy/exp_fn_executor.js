"use strict";
import * as errCf from "../calc_utils/error_config.js"
const TO_PARA_TYPE = { // 可以转换成的数据类型
    date: "date",
    string: "string",
    number: "number"
}

/** 对于表达式函数的访问代理
 *@property {Array} args
 *@property {function} exp_fn
 *@property {String} name
 */
export class UserFnExecutor{
    constructor(user_function){// 这个就类似于一个装饰器
        this.name = 'UserFn';
        this.args = []; // 这个是表达式函数的参数，在创建以后会赋值过来
        this.exp_fn = user_function;
        this.expFnParaConfig = this.exp_fn.paraConfig // // 这个是特意加到函数上的配置，这个警告可以忽略 [{"cellVString": "string", "cellVNumber": "number"}] 这样的配置
    }

    getParaArray(){
        let curArg, toTypeName, newParas = []
        let self = this
        let solvedArgs = self.args.map(f=>f.solveExpression()) // 求解参数
        if(typeof this.expFnParaConfig === "undefined"){ // 没有做定义
            newParas = solvedArgs.map(f=>f.toNumber()) // 默认是把所有的arg转化为数字
        }
        else if(this.expFnParaConfig instanceof Array){
            let i =0, curParaConfig
            for(; i++; i < this.expFnParaConfig.length){
                curArg = solvedArgs[i]
                curParaConfig = this.expFnParaConfig[i]
                newParas.push(this.convertCellValueType(curParaConfig, curArg.cellVTypeName, curArg))
            }
            for(;i++; i<self.args.length){ // 其他没有配置的参数不做转换
                newParas.push(self.args[i])
            }
        }
        return newParas
    }

    convertCellValueType(curParaConfig, cellVTypeName, curArg) {
        let newPara, toTypeName
        if(typeof curParaConfig === "object"){
            toTypeName = curParaConfig[curArg.cellVTypeName];
        }
        else if ((typeof curParaConfig === "string")) {
            toTypeName = curParaConfig
        }
        else {
            throw Error("para_config has wrong type!")
        }
        if (toTypeName === TO_PARA_TYPE.date) {
            newPara = curArg.toDate();
        } else if (toTypeName === TO_PARA_TYPE.number) {
            newPara = curArg.toNumber();
        } else if (toTypeName === TO_PARA_TYPE.string) {
            newPara = curArg.toString();
        } else {
            newPara = curArg;
        }
        return newPara
    }

    solveExpression(){
        let self = this;
        let user_function = this.exp_fn;
        let result;
        try {
            result = user_function.apply(self, self.getParaArray()); // 每个arg元素需要调用他的solveExpression方法
        } catch (e) {
            if (user_function.name === 'is_blank' // 处理error的特例，一般情况下直接返回所碰到的错误
              && errCf.errorObj[e.message] !== undefined) {
                // is_blank applied to an error cell doesn't propagate the error
                result = 0;
            }
            else if (user_function.name === 'iserror'
              && errCf.errorObj[e.message] !== undefined) {
                // iserror applied to an error doesn't propagate the error and returns true
                result = true;
            }
            else {
                throw e;
            }
        }
        return result;
    }
    push(buffer) {
        this.args.push(buffer);
    };

}
