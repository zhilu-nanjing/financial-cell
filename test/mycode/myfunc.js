import * as utils from '../../src/calc/calc_utils/helper.js';
import * as error from '../../src/calc/calc_utils/error_config.js';
import * as jStat from 'jstat';
import { errorObj } from '../../src/calc/calc_utils/error_config';
import { parseBool, days_str2date, parseNumber } from '../../src/calc/calc_utils/parse_helper';

const MSECOND_NUM_PER_DAY = 3600 * 24 *1000
const MONTH_NUM_PER_YEAR = 12
const DAYS_NUM_PER_YEAR =365
const DAYS_NUM_PER_YEAR_US =360

/**
 *
 * @param {number}settlement 必需。 有价证券的结算日。 有价证券结算日是在发行日之后，有价证券卖给购买者的日期。
 * @param {number}maturity 必需。 有价证券的到期日。 到期日是有价证券有效期截止时的日期。
 * @param {number}frequency 必需。 年付息次数。 如果按年支付，frequency = 1；按半年期支付，frequency = 2；按季支付，frequency = 4。
 * @returns {{startDay: *, endDay: *}}
 */
function get_Startdays_and_Enddays(settlement,maturity,frequency) {
    let settlementDate = days_str2date(settlement)
    let maturityDate = days_str2date(maturity)
    let monthBetween = maturityDate.getFullYear() * 12 + maturityDate.getMonth() - settlementDate.getFullYear() * 12 - settlementDate.getMonth()
    let N = parseInt(monthBetween / (12 / frequency))
    let endDay = utils.Copy(maturityDate)
    endDay.setMonth(endDay.getMonth() - N * 12 / frequency)
    let startDay = utils.Copy(endDay)
    startDay.setMonth(endDay.getMonth() - 12 / frequency)
    return {"startDay": startDay, "endDay": endDay}
}

/**
 *
 * @param {number}settlement 必需。 有价证券的结算日。 有价证券结算日是在发行日之后，有价证券卖给购买者的日期。
 * @param {number}maturity 必需。 有价证券的到期日。 到期日是有价证券有效期截止时的日期。
 * @param {number}frequency 必需。 年付息次数。 如果按年支付，frequency = 1；按半年期支付，frequency = 2；按季支付，frequency = 4。
 * @returns {{startDay: *, endDay: *}}
 */
function COUP_PARAMETER_TEST(settlement, maturity, frequency, basis){
    if ([0,1,2,3,4].indexOf(basis)===-1) {
        return 0;
    }
    if ([1,2,4].indexOf(frequency)===-1){
        return 0;
    }
    if (typeof(settlement)!='number'||typeof(maturity)!='number'){
        return 0;
    }
    if (settlement >= maturity) {
        return 0;
    }
}

/**
 *
 * @param {number}settlement 必需。 有价证券的结算日。 有价证券结算日是在发行日之后，有价证券卖给购买者的日期。
 * @param {number}maturity 必需。 有价证券的到期日。 到期日是有价证券有效期截止时的日期。
 * @param {number}frequency 必需。 年付息次数。 如果按年支付，frequency = 1；按半年期支付，frequency = 2；按季支付，frequency = 4
 * @param {number}basis 可选。 要使用的日计数基准类型。
 * @returns {*|Error|number}
 * @constructor
 */
export function COUPDAYBS(settlement, maturity, frequency, basis) {
    if(COUP_PARAMETER_TEST(settlement, maturity, frequency, basis) === 0){
        return errorObj.ERROR_NUM
    }
    let settlementDate = days_str2date(settlement)
    return (settlementDate - get_Startdays_and_Enddays(settlement, maturity, frequency).startDay)/ MSECOND_NUM_PER_DAY
};

/**
 *
 * @param {number}settlement 必需。 有价证券的结算日。 有价证券结算日是在发行日之后，有价证券卖给购买者的日期。
 * @param {number}maturity 必需。 有价证券的到期日。 到期日是有价证券有效期截止时的日期。
 * @param {number}frequency 必需。 年付息次数。 如果按年支付，frequency = 1；按半年期支付，frequency = 2；按季支付，frequency = 4
 * @param {number}basis 可选。 要使用的日计数基准类型。
 * @returns {*|Error|number}
 * @constructor
 */
