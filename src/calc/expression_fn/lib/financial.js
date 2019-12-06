import {errorObj} from '../../calc_utils/error_config'
import dateTime from './date_time'
import utils from './utils'

// exports.validDate = function (d)
function validDate(d){
  return d && d.getTime && !isNaN(d.getTime());
}

// function ensureDate(d) {
//   return (d instanceof Date)?d:new Date(d);
// }

exports.ACCRINT = function(issue, first, settlement, rate, par, frequency, basis) {
  if (typeof issue=='string'){
    issue = utils.parseDate(issue)
  }
  //XW: 参数错误报错
  try{
    issue = utils.ExcelDateToJSDate(issue);
    first = utils.ExcelDateToJSDate(first);
    settlement = utils.ExcelDateToJSDate(settlement);
  }catch (e) {
    return errorObj.ERROR_VALUE;
  }
  //XW：end
  if (!validDate(issue) || !validDate(first) || !validDate(settlement)) {
    return errorObj.ERROR_VALUE;
  }

  // Return error if either rate or par are lower than or equal to zero
  if (rate <= 0 || par <= 0) {
    return errorObj.ERROR_NUM;
  }

  // Return error if frequency is neither 1, 2, or 4
  if ([1, 2, 4].indexOf(frequency) === -1) {
    return errorObj.ERROR_NUM;
  }

  // Return error if basis is neither 0, 1, 2, 3, or 4
  if ([0, 1, 2, 3, 4].indexOf(basis) === -1) {
    return errorObj.ERROR_NUM;
  }

  // Return error if settlement is before or equal to issue
  if (settlement <= issue) {
    return errorObj.ERROR_NUM;
  }

  // Set default values
  par = par || 0;
  basis = basis || 0;
  // Compute accrued interest
  return par * rate * dateTime.YEARFRAC(issue, settlement, basis);
};

// XW: ACCRINTM函数
exports.ACCRINTM = function(issue, settlement, rate, par, basis) {
  //XW: 参数错误报错
  try{
    issue = utils.ExcelDateToJSDate(issue);
    settlement = utils.ExcelDateToJSDate(settlement);
  }catch (e) {
    return errorObj.ERROR_VALUE;
  }
  //XW：end
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

  // Set default values
  par = par || 0;
  basis = basis || 0;
  // Compute accrued interest
  let result = par * rate * dateTime.YEARFRAC(issue, settlement, basis);
  if (isNaN(result)){
    return errorObj.ERROR_VALUE;
  }else{
    return result
  }
};
//XW: end

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

// exports.get_days = function(settlement,maturity,frequency)测试时使用
//获取债券结息日(购买日)所在付息期间的起始时间
function get_days(settlement,maturity,frequency){
  let settlementDate = utils.parseDate(settlement)
  let maturityDate = utils.parseDate(maturity)
  let month_SM=maturityDate.getFullYear()*12+maturityDate.getMonth()-settlementDate.getFullYear()*12-settlementDate.getMonth()
  let times=parseInt(month_SM/(12/frequency))
  let endday=utils.Copy(maturityDate)
  endday.setMonth(endday.getMonth()-times*12/frequency)
  let startday= utils.Copy(endday)
  startday.setMonth(startday.getMonth()-12/frequency)
  return {"startday": startday, "endday":endday}
}
//TODO  COUP系列函数目前均未考虑参数输入不规范的报错情况

// COUPDAYBS计算的是债券在结算日(即购买日)前最后一次付息日至结算日之间的天数    by旺旺 2019/11/14
exports.COUPDAYBS = function (settlement, maturity, frequency, basis) {
  // if (!validDate(maturity) || !validDate(settlement)) {
  //   return errorObj.ERROR_VALUE;
  // }
  if ([0,1,2,3,4].indexOf(basis)===-1) {
    return errorObj.ERROR_NUM;
  }
  if ([1,2,4].indexOf(frequency)===-1){
    return errorObj.ERROR_NUM;
  }
  if (settlement >= maturity) {
    return errorObj.ERROR_NUM;
  }
  let settlementDate = utils.parseDate(settlement)
  let result = settlementDate - get_days(settlement, maturity, frequency).startday
  return result / (1000 * 60 * 60 * 24)
};
//原代码
// let maturityDate = utils.parseDate(maturity)
// let startday = utils.Copy(maturityDate)
// startday.setMonth(startday.getMonth()-12/frequency) // todo 余数算法更好
// while(startday >= settlementDate){
//   startday.setMonth(startday.getMonth()-12/frequency)
// }
// let endday = utils.Copy(startday)
// endday.setMonth(endday.getMonth()+12/frequency)

