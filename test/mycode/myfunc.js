import * as utils from '../../src/calc/expression_fn/lib/utils.js';
import * as error from '../../src/calc/calc_utils/error_config.js';
import * as jStat from 'jstat'
import {errorObj} from "../../src/calc/calc_utils/error_config";

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
    let settlementDate = utils.parseDate(settlement);
    let maturityDate = utils.parseDate(maturity);
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
    let monthBetween = maturityDate.getFullYear()*12+maturityDate.getMonth()-settlementDate.getFullYear()*12-settlementDate.getMonth()
    let N =parseInt(monthBetween/(12/frequency))
    let endDay=utils.Copy(maturityDate)
    endDay.setMonth(endDay.getMonth()-N*12/frequency)
    let startDay= utils.Copy(endDay)
    startDay.setMonth(startDay.getMonth()-12/frequency)
    let DSC = (endDay-settlementDate)/ (1000 * 60 * 60 * 24)
    let E = (endDay-startDay)/ (1000 * 60 * 60 * 24)
    let A = (settlementDate-startDay)/ (1000 * 60 * 60 * 24)
    let DSR = (maturityDate-settlementDate)/ (1000 * 60 * 60 * 24)
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
    let settlementDate = utils.parseDate(settlement);
    let maturityDate = utils.parseDate(maturity);
    let issueDate = utils.parseDate(issue)
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
    let DSM = (maturityDate-settlementDate)/ (1000 * 60 * 60 * 24)
    let DIM = (maturityDate-issueDate)/ (1000 * 60 * 60 * 24)
    let A = (settlementDate-issueDate)/ (1000 * 60 * 60 * 24)
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
 * @param {Number}settlement
 * @param {Number}maturity
 * @param {Number}issue
 * @param {Number}first_coupon
 * @param {Number}rate
 * @param {Number}yld
 * @param {Number}redemption
 * @param {Number}frequency
 * @param {Number}basis
 * @returns {number|*}
 * @constructor
 */
exports.ODDFPRICE = function (settlement, maturity, issue,first_coupon,rate, yld, redemption, frequency, basis) {
    let settlementDate = utils.parseDate(settlement);
    let maturityDate = utils.parseDate(maturity);
    let issueDate = utils.parseDate(issue);
    let first_couponDate = utils.parseDate(first_coupon);
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
    let monthBetween = maturityDate.getFullYear()*12+maturityDate.getMonth()-settlementDate.getFullYear()*12-settlementDate.getMonth()
    let N =Math.ceil(monthBetween/(12/frequency))
    let endDay=utils.Copy(maturityDate)
    endDay.setMonth(endDay.getMonth()-N*12/frequency)
    let startDay= utils.Copy(endDay)
    startDay.setMonth(startDay.getMonth()-12/frequency)
    let DSC = (endDay-settlementDate)/ (1000 * 60 * 60 * 24)
    let DFC = (first_couponDate - issueDate)/ (1000 * 60 * 60 * 24)
    let E = (endDay-startDay)/ (1000 * 60 * 60 * 24)
    let A = (settlementDate-startDay)/ (1000 * 60 * 60 * 24)
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
    cumulative = utils.parseBool(cumulative)
    if (x < 0){
        return errorObj.ERROR_NUM
    }
    x = utils.parseNumber(x);
    k = utils.parseNumber(k);
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

//
