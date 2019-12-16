import assert from 'assert'
import * as myfunc from "./myfunc";
import * as jStat from 'jstat'
import {CellVDateTime} from '../../src/calc/cell_value_type/cell_value.js';
import BigNumber from "bignumber.js"


describe('expression_fn integration', function () {
    describe('func', function () {
        it('COUPDAYBS', function () {
            let res1 = myfunc.COUPDAYBS(40861, 40862, 2, 0)
            console.log(res1);
            assert.equal(res1, 179)
            let res2 = myfunc.COUPDAYBS(40861, 40862, 2, 1)
            console.log(res2);
            assert.equal(res2, 183)
            let res3 = myfunc.COUPDAYBS(40861, 40862, 2, 2)
            console.log(res3);
            assert.equal(res3, 183)
            let res4 = myfunc.COUPDAYBS(40861, 40862, 2, 3)
            console.log(res4);
            assert.equal(res4, 183)
            let res5 = myfunc.COUPDAYBS(40861, 40862, 2, 4)
            console.log(res5);
            assert.equal(res5, 179)
        });
        it('COUPDAYS', function () {
            let res1 = myfunc.COUPDAYS(40861, 40862, 2, 0)
            console.log(res1);
            assert.equal(res1, 180)
            let res2 = myfunc.COUPDAYS(40861, 40862, 2, 1)
            console.log(res2);
            assert.equal(res2, 184)
            let res3 = myfunc.COUPDAYS(40861, 40862, 2, 2)
            console.log(res3);
            assert.equal(res3, 180)
            let res4 = myfunc.COUPDAYS(40861, 40862, 2, 3)
            console.log(res4);
            assert.equal(res4, 182.5)
            let res5 = myfunc.COUPDAYS(40861, 40862, 2, 4)
            console.log(res5);
            assert.equal(res5, 180)
        });
        it('COUPDAYSNC', function () {
            let res1 = myfunc.COUPDAYSNC(40861, 40862, 2, 0)
            console.log(res1);
            assert.equal(res1, 1)
            let res2 = myfunc.COUPDAYSNC(40861, 40862, 2, 1)
            console.log(res2);
            assert.equal(res2, 1)
            let res3 = myfunc.COUPDAYSNC(40861, 40862, 2, 2)
            console.log(res3);
            assert.equal(res3, 1)
            let res4 = myfunc.COUPDAYSNC(40861, 40862, 2, 3)
            console.log(res4);
            assert.equal(res4, 1)
            let res5 = myfunc.COUPDAYSNC(40861, 40862, 2, 4)
            console.log(res5);
            assert.equal(res5, 1)
        });
        it('COUPNCD', function () {
            let res1 = myfunc.COUPNCD(40861, 40862, 2, 1)
            console.log(res1);
            let aCellVDateTime1 = new CellVDateTime(res1)
            console.log(aCellVDateTime1.toNumber())
            assert(Math.abs(aCellVDateTime1.toNumber() - 40862) < 0.01)
            let res2 = myfunc.COUPNCD(40861, 40862, 2, 1)
            console.log(res2);
            let aCellVDateTime2 = new CellVDateTime(res2)
            console.log(aCellVDateTime2.toNumber())
            assert(Math.abs(aCellVDateTime2.toNumber() - 40862) < 0.01)
            let res3 = myfunc.COUPNCD(40861, 40862, 2, 1)
            console.log(res3);
            let aCellVDateTime3 = new CellVDateTime(res3)
            console.log(aCellVDateTime3.toNumber())
            assert(Math.abs(aCellVDateTime3.toNumber() - 40862) < 0.01)
            let res4 = myfunc.COUPNCD(40861, 40862, 2, 1)
            console.log(res4);
            let aCellVDateTime4 = new CellVDateTime(res4)
            console.log(aCellVDateTime4.toNumber())
            assert(Math.abs(aCellVDateTime4.toNumber() - 40862) < 0.01)
            let res5 = myfunc.COUPNCD(40861, 40862, 2, 1)
            console.log(res5);
            let aCellVDateTime5 = new CellVDateTime(res5)
            console.log(aCellVDateTime5.toNumber())
            assert(Math.abs(aCellVDateTime5.toNumber() - 40862) < 0.01)
        });
        it('COUPNUM', function () {
            let res1 = myfunc.COUPNUM(40861, 40862, 2, 0)
            console.log(res1);
            assert.equal(res1, 1)
            let res2 = myfunc.COUPNUM(40861, 40862, 2, 1)
            console.log(res2);
            assert.equal(res2, 1)
            let res3 = myfunc.COUPNUM(40861, 40862, 2, 2)
            console.log(res3);
            assert.equal(res3, 1)
            let res4 = myfunc.COUPNUM(40861, 40862, 2, 3)
            console.log(res4);
            assert.equal(res4, 1)
            let res5 = myfunc.COUPNUM(40861, 40862, 2, 4)
            console.log(res5);
            assert.equal(res5, 1)
        });
        it('COUPPCD', function () {
            let res1 = myfunc.COUPPCD(40861, 40862, 2, 1)
            console.log(res1);
            let aCellVDateTime1 = new CellVDateTime(res1)
            console.log(aCellVDateTime1.toNumber())
            assert(Math.abs(aCellVDateTime1.toNumber() - 40678) < 0.01)
            let res2 = myfunc.COUPPCD(40861, 40862, 2, 1)
            console.log(res2);
            let aCellVDateTime2 = new CellVDateTime(res2)
            console.log(aCellVDateTime2.toNumber())
            assert(Math.abs(aCellVDateTime2.toNumber() - 40678) < 0.01)
            let res3 = myfunc.COUPPCD(40861, 40862, 2, 1)
            console.log(res3);
            let aCellVDateTime3 = new CellVDateTime(res3)
            console.log(aCellVDateTime3.toNumber())
            assert(Math.abs(aCellVDateTime3.toNumber() - 40678) < 0.01)
            let res4 = myfunc.COUPPCD(40861, 40862, 2, 1)
            console.log(res4);
            let aCellVDateTime4 = new CellVDateTime(res4)
            console.log(aCellVDateTime4.toNumber())
            assert(Math.abs(aCellVDateTime4.toNumber() - 40678) < 0.01)
            let res5 = myfunc.COUPPCD(40861, 40862, 2, 1)
            console.log(res5);
            let aCellVDateTime5 = new CellVDateTime(res5)
            console.log(aCellVDateTime5.toNumber())
            assert(Math.abs(aCellVDateTime5.toNumber() - 40678) < 0.01)
        });
        it('VDB', function () {
            let res1 = myfunc.VDB(2400, 300, 3650, 0,1,)
            console.log(res1);
            assert(Math.abs(res1 - 1.315) < 0.001)
            let res2 = myfunc.VDB(2400, 300, 120, 0,1,)
            console.log(res2);
            assert(Math.abs(res2 - 40) < 0.001)
            let res3 = myfunc.VDB(2400, 300, 10, 0,1,)
            console.log(res3);
            assert(Math.abs(res3 - 480) < 0.001)
            let res4 = myfunc.VDB(2400, 300, 120, 6,18,)
            console.log(res4);
            assert(Math.abs(res4 - 396.306) < 0.001)
            let res5 = myfunc.VDB(2400, 300, 120, 6,18,1.5)
            console.log(res5);
            assert(Math.abs(res5 - 311.8089) < 0.001)
            let res6 = myfunc.VDB(2400, 300, 10, 0,0.875,1.5)
            console.log(res6);
            assert(Math.abs(res6 - 315) < 0.001)
        });
        it('YIELDDISC', function () {
            let res1 = myfunc.YIELDDISC(39494, 39508, 99.795, 100, 0)
            console.log(res1);
            assert(Math.abs(res1 - 0.0493) < 0.001)
            let res2 = myfunc.YIELDDISC(39494, 39508, 99.795, 100, 1)
            console.log(res2);
            assert(Math.abs(res2 - 0.0537) < 0.001)
            let res3 = myfunc.YIELDDISC(39494, 39508, 99.795, 100, 2)
            console.log(res3);
            assert(Math.abs(res3 - 0.0528) < 0.001)
            let res4 = myfunc.YIELDDISC(39494, 39508, 99.795, 100, 3)
            console.log(res4);
            assert(Math.abs(res4 - 0.0535562) < 0.001)
            let res5 = myfunc.YIELDDISC(39494, 39508, 99.795, 100, 4)
            console.log(res5);
            assert(Math.abs(res5 - 0.0493) < 0.001)
        });
        it('PRICE', function () {
            let res1 = myfunc.PRICE(39493, 43054, 0.0575, 0.065, 100,2,0)
            console.log(res1);

            let res2 = myfunc.PRICE(39493, 43054, 0.0575, 0.065, 100,2,1)
            console.log(res2);

            let res3 = myfunc.PRICE(39493, 43054, 0.0575, 0.065, 100,2,2)
            console.log(res3);

            let res4 = myfunc.PRICE(39493, 43054, 0.0575, 0.065, 100,2,3)
            console.log(res4);

            let res5 = myfunc.PRICE(39493, 43054, 0.0575, 0.065, 100,2,4)
            console.log(res5);
            assert(Math.abs(res1 - 94.63436) < 0.001)
            assert(Math.abs(res2 - 94.635449) < 0.001)
            assert(Math.abs(res3 - 94.636564) < 0.04)
            assert(Math.abs(res4 - 94.63517) < 0.02)
            assert(Math.abs(res5 - 94.63436) < 0.001)
        });
        it('YIELD', function () {
            let res1 = myfunc.YIELD(45000, 48555, 0.09, 99, 100, 4, 0)
            console.log(res1);
            assert(Math.abs(res1 - 0.0915) < 0.001)
            let res2 = myfunc.YIELD(45000, 48555, 0.09, 99, 100, 4, 1)
            console.log(res2);
            assert(Math.abs(res2 - 0.0915) < 0.001)
            let res3 = myfunc.YIELD(45000, 48555, 0.09, 99, 100, 4, 2)
            console.log(res3);
            assert(Math.abs(res3 - 0.0915) < 0.001)
            let res4 = myfunc.YIELD(45000, 48555, 0.09, 99, 100, 4, 3)
            console.log(res4);
            assert(Math.abs(res4 - 0.0915) < 0.001)
            let res5 = myfunc.YIELD(45000, 48555, 0.09, 99, 100, 4, 4)
            console.log(res5);
            assert(Math.abs(res5 - 0.0915) < 0.001)
        });
        it('YIELDMAT', function () {
            let res1 = myfunc.YIELDMAT(39522,39755,39394,0.0625,100.0123,0)
            console.log(res1);
            assert(Math.abs(res1-0.06095)<0.001)
            let res2 = myfunc.YIELDMAT(39522,39755,39394,0.0625,100.0123,1)
            console.log(res2);
            assert(Math.abs(res2-0.06096)<0.001)
            let res3 = myfunc.YIELDMAT(39522,39755,39394,0.0625,100.0123,2)
            console.log(res3);
            assert(Math.abs(res3-0.06094)<0.001)
            let res4 = myfunc.YIELDMAT(39522,39755,39394,0.0625,100.0123,3)
            console.log(res4);
            assert(Math.abs(res4-0.06096)<0.001)
            let res5 = myfunc.YIELDMAT(39522,39755,39394,0.0625,100.0123,4)
            console.log(res5);
            assert(Math.abs(res5-0.06095)<0.001)
        });
        it('ODDFPRICE', function () {
            let res1 = myfunc.ODDFPRICE(39763,44256,39736,39873,0.0785,0.0625,100,2,0)
            console.log(res1);
            let res2 = myfunc.ODDFPRICE(39763,44256,39736,39873,0.0785,0.0625,100,2,1)
            console.log(res2);
            let res3 = myfunc.ODDFPRICE(39763,44256,39736,39873,0.0785,0.0625,100,2,2)
            console.log(res3);
            let res4 = myfunc.ODDFPRICE(39763,44256,39736,39873,0.0785,0.0625,100,2,3)
            console.log(res4);
            let res5 = myfunc.ODDFPRICE(39763,44256,39736,39873,0.0785,0.0625,100,2,4)
            console.log(res5);
            let res6 = myfunc.ODDFPRICE(38773,44924,38749,39262,0.06,0.045,100,2,0)
            console.log(res6);
            let res7 = myfunc.ODDFPRICE(38773,44924,38749,39262,0.06,0.045,100,2,1)
            console.log(res7);
            let res8 = myfunc.ODDFPRICE(38773,44924,38749,39262,0.06,0.045,100,2,2)
            console.log(res8);
            let res9 = myfunc.ODDFPRICE(38773,44924,38749,39262,0.06,0.045,100,2,3)
            console.log(res9);
            let res10 = myfunc.ODDFPRICE(38773,44924,38749,39262,0.06,0.045,100,2,4)
            console.log(res10);
            assert(Math.abs(res1-113.5992)<0.02)
            assert(Math.abs(res2-113.5977)<0.05)
            assert(Math.abs(res3-113.5988)<0.05)
            assert(Math.abs(res4-113.5961)<0.05)
            assert(Math.abs(res5-113.5992)<0.02)
            assert(Math.abs(res6-117.4131)<0.4)
            assert(Math.abs(res7-117.4118)<0.4)
            assert(Math.abs(res8-117.4131)<0.4)
            assert(Math.abs(res9-117.41115)<0.4)
            assert(Math.abs(res10-117.4131)<0.4)


        });
        it('CHISQDIST', function () {
            let res1 = myfunc.CHISQDIST(2,3,false)
            console.log(res1);
            assert(Math.abs(res1-0.20755)<0.001)
            let res2 = myfunc.CHISQDIST(2,3,true)
            console.log(res2);
            assert(Math.abs(res2-0.42759)<0.001)
        });
        it('CHISQDISTRT', function () {
            let res1 = myfunc.CHISQDISTRT(18.307,10)
            console.log(res1);
            assert(Math.abs(res1-0.05)<0.001)
            let res2 = myfunc.CHISQDISTRT(20.307,8)
            console.log(res2);
            assert(Math.abs(res2-0.00923)<0.001)
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
            let res1 = myfunc.FTEST([6,7,9,15,21],[20,28,31,38,40])
            console.log(res1);
            assert(Math.abs(res1-0.64831785)<0.001)
            let res2 = myfunc.FTEST([12,42,347,8,5],[7,5,43,57,86])
            console.log(res2);
            assert(Math.abs(res2-0.015023)<0.001)
        });
        it('TTEST', function () {
            let res1 = myfunc.TTEST([3,4,5,8,55,1,2,4,55],[6,19,3,22,14,55,5,22,1],2,1)
            console.log(res1);
            assert(Math.abs(res1-0.9199744)<0.001)
            let res2 = myfunc.TTEST([3,4,5,8,55,1,2,4,55],[6,19,3,22,14,55,5,22,1],2,2)
            console.log(res2);
            assert(Math.abs(res2-0.907069)<0.001)
            let res3 = myfunc.TTEST([3,4,5,8,55,1,2,4,55],[6,19,3,22,14,55,5,22,1],1,1)
            console.log(res3);
            assert(Math.abs(res3-0.459987)<0.001)
            let res4 = myfunc.TTEST([3,4,5,8,55,1,2,4,55],[6,19,3,22,14,55,5,22,1],1,2)
            console.log(res4);
            assert(Math.abs(res4-0.4535347)<0.001)
        });
        it('DURATION', function () {
            let res1 = myfunc.DURATION(40401,40885,0.06,0.07,4,0)
            console.log(res1);

            let res2 = myfunc.DURATION(40401,40885,0.06,0.07,4,1)
            console.log(res2);

            let res3 = myfunc.DURATION(40401,40885,0.06,0.07,4,2)
            console.log(res3);

            let res4 = myfunc.DURATION(40401,40885,0.06,0.07,4,3)
            console.log(res4);

            let res5 = myfunc.DURATION(40401,40885,0.06,0.07,4,4)
            console.log(res5);
            assert(Math.abs(res1-1.270194961)<0.001)
            assert(Math.abs(res2-1.27128)<0.001)
            assert(Math.abs(res3-1.26741)<0.03)
            assert(Math.abs(res4-1.269852)<0.01)
            assert(Math.abs(res5-1.270194961)<0.001)
        });
        it('MDURATION', function () {
            let res1 = myfunc.MDURATION(40401,40885,0.06,0.07,4,0)
            console.log(res1);

            let res2 = myfunc.MDURATION(40401,40885,0.06,0.07,4,1)
            console.log(res2);

            let res3 = myfunc.MDURATION(40401,40885,0.06,0.07,4,2)
            console.log(res3);

            let res4 = myfunc.MDURATION(40401,40885,0.06,0.07,4,3)
            console.log(res4);

            let res5 = myfunc.MDURATION(40401,40885,0.06,0.07,4,4)
            console.log(res5);
            assert(Math.abs(res1-1.2483)<0.001)
            assert(Math.abs(res2-1.2494)<0.001)
            assert(Math.abs(res3-1.2456)<0.03)
            assert(Math.abs(res4-1.248)<0.002)
            assert(Math.abs(res5-1.2483)<0.001)
        });
    });
});