//COUPDAYS计算的是是结算日(即购买日)所处的计息周期的天数,如:到期日为2019/11/1,结算日为2019/2/1,那么计算是2019/11/11至2019/5/1的天数.by旺旺 2019/11/15
exports.COUPDAYS = function (settlement, maturity, frequency, basis) {
  // // if (!validDate(maturity) || !validDate(settlement)) {
  //   return errorObj.ERROR_VALUE;
  // }
  // Return error if either rate or par are lower than or equal to zero
  if ([0,1,2,3,4].indexOf(basis)===-1) {
    return errorObj.ERROR_NUM;
  }
  if ([1,2,4].indexOf(frequency)===-1){
    return errorObj.ERROR_NUM;
  }
  if (settlement >= maturity) {
    return errorObj.ERROR_NUM;
  }
  if ([0,2,4].indexOf(basis)>=0) {
    let result = 360/frequency
    return result;
  }
  if (basis===3 ) {
    let result = 365/frequency
    return result;
  }
  if (basis===1) {
    let result = get_days(settlement, maturity, frequency).endday - get_days(settlement, maturity, frequency).startday
    return result / (1000 * 60 * 60 * 24)
  }
};

// COUPDAYSNC计算的是结算日到下一付息日的天数
exports.COUPDAYSNC = function (settlement, maturity, frequency, basis) {
  // if (!validDate(maturity) || !validDate(settlement)) {
  //   return errorObj.ERROR_VALUE;
  // }
  // Return error if either rate or par are lower than or equal to zero
  if ([0,1,2,3,4].indexOf(basis)===-1) {
    return errorObj.ERROR_NUM;
  }
  if ([1,2,4].indexOf(frequency)===-1){
    return errorObj.ERROR_NUM;
  }
  if (settlement >= maturity) {
    return errorObj.ERROR_NUM;
  }
  let settlementDate = utils.parseDate(settlement)
  let result = get_days(settlement, maturity, frequency).endday - settlementDate
  return result / (1000 * 60 * 60 * 24)
};

//COUPNCD计算的是下一付息日,目前结果精确到天 by 旺旺 2019/11/15
exports.COUPNCD = function (settlement, maturity, frequency, basis) {
  // if (!validDate(maturity) || !validDate(settlement)) {
  //   return errorObj.ERROR_VALUE;
  // }
  // Return error if either rate or par are lower than or equal to zero
  if ([0,1,2,3,4].indexOf(basis)===-1) {
    return errorObj.ERROR_NUM;
  }
  if ([1,2,4].indexOf(frequency)===-1){
    return errorObj.ERROR_NUM;
  }
  if (settlement >= maturity) {
    return errorObj.ERROR_NUM;
  }
  return get_days(settlement, maturity, frequency).endday
};

//COUPNUM计算的是结算日后付息次数
exports.COUPNUM = function (settlement, maturity, frequency, basis) {
  // if (!validDate(maturity) || !validDate(settlement)) {
  //   return errorObj.ERROR_VALUE;
  // }
  // Return error if either rate or par are lower than or equal to zero
  if ([0,1,2,3,4].indexOf(basis)===-1) {
    return errorObj.ERROR_NUM;
  }
  if ([1,2,4].indexOf(frequency)===-1){
    return errorObj.ERROR_NUM;
  }
  if (settlement >= maturity) {
    return errorObj.ERROR_NUM;
  }
  let settlementDate = utils.parseDate(settlement)
  let maturityDate = utils.parseDate(maturity)
  let month_SM=maturityDate.getFullYear()*12+maturityDate.getMonth()-settlementDate.getFullYear()*12-settlementDate.getMonth()
  let times=parseInt(month_SM/(12/frequency))
  return times+1
};

