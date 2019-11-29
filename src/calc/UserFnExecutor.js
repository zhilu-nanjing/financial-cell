"use strict";

class UserFnExecutor{
    constructor(user_function){
        let self = this;
        self.name = 'UserFn';
        self.args = [];
        self.user_function = user_function;
    }
    calc(){
        let self = this;
        let user_function = this.user_function;
        let errorValues = {
            '#NULL!': 0x00,
            '#DIV/0!': 0x07,
            '#VALUE!': 0x0F,
            '#REF!': 0x17,
            '#NAME?': 0x1D,
            '#NUM!': 0x24,
            '#N/A': 0x2A,
            '#GETTING_DATA': 0x2B
        }, result;
        try {
            result = user_function.apply(self, self.args.map(f=>f.calc()));
        } catch (e) {
            if (user_function.name === 'is_blank'
              && errorValues[e.message] !== undefined) {
                // is_blank applied to an error cell doesn't propagate the error
                result = 0;
            }
            else if (user_function.name === 'iserror'
              && errorValues[e.message] !== undefined) {
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
module.exports = UserFnExecutor;
