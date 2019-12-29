"use strict";

import { Calc } from './calc_cmd/calc';
import { allFnObj, fnNameArrayWithKey } from './calc_cmd/formula';

export let calc = {}

calc.Calc = Calc
calc.allFnObj = allFnObj
calc.fnNameArrayWithKey = fnNameArrayWithKey

export class UserMoveRefactorBhv{
  constructor(argsForAA, argsForA1, argsForA1B2) {
    this.argsForAA = argsForAA
    this.argsForA1 = argsForA1
    this.argsForA1B2 = argsForA1B2
  }
  getArgsForAAUnit(aUnit) {
    return this.argsForAA;
  }

  getArgsForA1Unit(aUnit) {
    return this.argsForA1
  }

  getArgsForA1B1Unit(aUnit) {
    return this.argsForA1B2
  }

  dealAA(aAAUnit) {
    aAAUnit.updateByUserMove(this.getArgsForAAUnit(aAAUnit), true);
  }

  dealA1(aA1Unit) {
    aA1Unit.updateByUserMove(this.getArgsForA1Unit(aA1Unit), true);
  }

  dealA1B2(aA1B2Unit) {
    aA1B2Unit.updateByUserMove(this.getArgsForA1B1Unit(aA1B2Unit), true);
  }
}

export class NewLocRefactorBhv extends UserMoveRefactorBhv{
  dealAA(aAAUnit) {
    aAAUnit.updateByNewLoc(this.getArgsForAAUnit(aAAUnit), true);
  }

  dealA1(aA1Unit) {
    aA1Unit.updateByNewLoc(this.getArgsForA1Unit(aA1Unit), true);
  }

  dealA1B2(aA1B2Unit) {
    aA1B2Unit.updateByNewLoc(this.getArgsForA1B1Unit(aA1B2Unit), true);
  }
}