export function COUPDAYS(settlement, maturity, frequency, basis) {
    if(COUP_PARAMETER_TEST(settlement, maturity, frequency, basis) === 0){
        return errorObj.ERROR_NUM
    }
    if ([0,2,4].indexOf(basis)>=0) {
        return DAYS_NUM_PER_YEAR_US/frequency;
    }
    if (basis===3 ) {
        return DAYS_NUM_PER_YEAR/frequency;
    }
    if (basis===1) {
        return (get_Startdays_and_Enddays(settlement, maturity, frequency).endDay - get_Startdays_and_Enddays(settlement, maturity, frequency).startDay )/ MSECOND_NUM_PER_DAY
    }
};

/**
 *
 * @param {number}settlement 必需。 有价证券的结算日。 有价证券结算日是在发行日之后，有价证券卖给购买者的日期。
 * @param {number}maturity 必需。 有价证券的到期日。 到期日是有价证券有效期截止时的日期。
 * @param {number}frequency 必需。 年付息次数。 如果按年支付，frequency = 1；按半年期支付，frequency = 2；按季支付，frequency = 4
 * @param {number}basis 可选。 要使用的日计数基准类型。
 * @returns {*|Error|number}
 * @constructor
 */
export function COUPDAYSNC(settlement, maturity, frequency, basis) {
    if(COUP_PARAMETER_TEST(settlement, maturity, frequency, basis) === 0){
        return errorObj.ERROR_NUM
    }
    let settlementDate = days_str2date(settlement)
    return (get_Startdays_and_Enddays(settlement, maturity, frequency).endDay - settlementDate) / MSECOND_NUM_PER_DAY
};


/**
 *
 * @param {number}settlement 必需。 有价证券的结算日。 有价证券结算日是在发行日之后，有价证券卖给购买者的日期。
 * @param {number}maturity 必需。 有价证券的到期日。 到期日是有价证券有效期截止时的日期。
 * @param {number}frequency 必需。 年付息次数。 如果按年支付，frequency = 1；按半年期支付，frequency = 2；按季支付，frequency = 4
 * @param {number}basis 可选。 要使用的日计数基准类型。
 * @returns {*|Error|number}
 * @constructor
 */
export function COUPNUM(settlement, maturity, frequency, basis) {
    if(COUP_PARAMETER_TEST(settlement, maturity, frequency, basis) === 0){
        return errorObj.ERROR_NUM
    }
    let settlementDate = days_str2date(settlement)
    let maturityDate = days_str2date(maturity)
    let monthBetween=maturityDate.getFullYear()*12+maturityDate.getMonth()-settlementDate.getFullYear()*12-settlementDate.getMonth()
    let N=parseInt(monthBetween/(MONTH_NUM_PER_YEAR/frequency))
    return N+1
};


/**
 *
 * @param {number}settlement 必需。 有价证券的结算日。 有价证券结算日是在发行日之后，有价证券卖给购买者的日期。
 * @param {number}maturity 必需。 有价证券的到期日。 到期日是有价证券有效期截止时的日期。
 * @param {number}frequency 必需。 年付息次数。 如果按年支付，frequency = 1；按半年期支付，frequency = 2；按季支付，frequency = 4
 * @param {number}basis 可选。 要使用的日计数基准类型。
 * @returns {*|Error|number}
 * @constructor
 */
export function COUPPCD(settlement, maturity, frequency, basis) {
    if(COUP_PARAMETER_TEST(settlement, maturity, frequency, basis) === 0){
        return errorObj.ERROR_NUM
    }
    return get_Startdays_and_Enddays(settlement, maturity, frequency).startDay
};
/**
 *
 * @param {number}settlement 必需。 有价证券的结算日。 有价证券结算日是在发行日之后，有价证券卖给购买者的日期。
 * @param {number}maturity 必需。 有价证券的到期日。 到期日是有价证券有效期截止时的日期。
 * @param {number}frequency 必需。 年付息次数。 如果按年支付，frequency = 1；按半年期支付，frequency = 2；按季支付，frequency = 4
 * @param {number}basis 可选。 要使用的日计数基准类型。
 * @returns {*|Error|number}
 * @constructor
 */
