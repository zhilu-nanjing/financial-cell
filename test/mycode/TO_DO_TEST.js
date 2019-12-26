import assert from 'assert'
import * as myfunc from "./myfunc";
import * as information from '../../src/calc/expression_fn/lib/information';
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
        it('ACCRINT', function () {
            let res2 = easySolve(financial.ACCRINT, [39508, 39691, 39569, 0.1, 1000, 2, 1])
            console.log(res2)
            assert(Math.abs(res2 - 16.57608) < 0.001)  //basis=1时有差异
        })
        it('COUNTIF', function () {
            let res1 = easySolve(statistical.COUNTIF, [['苹果', '橙子', '桃子', '苹果'], '?果'])
            console.log(res1)
            assert.equal(res1, 2)//??未实现
        })
        it('KURT', function () {
            let res2 = easySolve(statistical.KURT, [1, 1, 1, 1])
            console.log(res2)
            assert.equal(res2.message, ERROR_DIV0) //引用的标准差计算错误
        })
        it('MINUTE', function () {
            let res1 = easySolve(date_time.MINUTE, ['12:45:00'])
            console.log(res1)
            assert.equal(res1, 45)
        })
        it('LOGEST', function () {
            let res1 = easySolve(statistical.LOGEST, [[33100, 47300, 69000, 102000, 150000, 220000], [11, 12, 13, 14, 15, 16], 'false', 'false'])
            console.log(res1)
            assert(Math.abs(res1 - 2.300392764) < 0.0001)//未实现true false选项
        })
        it('N', function () {
            let res4 = easySolve(information.N, [ERROR_NUM])
            console.log(res4)
            assert.equal(res4, ERROR_NUM)
            let res5 = easySolve(information.N, ['2011-4-17'])
            console.log(res5)
            assert.equal(res5, 40650)  //错误和日期未实现正确表示
        })

    })
})
