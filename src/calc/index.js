"use strict";

import { Calc } from './calc_cmd/calc';
import { allFnObj, fnNameArrayWithKey } from './calc_cmd/formula';

export let calc = {}

calc.Calc = Calc
calc.allFnObj = allFnObj
calc.fnNameArrayWithKey = fnNameArrayWithKey

export class BaseRefactorBhv {
  constructor(config) {
    this.config = config;
  }

  getArgsForNewLocAA(aUnit) {
    return [[0, 1]];
  }

  getArgsForNewLocA1(aUnit) {
    return [0, 1];
  }

  getArgsForNewLocA1B1(aUnit) {
    return [[0, 1], [2, 4]];
  }


  dealAA(aAAUnit) {
    aAAUnit.updateByNewLoc(this.getArgsForNewLocAA(aAAUnit), true);
  }

  dealA1(aA1Unit) {
    aA1Unit.updateByNewLoc(this.getArgsForNewLocA1(aA1Unit), true);
  }

  dealA1B2(aA1B2Unit) {
    aA1B2Unit.updateByNewLoc(this.getArgsForNewLocA1B1(aA1B2Unit), true);
  }

}