//COUPPCD计算的是结算日前最后一次付息日,目前结果精确到天 by 旺旺 2019/11/15
exports.COUPPCD = function (settlement, maturity, frequency, basis) {
  // if (!validDate(maturity) || !validDate(settlement)) {
  //   return errorObj.ERROR_VALUE;
  // }
  // Return error if either rate or par are lower than or equal to zero
  if ([0,1,2,3,4].indexOf(basis)===-1) {
    return errorObj.ERROR_NUM;
  }
  if ([1,2,4].indexOf(frequency)===-1){
    return errorObj.ERROR_NUM;
  }
  if (settlement >= maturity) {
    return errorObj.ERROR_NUM;
  }
  return get_days(settlement, maturity, frequency).startday
};


exports.CUMIPMT = function(rate, periods, value, start, end, type) {
  // Credits: algorithm inspired by Apache OpenOffice
  // Credits: Hannes Stiebitzhofer for the translations of function and variable names
  // Requires exports.FV() and exports.PMT() from exports.js [http://stoic.com/exports/]

  rate = utils.parseNumber(rate);
  periods = utils.parseNumber(periods);
  value = utils.parseNumber(value);
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

  rate = utils.parseNumber(rate);
  periods = utils.parseNumber(periods);
  value = utils.parseNumber(value);
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

  cost = utils.parseNumber(cost);
  salvage = utils.parseNumber(salvage);
  life = utils.parseNumber(life);
  period = utils.parseNumber(period);
  month = utils.parseNumber(month);
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

  cost = utils.parseNumber(cost);
  salvage = utils.parseNumber(salvage);
  life = utils.parseNumber(life);
  period = utils.parseNumber(period);
  factor = utils.parseNumber(factor);
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

  dollar = utils.parseNumber(dollar);
  fraction = utils.parseNumber(fraction);
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

  dollar = utils.parseNumber(dollar);
  fraction = utils.parseNumber(fraction);
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
  settlement = utils.parseDate(settlement);
  maturity = utils.parseDate(maturity);
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
  rate = utils.parseNumber(rate);
  periods = utils.parseNumber(periods);
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

  rate = utils.parseNumber(rate);
  periods = utils.parseNumber(periods);
  payment = utils.parseNumber(payment);
  value = utils.parseNumber(value);
  type = utils.parseNumber(type);
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
  principal = utils.parseNumber(principal);
  if (typeof schedule === 'string'){
    schedule = utils.strToMatrix(schedule)
  }
  schedule = utils.parseNumberArray(utils.flatten(schedule));
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

  rate = utils.parseNumber(rate);
  period = utils.parseNumber(period);
  periods = utils.parseNumber(periods);
  present = utils.parseNumber(present);
  future = utils.parseNumber(future);
  type = utils.parseNumber(type);
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

  values = utils.parseNumberArray(utils.flatten(values));
  guess = utils.parseNumber(guess);
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
  rate = utils.parseNumber(rate);
  period = utils.parseNumber(period);
  periods = utils.parseNumber(periods);
  value = utils.parseNumber(value);
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
  values = utils.parseNumberArray(utils.flatten(values));
  finance_rate = utils.parseNumber(finance_rate);
  reinvest_rate = utils.parseNumber(reinvest_rate);
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
  rate = utils.parseNumber(rate);
  periods = utils.parseNumber(periods);
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

  rate = utils.parseNumber(rate);
  payment = utils.parseNumber(payment);
  present = utils.parseNumber(present);
  future = utils.parseNumber(future);
  type = utils.parseNumber(type);
  if (utils.anyIsError(rate, payment, present, future, type)) {
    return errorObj.ERROR_VALUE;
  }

  // Return number of periods
  let num = payment * (1 + rate * type) - future * rate;
  let den = (present * rate + payment * (1 + rate * type));
  return Math.log(num / den) / Math.log(1 + rate);
};