export function COUPNCD(settlement, maturity, frequency, basis) {
    if(COUP_PARAMETER_TEST(settlement, maturity, frequency, basis) === 0){
        return errorObj.ERROR_NUM
    }
    return get_Startdays_and_Enddays(settlement, maturity, frequency).endDay
};

/**
 *
 * @param {Number} settlement 有价证券的结算日
 * @param {Number}maturity 有价证券的到期日
 * @param {Number}rate  有价证券的年息票利率
 * @param {Number}price  有价证券的价格（按面值为 ￥100 计算）
 * @param {Number}redemption  面值 ￥100 的有价证券的清偿价值
 * @param {Number}frequency  年付息次数
 * @param {Number}basis  要使用的日计数基准类型
 * @returns {number|*}
 * @constructor
 */
exports.YIELD = function (settlement, maturity, rate, price, redemption, frequency, basis) {
    let settlementDate = days_str2date(settlement);
    let maturityDate = days_str2date(maturity);
    if (utils.anyIsError(settlement, maturity)) {
        return error.value;
    }
    if(rate <= 0){
        return error.num;
    }
    if (price <= 0) {
        return error.num;
    }
    if (redemption <= 0){
        return error.num
    }
    if (settlement >= maturity  ) {
        return error.num;
    }
    let monthBetween = maturityDate.getFullYear()*MONTH_NUM_PER_YEAR+maturityDate.getMonth()-settlementDate.getFullYear()*MONTH_NUM_PER_YEAR-settlementDate.getMonth()
    let N =parseInt(monthBetween/(MONTH_NUM_PER_YEAR/frequency))
    let endDay=utils.Copy(maturityDate)
    endDay.setMonth(endDay.getMonth()-N*MONTH_NUM_PER_YEAR/frequency)
    let startDay= utils.Copy(endDay)
    startDay.setMonth(startDay.getMonth()-MONTH_NUM_PER_YEAR/frequency)
    let DSC = (endDay-settlementDate)/ (MSECOND_NUM_PER_DAY)
    let E = (endDay-startDay)/ (MSECOND_NUM_PER_DAY)
    let A = (settlementDate-startDay)/ (MSECOND_NUM_PER_DAY)
    let DSR = (maturityDate-settlementDate)/ (MSECOND_NUM_PER_DAY)
    let price1
    let price2
    if(N < 1){
        let yld = ((redemption/100+rate/frequency)-(price/100+(A*rate/E/frequency)))*frequency*E/(price/100+(A*rate/E/frequency))/DSR
        return yld
    }
    else if(N >= 1) {
        for (let yld = 0.01; yld <= 2; yld+=0.0001) {
            price1 = redemption / Math.pow(1 + yld / frequency, N - 1 + DSC / E) - ((100 * rate * A) / (frequency * E))
            price2 = (100 * rate) / (frequency * Math.pow(1 + yld / frequency, DSC / E))
            for (let k = 2; k <= N; k++) {
                price2 = price2 + (100 * rate) / (frequency * Math.pow(1 + yld / frequency, k - 1 + DSC / E))
            }
            let expectPrice = price1 + price2
            if(Math.abs(expectPrice - price)<= 0.1 ){
                return yld
            }
            else {
                console.log("yld",yld)
            }
        }
    }
};

/**TODO 结果的精确度可以再提高 by 旺旺 2019/12/9
 *
 * @param {Number}settlement 有价证券的结算日
 * @param {Number}maturity 有价证券的到期日
 * @param {Number}issue 有价证券的发行日
 * @param {Number}rate 有价证券在发行日的利率
 * @param {Number}price 有价证券的价格（按面值为 ￥100 计算）
 * @param {Number}basis 可选  要使用的日计数基准类型
 * @returns {number|*}
 * @constructor
 */
