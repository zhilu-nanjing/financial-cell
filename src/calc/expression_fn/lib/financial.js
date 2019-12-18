import { errorObj } from '../../calc_utils/error_config';
import * as dateTime from './date_time';
import * as utils from '../../calc_utils/helper';
import * as jStat from 'jstat';
import {dayNum2Date, days_str2date, parseBool, parseNumber} from '../../calc_utils/parse_helper';

function validDate(d){
  return d && d.getTime && !isNaN(d.getTime());
}


/**TODO basis =1 时有差异
 *
 * @param {number}issue 必需。 有价证券的发行日。
 * @param {number}first 必需。 有价证券的首次计息日。
 * @param {number}settlement 必需。 有价证券的结算日。 有价证券结算日是在发行日之后，有价证券卖给购买者的日期。
 * @param {number}rate 必需。 有价证券的年息票利率。
 * @param{number} par 必需。 证券的票面值。 如果省略此参数，则 ACCRINT 使用 ￥10,000。
 * @param {number}frequency 必需。 年付息次数。 如果按年支付，frequency = 1；按半年期支付，frequency = 2；按季支付，frequency = 4。
 * @param {number}basis 可选。 要使用的日计数基准类型。
 * @param {boolean}Calc_method 可选。 一个逻辑值，指定当结算日期晚于首次计息日期时用于计算总应计利息的方法。
 *                    如果值为 TRUE (1)，则返回从发行日到结算日的总应计利息。
 *                    如果值为 FALSE (0)，则返回从首次计息日到结算日的应计利息。 如果不输入此参数，则默认为 TRUE。
 * @returns {*|Error|number}
 * @constructor
 */
export function ACCRINT(issue, first, settlement, rate, par, frequency, basis,Calc_method) {
  if (rate <= 0 || par <= 0) {
    return errorObj.ERROR_NUM;
  }
  if ([1, 2, 4].indexOf(frequency) === -1) {
    return errorObj.ERROR_NUM;
  }
  if ([0, 1, 2, 3, 4].indexOf(basis) === -1) {
    return errorObj.ERROR_NUM;
  }
  if (settlement <= issue) {
    return errorObj.ERROR_NUM;
  }
  let Calcmethod = parseBool(Calc_method)
  par = par || 10000;
  basis = basis || 0;
  return par * rate * dateTime.YEARFRAC(issue, settlement, basis);
};

/**
 *
 * @param {number}issue 必需。 有价证券的发行日。
 * @param {number}settlement 必需。 有价证券的到期日。
 * @param {number}rate 必需。 有价证券的年息票利率。
 * @param {number}par 必需。 证券的票面值。 如果省略此参数，则 ACCRINTM 使用 ￥10,000。
 * @param {number}basis 可选。 要使用的日计数基准类型。
 * @returns {*|Error|number}
 * @constructor
 */
export function ACCRINTM(issue, settlement, rate, par, basis) {
  if (rate <= 0 || par <= 0) {
    return errorObj.ERROR_NUM;
  }
  if (basis < 0 || basis > 4) {
    return errorObj.ERROR_NUM;
  }
  if (settlement <= issue) {
    return errorObj.ERROR_NUM;
  }
  par = par || 10000;
  basis = basis || 0;
  return par * rate * dateTime.YEARFRAC(issue, settlement, basis);
}

// TODO
//XW: 待实现
exports.AMORDEGRC = function (cost, date_purchased, first_period, salvage, period, rate, basis) {
  if (!validDate(issue) || !validDate(settlement)) {
    return errorObj.ERROR_VALUE;
  }
  // Return error if either rate or par are lower than or equal to zero
  if (rate <= 0 || par <= 0) {
    return errorObj.ERROR_NUM;
  }
  if (basis < 0 || basis > 4) {
    return errorObj.ERROR_NUM;
  }
  // Return error if settlement is before or equal to issue
  if (settlement <= issue) {
    return errorObj.ERROR_NUM;
  }
};

// TODO
exports.AMORLINC = function() {
  throw new Error('AMORLINC is not implemented');
};


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
  let N = parseInt((maturityDate.getFullYear()*12+maturityDate.getMonth()-settlementDate.getFullYear()*12-settlementDate.getMonth())/(12/frequency))
  let testDate = utils.Copy(maturityDate)
  testDate.setMonth(testDate.getMonth() - N* 12 / frequency)
  if(testDate > settlementDate){
    N = N + 1
  }
  else{
    N
  }
  let endDay = utils.Copy(maturityDate)
  endDay.setMonth(endDay.getMonth() - (N-1) * 12 / frequency)
  let startDay = utils.Copy(endDay)
  startDay.setMonth(endDay.getMonth() - 12 / frequency)
  return {"startDay": startDay, "endDay": endDay,"N": N}
}

/**
 *
 * @param {number}settlement 必需。 有价证券的结算日。 有价证券结算日是在发行日之后，有价证券卖给购买者的日期。
 * @param {number}maturity 必需。 有价证券的到期日。 到期日是有价证券有效期截止时的日期。
 * @param {number}frequency 必需。 年付息次数。 如果按年支付，frequency = 1；按半年期支付，frequency = 2；按季支付，frequency = 4。
 * @returns {{startDay: *, endDay: *}}
 */
