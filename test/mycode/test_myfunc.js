import assert from 'assert'
import * as myfunc from "./myfunc";
import * as jStat from 'jstat'
import {CellVDateTime} from '../../src/calc/cell_value_type/cell_value.js';

describe('expression_fn integration', function () {
    describe('func', function () {
        it('COUPDAYBS', function () {
            let res = myfunc.COUPDAYBS(40861, 40862, 2, 1)
            console.log(res);
            assert.equal(res, 183)
        });
        it('COUPDAYS', function () {
            let res = myfunc.COUPDAYS(40861, 40862, 2, 1)
            console.log(res);
            assert.equal(res, 184)
        });
        it('COUPDAYSNC', function () {
            let res = myfunc.COUPDAYSNC(40861, 40862, 2, 1)
            console.log(res);
            assert.equal(res, 1)
        });
        it('COUPNCD', function () {
            let res = myfunc.COUPNCD(40861, 40862, 2, 1)
            console.log(res);
            let aCellVDateTime = new CellVDateTime(res)
            console.log(aCellVDateTime.toNumber())
            assert(Math.abs(aCellVDateTime.toNumber() - 40862) < 0.01)
        });
        it('COUPNUM', function () {
            let res = myfunc.COUPDAYSNC(40861, 40862, 2, 1)
            console.log(res);
            assert.equal(res, 1)
        });
        it('COUPPCD', function () {
            let res = myfunc.COUPPCD(40861, 40862, 2, 1)
            console.log(res);
            let aCellVDateTime = new CellVDateTime(res)
            console.log(aCellVDateTime.toNumber())
            assert(Math.abs(aCellVDateTime.toNumber() - 40678) < 0.01)
        });
        it('VDB', function () {
            let res = myfunc.VDB(2400, 300, 120, 6,18,)
            console.log(res);
            assert(Math.abs(res - 396.306) < 0.001)
        });
        it('YIELDDISC', function () {
            let res = myfunc.YIELDDISC(39494, 39508, 99.795, 100, 2)
            console.log(res);
            assert(Math.abs(res - 0.052822) < 0.01)
        });
        it('YIELD', function () {
            let res = myfunc.YIELD(33000, 44000, 0.066, 88.88, 100, 4, 0)
            console.log(res);
            assert(Math.abs(res - 0.0753666) < 0.01)
        });
        it('YIELDMAT', function () {
            let res = myfunc.YIELDMAT(39630,39661,39569,0.1,99)
            console.log(res);
            assert(Math.abs(res-0.2185)<0.01)
        });
        it('ODDFPRICE', function () {
            let res = myfunc.ODDFPRICE(40101,47890,40057,40220,0.06,0.05,100,2)
            console.log(res);
            assert(Math.abs(res-113.01959)<1)
        });
        it('CHISQDIST', function () {
            let res = myfunc.CHISQDIST(2,3,false)
            console.log(res);
            assert(Math.abs(res-0.20755)<0.0001)
        });
        it('CHISQDISTRT', function () {
            let res = myfunc.CHISQDISTRT(18.307,10)
            console.log(res);
            assert(Math.abs(res-0.05)<0.0001)
        });
        it('CHISQINV', function () {
            let res = myfunc.CHISQINV(0.93,1)
            console.log(res);
            assert(Math.abs(res-3.2830)<0.0001)
        });
        it('CHISQINVRT', function () {
            let res = myfunc.CHISQINVRT(0.050001,10)
            console.log(res);
            assert(Math.abs(res-18.306973)<0.0001)
        });
        it('FTEST', function () {
            let res = myfunc.FTEST([6,7,9,15,21],[20,28,31,38,40])
            console.log(res);
            assert(Math.abs(res-0.64831785)<0.0001)
        });
        it('TTEST', function () {
            let res = myfunc.TTEST([3,4,5,8,55,1,2,4,55],[6,19,3,22,14,55,5,22,1],2,1)
            console.log(res);
            assert(Math.abs(res-0.9199744)<0.0001)
        });
        it('DURATION', function () {
            let res = myfunc.DURATION(40401,40885,0.06,0.07,4,1)
            console.log(res);
            assert(Math.abs(res-1.271)<0.001)
        });
        it('MDURATION', function () {
            let res = myfunc.MDURATION(40401,40885,0.06,0.07,4,1)
            console.log(res);
            assert(Math.abs(res-1.249)<0.001)
        });
        it('helper_ttest', function () {
            let array1 = [123,123,12,12,1212],
              array2 = [123,123,12,12,12], tails = 1;
            // type = 1 成对t检验
            let array3 = array1.map((curValue,index) => array2[index] - curValue)
            const res = jStat.ttest(0, array3, tails)
            console.log(res)

            // type =2 同方差t检验, tail = 2
            const res2_tail2 = jStat.anovaftest( array1, array2)
            const res2_tail1 = res2_tail2/2
            console.log(res2)




        })

    });
});