exports.YIELDMAT = function (settlement, maturity,issue, rate, price, basis) {
    let settlementDate = days_str2date(settlement);
    let maturityDate = days_str2date(maturity);
    let issueDate = days_str2date(issue)
    if (utils.anyIsError(settlement, maturity,issue)) {
        return error.value;
    }
    if(rate <= 0){
        return error.num;
    }
    if (price <= 0) {
        return error.num;
    }
    if (settlement >= maturity || issue >= settlement ) {
        return error.num;
    }
    let DSM = (maturityDate-settlementDate)/ (MSECOND_NUM_PER_DAY)
    let DIM = (maturityDate-issueDate)/ (MSECOND_NUM_PER_DAY)
    let A = (settlementDate-issueDate)/ (MSECOND_NUM_PER_DAY)
    for (let yld = 0.01; yld <= 2; yld+=0.0001) {
        let priceMat = (100+(DIM/365*rate*100))/(1+(DSM/365*yld))-(A*rate*100/365)
        if(Math.abs(priceMat - price)<= 0.001 ){
            return yld
        }
        else {
            console.log("yld",yld)
        }
    }
};
/**TODO 结果的精确度可以再提高 by 旺旺 2019/12/9
 *
 * @param {Number}settlement 必需。 有价证券的结算日。 有价证券结算日是在发行日之后，有价证券卖给购买者的日期。
 * @param {Number}maturity 必需。 有价证券的到期日。 到期日是有价证券有效期截止时的日期。
 * @param {Number}issue 必需。 有价证券的发行日。
 * @param {Number}first_coupon 必需。 有价证券的首期付息日。
 * @param {Number}rate 必需。 有价证券的利率。
 * @param {Number}yld 必需。 有价证券的年收益率。
 * @param {Number}redemption 必需。 面值 ￥100 的有价证券的清偿价值。
 * @param {Number}frequency 必需。 年付息次数。
 * @param {Number}basis 可选。 要使用的日计数基准类型。
 * @returns {number|*}
 * @constructor
 */
exports.ODDFPRICE = function (settlement, maturity, issue,first_coupon,rate, yld, redemption, frequency, basis) {
    let settlementDate = days_str2date(settlement);
    let maturityDate = days_str2date(maturity);
    let issueDate = days_str2date(issue);
    let first_couponDate = days_str2date(first_coupon);
    if (utils.anyIsError(settlement, maturity,issue,first_coupon)) {
        return error.value;
    }
    if(rate <= 0){
        return error.num;
    }
    if (redemption <= 0){
        return error.num
    }
    if (first_coupon >= maturity || issue >= settlement || settlement >= first_coupon) {
        return error.num;
    }
    let monthBetween = maturityDate.getFullYear()*MONTH_NUM_PER_YEAR+maturityDate.getMonth()-settlementDate.getFullYear()*MONTH_NUM_PER_YEAR-settlementDate.getMonth()
    let N =Math.ceil(monthBetween/(MONTH_NUM_PER_YEAR/frequency))
    let endDay=utils.Copy(maturityDate)
    endDay.setMonth(endDay.getMonth()-N*MONTH_NUM_PER_YEAR/frequency)
    let startDay= utils.Copy(endDay)
    startDay.setMonth(startDay.getMonth()-MONTH_NUM_PER_YEAR/frequency)
    let DSC = (endDay-settlementDate)/ (MSECOND_NUM_PER_DAY)
    let DFC = (first_couponDate - issueDate)/ (MSECOND_NUM_PER_DAY)
    let E = (endDay-startDay)/ (MSECOND_NUM_PER_DAY)
    let A = (settlementDate-startDay)/ (MSECOND_NUM_PER_DAY)
    let price1
    let price2 = 0
        price1 = (redemption/Math.pow(1 + yld / frequency, N - 1 + DSC / E))+(100*rate*DFC/frequency/E/Math.pow(1 + yld / frequency,  DSC / E))- ((100 * rate * A) / (frequency * E))
    for (let k = 2; k <= N; k++) {
        price2 = price2 + (100 * rate) / (frequency * Math.pow(1 + yld / frequency, k - 1 + DSC / E))
    }
    return price1 + price2
    }