function COUP_PARAMETER_TEST(settlement, maturity, frequency, basis){
  if ([0,1,2,3,4].indexOf(basis)===-1 & basis !== undefined) {
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
 * @param {number}dateafter 较大的日子
 * @param {number}datebefore 较小的日子
 * @param {number}basis 可选。 要使用的日计数基准类型。
 * @returns {number}
 * @constructor
 */
function DAYSBETWEEN_AFTER_BASIS_TEST(dateafter,datebefore,basis) {
  if ([1, 2, 3].indexOf(basis) >= 0) {
    return (dateafter - datebefore) / (MSECOND_NUM_PER_DAY)
  } else {
    let monthsBetween = dateafter.getFullYear() * MONTH_NUM_PER_YEAR + dateafter.getMonth()
        - datebefore.getFullYear() * MONTH_NUM_PER_YEAR - datebefore.getMonth() - 1
    return monthsBetween * DAYS_NUM_PER_MONTH_US + DAYS_NUM_PER_MONTH_US - datebefore.getDate() + dateafter.getDate()
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
  let startDay = get_Startdays_and_Enddays(settlement, maturity, frequency).startDay
  return DAYSBETWEEN_AFTER_BASIS_TEST(settlementDate,startDay,basis)
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
  if (basis===3 ) {
    return DAYS_NUM_PER_YEAR/frequency;
  }
  if (basis===1) {
    return (get_Startdays_and_Enddays(settlement, maturity, frequency).endDay
        - get_Startdays_and_Enddays(settlement, maturity, frequency).startDay )/ MSECOND_NUM_PER_DAY
  }
  else {
    return DAYS_NUM_PER_YEAR_US/frequency;
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
  let endDay = get_Startdays_and_Enddays(settlement, maturity, frequency).endDay
  return DAYSBETWEEN_AFTER_BASIS_TEST(endDay,settlementDate,basis)
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
  return get_Startdays_and_Enddays(settlement, maturity, frequency).N
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


exports.CUMIPMT = function(rate, periods, value, start, end, type) {
  // Credits: algorithm inspired by Apache OpenOffice
  // Credits: Hannes Stiebitzhofer for the translations of function and variable names
  // Requires exports.FV() and exports.PMT() from exports.js [http://stoic.com/exports/]

  rate = parseNumber(rate);
  periods = parseNumber(periods);
  value = parseNumber(value);
  if (utils.anyIsError(rate, periods, value)) {
    return errorObj.ERROR_VALUE;
  }

  // Return error if either rate, periods, or value are lower than or equal to zero
  if (rate <= 0 || periods <= 0 || value <= 0) {
    return errorObj.ERROR_NUM;
  }

  // Return error if deal1Char < 1, end < 1, or deal1Char > end
  if (start < 1 || end < 1 || start > end) {
    return errorObj.ERROR_NUM;
  }

  // Return error if type is neither 0 nor 1
  if (type !== 0 && type !== 1) {
    return errorObj.ERROR_NUM;
  }

  // Compute cumulative interest
  let payment = exports.PMT(rate, periods, value, 0, type);
  let interest = 0;

  if (start === 1) {
    if (type === 0) {
      interest = -value;
      start++;
    }
  }

  for (let i = start; i <= end; i++) {
    if (type === 1) {
      interest += exports.FV(rate, i - 2, payment, value, 1) - payment;
    } else {
      interest += exports.FV(rate, i - 1, payment, value, 0);
    }
  }
  interest *= rate;

  // Return cumulative interest
  return interest;
};

exports.CUMPRINC = function(rate, periods, value, start, end, type) {
  // Credits: algorithm inspired by Apache OpenOffice
  // Credits: Hannes Stiebitzhofer for the translations of function and variable names

  rate = parseNumber(rate);
  periods = parseNumber(periods);
  value = parseNumber(value);
  if (utils.anyIsError(rate, periods, value)) {
    return errorObj.ERROR_VALUE;
  }

  // Return error if either rate, periods, or value are lower than or equal to zero
  if (rate <= 0 || periods <= 0 || value <= 0) {
    return errorObj.ERROR_NUM;
  }

  // Return error if deal1Char < 1, end < 1, or deal1Char > end
  if (start < 1 || end < 1 || start > end) {
    return errorObj.ERROR_NUM;
  }

  // Return error if type is neither 0 nor 1
  if (type !== 0 && type !== 1) {
    return errorObj.ERROR_NUM;
  }

  // Compute cumulative principal
  let payment = exports.PMT(rate, periods, value, 0, type);
  let principal = 0;
  if (start === 1) {
    if (type === 0) {
      principal = payment + value * rate;
    } else {
      principal = payment;
    }
    start++;
  }
  for (let i = start; i <= end; i++) {
    if (type > 0) {
      principal += payment - (exports.FV(rate, i - 2, payment, value, 1) - payment) * rate;
    } else {
      principal += payment - exports.FV(rate, i - 1, payment, value, 0) * rate;
    }
  }

  // Return cumulative principal
  return principal;
};

exports.DB = function(cost, salvage, life, period, month) {
  // Initialize month
  month = (month === undefined) ? 12 : month;

  cost = parseNumber(cost);
  salvage = parseNumber(salvage);
  life = parseNumber(life);
  period = parseNumber(period);
  month = parseNumber(month);
  if (utils.anyIsError(cost, salvage, life, period, month)) {
    return errorObj.ERROR_VALUE;
  }

  // Return error if any of the parameters is negative
  if (cost < 0 || salvage < 0 || life < 0 || period < 0) {
    return errorObj.ERROR_NUM;
  }

  // Return error if month is not an integer between 1 and 12
  if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].indexOf(month) === -1) {
    return errorObj.ERROR_NUM;
  }

  // Return error if period is greater than life
  if (period > life) {
    return errorObj.ERROR_NUM;
  }

  // Return 0 (zero) if salvage is greater than or equal to cost
  if (salvage >= cost) {
    return 0;
  }

  // Rate is rounded to three decimals places
  let rate = (1 - Math.pow(salvage / cost, 1 / life)).toFixed(3);

  // Compute initial depreciation
  let initial = cost * rate * month / 12;

  // Compute total depreciation
  let total = initial;
  let current = 0;
  let ceiling = (period === life) ? life - 1 : period;
  for (let i = 2; i <= ceiling; i++) {
    current = (cost - total) * rate;
    total += current;
  }

  // Depreciation for the first and last periods are special cases
  if (period === 1) {
    // First period
    return initial;
  } else if (period === life) {
    // Last period
    return (cost - total) * rate;
  } else {
    return current;
  }
};

exports.DDB = function(cost, salvage, life, period, factor) {
  // Initialize factor
  factor = (factor === undefined) ? 2 : factor;

  cost = parseNumber(cost);
  salvage = parseNumber(salvage);
  life = parseNumber(life);
  period = parseNumber(period);
  factor = parseNumber(factor);
  if (utils.anyIsError(cost, salvage, life, period, factor)) {
    return errorObj.ERROR_VALUE;
  }

  // Return error if any of the parameters is negative or if factor is null
  if (cost < 0 || salvage < 0 || life < 0 || period < 0 || factor <= 0) {
    return errorObj.ERROR_NUM;
  }

  // Return error if period is greater than life
  if (period > life) {
    return errorObj.ERROR_NUM;
  }

  // Return 0 (zero) if salvage is greater than or equal to cost
  if (salvage >= cost) {
    return 0;
  }

  // Compute depreciation
  let total = 0;
  let current = 0;
  for (let i = 1; i <= period; i++) {
    current = Math.min((cost - total) * (factor / life), (cost - salvage - total));
    total += current;
  }

  // Return depreciation
  return current;
};

// TODO
exports.DISC = function (settlement,maturity,pr,redemption,basis) {
  if (pr<=0 || redemption<=0){
    return errorObj.ERROR_NUM
  }
  if (basis<0 || basis >4){
    return errorObj.ERROR_NUM
  }
  if (settlement >= maturity){
    return errorObj.ERROR_NUM
  }
  let B = 360
  let DSM = Math.abs(dateTime.DAYS(maturity, settlement, false))
  return (redemption-pr)/pr * B /DSM
};

exports.DOLLARDE = function(dollar, fraction) {
  // Credits: algorithm inspired by Apache OpenOffice

  dollar = parseNumber(dollar);
  fraction = parseNumber(fraction);
  if (utils.anyIsError(dollar, fraction)) {
    return errorObj.ERROR_VALUE;
  }

  // Return error if fraction is negative
  if (fraction < 0) {
    return errorObj.ERROR_NUM;
  }

  // Return error if fraction is greater than or equal to 0 and less than 1
  if (fraction >= 0 && fraction < 1) {
    return errorObj.ERROR_DIV0;
  }

  // Truncate fraction if it is not an integer
  fraction = parseInt(fraction, 10);

  // Compute integer part
  let result = parseInt(dollar, 10);

  // Add decimal part
  result += (dollar % 1) * Math.pow(10, Math.ceil(Math.log(fraction) / Math.LN10)) / fraction;

  // Round result
  let power = Math.pow(10, Math.ceil(Math.log(fraction) / Math.LN2) + 1);
  result = Math.round(result * power) / power;

  // Return converted dollar price
  return result;
};

exports.DOLLARFR = function(dollar, fraction) {
  // Credits: algorithm inspired by Apache OpenOffice

  dollar = parseNumber(dollar);
  fraction = parseNumber(fraction);
  if (utils.anyIsError(dollar, fraction)) {
    return errorObj.ERROR_VALUE;
  }

  // Return error if fraction is negative
  if (fraction < 0) {
    return errorObj.ERROR_NUM;
  }

  // Return error if fraction is greater than or equal to 0 and less than 1
  if (fraction >= 0 && fraction < 1) {
    return errorObj.ERROR_DIV0;
  }

  // Truncate fraction if it is not an integer
  fraction = parseInt(fraction, 10);

  // Compute integer part
  let result = parseInt(dollar, 10);

  // Add decimal part
  result += (dollar % 1) * Math.pow(10, -Math.ceil(Math.log(fraction) / Math.LN10)) * fraction;

  // Return converted dollar price
  return result;
};

// TODO
//XW：待实现
exports.DURATION = function (settlement, maturity, coupon, yld, frequency, basis) {
  settlement = dayNum2Date(settlement);
  maturity = dayNum2Date(maturity);
  if (!validDate(maturity) || !validDate(settlement)) {
    return errorObj.ERROR_VALUE;
  }
  if (basis<0 || basis > 4){
    return errorObj.ERROR_NUM
  }
  if (settlement >= maturity){
    return errorObj.ERROR_NUM
  }
};
//XW：end

exports.EFFECT = function(rate, periods) {
  rate = parseNumber(rate);
  periods = parseNumber(periods);
  if (utils.anyIsError(rate, periods)) {
    return errorObj.ERROR_VALUE;
  }

  // Return error if rate <=0 or periods < 1
  if (rate <= 0 || periods < 1) {
    return errorObj.ERROR_NUM;
  }

  // Truncate periods if it is not an integer
  periods = parseInt(periods, 10);

  // Return effective annual interest rate
  return Math.pow(1 + rate / periods, periods) - 1;
};

exports.FV = function(rate, periods, payment, value, type) {
  // Credits: algorithm inspired by Apache OpenOffice

  value = value || 0;
  type = type || 0;

  rate = parseNumber(rate);
  periods = parseNumber(periods);
  payment = parseNumber(payment);
  value = parseNumber(value);
  type = parseNumber(type);
  if (utils.anyIsError(rate, periods, payment, value, type)) {
    return errorObj.ERROR_VALUE;
  }

  // Return future value
  let result;
  if (rate === 0) {
    result = value + payment * periods;
  } else {
    let term = Math.pow(1 + rate, periods);
    if (type === 1) {
      result = value * term + payment * (1 + rate) * (term - 1) / rate;
    } else {
      result = value * term + payment * (term - 1) / rate;
    }
  }
  return -result;
};

exports.FVSCHEDULE = function (principal, schedule) {
  principal = parseNumber(principal);
  if (typeof schedule === 'string'){
    schedule = utils.strToMatrix(schedule)
  }
  schedule = parseNumberArray(utils.flatten(schedule));
  if (utils.anyIsError(principal, schedule)) {
    return errorObj.ERROR_VALUE;
  }

  let n = schedule.length;
  let future = principal;

  // Apply all interests in schedule
  for (let i = 0; i < n; i++) {
    // Apply scheduled interest
    future *= 1 + schedule[i];
  }

  // Return future value
  return future;
};

// XW：INTRATE实现
exports.INTRATE = function (settlement, maturity, investment, redemption, basis) {
  //https://support.office.com/zh-cn/article/intrate-%E5%87%BD%E6%95%B0-5cb34dde-a221-4cb6-b3eb-0b9e55e1316f
  if (investment<=0 || redemption<=0){
    return errorObj.ERROR_VALUE
  }
  if (basis<0 || basis > 4){
    return errorObj.ERROR_NUM
  }
  if (settlement >= maturity){
    return errorObj.ERROR_NUM
  }
  let B = 1//一年之中的天数，取决于年基准数。
  let DIM = 2// 结算日与到期日之间的天数。
  return (redemption-investment)/investment *(B/DIM)
};
//XW：end

exports.IPMT = function(rate, period, periods, present, future, type) {
  // Credits: algorithm inspired by Apache OpenOffice

  future = future || 0;
  type = type || 0;

  rate = parseNumber(rate);
  period = parseNumber(period);
  periods = parseNumber(periods);
  present = parseNumber(present);
  future = parseNumber(future);
  type = parseNumber(type);
  if (utils.anyIsError(rate, period, periods, present, future, type)) {
    return errorObj.ERROR_VALUE;
  }

  // Compute payment
  let payment = exports.PMT(rate, periods, present, future, type);

  // Compute interest
  let interest;
  if (period === 1) {
    if (type === 1) {
      interest = 0;
    } else {
      interest = -present;
    }
  } else {
    if (type === 1) {
      interest = exports.FV(rate, period - 2, payment, present, 1) - payment;
    } else {
      interest = exports.FV(rate, period - 1, payment, present, 0);
    }
  }

  // Return interest
  return interest * rate;
};

exports.IRR = function(values, guess) {
  // Credits: algorithm inspired by Apache OpenOffice

  guess = guess || 0;

  values = parseNumberArray(utils.flatten(values));
  guess = parseNumber(guess);
  if (utils.anyIsError(values, guess)) {
    return errorObj.ERROR_VALUE;
  }

  // Calculates the resulting amount
  let irrResult = function(values, dates, rate) {
    let r = rate + 1;
    let result = values[0];
    for (let i = 1; i < values.length; i++) {
      result += values[i] / Math.pow(r, (dates[i] - dates[0]) / 365);
    }
    return result;
  };

  // Calculates the first derivation
  let irrResultDeriv = function(values, dates, rate) {
    let r = rate + 1;
    let result = 0;
    for (let i = 1; i < values.length; i++) {
      let frac = (dates[i] - dates[0]) / 365;
      result -= frac * values[i] / Math.pow(r, frac + 1);
    }
    return result;
  };

  // Initialize dates and check that values contains at least one positive value and one negative value
  let dates = [];
  let positive = false;
  let negative = false;
  for (let i = 0; i < values.length; i++) {
    dates[i] = (i === 0) ? 0 : dates[i - 1] + 365;
    if (values[i] > 0) {
      positive = true;
    }
    if (values[i] < 0) {
      negative = true;
    }
  }

  // Return error if values does not contain at least one positive value and one negative value
  if (!positive || !negative) {
    return errorObj.ERROR_NUM;
  }

  // Initialize guess and resultRate
  guess = (guess === undefined) ? 0.1 : guess;
  let resultRate = guess;

  // Set maximum epsilon for end of iteration
  let epsMax = 1e-10;

  // Implement Newton's method
  let newRate, epsRate, resultValue;
  let contLoop = true;
  do {
    resultValue = irrResult(values, dates, resultRate);
    newRate = resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
    epsRate = Math.abs(newRate - resultRate);
    resultRate = newRate;
    contLoop = (epsRate > epsMax) && (Math.abs(resultValue) > epsMax);
  } while (contLoop);

  // Return internal rate of return
  return resultRate;
};

exports.ISPMT = function(rate, period, periods, value) {
  rate = parseNumber(rate);
  period = parseNumber(period);
  periods = parseNumber(periods);
  value = parseNumber(value);
  if (utils.anyIsError(rate, period, periods, value)) {
    return errorObj.ERROR_VALUE;
  }

  // Return interest
  return value * rate * (period / periods - 1);
};

// XW：待实现
exports.MDURATION = function (settlement, maturity, coupon, yld, frequency, basis) {
  if (coupon < 0 || yld < 0){
    return errorObj.ERROR_NUM
  }
  if (basis < 0 || basis > 4){
    return errorObj.ERROR_NUM
  }
  if ([1, 2, 4].indexOf(frequency) === -1) {
    return errorObj.ERROR_NUM;
  }

};
//xW:end

exports.MIRR = function(values, finance_rate, reinvest_rate) {
  values = parseNumberArray(utils.flatten(values));
  finance_rate = parseNumber(finance_rate);
  reinvest_rate = parseNumber(reinvest_rate);
  if (utils.anyIsError(values, finance_rate, reinvest_rate)) {
    return errorObj.ERROR_VALUE;
  }

  // Initialize number of values
  let n = values.length;

  // Lookup payments (negative values) and incomes (positive values)
  let payments = [];
  let incomes = [];
  for (let i = 0; i < n; i++) {
    if (values[i] < 0) {
      payments.push(values[i]);
    } else {
      incomes.push(values[i]);
    }
  }

  // Return modified internal rate of return
  let num = -exports.NPV(reinvest_rate, incomes) * Math.pow(1 + reinvest_rate, n - 1);
  let den = exports.NPV(finance_rate, payments) * (1 + finance_rate);
  return Math.pow(num / den, 1 / (n - 1)) - 1;
};

exports.NOMINAL = function(rate, periods) {
  rate = parseNumber(rate);
  periods = parseNumber(periods);
  if (utils.anyIsError(rate, periods)) {
    return errorObj.ERROR_VALUE;
  }

  // Return error if rate <=0 or periods < 1
  if (rate <= 0 || periods < 1) {
    return errorObj.ERROR_NUM;
  }

  // Truncate periods if it is not an integer
  periods = parseInt(periods, 10);

  // Return nominal annual interest rate
  return (Math.pow(rate + 1, 1 / periods) - 1) * periods;
};

exports.NPER = function(rate, payment, present, future, type) {
  type = (type === undefined) ? 0 : type;
  future = (future === undefined) ? 0 : future;

  rate = parseNumber(rate);
  payment = parseNumber(payment);
  present = parseNumber(present);
  future = parseNumber(future);
  type = parseNumber(type);
  if (utils.anyIsError(rate, payment, present, future, type)) {
    return errorObj.ERROR_VALUE;
  }

  // Return number of periods
  let num = payment * (1 + rate * type) - future * rate;
  let den = (present * rate + payment * (1 + rate * type));
  return Math.log(num / den) / Math.log(1 + rate);
};

exports.NPV = function() {
  let args = parseNumberArray(utils.flatten(arguments));
  if (args instanceof Error) {
    return args;
  }

  // Lookup rate
  let rate = args[0];

  // Initialize net present value
  let value = 0;

  // Loop on all values
  for (let j = 1; j < args.length; j++) {
    value += args[j] / Math.pow(1 + rate, j);
  }

  // Return net present value
  return value;
};

// XW:待实现
exports.ODDFPRICE = function() {
  throw new Error('ODDFPRICE is not implemented');
};

// TODO
exports.ODDFYIELD = function() {
  throw new Error('ODDFYIELD is not implemented');
};

// TODO
exports.ODDLPRICE = function() {
  throw new Error('ODDLPRICE is not implemented');
};

// TODO
exports.ODDLYIELD = function() {
  throw new Error('ODDLYIELD is not implemented');
};
//XW：end
exports.PDURATION = function(rate, present, future) {
  rate = parseNumber(rate);
  present = parseNumber(present);
  future = parseNumber(future);
  if (utils.anyIsError(rate, present, future)) {
    return errorObj.ERROR_VALUE;
  }

  // Return error if rate <=0
  if (rate <= 0) {
    return errorObj.ERROR_NUM;
  }

  // Return number of periods
  return (Math.log(future) - Math.log(present)) / Math.log(1 + rate);
};

exports.PMT = function(rate, periods, present, future, type) {
  // Credits: algorithm inspired by Apache OpenOffice

  future = future || 0;
  type = type || 0;

  rate = parseNumber(rate);
  periods = parseNumber(periods);
  present = parseNumber(present);
  future = parseNumber(future);
  type = parseNumber(type);
  if (utils.anyIsError(rate, periods, present, future, type)) {
    return errorObj.ERROR_VALUE;
  }

  // Return payment
  let result;
  if (rate === 0) {
    result = (present + future) / periods;
  } else {
    let term = Math.pow(1 + rate, periods);
    if (type === 1) {
      result = (future * rate / (term - 1) + present * rate / (1 - 1 / term)) / (1 + rate);
    } else {
      result = future * rate / (term - 1) + present * rate / (1 - 1 / term);
    }
  }
  return -result;
};

exports.PPMT = function(rate, period, periods, present, future, type) {
  future = future || 0;
  type = type || 0;

  rate = parseNumber(rate);
  periods = parseNumber(periods);
  present = parseNumber(present);
  future = parseNumber(future);
  type = parseNumber(type);
  if (utils.anyIsError(rate, periods, present, future, type)) {
    return errorObj.ERROR_VALUE;
  }

  return exports.PMT(rate, periods, present, future, type) - exports.IPMT(rate, period, periods, present, future, type);
};
//XW：函数实现
exports.PRICE = function (settlement, maturity, rate, yld, redemption, frequency, basis) {
  let settlementDate = dayNum2Date(settlement)
  let maturityDate = dayNum2Date(maturity)
  if (utils.anyIsError(settlementDate, maturityDate)) {
    return errorObj.ERROR_VALUE;
  }
  if (basis<0 || basis>4){
    return errorObj.ERROR_NA
  }
  if(settlementDate >= maturityDate){
    return errorObj.ERROR_NA
  }
  let month_SM=maturityDate.getFullYear()*12+maturityDate.getMonth()-settlementDate.getFullYear()*12-settlementDate.getMonth()
  let N =parseInt(month_SM/(12/frequency))
  let endday=utils.Copy(maturityDate)
  endday.setMonth(endday.getMonth()-N*12/frequency)
  let startday= utils.Copy(endday)
  startday.setMonth(startday.getMonth()-12/frequency)
  let DSC = (endday-settlementDate)/ (1000 * 60 * 60 * 24)
  let E = (endday-startday)/ (1000 * 60 * 60 * 24)
  let A = (settlementDate-startday)/ (1000 * 60 * 60 * 24)
  if(N > 1){
    let PPART1=redemption/((1+yld/frequency)^(N-1+DSC/E))-((100*rate*A)/(frequency*E))
    let PPART2 = (100*rate)/(frequency*((1+yld/frequency)^(DSC/E)))
    for(let k = 2;k<=N;k++){
      PPART2 = PPART2+(100*rate)/(frequency*((1+yld/frequency)^(k-1+DSC/E)))
    }
    let P = PPART1+PPART2
    return P
  }
  if(N == 1){
    let T1 = 100*rate/frequency +redemption
    let T2 = yld*(E-A)/frequency/E+1
    let T3 = 100*rate*A/frequency/E
    let P = T1/T2-T3
    return P
  }
};

// TODO
exports.PRICEDISC = function (settlement, maturity, discount, redemption, basis) {
  settlement = dayNum2Date(settlement);
  maturity = dayNum2Date(maturity);
  if (utils.anyIsError(settlement, maturity)) {
    return errorObj.ERROR_VALUE;
  }
  if (basis<0 || basis>4){
    return errorObj.ERROR_NA
  }
  if(settlement >= maturity){
    return errorObj.ERROR_NA
  }
  let day = Math.abs(dateTime.DAYS(settlement, maturity, false))
  return redemption - discount*redemption*day/360
};

// TODO
exports.PRICEMAT = function (settlement, maturity, issue, rate, yld, basis) {
  settlement = dayNum2Date(settlement);
  maturity = dayNum2Date(maturity);
  issue = dayNum2Date(issue);
  if (utils.anyIsError(settlement, maturity)) {
    return errorObj.ERROR_VALUE;
  }
  if (basis<0 || basis>4){
    return errorObj.ERROR_NA
  }
  if(settlement >= maturity){
    return errorObj.ERROR_NA
  }
  let dsm = Math.abs(dateTime.DAYS(settlement, maturity, false))
  let dim = Math.abs(dateTime.DAYS(maturity, issue, false))
  let B = 360
  let A = Math.abs(dateTime.DAYS(issue, settlement, false))
  let result = (100 + ((dim/B)*rate*100))/(1+(dsm/B)*yld)-(A/B)*rate*100
  return result
};
//XW：end
exports.PV = function(rate, periods, payment, future, type) {
  future = future || 0;
  type = type || 0;

  rate = parseNumber(rate);
  periods = parseNumber(periods);
  payment = parseNumber(payment);
  future = parseNumber(future);
  type = parseNumber(type);
  if (utils.anyIsError(rate, periods, payment, future, type)) {
    return errorObj.ERROR_VALUE;
  }

  // Return present value
  if (rate === 0) {
    return -payment * periods - future;
  } else {
    return (((1 - Math.pow(1 + rate, periods)) / rate) * payment * (1 + rate * type) - future) / Math.pow(1 + rate, periods);
  }
};

exports.RATE = function(periods, payment, present, future, type, guess) {
  // Credits: rabugento

  guess = (guess === undefined) ? 0.01 : guess;
  future = (future === undefined) ? 0 : future;
  type = (type === undefined) ? 0 : type;

  periods = parseNumber(periods);
  payment = parseNumber(payment);
  present = parseNumber(present);
  future = parseNumber(future);
  type = parseNumber(type);
  guess = parseNumber(guess);
  if (utils.anyIsError(periods, payment, present, future, type, guess)) {
    return errorObj.ERROR_VALUE;
  }

  // Set maximum epsilon for end of iteration
  let epsMax = 1e-6;

  // Set maximum number of iterations
  let iterMax = 100;
  let iter = 0;
  let close = false;
  let rate = guess;

  while (iter < iterMax && !close) {
    let t1 = Math.pow(rate + 1, periods);
    let t2 = Math.pow(rate + 1, periods - 1);

    let f1 = future + t1 * present + payment * (t1 - 1) * (rate * type + 1) / rate;
    let f2 = periods * t2 * present - payment * (t1 - 1) *(rate * type + 1) / Math.pow(rate,2);
    let f3 = periods * payment * t2 * (rate * type + 1) / rate + payment * (t1 - 1) * type / rate;

    let newRate = rate - f1 / (f2 + f3);

    if (Math.abs(newRate - rate) < epsMax) close = true;
    iter++
    rate = newRate;
  }

  if (!close) return Number.NaN + rate;
  return rate;
};
//XW：函数实现
exports.RECEIVED = function (settlement, maturity, investment, discount, basis) {
  settlement = dayNum2Date(settlement);
  maturity = dayNum2Date(maturity);
  if (utils.anyIsError(settlement, maturity)) {
    return errorObj.ERROR_VALUE;
  }
  if (investment <= 0 || discount <= 0){
    return errorObj.ERROR_NA
  }
  if (basis<0 || basis>4){
    return errorObj.ERROR_NA
  }
  if(settlement >= maturity){
    return errorObj.ERROR_NA
  }
  let day = Math.abs(dateTime.DAYS(settlement, maturity, false))
  return investment/(1-(discount*day/360))
};
//XW：end

exports.RRI = function(periods, present, future) {
  periods = parseNumber(periods);
  present = parseNumber(present);
  future = parseNumber(future);
  if (utils.anyIsError(periods, present, future)) {
    return errorObj.ERROR_VALUE;
  }

  // Return error if periods or present is equal to 0 (zero)
  if (periods === 0 || present === 0) {
    return errorObj.ERROR_NUM;
  }

  // Return equivalent interest rate
  return Math.pow(future / present, 1 / periods) - 1;
};

exports.SLN = function(cost, salvage, life) {
  cost = parseNumber(cost);
  salvage = parseNumber(salvage);
  life = parseNumber(life);
  if (utils.anyIsError(cost, salvage, life)) {
    return errorObj.ERROR_VALUE;
  }

  // Return error if life equal to 0 (zero)
  if (life === 0) {
    return errorObj.ERROR_NUM;
  }

  // Return straight-line depreciation
  return (cost - salvage) / life;
};

exports.SYD = function(cost, salvage, life, period) {
  // Return error if any of the parameters is not a number
  cost = parseNumber(cost);
  salvage = parseNumber(salvage);
  life = parseNumber(life);
  period = parseNumber(period);
  if (utils.anyIsError(cost, salvage, life, period)) {
    return errorObj.ERROR_VALUE;
  }

  // Return error if life equal to 0 (zero)
  if (life === 0) {
    return errorObj.ERROR_NUM;
  }

  // Return error if period is lower than 1 or greater than life
  if (period < 1 || period > life) {
    return errorObj.ERROR_NUM;
  }

  // Truncate period if it is not an integer
  period = parseInt(period, 10);

  // Return straight-line depreciation
  return ((cost - salvage) * (life - period + 1) * 2) / (life * (life + 1));
};

exports.TBILLEQ = function(settlement, maturity, discount) {
  settlement = dayNum2Date(settlement);
  maturity = dayNum2Date(maturity);
  discount = parseNumber(discount);
  if (utils.anyIsError(settlement, maturity, discount)) {
    return errorObj.ERROR_VALUE;
  }

  // Return error if discount is lower than or equal to zero
  if (discount <= 0) {
    return errorObj.ERROR_NUM;
  }

  // Return error if settlement is greater than maturity
  if (settlement > maturity) {
    return errorObj.ERROR_NUM;
  }

  // Return error if maturity is more than one year after settlement
  if (maturity - settlement > 365 * 24 * 60 * 60 * 1000) {
    return errorObj.ERROR_NUM;
  }

  // Return bond-equivalent yield
  return (365 * discount) / (360 - discount * dateTime.DAYS360(settlement, maturity, false));
};

exports.TBILLPRICE = function(settlement, maturity, discount) {
  settlement = dayNum2Date(settlement);
  maturity = dayNum2Date(maturity);
  discount = parseNumber(discount);
  if (utils.anyIsError(settlement, maturity, discount)) {
    return errorObj.ERROR_VALUE;
  }

  // Return error if discount is lower than or equal to zero
  if (discount <= 0) {
    return errorObj.ERROR_NUM;
  }

  // Return error if settlement is greater than maturity
  if (settlement > maturity) {
    return errorObj.ERROR_NUM;
  }

  // Return error if maturity is more than one year after settlement
  if (maturity - settlement > 365 * 24 * 60 * 60 * 1000) {
    return errorObj.ERROR_NUM;
  }

  // Return bond-equivalent yield
  return 100 * (1 - discount * dateTime.DAYS360(settlement, maturity, false) / 360);
};

exports.TBILLYIELD = function(settlement, maturity, price) {
  settlement = dayNum2Date(settlement);
  maturity = dayNum2Date(maturity);
  price = parseNumber(price);
  if (utils.anyIsError(settlement, maturity, price)) {
    return errorObj.ERROR_VALUE;
  }

  // Return error if price is lower than or equal to zero
  if (price <= 0) {
    return errorObj.ERROR_NUM;
  }

  // Return error if settlement is greater than maturity
  if (settlement > maturity) {
    return errorObj.ERROR_NUM;
  }

  // Return error if maturity is more than one year after settlement
  if (maturity - settlement > 365 * 24 * 60 * 60 * 1000) {
    return errorObj.ERROR_NUM;
  }

  // Return bond-equivalent yield
  return (100 - price) * 360 / (price * dateTime.DAYS360(settlement, maturity, false));
};

//TODO 尚未考虑no_switch的情况,起始日和终止日都带小数时存在误差 by 旺旺11/19
function get_total(cost, salvage, period,life,factor){
  let total = 0;
  let current = 0;
  let i = 1
  for (; i <= period; i++) {
    current = Math.min((cost - total) * (factor / life), (cost - salvage - total));
    total += current;
  }
  let currentnew=(period-i+1)*Math.min((cost - total) * (factor / life), (cost - salvage - total))
  return total + currentnew
}
exports.get_total = get_total

exports.VDB = function(cost, salvage, life, Start_period,End_period,factor,No_switch) {
  let factorNum = (factor === undefined) ? 2 : factor;
  let costNum = cost
  let salvageNum = salvage
  let lifeNum = life
  let Start_periodNum = Start_period
  let End_periodNum = End_period
  if (utils.anyIsError(costNum, salvageNum, lifeNum, Start_periodNum,End_periodNum, factorNum)) {
    return errorObj.ERROR_VALUE;
  }
  if (costNum < 0 || salvageNum < 0 || lifeNum < 0 || Start_periodNum < 0 || factorNum <= 0) {
    return errorObj.ERROR_NUM;
  }
  if (Start_periodNum > lifeNum) {
    return errorObj.ERROR_NUM;
  }
  if (salvageNum >= costNum) {
    return 0;
  }
  let result=get_total(costNum,salvageNum,End_periodNum,lifeNum,factorNum)-get_total(costNum,salvageNum,Start_periodNum,lifeNum,factorNum)
  return result
};



exports.XIRR = function(values, dates, guess) {
  // Credits: algorithm inspired by Apache OpenOffice

  values = parseNumberArray(utils.flatten(values));
  dates = utils.parseDateArray(utils.flatten(dates));
  guess = parseNumber(guess);
  if (utils.anyIsError(values, dates, guess)) {
    return errorObj.ERROR_VALUE;
  }

  // Calculates the resulting amount
  let irrResult = function(values, dates, rate) {
    let r = rate + 1;
    let result = values[0];
    for (let i = 1; i < values.length; i++) {
      result += values[i] / Math.pow(r, dateTime.DAYS(dates[i], dates[0]) / 365);
    }
    return result;
  };

  // Calculates the first derivation
  let irrResultDeriv = function(values, dates, rate) {
    let r = rate + 1;
    let result = 0;
    for (let i = 1; i < values.length; i++) {
      let frac = dateTime.DAYS(dates[i], dates[0]) / 365;
      result -= frac * values[i] / Math.pow(r, frac + 1);
    }
    return result;
  };

  // Check that values contains at least one positive value and one negative value
  let positive = false;
  let negative = false;
  for (let i = 0; i < values.length; i++) {
    if (values[i] > 0) {
      positive = true;
    }
    if (values[i] < 0) {
      negative = true;
    }
  }

  // Return error if values does not contain at least one positive value and one negative value
  if (!positive || !negative) {
    return errorObj.ERROR_NUM;
  }

  // Initialize guess and resultRate
  guess = guess || 0.1;
  let resultRate = guess;

  // Set maximum epsilon for end of iteration
  let epsMax = 1e-10;

  // Implement Newton's method
  let newRate, epsRate, resultValue;
  let contLoop = true;
  do {
    resultValue = irrResult(values, dates, resultRate);
    newRate = resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
    epsRate = Math.abs(newRate - resultRate);
    resultRate = newRate;
    contLoop = (epsRate > epsMax) && (Math.abs(resultValue) > epsMax);
  } while (contLoop);

  // Return internal rate of return
  return resultRate;
};

exports.XNPV = function(rate, values, dates) {
  rate = parseNumber(rate);
  values = parseNumberArray(utils.flatten(values));
  dates = utils.parseDateArray(utils.flatten(dates));
  if (utils.anyIsError(rate, values, dates)) {
    return errorObj.ERROR_VALUE;
  }

  let result = 0;
  for (let i = 0; i < values.length; i++) {
    result += values[i] / Math.pow(1 + rate, dateTime.DAYS(dates[i], dates[0]) / 365);
  }
  return result;
};

// XW：待实现
exports.YIELD = function (settlement, maturity, rate, pr, redemption, frequency, basis) {
  settlement = dayNum2Date(settlement);
  maturity = dayNum2Date(maturity);
  if (utils.anyIsError(settlement, maturity)) {
    return errorObj.ERROR_VALUE;
  }
  if(rate <= 0){
    return errorObj.ERROR_NUM;
  }
  // Return error if price is lower than or equal to zero
  if (pr <= 0) {
    return errorObj.ERROR_NUM;
  }
  if (redemption <= 0){
    return errorObj.ERROR_NUM
  }
  // Return error if settlement is greater than maturity
  if (settlement >= maturity  ) {
    return errorObj.ERROR_NUM;
  }
  let A = Math.abs(dateTime.DAYS(settlement, maturity, false))

};


// TODO 调用的parseDate转化日期不够准确,如39494应转为2008/2/16,实际转为2008/2/15 23:54造成basis==0,4时的误差
exports.YIELDDISC = function(settlement, maturity,pr, redemption,basis) {
  // throw created Error('YIELDDISC is not implemented');
  let settlementDate = dayNum2Date(settlement);
  let maturityDate = dayNum2Date(maturity);
  if (utils.anyIsError(settlementDate, maturityDate)) {
    return errorObj.ERROR_VALUE;
  }
  if (pr <= 0) {
    return errorObj.ERROR_NUM;
  }
  if (redemption <= 0){
    return errorObj.ERROR_NUM
  }
  if (settlementDate >= maturityDate  ) {
    return errorObj.ERROR_NUM;
  }
  if ([0,1,2,3,4].indexOf(basis)===-1) {
    return errorObj.ERROR_NUM;
  }
  let res
  if (basis===1){
    let year=settlementDate.getFullYear()
    if (0 === year%4 && (year%100 !==0 || year%400 === 0)){
      let res = (redemption-pr)/pr/(maturityDate-settlementDate)*366*(1000 * 60 * 60 * 24)
      return res
    }
    else{
      let res = (redemption-pr)/pr/(maturityDate-settlementDate)*365*(1000 * 60 * 60 * 24)
      return res
    }
  }
  if (basis===2){
    let res = (redemption-pr)/pr/(maturityDate-settlementDate)*360*(1000 * 60 * 60 * 24)
    return res
  }
  if (basis===3){
    let res = (redemption-pr)/pr/(maturityDate-settlementDate)*365*(1000 * 60 * 60 * 24)
    return res
  }
  if (basis===0||basis===4){
    let month_SM=maturityDate.getFullYear()*12+maturityDate.getMonth()-settlementDate.getFullYear()*12-settlementDate.getMonth()-1
    let day_SM=month_SM*30+30-settlementDate.getDay()+maturityDate.getDay()
    let res=(redemption-pr)/pr/day_SM*360
    return res
  }
};

// TODO
exports.YIELDMAT = function() {
  throw new Error('YIELDMAT is not implemented');
};
//XW：end

exports.FACTORIAL = function (n){
  let result = 1
  for (let i=n; i>=1;i--){
    result *= i
  }
  return result
}
