"use strict";

export class UserRawFnExecutor {
    constructor(user_function){
        let self = this;
        self.name = 'UserRawFn';
        self.args = [];
        self.user_function = user_function;

    }
    solveExpression(){
        return this.user_function.apply(this, this.args);
    };
    push(buffer) {
        this.args.push(buffer);
    };
}
