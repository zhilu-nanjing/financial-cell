import assert from 'assert'
import * as myfunc from "./myfunc";


describe('expression_fn integration', function () {
    describe('func', function () {
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
    });
});

