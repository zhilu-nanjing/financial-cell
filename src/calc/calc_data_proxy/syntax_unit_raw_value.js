"use strict";

import { RAW_VALUE } from '../calc_utils/config';

export class RawValue{
    constructor(value){
        this.value = value
        this.unitType = RAW_VALUE
    };
    setValue(v) {
        this.value = v;
    };
    solveExpression() {
        return this.value;
    };
};