/**
 *
 * @param {Number}x 必需。 用来计算分布的数值
 * @param {Number}k 必需。 自由度数,即样本个数
 * @param {Boolean}cumulative 必需。 决定函数形式的逻辑值
 * @returns {*|Error}
 * @constructor
 */
exports.CHISQDIST = function(x, k, cumulative) {
    cumulative = parseBool(cumulative)
    if (x < 0){
        return errorObj.ERROR_NUM
    }
    x = parseNumber(x);
    k = parseNumber(k);
    if (utils.anyIsError(x, k)) {
        return errorObj.ERROR_VALUE;
    }
    return (cumulative) ? jStat.chisquare.cdf(x, k) : jStat.chisquare.pdf(x, k);
};

/**
 *
 * @param x {Number}x 必需。 用来计算分布的数值
 * @param k {Number}k 必需。 自由度数,即样本个数
 * @returns {*|Error|number}
 * @constructor
 */
exports.CHISQDISTRT = function(x, k) {
    if (!x || !k) {
        return errorObj.ERROR_NA;
    }

    if (x < 1 || k > Math.pow(10, 10)) {
        return errorObj.ERROR_NUM;
    }

    if ((typeof x !== 'number') || (typeof k !== 'number')) {
        return errorObj.ERROR_VALUE;
    }

    return 1 -  jStat.chisquare.cdf(x, k);
};

/**
 *
 * @param x {Number}probability 必需。 与 χ2 分布相关联的概率。
 * @param k {Number}k 必需。 自由度数。
 * @returns {*|Error}
 * @constructor
 */
exports.CHISQINV = function(probability, k) {
    probability = parseNumber(probability);
    k = parseNumber(k);
    if (utils.anyIsError(probability, k)) {
        return errorObj.ERROR_VALUE;
    }
    return jStat.chisquare.inv(probability, k);
};

/**
 *
 * @param x {Number}probability 必需。 与 χ2 分布相关联的概率。
 * @param k {Number}k 必需。 自由度数。
 * @returns {*|Error}
 * @constructor
 */
exports.CHISQINVRT = function(probability, k) {
    if (!probability | !k) {
        return errorObj.ERROR_NA;
    }

    if (probability < 0 || probability > 1 || k < 1 || k > Math.pow(10, 10)) {
        return errorObj.ERROR_NUM;
    }

    if ((typeof probability !== 'number') || (typeof k !== 'number')) {
        return errorObj.ERROR_VALUE;
    }

    return jStat.chisquare.inv(1.0 - probability, k);
};


function variance(array) {
        let avg = jStat.mean(array)
        let sum = 0;
        for (let i = 0; i < array.length; i++) {
            sum += Math.pow((array[i] - avg), 2);
        }
        return sum/(array.length - 1);
    };

/**
 *
 * @param{arr} array1 必需。 第一个数组或数据区域。
 * @param{arr}array2 必需。 第二个数组或数据区域。
 * @returns {*|Error|number}
 * @constructor
 */
exports.FTEST = function (array1, array2) {
    if (!array1 || !array2) {
        return errorObj.ERROR_NA;
    }

    if (!(array1 instanceof Array) || !(array2 instanceof Array)) {
        return errorObj.ERROR_NA;
    }

    if (array1.length < 2 || array2.length < 2) {
        return errorObj.ERROR_DIV0;
    }
    let sum1 = jStat.variance(array1);
    let sum2 = jStat.variance(array2);
    if(sum1 >= sum2){
        return 2*jStat.ftest(sum1/sum2,array1.length - 1,array2.length - 1);
    }
    if(sum2 > sum1){
        return 2*jStat.ftest(sum2/sum1,array2.length - 1,array1.length - 1);
    }

};

