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
import * as information from '../../src/calc/expression_fn/lib/information'

describe('expression_fn integration', function () {
    describe('func', function () {
        it('LARGE', function () {
            let res1 = easySolve(statistical.LARGE, [[[3, 5, 3, 5, 4], [4, 2, 4, 6, 7]], 3])
            console.log(res1)
            assert.equal(res1, 5)
            let res2 = easySolve(statistical.LARGE, [[[3, 5, 3, 5, 4], [4, 2, 4, 6, 7]], 100])
            console.log(res2)
            assert.equal(res2.message, ERROR_NUM)
            let res3 = easySolve(statistical.LARGE, [[], 3])
            console.log(res3)
            assert.equal(res3.message, ERROR_NUM)
        })
        it('LCM', function () {
            let res1 = easySolve(mathtrig.LCM, [5, 2])
            console.log(res1)
            assert.equal(res1, 10)
            let res2 = easySolve(mathtrig.LCM, [24, 36])
            console.log(res2)
            assert.equal(res2, 72)
            let res3 = easySolve(mathtrig.LCM, [5, 15, 10])
            console.log(res3)
            assert.equal(res3, 30)
            let res4 = easySolve(mathtrig.LCM, ['aaaa', 36])
            console.log(res4)
            assert.equal(res4.message, ERROR_VALUE)
            let res5 = easySolve(mathtrig.LCM, [24, -36])
            console.log(res5)
            assert.equal(res5.message, ERROR_NUM)
        })
        it('LEFT', function () {
            let res1 = easySolve(text.LEFT, ['Sweden', 4])
            console.log(res1)
            assert.equal(res1, 'Swed')
            let res2 = easySolve(text.LEFT, ['Sweden'])
            console.log(res2)
            assert.equal(res2, 'S')
            let res3 = easySolve(text.LEFT, ['Sweden Good', 8])
            console.log(res3)
            assert.equal(res3, 'Sweden G')
            let res4 = easySolve(text.LEFT, ['Sweden Good', 100])
            console.log(res4)
            assert.equal(res4, 'Sweden Good')
            let res5 = easySolve(text.LEFT, ['销售价格', 2])
            console.log(res5)
            assert.equal(res5, '销售')
        })
        it('LEN', function () {
            let res1 = easySolve(text.LEN, ['Sweden'])
            console.log(res1)
            assert.equal(res1, 6)
            let res2 = easySolve(text.LEN, ['Sweden瑞典'])
            console.log(res2)
            assert.equal(res2, 8)
        })
        it('LN', function () {
            let res1 = easySolve(mathtrig.LN, [86])
            console.log(res1)
            assert(Math.abs(res1 - 4.4543473) < 0.0001)
            let res2 = easySolve(mathtrig.LN, ['aaaaa'])
            console.log(res2)
            assert.equal(res2.message, ERROR_VALUE)
            let res3 = easySolve(mathtrig.LN, [-11])
            console.log(res3)
            assert.equal(res3.message, ERROR_NUM)
        })
        it('LOG', function () {
            let res1 = easySolve(mathtrig.LOG, [10])
            console.log(res1)
            assert.equal(res1, 1)
            let res2 = easySolve(mathtrig.LOG, [8, 2])
            console.log(res2)
            assert.equal(res2, 3)
            let res3 = easySolve(mathtrig.LOG, [-11])
            console.log(res3)
            assert.equal(res3.message, ERROR_NUM)
            let res4 = easySolve(mathtrig.LOG, [11, -2])
            console.log(res4)
            assert.equal(res4.message, ERROR_NUM)
        })
        it('LOG10', function () {
            let res1 = easySolve(mathtrig.LOG10, [86])
            console.log(res1)
            assert(Math.abs(res1 - 1.934498451) < 0.0001)
            let res2 = easySolve(mathtrig.LOG10, [-5])
            console.log(res2)
            assert.equal(res2.message, ERROR_NUM)
        })
        it('LOGEST', function () {
            let res1 = easySolve(statistical.LOGEST, [[33100, 47300, 69000, 102000, 150000, 220000], [11, 12, 13, 14, 15, 16]])
            console.log(res1)
            assert(Math.abs(res1 - 1.463275628) < 0.0001)
            let res2 = easySolve(mathtrig.LOG10, [-5])
            console.log(res2)
            assert.equal(res2.message, ERROR_NUM)
        })
        it('LOGNORM.INV', function () {
            let res1 = easySolve(statistical.LOGNORM.INV, [0.039084, 3.5, 1.2])
            console.log(res1)
            assert(Math.abs(res1 - 4.0000252) < 0.0001)
            let res2 = easySolve(statistical.LOGNORM.INV, [-0.039084, 3.5, 1.2])
            console.log(res2)
            assert.equal(res2.message, ERROR_NUM)
        })
        it('LOGNORM.DIST', function () {
            let res1 = easySolve(statistical.LOGNORM.DIST, [4, 3.5, 1.2, 'true'])
            console.log(res1)
            assert(Math.abs(res1 - 0.0390836) < 0.0001)
            let res2 = easySolve(statistical.LOGNORM.DIST, [4, 3.5, 1.2, 'false'])
            console.log(res2)
            assert(Math.abs(res2 - 0.0176176) < 0.0001)
            let res3 = easySolve(statistical.LOGNORM.DIST, [-0.039084, 3.5, 1.2])
            console.log(res3)
            assert.equal(res3.message, ERROR_NUM)
        })
        it('LOWER', function () {
            let res1 = easySolve(text.LOWER, ['E. E. Cummings'])
            console.log(res1)
            assert.equal(res1, 'e. e. cummings')
            let res2 = easySolve(text.LOWER, ['Apt. 2B'])
            console.log(res2)
            assert.equal(res2, 'apt. 2b')
        })
        it('MAX', function () {
            let res1 = easySolve(statistical.MAX, [10, 7, 9, 27, 2])
            console.log(res1)
            assert.equal(res1, 27)
            let res2 = easySolve(statistical.MAX, [])
            console.log(res2)
            assert.equal(res2, 0)
        })
        it('MAXA', function () {
            let res1 = easySolve(statistical.MAXA, [0, 0.2, 0.5, 0.4, 1])
            console.log(res1)
            assert.equal(res1, 1)
            let res2 = easySolve(statistical.MAXA, [])
            console.log(res2)
            assert.equal(res2, 0)
        })
        it('MEDIAN', function () {
            let res1 = easySolve(statistical.MEDIAN, [1, 2, 3, 4, 5])
            console.log(res1)
            assert.equal(res1, 3)
            let res2 = easySolve(statistical.MEDIAN, [1, 2, 3, 4, 5, 6])
            console.log(res2)
            assert.equal(res2, 3.5)
            let res3 = easySolve(statistical.MEDIAN, [1, '1ss111', 3, 4, 5, 6])
            console.log(res3)
            assert.equal(res3, 3.5)
        })
        it('MID', function () {
            let res1 = easySolve(text.MID, ['Fluid Flow', 1, 5])
            console.log(res1)
            assert.equal(res1, 'Fluid')
            let res2 = easySolve(text.MID, ['Fluid Flow', 7, 20])
            console.log(res2)
            assert.equal(res2, 'Flow')
            let res3 = easySolve(text.MID, ['Fluid Flow', 20, 5])
            console.log(res3)
            assert.equal(res3, '')
            let res4 = easySolve(text.MID, ['Fluid Flow', 0.1, 5])
            console.log(res4)
            assert.equal(res4.message, ERROR_VALUE)
        })
        it('MIN', function () {
            let res1 = easySolve(statistical.MIN, [10, 7, 9, 7, 2])
            console.log(res1)
            assert.equal(res1, 2)
            let res2 = easySolve(statistical.MIN, [10, 7, 9, 7, 2, 0])
            console.log(res2)
            assert.equal(res2, 0)
            let res3 = easySolve(statistical.MIN, [])
            console.log(res3)
            assert.equal(res3, 0)
        })
        it('MINA', function () {
            let res1 = easySolve(statistical.MINA, [0.2, 0.5, 0.4, 0.8])
            console.log(res1)
            assert.equal(res1, 0.2)
        })
        it('MINVERSE', function () {
            let res1 = easySolve(mathtrig.MINVERSE, [[[4, -1], [2, 0]]])
            console.log(res1)
        })
        it('MOD', function () {
            let res1 = easySolve(mathtrig.MOD, [3, 2])
            console.log(res1)
            assert.equal(res1, 1)
            let res2 = easySolve(mathtrig.MOD, [3, -2])
            console.log(res2)
            assert.equal(res2, -1)
            let res3 = easySolve(mathtrig.MOD, [3, 0])
            console.log(res3)
            assert.equal(res3.message, ERROR_DIV0)
        })
        it('MODE.MULT', function () {
            let res1 = easySolve(statistical.MODE.MULT, [[1, 2, 3, 4, 3, 2, 1, 2, 3, 5, 6, 1]])
            console.log(res1)
            let res2 = easySolve(statistical.MODE.MULT, [1, 2, 2, 4, 5, 6, 7, 8])
            console.log(res2)
        })
        it('MODE.SNGL', function () {
            let res1 = easySolve(statistical.MODE.SNGL, [5.6, 4, 4, 3, 2, 4])
            console.log(res1)
            assert.equal(res1, 4)
        })
        it('MONTH', function () {
            let res1 = easySolve(date_time.MONTH, ['2011-4-15'])
            console.log(res1)
            assert.equal(res1, 4)
        })
        it('MROUND', function () {
            let res1 = easySolve(mathtrig.MROUND, [10, 3])
            console.log(res1)
            assert.equal(res1, 9)
            let res2 = easySolve(mathtrig.MROUND, [-10, -3])
            console.log(res2)
            assert.equal(res2, -9)
            let res3 = easySolve(mathtrig.MROUND, [1.3, 0.2])
            console.log(res3)
            assert(Math.abs(res3 - 1.4) < 0.0001)
            let res4 = easySolve(mathtrig.MROUND, [5, -2])
            console.log(res4)
            assert.equal(res4.message, ERROR_NUM)
        })
        it('MULTINOMIAL', function () {
            let res1 = easySolve(mathtrig.MULTINOMIAL, [2, 3, 4])
            console.log(res1)
            assert.equal(res1, 1260)
            let res2 = easySolve(mathtrig.MULTINOMIAL, ['www', 3, 4])
            console.log(res2)
            assert.equal(res2.message, ERROR_VALUE)
            let res3 = easySolve(mathtrig.MULTINOMIAL, [-22, 3, 4])
            console.log(res3)
            assert.equal(res3.message, ERROR_NUM)
        })
        it('MUNIT', function () {
            let res1 = easySolve(mathtrig.MUNIT, [3])
            console.log(res1)
        })
        it('N', function () {
            let res1 = easySolve(information.N, [7])
            console.log(res1)
            assert.equal(res1, 7)
            let res2 = easySolve(information.N, ['EVEN'])
            console.log(res2)
            assert.equal(res2, 0)
            let res3 = easySolve(information.N, [true])
            console.log(res3)
            assert.equal(res3, 1)
        })

    })
})