exports.NPV = function() {
  let args = utils.parseNumberArray(utils.flatten(arguments));
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
  rate = utils.parseNumber(rate);
  present = utils.parseNumber(present);
  future = utils.parseNumber(future);
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

  rate = utils.parseNumber(rate);
  periods = utils.parseNumber(periods);
  present = utils.parseNumber(present);
  future = utils.parseNumber(future);
  type = utils.parseNumber(type);
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

  rate = utils.parseNumber(rate);
  periods = utils.parseNumber(periods);
  present = utils.parseNumber(present);
  future = utils.parseNumber(future);
  type = utils.parseNumber(type);
  if (utils.anyIsError(rate, periods, present, future, type)) {
    return errorObj.ERROR_VALUE;
  }

  return exports.PMT(rate, periods, present, future, type) - exports.IPMT(rate, period, periods, present, future, type);
};
//XW：函数实现
exports.PRICE = function (settlement, maturity, rate, yld, redemption, frequency, basis) {
  let settlementDate = utils.parseDate(settlement)
  let maturityDate = utils.parseDate(maturity)
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
  if(N = 1){
    let T1 = 100*rate/frequency +redemption
    let T2 = yld*(E-A)/frequency/E+1
    let T3 = 100*rate*A/frequency/E
    let P = T1/T2-T3
    return P
  }
};

// TODO
exports.PRICEDISC = function (settlement, maturity, discount, redemption, basis) {
  settlement = utils.parseDate(settlement);
  maturity = utils.parseDate(maturity);
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
  settlement = utils.parseDate(settlement);
  maturity = utils.parseDate(maturity);
  issue = utils.parseDate(issue);
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

  rate = utils.parseNumber(rate);
  periods = utils.parseNumber(periods);
  payment = utils.parseNumber(payment);
  future = utils.parseNumber(future);
  type = utils.parseNumber(type);
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

  periods = utils.parseNumber(periods);
  payment = utils.parseNumber(payment);
  present = utils.parseNumber(present);
  future = utils.parseNumber(future);
  type = utils.parseNumber(type);
  guess = utils.parseNumber(guess);
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
  settlement = utils.parseDate(settlement);
  maturity = utils.parseDate(maturity);
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
  periods = utils.parseNumber(periods);
  present = utils.parseNumber(present);
  future = utils.parseNumber(future);
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
  cost = utils.parseNumber(cost);
  salvage = utils.parseNumber(salvage);
  life = utils.parseNumber(life);
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
  cost = utils.parseNumber(cost);
  salvage = utils.parseNumber(salvage);
  life = utils.parseNumber(life);
  period = utils.parseNumber(period);
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
  settlement = utils.parseDate(settlement);
  maturity = utils.parseDate(maturity);
  discount = utils.parseNumber(discount);
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
  settlement = utils.parseDate(settlement);
  maturity = utils.parseDate(maturity);
  discount = utils.parseNumber(discount);
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
  settlement = utils.parseDate(settlement);
  maturity = utils.parseDate(maturity);
  price = utils.parseNumber(price);
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
  let costNum = utils.parseNumber(cost);
  let salvageNum = utils.parseNumber(salvage);
  let lifeNum = utils.parseNumber(life);
  let Start_periodNum = utils.parseNumber(Start_period);
  let End_periodNum = utils.parseNumber(End_period);
  factorNum = utils.parseNumber(factor);
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

  values = utils.parseNumberArray(utils.flatten(values));
  dates = utils.parseDateArray(utils.flatten(dates));
  guess = utils.parseNumber(guess);
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
  rate = utils.parseNumber(rate);
  values = utils.parseNumberArray(utils.flatten(values));
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
  settlement = utils.parseDate(settlement);
  maturity = utils.parseDate(maturity);
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
  // throw new Error('YIELDDISC is not implemented');
  let settlementDate = utils.parseDate(settlement);
  let maturityDate = utils.parseDate(maturity);
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
