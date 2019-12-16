import assert from 'assert'
import * as myfunc from "./myfunc";
import {UserFnExecutor} from '../../src/calc/calc_data_proxy/exp_fn_executor';
import {ISBLANK} from '../../src/calc/expression_fn/lib/information';
import {CellVEmpty, CellVError, CellVBool,CellVString, CellVNumber} from '../../src/calc/cell_value_type/cell_value';
import {RawValue} from '../../src/calc/calc_data_proxy/raw_value';


describe('expression_fn integration', function () {
  describe('func', function () {
    it('ISBLANK', function () {
      let userFnExecutor = new UserFnExecutor(ISBLANK, [new RawValue(new CellVEmpty())])
      let res = userFnExecutor.solveExpression()
      assert.equal(res, true)
    })

  })
})
