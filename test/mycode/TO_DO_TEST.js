import assert from 'assert'
import * as myfunc from "./myfunc";
import {ISBLANK} from '../../src/calc/expression_fn/lib/information';
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
        it('IF', function () {
            let res2 = easySolve(logical.IF, ['2>4', 1, 2])
            console.log(res2)
            assert.equal(res2, 2)//无法识别表达式
        })

    })
})