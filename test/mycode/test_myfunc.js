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
            let res = myfunc.YIELDDISC(39494, 39555, 99.795, 100, 1)
            console.log(res);
            assert(Math.abs(res - 0.012325) < 0.001)
        });
        it('PRICE', function () {
            let res = myfunc.PRICE(39493, 43054, 0.0575, 0.065, 100,2,0)
            console.log(res);
            assert(Math.abs(res - 94.634) < 0.001)
        });
        it('YIELD', function () {
            let res = myfunc.YIELD(45000, 48555, 0.09, 99, 100, 4, 0)
            console.log(res);
            assert(Math.abs(res - 0.0915) < 0.001)
        });
        it('YIELDMAT', function () {
            let res = myfunc.YIELDMAT(39522,39755,39394,0.0625,100.0123)
            console.log(res);
            assert(Math.abs(res-0.06095)<0.001)
        });
        it('ODDFPRICE', function () {
            let res = myfunc.ODDFPRICE(39763,44256,39736,39873,0.0785,0.0625,100,2,1)
            console.log(res);
            assert(Math.abs(res-113.5977)<0.001)
        });
        it('CHISQDIST', function () {
            let res = myfunc.CHISQDIST(2,3,false)
            console.log(res);
            assert(Math.abs(res-0.20755)<0.001)
        });
        it('CHISQDISTRT', function () {
            let res = myfunc.CHISQDISTRT(18.307,10)
            console.log(res);
            assert(Math.abs(res-0.05)<0.001)
        });
        it('CHISQINV', function () {
            let res = myfunc.CHISQINV(0.93,1)
            console.log(res);
            assert(Math.abs(res-3.2830)<0.001)
        });
        it('CHISQINVRT', function () {
            let res = myfunc.CHISQINVRT(0.050001,10)
            console.log(res);
            assert(Math.abs(res-18.306973)<0.001)
        });
        it('FTEST', function () {
            let res = myfunc.FTEST([6,7,9,15,21],[20,28,31,38,40])
            console.log(res);
            assert(Math.abs(res-0.64831785)<0.001)
        });
        it('TTEST', function () {
            let res = myfunc.TTEST([3,4,5,8,55,1,2,4,55],[6,19,3,22,14,55,5,22,1],2,1)
            console.log(res);
            assert(Math.abs(res-0.9199744)<0.001)
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
    });
});

