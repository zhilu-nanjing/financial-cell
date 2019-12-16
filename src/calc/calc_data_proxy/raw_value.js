"use strict";

export class RawValue{
    constructor(value){
        this.value = value
    };
    setValue(v) {
        this.value = v;
    };
    solveExpression() {
        return this.value;
    };
};

/**
 * 直接写出来的数组，例如：{1,3,4}
 */
export class RawArray {
    constructor(rawStr) {
        this.rawStr = rawStr;
    }

    solveExpression() { // 得到结果

    }

}