/**
 *
 * @param {arr} array1 必需。 第一个数组或数据区域。
 * @param {arr}array2 必需。 第二个数组或数据区域。
 * @param {Number}tails 必需。 指定分布尾数。 如果 tails = 1，则 T.TEST 使用单尾分布。 如果 tails = 2，则 T.TEST 使用双尾分布。
 * @param {Number}type 必需。 要执行的 t 检验的类型。
 * @returns {*|Error}
 * @constructor
 */
exports.TTEST = function (array1, array2,tails,type) {
    if (!array1 || !array2) {
        return errorObj.ERROR_NA;
    }

    if (!(array1 instanceof Array) || !(array2 instanceof Array)) {
        return errorObj.ERROR_NA;
    }

    if (array1.length < 2 || array2.length < 2) {
        return errorObj.ERROR_DIV0;
    }
    let sum1 = variance(array1);
    let sum2 = variance(array2);
    let value = Math.abs(jStat.mean(array1) - jStat.mean(array2)) / Math.sqrt(sum1/array1.length + sum2/array2.length);
    if(type === 2){
        let arrayNew = array1.concat(array2);
        if(tails === 1){
            return jStat.anovaftest( array1, array2)/2 ;
        }
        if(tails === 2){
            return jStat.anovaftest( array1, array2) ;
        }
    }
    if(type === 1){
        let array3 = array1.map((curValue,index) => array2[index] - curValue)
        return jStat.ttest(0, array3, tails)
    }
};

export function DURATION(settlement, maturity, coupon, yld, frequency, basis){
    let settlementDate = days_str2date(settlement);
    let maturityDate = days_str2date(maturity);
    if (basis<0 || basis > 4){
        return errorObj.ERROR_NUM
    }
    if (settlement >= maturity){
        return errorObj.ERROR_NUM
    }
    let monthBetween = maturityDate.getFullYear()*MONTH_NUM_PER_YEAR+maturityDate.getMonth()-settlementDate.getFullYear()*MONTH_NUM_PER_YEAR-settlementDate.getMonth()
    let N =parseInt(monthBetween/(MONTH_NUM_PER_YEAR/frequency))
    let endDay=utils.Copy(maturityDate)
    endDay.setMonth(endDay.getMonth()-N*MONTH_NUM_PER_YEAR/frequency)
    let startDay= utils.Copy(endDay)
    startDay.setMonth(startDay.getMonth()-MONTH_NUM_PER_YEAR/frequency)
    let DSC = (endDay-settlementDate)/ (MSECOND_NUM_PER_DAY)
    let E = (endDay-startDay)/ (MSECOND_NUM_PER_DAY)
    let A = (settlementDate-startDay)/ (MSECOND_NUM_PER_DAY)
    let DSR = (maturityDate-settlementDate)/ (MSECOND_NUM_PER_DAY)
    let presentValue = 0
    for (let i =1;i<=N +1 ;i++){
        presentValue = presentValue + (coupon*100/frequency)/Math.pow(1 + yld / frequency, (DSC+(i-1)*E) / E)
    }
    presentValue = presentValue + 100/Math.pow(1 + yld / frequency, DSR / E)
    let dur = 0
    for (let i =1;i<=N +1 ;i++){
        dur = dur + (DSC+(i-1)*E)/DAYS_NUM_PER_YEAR*((coupon*100/frequency)/Math.pow(1 + yld / frequency, (DSC+(i-1)*E) / E))/presentValue
    }
    return dur + DSR/DAYS_NUM_PER_YEAR*(100/Math.pow(1 + yld / frequency, DSR / E))/presentValue
}

export function MDURATION(settlement, maturity, coupon, yld, frequency, basis){
    let settlementDate = days_str2date(settlement);
    let maturityDate = days_str2date(maturity);
    if (basis<0 || basis > 4){
        return errorObj.ERROR_NUM
    }
    if (settlement >= maturity){
        return errorObj.ERROR_NUM
    }
    return DURATION(settlement, maturity, coupon, yld, frequency, basis)/(1+yld/frequency)
}