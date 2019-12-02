"use strict";

export class RawValue{
    constructor(value){
        this.value = value
    };
    setValue(v) {
        this.value = v;
    };
    calc() {
        return this.value;
    };
};
