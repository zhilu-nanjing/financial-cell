import assert from 'assert'
import * as myfunc from "./myfunc";
import {default as information, ISBLANK} from '../../src/calc/expression_fn/lib/information';
import {
    CellVEmpty,
    CellVError,
    CellVBool,
    CellVString,
    CellVNumber,
    CellVDateTime
} from '../../src/calc/cell_value_type/cell_value';
import {RawValue} from '../../src/calc/calc_data_proxy/syntax_unit_raw_value';
import {easySolve} from '../../src/calc/calc_data_proxy/exp_fn_executor';
import * as date_time from '../../src/calc/expression_fn/lib/date_time'
import * as statistical from '../../src/calc/expression_fn/lib/statistical'
import * as mathtrig from '../../src/calc/expression_fn/lib/math-trig'
import * as financial from '../../src/calc/expression_fn/lib/financial'
import * as logical from '../../src/calc/expression_fn/lib/logical'
import * as text from '../../src/calc/expression_fn/lib/text'
import * as engineering from '../../src/calc/expression_fn/lib/engineering'
import * as database from '../../src/calc/expression_fn/lib/database'
import {ERROR_DIV0, ERROR_NA, ERROR_NUM, ERROR_VALUE} from "../../src/calc/calc_utils/error_config";

describe('expression_fn integration', function () {
    describe('func', function () {
        it('ISBLANK', function () {
            let res1 = easySolve(information.ISBLANK, [new CellVEmpty()])
            console.log(res1)
            assert.equal(res1, true)
        })
        it('ISLOGICAL', function () {
            let res1 = easySolve(information.ISLOGICAL, [false])
            console.log(res1)
            assert.equal(res1, true)
            let res2 = easySolve(information.ISLOGICAL, [true])
            console.log(res2)
            assert.equal(res2, true)
        })
        it('KURT', function () {
            let res2 = easySolve(statistical.KURT, [1, 1, 1, 1])
            console.log(res2)
            assert.equal(res2.message, ERROR_DIV0) //标准差
        })
        it('IFS', function () {
            let res2 = easySolve(statistical.IFS, [false, 'A', 'true', 'B', 'true', 'C', 'true', 'D'])
            console.log(res2)
            assert.equal(res2, 'B')
        })

    })
})