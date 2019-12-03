"use strict";
import cf from "../calc_utils/config.js"
export class UserFnExecutor{
    constructor(user_function){
        let self = this;
        self.name = 'UserFn';
        self.args = [];
        self.user_function = user_function;
    }
    solveExpression(){
        let self = this;
        let user_function = this.user_function;
        let result;
        try {
            result = user_function.apply(self, self.args.map(f=>f.solveExpression())); // 每个arg元素需要调用他的solveExpression方法
        } catch (e) {
            if (user_function.name === 'is_blank' // 处理error的特例，一般情况下直接返回所碰到的错误
              && cf.errorValues[e.message] !== undefined) {
                // is_blank applied to an error cell doesn't propagate the error
                result = 0;
            }
            else if (user_function.name === 'iserror'
              && cf.errorValues[e.message] !== undefined) {
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
