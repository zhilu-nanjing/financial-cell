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
            let res1 = easySolve(financial.ACCRINT, [39508, 39691, 39569, 0.1, 1000, 2, 0])
            console.log(res1)
            assert(Math.abs(res1 - 16.66666) < 0.001)
            let res2 = easySolve(financial.ACCRINT, [39508, 39691, 39569, 0.1, 1000, 2, 1])
            console.log(res2)
            assert(Math.abs(res2 - 16.57608) < 0.1)
            let res3 = easySolve(financial.ACCRINT, [39508, 39691, 39569, 0.1, 1000, 2, 2])
            console.log(res3)
            assert(Math.abs(res3 - 16.94444) < 0.001)
            let res4 = easySolve(financial.ACCRINT, [39508, 39691, 39569, 0.1, 1000, 2, 3])
            console.log(res4)
            assert(Math.abs(res4 - 16.7123) < 0.001)
            let res5 = easySolve(financial.ACCRINT, [39508, 39691, 39569, 0.1, 1000, 2, 4])
            console.log(res5)
            assert(Math.abs(res5 - 16.66666) < 0.001)
            let res6 = easySolve(financial.ACCRINT, [39512, 39691, 39569, 0.1, 1000, 2, 0, 'FALSE'])
            console.log(res6)
            assert(Math.abs(res6 - 15.55555) < 0.001)
            let res7 = easySolve(financial.ACCRINT, [39543, 39691, 39569, 0.1, 1000, 2, 0, 'TRUE'])
            console.log(res7)
            assert(Math.abs(res7 - 7.22222) < 0.001)
        })
        it('ACCRINTM', function () {
            let res1 = easySolve(financial.ACCRINTM, [39539, 39614, 0.1, 1000, 0])
            console.log(res1)
            assert(Math.abs(res1 - 20.55555) < 0.001)
            let res2 = easySolve(financial.ACCRINTM, [39539, 39614, 0.1, 1000, 1])
            console.log(res2)
            assert(Math.abs(res2 - 20.4918) < 0.001)
            let res3 = easySolve(financial.ACCRINTM, [39539, 39614, 0.1, 1000, 2])
            console.log(res3)
            assert(Math.abs(res3 - 20.8333) < 0.001)
            let res4 = easySolve(financial.ACCRINTM, [39539, 39614, 0.1, 1000, 3])
            console.log(res4)
            assert(Math.abs(res4 - 20.5479) < 0.001)
            let res5 = easySolve(financial.ACCRINTM, [39539, 39614, 0.1, 1000, 4])
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
            let res = easySolve(mathtrig.ADD, [11, 12])
            console.log(res)
            assert.equal(res, 23)
        })
        it('AND', function () {
            let res = easySolve(logical.AND, ['1>0', '2>1'])
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
            let res1 = easySolve(mathtrig.ATAN2, [1, 1])
            console.log(res1)
            assert(Math.abs(res1 - 0.78539816) < 0.001)
            let res2 = easySolve(mathtrig.ATAN2, [-1, -1])
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
            let res1 = easySolve(statistical.AVEDEV, [4, 5, 6, 7, 5, 4, 3])
            console.log(res1)
            assert(Math.abs(res1 - 1.020408) < 0.001)
            let res2 = easySolve(statistical.AVEDEV, [-0.1])
            console.log(res2)
            assert(Math.abs(res2 - (-0.1003353)) < 0.001)
        })
        it('AVERAGE', function () {
            let res1 = easySolve(statistical.AVERAGE, [10, 7, 9, 27, 2])
            console.log(res1)
            assert.equal(res1, 11)
            let res2 = easySolve(statistical.AVERAGE, [10, 7, 9, 27, 2, 5])
            console.log(res2)
            assert.equal(res2, 10)
        })
        it('AVERAGEA', function () {
            let res1 = easySolve(statistical.AVERAGEA, [10, 7, 9, 2,])
            console.log(res1)
            assert.equal(res1, 7)
            let res2 = easySolve(statistical.AVERAGEA, [10, 7, 9, 2, '不存在'])
            console.log(res2)
            assert.equal(res2, 5.6)
        })
        it('AVERAGEIF', function () {
            let res1 = easySolve(statistical.AVERAGEIF, [[7000, 14000, 21000, 28000], '<23000'])
            console.log(res1)
            assert.equal(res1, 14000)
            let res2 = easySolve(statistical.AVERAGEIF, [[100000, 200000, 300000, 400000], '<250000'])
            console.log(res2);
            assert.equal(res2, 150000)
            let res3 = easySolve(statistical.AVERAGEIF, [[100000, 200000, 300000, 400000], '<95000'])
            console.log(res3);
            assert.equal(res3.message, ERROR_DIV0)
            let res4 = easySolve(statistical.AVERAGEIF, [[100000, 200000, 300000, 400000], '>250000', [7000, 14000, 21000, 28000]])
            console.log(res4);
            assert.equal(res4, 24500)
            let res5 = easySolve(statistical.AVERAGEIF, [['东部', '西部', '北部', '南部(新办事处)', '中西部'], '=*西部', [45678, 23789, -4789, 0, 9678]])
            console.log(res5);
            assert.equal(res5, 16733.5)
            let res6 = easySolve(statistical.AVERAGEIF, [['东部', '西部', '北部', '南部(新办事处)', '中西部'], '<>*(新办事处)', [45678, 23789, -4789, 0, 9678]])
            console.log(res6);
            assert.equal(res6, 18589)
        })
        it('AVERAGEIFS', function () {
            let res1 = easySolve(statistical.AVERAGEIFS, [['小测验', '成绩', 75, 94], ['小测验', '成绩', 75, 94], '>70', ['小测验', '成绩', 75, 94], '<90'])
            console.log(res1)
            assert.equal(res1, 75)
            let res2 = easySolve(statistical.AVERAGEIFS, [['小测验', '成绩', 85, 80], ['小测验', '成绩', 85, 80], '>95'])
            console.log(res2)
            assert.equal(res2.message, ERROR_DIV0)
            let res3 = easySolve(statistical.AVERAGEIFS, [['考试', '成绩', 87, 88],['考试', '成绩', 87, 88],'<>Incomplete', ['考试', '成绩', 87, 88], '>80'])
            console.log(res3)
            assert.equal(res3, 87.5)
            let res4 = easySolve(statistical.AVERAGEIFS, [[230000,197000,345678,321900,450000,395000], ['辽阳', '邯郸', '邯郸','辽阳', '邯郸','邯郸'], '邯郸',[3,2,4,2,5,4],'>2',['否', '是', '是','是', '是','否'],'是'])
            console.log(res4)
            assert.equal(res4, 397839)
            let res5 = easySolve(statistical.AVERAGEIFS, [[230000,197000,345678,321900,450000,395000], ['辽阳', '邯郸', '邯郸','辽阳', '邯郸','邯郸'], '辽阳',[3,2,4,2,5,4],'<=3',['否', '是', '是','是', '是','否'],'否'])
            console.log(res5)
            assert.equal(res5, 230000)
        })
        it('BASE', function () {
            let res1 = easySolve(mathtrig.BASE, [7,2])
            console.log(res1)
            assert.equal(res1, 111)
            let res2 = easySolve(mathtrig.BASE, [100,16])
            console.log(res2)
            assert.equal(res2, 64)
            let res3 = easySolve(mathtrig.BASE, [15,2,10])
            console.log(res3)
            assert.equal(res3, '0000001111')
        })
        it('BESSELI', function () {
            let res1 = easySolve(engineering.BESSELI, [1.5, 1])
            console.log(res1)
            assert(Math.abs(res1 - 0.981666) < 0.001)
        })
        it('BESSELJ', function () {
            let res1 = easySolve(engineering.BESSELJ, [1.9, 2])
            console.log(res1)
            assert(Math.abs(res1 - 0.3299258) < 0.001)
        })
        it('BESSELK', function () {
            let res1 = easySolve(engineering.BESSELK, [1.5, 1])
            console.log(res1)
            assert(Math.abs(res1 - 0.277387) < 0.001)
        })
        it('BESSELY', function () {
            let res1 = easySolve(engineering.BESSELY, [2.5, 1])
            console.log(res1)
            assert(Math.abs(res1 - 0.145918) < 0.001)
        })
        it('BETADIST', function () {
            let res1 = easySolve(statistical.BETA__DIST, [2,8,10,'true',1,3])
            console.log(res1)
            assert(Math.abs(res1 - 0.6854706) < 0.001)
            let res2 = easySolve(statistical.BETA__DIST, [2,8,10,'false',1,3])
            console.log(res2)
            assert(Math.abs(res2 - 1.4837646) < 0.001)
        })
        it('BETAINV', function () {
            let res1 = easySolve(statistical.BETA__INV, [0.685470581,8,10,1,3])
            console.log(res1)
            assert(Math.abs(res1 - 2) < 0.001)
            let res2 = easySolve(statistical.BETA__INV, [0.685470581,-8,10,1,3])
            console.log(res2)
            assert.equal(res2.message, ERROR_NUM)
        })
        it('BIN2DEC', function () {
            let res1 = easySolve(engineering.BIN2DEC, [1100100])
            console.log(res1)
            assert.equal(res1, 100)
            let res2 = easySolve(engineering.BIN2DEC, [1111111111])
            console.log(res2)
            assert.equal(res2, -1)
            let res3 = easySolve(engineering.BIN2DEC, [11111111111])
            console.log(res3)
            assert.equal(res3.message, ERROR_NUM)
        })
        it('BIN2HEX', function () {
            let res1 = easySolve(engineering.BIN2HEX, [11111011,4])
            console.log(res1)
            assert.equal(res1, '00fb')
            let res2 = easySolve(engineering.BIN2HEX, [1110])
            console.log(res2)
            assert.equal(res2, 'e')
            let res3 = easySolve(engineering.BIN2HEX, [1111111111])
            console.log(res3)
            assert.equal(res3, 'ffffffffff')
        })
        it('BIN2OCT', function () {
            let res1 = easySolve(engineering.BIN2OCT, [1001,3])
            console.log(res1)
            assert.equal(res1, '011')
            let res2 = easySolve(engineering.BIN2OCT, [1100100])
            console.log(res2)
            assert.equal(res2, 144)
            let res3 = easySolve(engineering.BIN2OCT, [1111111111])
            console.log(res3)
            assert.equal(res3, 7777777777)
        })
        it('BINOMDIST', function () {
            let res1 = easySolve(statistical.BINOM__DIST, [6,10,0.5])
            console.log(res1)
            assert(Math.abs(res1 - 0.2050781) < 0.001)
            let res2 = easySolve(statistical.BINOM__DIST, [16,10,0.5])
            console.log(res2)
            assert.equal(res2.message, ERROR_NUM)
        })
        it('BINOMINV', function () {
            let res1 = easySolve(statistical.BINOM__INV, [6,0.5,0.75])
            console.log(res1)
            assert.equal(res1, 4)
            let res2 = easySolve(statistical.BINOM__INV, [-6,0.5,0.75])
            console.log(res2)
            assert.equal(res2.message, ERROR_NUM)
        })
        it('BITAND', function () {
            let res1 = easySolve(engineering.BITAND, [1,5])
            console.log(res1)
            assert.equal(res1, 1)
            let res2 = easySolve(engineering.BITAND, [13,25])
            console.log(res2)
            assert.equal(res2, 9)
            let res3 = easySolve(engineering.BITAND, [-13,-25])
            console.log(res3)
            assert.equal(res3.message, ERROR_NUM)
        })
        it('BITLSHIFT', function () {
            let res1 = easySolve(engineering.BITLSHIFT, [4,2])
            console.log(res1)
            assert.equal(res1, 16)
            let res2 = easySolve(engineering.BITLSHIFT, [13,54])
            console.log(res2)
            assert.equal(res2.message, ERROR_NUM)
        })
        it('BITOR', function () {
            let res1 = easySolve(engineering.BITOR, [23,10])
            console.log(res1)
            assert.equal(res1, 31)
            let res2 = easySolve(engineering.BITOR, [13,-54])
            console.log(res2)
            assert.equal(res2.message, ERROR_NUM)
        })
        it('BITRSHIFT', function () {
            let res1 = easySolve(engineering.BITRSHIFT, [13,2])
            console.log(res1)
            assert.equal(res1, 3)
            let res2 = easySolve(engineering.BITRSHIFT, [13,-54])
            console.log(res2)
            assert.equal(res2.message, ERROR_NUM)
        })
        it('BITXOR', function () {
            let res1 = easySolve(engineering.BITXOR, [5,3])
            console.log(res1)
            assert.equal(res1, 6)
            let res2 = easySolve(engineering.BITXOR, [13,-54])
            console.log(res2)
            assert.equal(res2.message, ERROR_NUM)
        })
        it('CEILING', function () {
            let res1 = easySolve(mathtrig.CEILING, [2.5,1])
            console.log(res1)
            assert.equal(res1, 3)
            let res2 = easySolve(mathtrig.CEILING, [-2.5,-2])
            console.log(res2)
            assert.equal(res2, -4)
            let res3 = easySolve(mathtrig.CEILING, [-2.5,2])
            console.log(res3)
            assert.equal(res3, -2)
            let res4 = easySolve(mathtrig.CEILING, [1.5,0.1])
            console.log(res4)
            assert.equal(res4, 1.5)
            let res5 = easySolve(mathtrig.CEILING, [0.234,0.01])
            console.log(res5)
            assert.equal(res5, 0.24)
        })
        it('CEILINGMATH', function () {
            let res1 = easySolve(mathtrig.CEILINGMATH, [24.3,5])
            console.log(res1)
            assert.equal(res1, 25)
            let res2 = easySolve(mathtrig.CEILINGMATH, [6.7])
            console.log(res2)
            assert.equal(res2, 7)
            let res3 = easySolve(mathtrig.CEILINGMATH, [-8.1,2])
            console.log(res3)
            assert.equal(res3, -8)
            let res4 = easySolve(mathtrig.CEILINGMATH, [-5.5,2,-1])
            console.log(res4)
            assert.equal(res4, -6)
        })
        it('CEILINGPRECISE', function () {
            let res1 = easySolve(mathtrig.CEILINGPRECISE, [24.3,5])
            console.log(res1)
            assert.equal(res1, 25)
            let res2 = easySolve(mathtrig.CEILINGPRECISE, [6.7])
            console.log(res2)
            assert.equal(res2, 7)
            let res3 = easySolve(mathtrig.CEILINGPRECISE, [-8.1,2])
            console.log(res3)
            assert.equal(res3, -8)
            let res4 = easySolve(mathtrig.CEILINGPRECISE, [-5.5,2,-1])
            console.log(res4)
            assert.equal(res4, -6)
        })
        it('CHAR', function () {
            let res1 = easySolve(text.CHAR, [65])
            console.log(res1)
            assert.equal(res1, 'A')
            let res2 = easySolve(text.CHAR, [33])
            console.log(res2)
            assert.equal(res2, '!')
        })
        it('CHISQTEST', function () {
            let res1 = easySolve(statistical.CHISQ__TEST, [[[58,35],[11,25],[10,23]],[[45.35,47.65],[17.56,18.44],[16.09,16.91]]])
            console.log(res1)
            assert(Math.abs(res1 - 0.000308192) < 0.000001)
            let res2 = easySolve(statistical.CHISQ__TEST, [[[58,11,35],[11,25],[10,23]],[[45.35,47.65],[17.56,18.44],[16.09,16.91]]])
            console.log(res2)
            assert.equal(res2.message, ERROR_VALUE)
        })
        it('CHOOSE', function () {
            let res1 = easySolve(logical.CHOOSE, [2,'1st','2nd','3rd','Finished'])
            console.log(res1)
            assert.equal(res1, '2nd')
            let res2 = easySolve(logical.CHOOSE, [4,'Nails','Screws','Nuts','Bolts'])
            console.log(res2)
            assert.equal(res2, 'Bolts')
            let res3 = easySolve(logical.CHOOSE, [3,'Wide','115','world',8])
            console.log(res3)
            assert.equal(res3, 'world')
            let res4 = easySolve(logical.CHOOSE, [255,45,12,10])
            console.log(res4)
            assert.equal(res4.message, ERROR_VALUE)
        })
        it('CLEAN', function () {
            let arg0 = easySolve(text.CHAR, [9])
            let arg1 = easySolve(text.CHAR, [10])
            let res1 = easySolve(text.CLEAN, [arg0+"月度报表"+arg1])
            console.log(res1)
            assert.equal(res1, '月度报表')
        })
        it('CODE', function () {
            let res1 = easySolve(text.CODE, ['A'])
            console.log(res1)
            assert.equal(res1, 65)
            let res2 = easySolve(text.CODE, ['!'])
            console.log(res2)
            assert.equal(res2, 33)
        })
        it('COMBIN', function () {
            let res1 = easySolve(mathtrig.COMBIN, [8,2])
            console.log(res1)
            assert.equal(res1, 28)
            let res2 = easySolve(mathtrig.COMBIN, [9,3])
            console.log(res2)
            assert.equal(res2, 84)
        })
        it('COMBINA', function () {
            let res1 = easySolve(mathtrig.COMBINA, [4,3])
            console.log(res1)
            assert.equal(res1, 20)
            let res2 = easySolve(mathtrig.COMBINA, [10,3])
            console.log(res2)
            assert.equal(res2, 220)
        })
        it('COMBINA', function () {
            let res1 = easySolve(mathtrig.COMBINA, [4,3])
            console.log(res1)
            assert.equal(res1, 20)
            let res2 = easySolve(mathtrig.COMBINA, [10,3])
            console.log(res2)
            assert.equal(res2, 220)
        })
        it('COMPLEX', function () {
            let res1 = easySolve(engineering.COMPLEX, [3,4])
            console.log(res1)
            assert.equal(res1, '3+4i')
            let res2 = easySolve(engineering.COMPLEX, [3,4,'j'])
            console.log(res2)
            assert.equal(res2, '3+4j')
            let res3 = easySolve(engineering.COMPLEX, [0,1])
            console.log(res3)
            assert.equal(res3, 'i')
            let res4 = easySolve(engineering.COMPLEX, [1,0])
            console.log(res4)
            assert.equal(res4, 1)
        })
        it('CONFIDENCENORM', function () {
            let res1 = easySolve(statistical.CONFIDENCE__NORM, [0.05,2.5,50])
            console.log(res1)
            assert(Math.abs(res1 - 0.692951912) < 0.001)
        })
        it('CONFIDENCET', function () {
            let res1 = easySolve(statistical.CONFIDENCE__T, [0.05,1,50])
            console.log(res1)
            assert(Math.abs(res1 - 0.2841968) < 0.001)
        })
        it('CONVER', function () {
            let res1 = easySolve(engineering.CONVER, [1,'lbm','kg'])
            console.log(res1)
            assert(Math.abs(res1 - 0.4535924) < 0.001)
            let res2 = easySolve(engineering.CONVER, [68,'F','C'])
            console.log(res2)
            assert.equal(res2, 20)
            let res3 = easySolve(engineering.CONVER, [2.5,'ft','sec'])
            console.log(res3)
            assert.equal(res3.message, ERROR_NA)
        })
        it('CORREL', function () {
            let res1 = easySolve(statistical.CORREL, [[3,2,4,5,6],[9,7,12,15,17]])
            console.log(res1)
            assert(Math.abs(res1 - 0.997054486) < 0.001)
        })
        it('COS', function () {
            let res1 = easySolve(mathtrig.COS, [1.047])
            console.log(res1)
            assert(Math.abs(res1 - 0.5001711) < 0.001)
        })
        it('COSH', function () {
            let res1 = easySolve(mathtrig.COSH, [4])
            console.log(res1)
            assert(Math.abs(res1 - 27.308233) < 0.001)
        })
        it('COT', function () {
            let res1 = easySolve(mathtrig.COT, [30])
            console.log(res1)
            assert(Math.abs(res1 - (-0.156)) < 0.001)
            let res2 = easySolve(mathtrig.COT, [45])
            console.log(res2)
            assert(Math.abs(res2 - 0.617) < 0.001)
        })
        it('COTH', function () {
            let res1 = easySolve(mathtrig.COTH, [2])
            console.log(res1)
            assert(Math.abs(res1 - 1.037) < 0.001)
        })
        it('COUNT', function () {
            let res1 = easySolve(statistical.COUNT, [3,2,4,5,6,' '])
            console.log(res1)
            assert.equal(res1, 5)
            let res2 = easySolve(statistical.COUNT, [3,2,4,5,6,' ',2])
            console.log(res2)
            assert.equal(res2, 6)
        })
        it('COUNTA', function () {
            let res1 = easySolve(statistical.COUNTA, [3,2,4,5,6, ])
            console.log(res1)
            assert.equal(res1, 5)
        })
        it('COUNTBLANK', function () {
            let res1 = easySolve(statistical.COUNTBLANK, [6,'','',7,4,34])
            console.log(res1)
            assert.equal(res1, 2)
        })
        it('COUNTIF', function () {
            let res1 = easySolve(statistical.COUNTIF, [['苹果','橙子','桃子','苹果'],'*'])
            console.log(res1)
            assert.equal(res1, 4)
        })
        it('COVARIANCEP', function () {
            let res1 = easySolve(statistical.COVARIANCE__P, [[3,2,4,5,6],[9,7,1.2,15,17]])
            console.log(res1)
            assert.equal(res1, 5.2)
        })
        it('COVARIANCES', function () {
            let res1 = easySolve(statistical.COVARIANCE__S, [[2,4,8],[5,11,12]])
            console.log(res1)
            assert(Math.abs(res1 - 9.666666) < 0.001)
        })
        it('CSC', function () {
            let res1 = easySolve(mathtrig.CSC, [15])
            console.log(res1)
            assert(Math.abs(res1 - 1.538) < 0.001)
        })
        it('CSCH', function () {
            let res1 = easySolve(mathtrig.CSCH, [1.5])
            console.log(res1)
            assert(Math.abs(res1 - 0.4696) < 0.001)
        })
        it('CUMIPMT', function () {
            let res1 = easySolve(financial.CUMIPMT, [0.0075,360,125000,13,24,0])
            console.log(res1)
            assert(Math.abs(res1 - (-11135.23213)) < 0.001)
            let res2 = easySolve(financial.CUMIPMT, [0.0075,360,125000,1,1,0])
            console.log(res2)
            assert(Math.abs(res2 - (-937.5)) < 0.001)
        })
        it('CUMPRINC', function () {
            let res1 = easySolve(financial.CUMPRINC, [0.0075,360,125000,13,24,0])
            console.log(res1)
            assert(Math.abs(res1 - (-934.1071234)) < 0.001)
            let res2 = easySolve(financial.CUMPRINC, [0.0075,360,125000,1,1,0])
            console.log(res2)
            assert(Math.abs(res2 - (-68.27827118)) < 0.001)
        })
        it('DATE', function () {
            let res1 = easySolve(date_time.DATE, [2012,3,14])
            console.log(res1)
            let aCellVDateTime = new CellVDateTime(res1)
            console.log(aCellVDateTime.toNumber())
            assert(Math.abs(aCellVDateTime.toNumber() - 40982) < 0.001)
        })
        it('DATEVALUE', function () {
            let res1 = easySolve(date_time.DATEVALUE, ['2011-8-22'])
            console.log(res1)
            assert.equal(res1, 40777)
            let res2 = easySolve(date_time.DATEVALUE, ['22-MAY-2011'])
            console.log(res2)
            assert.equal(res2, 40685)
            let res3 = easySolve(date_time.DATEVALUE, ['2011/02/23'])
            console.log(res3)
            assert.equal(res3, 40597)
        })
        it('DAVERAGE', function () {
            let res1 = easySolve(database.DAVERAGE, [[['树种','高度','年数','产量','利润'],['苹果树',18,20,14,105],['梨树',12,12,10,96],['樱桃树',13,14,9,105],['苹果树',14,15,10,75],['梨树',9,8,8,76.8],['苹果树',8,9,6,45]],'产量',[['树种','高度','年数','产量','利润'],['=苹果树','>10',new CellVEmpty,new CellVEmpty,new CellVEmpty]]])
            console.log(res1)
            assert.equal(res1, 12)
        })
        it('DAYS', function () {
            let res1 = easySolve(date_time.DAYS, ['2011-12-31','2011-1-1'])
            console.log(res1)
            assert.equal(res1, 364)
            let res2 = easySolve(date_time.DAYS, ['2011-3-15','2011-2-1'])
            console.log(res2)
            assert.equal(res2, 42)
        })
        it('DAYS360', function () {
            let res1 = easySolve(date_time.DAYS360, ['2011-1-30','2011-2-1'])
            console.log(res1)
            assert.equal(res1, 1)
            let res2 = easySolve(date_time.DAYS360, ['2011-1-1','2011-12-31'])
            console.log(res2)
            assert.equal(res2, 359)
            let res3 = easySolve(date_time.DAYS360, ['2011-1-1','2011-2-1'])
            console.log(res3)
            assert.equal(res3, 30)
        })
        it('DCOUNT', function () {
            let res1 = easySolve(database.DCOUNT, [[['树种','高度','年数','产量',0],['苹果树',18,20,14,0]],'高度','高度>10'])
            console.log(res1)
            assert(Math.abs(res1 - (-934.1071234)) < 0.001)
        })
        it('DEC2BIN', function () {
            let res1 = easySolve(engineering.DEC2BIN, [9,4])
            console.log(res1)
            assert.equal(res1, 1001)
            let res2 = easySolve(engineering.DEC2BIN, [-100])
            console.log(res2)
            assert.equal(res2, 1110011100)
        })
        it('DEC2HEX', function () {
            let res1 = easySolve(engineering.DEC2HEX, [100,4])
            console.log(res1)
            assert.equal(res1, '0064')
            let res2 = easySolve(engineering.DEC2HEX, [-54])
            console.log(res2)
            assert.equal(res2, 'ffffffffca')
            let res3 = easySolve(engineering.DEC2HEX, [28])
            console.log(res3)
            assert.equal(res3, '1c')
            let res4 = easySolve(engineering.DEC2HEX, [64,1])
            console.log(res4)
            assert.equal(res4.message, ERROR_NUM)
        })
        it('DEC2OCT', function () {
            let res1 = easySolve(engineering.DEC2OCT, [58,3])
            console.log(res1)
            assert.equal(res1, '072')
            let res2 = easySolve(engineering.DEC2OCT, [-100])
            console.log(res2)
            assert.equal(res2, 7777777634)
        })
        it('DECIMAL', function () {
            let res1 = easySolve(mathtrig.DECIMAL, ['FF',16])
            console.log(res1)
            assert.equal(res1, 255)
            let res2 = easySolve(mathtrig.DECIMAL, ['1111',2])
            console.log(res2)
            assert.equal(res2, 15)
        })
        it('DEGREES', function () {
            let res1 = easySolve(mathtrig.DEGREES, [3.141592654])
            console.log(res1)
            assert(Math.abs(res1 - 180) < 0.001)
        })








    })
})
