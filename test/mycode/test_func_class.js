import  assert from 'assert'
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
import {RawValue} from '../../src/calc/calc_data_proxy/raw_value';
import {easySolve} from '../../src/calc/calc_data_proxy/exp_fn_executor';
import * as date_time from '../../src/calc/expression_fn/lib/date_time'
import * as statistical from '../../src/calc/expression_fn/lib/statistical'
import * as mathtrig from '../../src/calc/expression_fn/lib/math-trig'
import * as financial from '../../src/calc/expression_fn/lib/financial'
import * as logical from '../../src/calc/expression_fn/lib/logical'
import * as text from '../../src/calc/expression_fn/lib/text'

describe('expression_fn integration', function () {
  describe('func', function () {
    it('ISBLANK', function () {
      let res = easySolve(ISBLANK, [new CellVEmpty()])
      assert.equal(res, false)
    })
    it('ABS', function () {
      let res = easySolve(mathtrig.ABS, [-2.5])
      console.log(res)
      assert.equal(res, 2.5)
    })
    it('ACCRINT', function () {
      let res1 = easySolve(financial.ACCRINT, [39508,39691,39569,0.1,1000,2,0])
      console.log(res1)
      assert(Math.abs(res1 - 16.66666) < 0.001)
      let res2 = easySolve(financial.ACCRINT, [39508,39691,39569,0.1,1000,2,1])
      console.log(res2)
      assert(Math.abs(res2 - 16.57608) < 0.1)
      let res3 = easySolve(financial.ACCRINT, [39508,39691,39569,0.1,1000,2,2])
      console.log(res3)
      assert(Math.abs(res3 - 16.94444) < 0.001)
      let res4 = easySolve(financial.ACCRINT, [39508,39691,39569,0.1,1000,2,3])
      console.log(res4)
      assert(Math.abs(res4 - 16.7123) < 0.001)
      let res5 = easySolve(financial.ACCRINT, [39508,39691,39569,0.1,1000,2,4])
      console.log(res5)
      assert(Math.abs(res5 - 16.66666) < 0.001)
      let res6 = easySolve(financial.ACCRINT, [39512,39691,39569,0.1,1000,2,0,'FALSE'])
      console.log(res6)
      assert(Math.abs(res6 - 15.55555) < 0.001)
      let res7 = easySolve(financial.ACCRINT, [39543,39691,39569,0.1,1000,2,0,'TRUE'])
      console.log(res7)
      assert(Math.abs(res7 - 7.22222) < 0.001)
    })
    it('ACCRINTM', function () {
      let res1 = easySolve(financial.ACCRINTM, [39539,39614,0.1,1000,0])
      console.log(res1)
      assert(Math.abs(res1 - 20.55555) < 0.001)
      let res2 = easySolve(financial.ACCRINTM, [39539,39614,0.1,1000,1])
      console.log(res2)
      assert(Math.abs(res2 - 20.4918) < 0.001)
      let res3 = easySolve(financial.ACCRINTM, [39539,39614,0.1,1000,2])
      console.log(res3)
      assert(Math.abs(res3 - 20.8333) < 0.001)
      let res4 = easySolve(financial.ACCRINTM, [39539,39614,0.1,1000,3])
      console.log(res4)
      assert(Math.abs(res4 - 20.5479) < 0.001)
      let res5 = easySolve(financial.ACCRINTM, [39539,39614,0.1,1000,4])
      console.log(res5)
      assert(Math.abs(res5 - 20.5555) < 0.001)
    })
    it('ACOS', function () {
      let res = easySolve(mathtrig.ACOS, [-0.5])
      console.log(res)
      assert(Math.abs(res - 2.094395) < 0.001)
    })
    it('ACOSH', function () {
      let res = easySolve(mathtrig.ACOSH, [10])
      console.log(res)
      assert(Math.abs(res - 2.99322) < 0.001)
    })
    it('ACOT', function () {
      let res = easySolve(mathtrig.ACOT, [2])
      console.log(res)
      assert(Math.abs(res - 0.463647) < 0.001)
    })
    it('ACOTH', function () {
      let res = easySolve(mathtrig.ACOTH, [6])
      console.log(res)
      assert(Math.abs(res - 0.168236) < 0.001)
    })
    it('ADD', function () {
      let res = easySolve(mathtrig.ADD, [11,12])
      console.log(res)
      assert.equal(res, 23)
    })
    it('AND', function () {
      let res = easySolve(logical.AND, ['1>0','2>1'])
      console.log(res)
      assert.equal(res, 'true')
    })
    it('ARABIC', function () {
      let res1 = easySolve(mathtrig.ARABIC, ["LVII"])
      console.log(res1)
      assert.equal(res1, 57)
      let res2 = easySolve(mathtrig.ARABIC, ["mcmxii"])
      console.log(res2)
      assert.equal(res2, 1912)
    })
    it('ASC', function () {
      let res1 = easySolve(text.ASC, ['EXCEL'])
      console.log(res1)
      assert.equal(res1, 'EXCEL')
    })
    it('ASIN', function () {
      let res = easySolve(mathtrig.ASIN, [-0.5])
      console.log(res)
      assert(Math.abs(res - (-0.523598)) < 0.001)
    })
    it('ASINH', function () {
      let res1 = easySolve(mathtrig.ASINH, [-2.5])
      console.log(res1)
      assert(Math.abs(res1 - (-1.647231)) < 0.001)
      let res2 = easySolve(mathtrig.ASINH, [10])
      console.log(res2)
      assert(Math.abs(res2 - 2.99822) < 0.001)
    })
    it('ATAN', function () {
      let res = easySolve(mathtrig.ATAN, [1])
      console.log(res)
      assert(Math.abs(res - 0.78539816) < 0.001)
    })
    it('ATAN2', function () {
      let res1 = easySolve(mathtrig.ATAN2, [1,1])
      console.log(res1)
      assert(Math.abs(res1 - 0.78539816) < 0.001)
      let res2 = easySolve(mathtrig.ATAN2, [-1,-1])
      console.log(res2)
      assert(Math.abs(res2 - (-2.35619449)) < 0.001)
    })
    it('ATANH', function () {
      let res1 = easySolve(mathtrig.ATANH, [0.76159416])
      console.log(res1)
      assert(Math.abs(res1 - 1) < 0.001)
      let res2 = easySolve(mathtrig.ATANH, [-0.1])
      console.log(res2)
      assert(Math.abs(res2 - (-0.1003353)) < 0.001)
    })
    it('AVEDEV', function () {
      let res1 = easySolve(statistical.AVEDEV, [4,5,6,7,5,4,3])
      console.log(res1)
      assert(Math.abs(res1 - 1.020408) < 0.001)
      let res2 = easySolve(statistical.AVEDEV, [-0.1])
      console.log(res2)
      assert(Math.abs(res2 - (-0.1003353)) < 0.001)
    })
    it('AVERAGE', function () {
      let res1 = easySolve(statistical.AVERAGE, [10,7,9,27,2])
      console.log(res1)
      assert.equal(res1, 11)
      let res2 = easySolve(statistical.AVERAGE, [10,7,9,27,2,5])
      console.log(res2)
      assert.equal(res2, 10)
    })
    it('AVERAGEA', function () {
      let res1 = easySolve(statistical.AVERAGEA, [10,7,9,2, ])
      console.log(res1)
      assert.equal(res1, 7)
      let res2 = easySolve(statistical.AVERAGEA, [10,7,9,2,'不存在'])
      console.log(res2)
      assert.equal(res2, 5.6)
    })
    it('AVERAGEIF', function () {
      // let res1 = easySolve(statistical.AVERAGEIF, [[[7000,14000,21000,28000]],'<23000' ])
      // console.log(res1)
      // assert.equal(res1, 14000)
      // let res2 = easySolve(statistical.AVERAGEIF, [10,7,9,2,'不存在'])
      // console.log(res2)
      // assert.equal(res2, 5.6)
      let res1 = statistical.AVERAGEIF([7000,14000,21000,28000], '<23000', )
      console.log(res1);
      assert.equal(res1, 14000)
      let res2 = statistical.AVERAGEIF([100000,200000,300000,400000], '<250000', )
      console.log(res2);
      assert.equal(res2, 150000)
      let res3 = statistical.AVERAGEIF([100000,200000,300000,400000], '<95000', )
      console.log(res3);
      assert.equal(res3, 150000)
      let res4 = statistical.AVERAGEIF([100000,200000,300000,400000], '>250000',[7000,14000,21000,28000] )
      console.log(res4);
      assert.equal(res4, 24500)
    })
  })
})
