var error = require('./error');
var dateTime = require('./date-time');
var utils = require('./utils');

// exports.validDate = function (d)
function validDate(d){
  return d && d.getTime && !isNaN(d.getTime());
}

function ensureDate(d) {
  return (d instanceof Date)?d:new Date(d);
}

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
    return error.value;
  }
  //XW：end
  if (!validDate(issue) || !validDate(first) || !validDate(settlement)) {
    return error.value;
  }

  // Return error if either rate or par are lower than or equal to zero
  if (rate <= 0 || par <= 0) {
    return error.num;
  }

  // Return error if frequency is neither 1, 2, or 4
  if ([1, 2, 4].indexOf(frequency) === -1) {
    return error.num;
  }

  // Return error if basis is neither 0, 1, 2, 3, or 4
  if ([0, 1, 2, 3, 4].indexOf(basis) === -1) {
    return error.num;
  }

  // Return error if settlement is before or equal to issue
  if (settlement <= issue) {
    return error.num;
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
    return error.value;
  }
  //XW：end
  // Return error if either rate or par are lower than or equal to zero
  if (rate <= 0 || par <= 0) {
    return error.num;
  }


  if (basis < 0 || basis > 4) {
    return error.num;
  }

  // Return error if settlement is before or equal to issue
  if (settlement <= issue) {
    return error.num;
  }

  // Set default values
  par = par || 0;
  basis = basis || 0;
  // Compute accrued interest
  var result = par * rate * dateTime.YEARFRAC(issue, settlement, basis);
  if (isNaN(result)){
    return error.value;
  }else{
    return result
  }
};
//XW: end

// TODO
//XW: 待实现
exports.AMORDEGRC = function (cost, date_purchased, first_period, salvage, period, rate, basis) {
  if (!validDate(issue) || !validDate(settlement)) {
    return error.value;
  }
  // Return error if either rate or par are lower than or equal to zero
  if (rate <= 0 || par <= 0) {
    return error.num;
  }
  if (basis < 0 || basis > 4) {
    return error.num;
  }
  // Return error if settlement is before or equal to issue
  if (settlement <= issue) {
    return error.num;
  }
};

// TODO
exports.AMORLINC = function() {
  throw new Error('AMORLINC is not implemented');
};

// exports.get_days = function(settlement,maturity,frequency)测试时使用
//获取债券结息日(购买日)所在付息期间的起始时间
function get_days(settlement,maturity,frequency){
  var settlementDate = utils.parseDate(settlement)
  var maturityDate = utils.parseDate(maturity)
  var month_SM=maturityDate.getFullYear()*12+maturityDate.getMonth()-settlementDate.getFullYear()*12-settlementDate.getMonth()
  var times=parseInt(month_SM/(12/frequency))
  var endday=utils.Copy(maturityDate)
  endday.setMonth(endday.getMonth()-times*12/frequency)
  var startday= utils.Copy(endday)
  startday.setMonth(startday.getMonth()-12/frequency)
  return {"startday": startday, "endday":endday}
}
//TODO  COUP系列函数目前均未考虑参数输入不规范的报错情况

// COUPDAYBS计算的是债券在结算日(即购买日)前最后一次付息日至结算日之间的天数    by旺旺 2019/11/14
exports.COUPDAYBS = function (settlement, maturity, frequency, basis) {
  // if (!validDate(maturity) || !validDate(settlement)) {
  //   return error.value;
  // }
  if ([0,1,2,3,4].indexOf(basis)===-1) {
    return error.num;
  }
  if ([1,2,4].indexOf(frequency)===-1){
    return error.num;
  }
  if (settlement >= maturity) {
    return error.num;
  }
  var settlementDate = utils.parseDate(settlement)
  var result = settlementDate - get_days(settlement, maturity, frequency).startday
  return result / (1000 * 60 * 60 * 24)
};
//原代码
// var maturityDate = utils.parseDate(maturity)
// var startday = utils.Copy(maturityDate)
// startday.setMonth(startday.getMonth()-12/frequency) // todo 余数算法更好
// while(startday >= settlementDate){
//   startday.setMonth(startday.getMonth()-12/frequency)
// }
// var endday = utils.Copy(startday)
// endday.setMonth(endday.getMonth()+12/frequency)

//COUPDAYS计算的是是结算日(即购买日)所处的计息周期的天数,如:到期日为2019/11/1,结算日为2019/2/1,那么计算是2019/11/11至2019/5/1的天数.by旺旺 2019/11/15
exports.COUPDAYS = function (settlement, maturity, frequency, basis) {
  // // if (!validDate(maturity) || !validDate(settlement)) {
  //   return error.value;
  // }
  // Return error if either rate or par are lower than or equal to zero
  if ([0,1,2,3,4].indexOf(basis)===-1) {
    return error.num;
  }
  if ([1,2,4].indexOf(frequency)===-1){
    return error.num;
  }
  if (settlement >= maturity) {
    return error.num;
  }
  if ([0,2,4].indexOf(basis)>=0) {
    var result = 360/frequency
    return result;
  }
  if (basis===3 ) {
    var result = 365/frequency
    return result;
  }
  if (basis===1) {
    var result = get_days(settlement, maturity, frequency).endday - get_days(settlement, maturity, frequency).startday
    return result / (1000 * 60 * 60 * 24)
  }
};

// COUPDAYSNC计算的是结算日到下一付息日的天数
exports.COUPDAYSNC = function (settlement, maturity, frequency, basis) {
  // if (!validDate(maturity) || !validDate(settlement)) {
  //   return error.value;
  // }
  // Return error if either rate or par are lower than or equal to zero
  if ([0,1,2,3,4].indexOf(basis)===-1) {
    return error.num;
  }
  if ([1,2,4].indexOf(frequency)===-1){
    return error.num;
  }
  if (settlement >= maturity) {
    return error.num;
  }
  var settlementDate = utils.parseDate(settlement)
  var result = get_days(settlement, maturity, frequency).endday - settlementDate
  return result / (1000 * 60 * 60 * 24)
};

//COUPNCD计算的是下一付息日,目前结果精确到天 by 旺旺 2019/11/15
exports.COUPNCD = function (settlement, maturity, frequency, basis) {
  // if (!validDate(maturity) || !validDate(settlement)) {
  //   return error.value;
  // }
  // Return error if either rate or par are lower than or equal to zero
  if ([0,1,2,3,4].indexOf(basis)===-1) {
    return error.num;
  }
  if ([1,2,4].indexOf(frequency)===-1){
    return error.num;
  }
  if (settlement >= maturity) {
    return error.num;
  }
  return get_days(settlement, maturity, frequency).endday
};

//COUPNUM计算的是结算日后付息次数
exports.COUPNUM = function (settlement, maturity, frequency, basis) {
  // if (!validDate(maturity) || !validDate(settlement)) {
  //   return error.value;
  // }
  // Return error if either rate or par are lower than or equal to zero
  if ([0,1,2,3,4].indexOf(basis)===-1) {
    return error.num;
  }
  if ([1,2,4].indexOf(frequency)===-1){
    return error.num;
  }
  if (settlement >= maturity) {
    return error.num;
  }
  var settlementDate = utils.parseDate(settlement)
  var maturityDate = utils.parseDate(maturity)
  var month_SM=maturityDate.getFullYear()*12+maturityDate.getMonth()-settlementDate.getFullYear()*12-settlementDate.getMonth()
  var times=parseInt(month_SM/(12/frequency))
  return times+1
};

//COUPPCD计算的是结算日前最后一次付息日,目前结果精确到天 by 旺旺 2019/11/15
exports.COUPPCD = function (settlement, maturity, frequency, basis) {
  // if (!validDate(maturity) || !validDate(settlement)) {
  //   return error.value;
  // }
  // Return error if either rate or par are lower than or equal to zero
  if ([0,1,2,3,4].indexOf(basis)===-1) {
    return error.num;
  }
  if ([1,2,4].indexOf(frequency)===-1){
    return error.num;
  }
  if (settlement >= maturity) {
    return error.num;
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
    return error.value;
  }

  // Return error if either rate, periods, or value are lower than or equal to zero
  if (rate <= 0 || periods <= 0 || value <= 0) {
    return error.num;
  }

  // Return error if start < 1, end < 1, or start > end
  if (start < 1 || end < 1 || start > end) {
    return error.num;
  }

  // Return error if type is neither 0 nor 1
  if (type !== 0 && type !== 1) {
    return error.num;
  }

  // Compute cumulative interest
  var payment = exports.PMT(rate, periods, value, 0, type);
  var interest = 0;

  if (start === 1) {
    if (type === 0) {
      interest = -value;
      start++;
    }
  }

  for (var i = start; i <= end; i++) {
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
    return error.value;
  }

  // Return error if either rate, periods, or value are lower than or equal to zero
  if (rate <= 0 || periods <= 0 || value <= 0) {
    return error.num;
  }

  // Return error if start < 1, end < 1, or start > end
  if (start < 1 || end < 1 || start > end) {
    return error.num;
  }

  // Return error if type is neither 0 nor 1
  if (type !== 0 && type !== 1) {
    return error.num;
  }

  // Compute cumulative principal
  var payment = exports.PMT(rate, periods, value, 0, type);
  var principal = 0;
  if (start === 1) {
    if (type === 0) {
      principal = payment + value * rate;
    } else {
      principal = payment;
    }
    start++;
  }
  for (var i = start; i <= end; i++) {
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
    return error.value;
  }

  // Return error if any of the parameters is negative
  if (cost < 0 || salvage < 0 || life < 0 || period < 0) {
    return error.num;
  }

  // Return error if month is not an integer between 1 and 12
  if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].indexOf(month) === -1) {
    return error.num;
  }

  // Return error if period is greater than life
  if (period > life) {
    return error.num;
  }

  // Return 0 (zero) if salvage is greater than or equal to cost
  if (salvage >= cost) {
    return 0;
  }

  // Rate is rounded to three decimals places
  var rate = (1 - Math.pow(salvage / cost, 1 / life)).toFixed(3);

  // Compute initial depreciation
  var initial = cost * rate * month / 12;

  // Compute total depreciation
  var total = initial;
  var current = 0;
  var ceiling = (period === life) ? life - 1 : period;
  for (var i = 2; i <= ceiling; i++) {
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
    return error.value;
  }

  // Return error if any of the parameters is negative or if factor is null
  if (cost < 0 || salvage < 0 || life < 0 || period < 0 || factor <= 0) {
    return error.num;
  }

  // Return error if period is greater than life
  if (period > life) {
    return error.num;
  }

  // Return 0 (zero) if salvage is greater than or equal to cost
  if (salvage >= cost) {
    return 0;
  }

  // Compute depreciation
  var total = 0;
  var current = 0;
  for (var i = 1; i <= period; i++) {
    current = Math.min((cost - total) * (factor / life), (cost - salvage - total));
    total += current;
  }

  // Return depreciation
  return current;
};

// TODO
exports.DISC = function (settlement,maturity,pr,redemption,basis) {
  if (pr<=0 || redemption<=0){
    return error.num
  }
  if (basis<0 || basis >4){
    return error.num
  }
  if (settlement >= maturity){
    return error.num
  }
  var B = 360
  var DSM = Math.abs(dateTime.DAYS(maturity, settlement, false))
  return (redemption-pr)/pr * B /DSM
};

exports.DOLLARDE = function(dollar, fraction) {
  // Credits: algorithm inspired by Apache OpenOffice

  dollar = utils.parseNumber(dollar);
  fraction = utils.parseNumber(fraction);
  if (utils.anyIsError(dollar, fraction)) {
    return error.value;
  }

  // Return error if fraction is negative
  if (fraction < 0) {
    return error.num;
  }

  // Return error if fraction is greater than or equal to 0 and less than 1
  if (fraction >= 0 && fraction < 1) {
    return error.div0;
  }

  // Truncate fraction if it is not an integer
  fraction = parseInt(fraction, 10);

  // Compute integer part
  var result = parseInt(dollar, 10);

  // Add decimal part
  result += (dollar % 1) * Math.pow(10, Math.ceil(Math.log(fraction) / Math.LN10)) / fraction;

  // Round result
  var power = Math.pow(10, Math.ceil(Math.log(fraction) / Math.LN2) + 1);
  result = Math.round(result * power) / power;

  // Return converted dollar price
  return result;
};

exports.DOLLARFR = function(dollar, fraction) {
  // Credits: algorithm inspired by Apache OpenOffice

  dollar = utils.parseNumber(dollar);
  fraction = utils.parseNumber(fraction);
  if (utils.anyIsError(dollar, fraction)) {
    return error.value;
  }

  // Return error if fraction is negative
  if (fraction < 0) {
    return error.num;
  }

  // Return error if fraction is greater than or equal to 0 and less than 1
  if (fraction >= 0 && fraction < 1) {
    return error.div0;
  }

  // Truncate fraction if it is not an integer
  fraction = parseInt(fraction, 10);

  // Compute integer part
  var result = parseInt(dollar, 10);

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
    return error.value;
  }
  if (basis<0 || basis > 4){
    return error.num
  }
  if (settlement >= maturity){
    return error.num
  }
};
//XW：end

exports.EFFECT = function(rate, periods) {
  rate = utils.parseNumber(rate);
  periods = utils.parseNumber(periods);
  if (utils.anyIsError(rate, periods)) {
    return error.value;
  }

  // Return error if rate <=0 or periods < 1
  if (rate <= 0 || periods < 1) {
    return error.num;
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
    return error.value;
  }

  // Return future value
  var result;
  if (rate === 0) {
    result = value + payment * periods;
  } else {
    var term = Math.pow(1 + rate, periods);
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
    return error.value;
  }

  var n = schedule.length;
  var future = principal;

  // Apply all interests in schedule
  for (var i = 0; i < n; i++) {
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
    return error.value
  }
  if (basis<0 || basis > 4){
    return error.num
  }
  if (settlement >= maturity){
    return error.num
  }
  var B = 1//一年之中的天数，取决于年基准数。
  var DIM = 2// 结算日与到期日之间的天数。
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
    return error.value;
  }

  // Compute payment
  var payment = exports.PMT(rate, periods, present, future, type);

  // Compute interest
  var interest;
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
    return error.value;
  }

  // Calculates the resulting amount
  var irrResult = function(values, dates, rate) {
    var r = rate + 1;
    var result = values[0];
    for (var i = 1; i < values.length; i++) {
      result += values[i] / Math.pow(r, (dates[i] - dates[0]) / 365);
    }
    return result;
  };

  // Calculates the first derivation
  var irrResultDeriv = function(values, dates, rate) {
    var r = rate + 1;
    var result = 0;
    for (var i = 1; i < values.length; i++) {
      var frac = (dates[i] - dates[0]) / 365;
      result -= frac * values[i] / Math.pow(r, frac + 1);
    }
    return result;
  };

  // Initialize dates and check that values contains at least one positive value and one negative value
  var dates = [];
  var positive = false;
  var negative = false;
  for (var i = 0; i < values.length; i++) {
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
    return error.num;
  }

  // Initialize guess and resultRate
  guess = (guess === undefined) ? 0.1 : guess;
  var resultRate = guess;

  // Set maximum epsilon for end of iteration
  var epsMax = 1e-10;

  // Implement Newton's method
  var newRate, epsRate, resultValue;
  var contLoop = true;
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
    return error.value;
  }

  // Return interest
  return value * rate * (period / periods - 1);
};

// XW：待实现
exports.MDURATION = function (settlement, maturity, coupon, yld, frequency, basis) {
  if (coupon < 0 || yld < 0){
    return error.num
  }
  if (basis < 0 || basis > 4){
    return error.num
  }
  if ([1, 2, 4].indexOf(frequency) === -1) {
    return error.num;
  }

};
//xW:end

exports.MIRR = function(values, finance_rate, reinvest_rate) {
  values = utils.parseNumberArray(utils.flatten(values));
  finance_rate = utils.parseNumber(finance_rate);
  reinvest_rate = utils.parseNumber(reinvest_rate);
  if (utils.anyIsError(values, finance_rate, reinvest_rate)) {
    return error.value;
  }

  // Initialize number of values
  var n = values.length;

  // Lookup payments (negative values) and incomes (positive values)
  var payments = [];
  var incomes = [];
  for (var i = 0; i < n; i++) {
    if (values[i] < 0) {
      payments.push(values[i]);
    } else {
      incomes.push(values[i]);
    }
  }

  // Return modified internal rate of return
  var num = -exports.NPV(reinvest_rate, incomes) * Math.pow(1 + reinvest_rate, n - 1);
  var den = exports.NPV(finance_rate, payments) * (1 + finance_rate);
  return Math.pow(num / den, 1 / (n - 1)) - 1;
};

exports.NOMINAL = function(rate, periods) {
  rate = utils.parseNumber(rate);
  periods = utils.parseNumber(periods);
  if (utils.anyIsError(rate, periods)) {
    return error.value;
  }

  // Return error if rate <=0 or periods < 1
  if (rate <= 0 || periods < 1) {
    return error.num;
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
    return error.value;
  }

  // Return number of periods
  var num = payment * (1 + rate * type) - future * rate;
  var den = (present * rate + payment * (1 + rate * type));
  return Math.log(num / den) / Math.log(1 + rate);
};

exports.NPV = function() {
  var args = utils.parseNumberArray(utils.flatten(arguments));
  if (args instanceof Error) {
    return args;
  }

  // Lookup rate
  var rate = args[0];

  // Initialize net present value
  var value = 0;

  // Loop on all values
  for (var j = 1; j < args.length; j++) {
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
    return error.value;
  }

  // Return error if rate <=0
  if (rate <= 0) {
    return error.num;
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
    return error.value;
  }

  // Return payment
  var result;
  if (rate === 0) {
    result = (present + future) / periods;
  } else {
    var term = Math.pow(1 + rate, periods);
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
    return error.value;
  }

  return exports.PMT(rate, periods, present, future, type) - exports.IPMT(rate, period, periods, present, future, type);
};
//XW：函数实现
exports.PRICE = function (settlement, maturity, rate, yld, redemption, frequency, basis) {
  var settlementDate = utils.parseDate(settlement)
  var maturityDate = utils.parseDate(maturity)
  if (utils.anyIsError(settlementDate, maturityDate)) {
    return error.value;
  }
  if (basis<0 || basis>4){
    return error.na
  }
  if(settlementDate >= maturityDate){
    return error.na
  }
  var month_SM=maturityDate.getFullYear()*12+maturityDate.getMonth()-settlementDate.getFullYear()*12-settlementDate.getMonth()
  var N =parseInt(month_SM/(12/frequency))
  var endday=utils.Copy(maturityDate)
  endday.setMonth(endday.getMonth()-N*12/frequency)
  var startday= utils.Copy(endday)
  startday.setMonth(startday.getMonth()-12/frequency)
  var DSC = (endday-settlementDate)/ (1000 * 60 * 60 * 24)
  var E = (endday-startday)/ (1000 * 60 * 60 * 24)
  var A = (settlementDate-startday)/ (1000 * 60 * 60 * 24)
  if(N > 1){
    var PPART1=redemption/((1+yld/frequency)^(N-1+DSC/E))-((100*rate*A)/(frequency*E))
    var PPART2 = (100*rate)/(frequency*((1+yld/frequency)^(DSC/E)))
    for(var k = 2;k<=N;k++){
      PPART2 = PPART2+(100*rate)/(frequency*((1+yld/frequency)^(k-1+DSC/E)))
    }
    var P = PPART1+PPART2
    return P
  }
  if(N = 1){
    var T1 = 100*rate/frequency +redemption
    var T2 = yld*(E-A)/frequency/E+1
    var T3 = 100*rate*A/frequency/E
    var P = T1/T2-T3
    return P
  }
};

// TODO
exports.PRICEDISC = function (settlement, maturity, discount, redemption, basis) {
  settlement = utils.parseDate(settlement);
  maturity = utils.parseDate(maturity);
  if (utils.anyIsError(settlement, maturity)) {
    return error.value;
  }
  if (basis<0 || basis>4){
    return error.na
  }
  if(settlement >= maturity){
    return error.na
  }
  var day = Math.abs(dateTime.DAYS(settlement, maturity, false))
  return redemption - discount*redemption*day/360
};

// TODO
exports.PRICEMAT = function (settlement, maturity, issue, rate, yld, basis) {
  settlement = utils.parseDate(settlement);
  maturity = utils.parseDate(maturity);
  issue = utils.parseDate(issue);
  if (utils.anyIsError(settlement, maturity)) {
    return error.value;
  }
  if (basis<0 || basis>4){
    return error.na
  }
  if(settlement >= maturity){
    return error.na
  }
  var dsm = Math.abs(dateTime.DAYS(settlement, maturity, false))
  var dim = Math.abs(dateTime.DAYS(maturity, issue, false))
  var B = 360
  var A = Math.abs(dateTime.DAYS(issue, settlement, false))
  var result = (100 + ((dim/B)*rate*100))/(1+(dsm/B)*yld)-(A/B)*rate*100
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
    return error.value;
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
    return error.value;
  }

  // Set maximum epsilon for end of iteration
  var epsMax = 1e-6;

  // Set maximum number of iterations
  var iterMax = 100;
  var iter = 0;
  var close = false;
  var rate = guess;

  while (iter < iterMax && !close) {
    var t1 = Math.pow(rate + 1, periods);
    var t2 = Math.pow(rate + 1, periods - 1);

    var f1 = future + t1 * present + payment * (t1 - 1) * (rate * type + 1) / rate;
    var f2 = periods * t2 * present - payment * (t1 - 1) *(rate * type + 1) / Math.pow(rate,2);
    var f3 = periods * payment * t2 * (rate * type + 1) / rate + payment * (t1 - 1) * type / rate;

    var newRate = rate - f1 / (f2 + f3);

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
    return error.value;
  }
  if (investment <= 0 || discount <= 0){
    return error.na
  }
  if (basis<0 || basis>4){
    return error.na
  }
  if(settlement >= maturity){
    return error.na
  }
  var day = Math.abs(dateTime.DAYS(settlement, maturity, false))
  return investment/(1-(discount*day/360))
};
//XW：end

exports.RRI = function(periods, present, future) {
  periods = utils.parseNumber(periods);
  present = utils.parseNumber(present);
  future = utils.parseNumber(future);
  if (utils.anyIsError(periods, present, future)) {
    return error.value;
  }

  // Return error if periods or present is equal to 0 (zero)
  if (periods === 0 || present === 0) {
    return error.num;
  }

  // Return equivalent interest rate
  return Math.pow(future / present, 1 / periods) - 1;
};

exports.SLN = function(cost, salvage, life) {
  cost = utils.parseNumber(cost);
  salvage = utils.parseNumber(salvage);
  life = utils.parseNumber(life);
  if (utils.anyIsError(cost, salvage, life)) {
    return error.value;
  }

  // Return error if life equal to 0 (zero)
  if (life === 0) {
    return error.num;
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
    return error.value;
  }

  // Return error if life equal to 0 (zero)
  if (life === 0) {
    return error.num;
  }

  // Return error if period is lower than 1 or greater than life
  if (period < 1 || period > life) {
    return error.num;
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
    return error.value;
  }

  // Return error if discount is lower than or equal to zero
  if (discount <= 0) {
    return error.num;
  }

  // Return error if settlement is greater than maturity
  if (settlement > maturity) {
    return error.num;
  }

  // Return error if maturity is more than one year after settlement
  if (maturity - settlement > 365 * 24 * 60 * 60 * 1000) {
    return error.num;
  }

  // Return bond-equivalent yield
  return (365 * discount) / (360 - discount * dateTime.DAYS360(settlement, maturity, false));
};

exports.TBILLPRICE = function(settlement, maturity, discount) {
  settlement = utils.parseDate(settlement);
  maturity = utils.parseDate(maturity);
  discount = utils.parseNumber(discount);
  if (utils.anyIsError(settlement, maturity, discount)) {
    return error.value;
  }

  // Return error if discount is lower than or equal to zero
  if (discount <= 0) {
    return error.num;
  }

  // Return error if settlement is greater than maturity
  if (settlement > maturity) {
    return error.num;
  }

  // Return error if maturity is more than one year after settlement
  if (maturity - settlement > 365 * 24 * 60 * 60 * 1000) {
    return error.num;
  }

  // Return bond-equivalent yield
  return 100 * (1 - discount * dateTime.DAYS360(settlement, maturity, false) / 360);
};

exports.TBILLYIELD = function(settlement, maturity, price) {
  settlement = utils.parseDate(settlement);
  maturity = utils.parseDate(maturity);
  price = utils.parseNumber(price);
  if (utils.anyIsError(settlement, maturity, price)) {
    return error.value;
  }

  // Return error if price is lower than or equal to zero
  if (price <= 0) {
    return error.num;
  }

  // Return error if settlement is greater than maturity
  if (settlement > maturity) {
    return error.num;
  }

  // Return error if maturity is more than one year after settlement
  if (maturity - settlement > 365 * 24 * 60 * 60 * 1000) {
    return error.num;
  }

  // Return bond-equivalent yield
  return (100 - price) * 360 / (price * dateTime.DAYS360(settlement, maturity, false));
};

//TODO 尚未考虑no_switch的情况,起始日和终止日都带小数时存在误差 by 旺旺11/19
function get_total(cost, salvage, period,life,factor){
  var total = 0;
  var current = 0;
  for (var i = 1; i <= period; i++) {
    current = Math.min((cost - total) * (factor / life), (cost - salvage - total));
    total += current;
  }
  var currentnew=(period-i+1)*Math.min((cost - total) * (factor / life), (cost - salvage - total))
  return total + currentnew
}
exports.get_total = get_total

exports.VDB = function(cost, salvage, life, Start_period,End_period,factor,No_switch) {
  var factorNum = (factor === undefined) ? 2 : factor;
  var costNum = utils.parseNumber(cost);
  var salvageNum = utils.parseNumber(salvage);
  var lifeNum = utils.parseNumber(life);
  var Start_periodNum = utils.parseNumber(Start_period);
  var End_periodNum = utils.parseNumber(End_period);
  factorNum = utils.parseNumber(factor);
  if (utils.anyIsError(costNum, salvageNum, lifeNum, Start_periodNum,End_periodNum, factorNum)) {
    return error.value;
  }
  if (costNum < 0 || salvageNum < 0 || lifeNum < 0 || Start_periodNum < 0 || factorNum <= 0) {
    return error.num;
  }
  if (Start_periodNum > lifeNum) {
    return error.num;
  }
  if (salvageNum >= costNum) {
    return 0;
  }
  var result=get_total(costNum,salvageNum,End_periodNum,lifeNum,factorNum)-get_total(costNum,salvageNum,Start_periodNum,lifeNum,factorNum)
  return result
};



exports.XIRR = function(values, dates, guess) {
  // Credits: algorithm inspired by Apache OpenOffice

  values = utils.parseNumberArray(utils.flatten(values));
  dates = utils.parseDateArray(utils.flatten(dates));
  guess = utils.parseNumber(guess);
  if (utils.anyIsError(values, dates, guess)) {
    return error.value;
  }

  // Calculates the resulting amount
  var irrResult = function(values, dates, rate) {
    var r = rate + 1;
    var result = values[0];
    for (var i = 1; i < values.length; i++) {
      result += values[i] / Math.pow(r, dateTime.DAYS(dates[i], dates[0]) / 365);
    }
    return result;
  };

  // Calculates the first derivation
  var irrResultDeriv = function(values, dates, rate) {
    var r = rate + 1;
    var result = 0;
    for (var i = 1; i < values.length; i++) {
      var frac = dateTime.DAYS(dates[i], dates[0]) / 365;
      result -= frac * values[i] / Math.pow(r, frac + 1);
    }
    return result;
  };

  // Check that values contains at least one positive value and one negative value
  var positive = false;
  var negative = false;
  for (var i = 0; i < values.length; i++) {
    if (values[i] > 0) {
      positive = true;
    }
    if (values[i] < 0) {
      negative = true;
    }
  }

  // Return error if values does not contain at least one positive value and one negative value
  if (!positive || !negative) {
    return error.num;
  }

  // Initialize guess and resultRate
  guess = guess || 0.1;
  var resultRate = guess;

  // Set maximum epsilon for end of iteration
  var epsMax = 1e-10;

  // Implement Newton's method
  var newRate, epsRate, resultValue;
  var contLoop = true;
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
    return error.value;
  }

  var result = 0;
  for (var i = 0; i < values.length; i++) {
    result += values[i] / Math.pow(1 + rate, dateTime.DAYS(dates[i], dates[0]) / 365);
  }
  return result;
};

// XW：待实现
exports.YIELD = function (settlement, maturity, rate, pr, redemption, frequency, basis) {
  settlement = utils.parseDate(settlement);
  maturity = utils.parseDate(maturity);
  if (utils.anyIsError(settlement, maturity)) {
    return error.value;
  }
  if(rate <= 0){
    return error.num;
  }
  // Return error if price is lower than or equal to zero
  if (pr <= 0) {
    return error.num;
  }
  if (redemption <= 0){
    return error.num
  }
  // Return error if settlement is greater than maturity
  if (settlement >= maturity  ) {
    return error.num;
  }
  var A = Math.abs(dateTime.DAYS(settlement, maturity, false))

};


// TODO 调用的parseDate转化日期不够准确,如39494应转为2008/2/16,实际转为2008/2/15 23:54造成basis==0,4时的误差
exports.YIELDDISC = function(settlement, maturity,pr, redemption,basis) {
  // throw new Error('YIELDDISC is not implemented');
  var settlementDate = utils.parseDate(settlement);
  var maturityDate = utils.parseDate(maturity);
  if (utils.anyIsError(settlementDate, maturityDate)) {
    return error.value;
  }
  if (pr <= 0) {
    return error.num;
  }
  if (redemption <= 0){
    return error.num
  }
  if (settlementDate >= maturityDate  ) {
    return error.num;
  }
  if ([0,1,2,3,4].indexOf(basis)===-1) {
    return error.num;
  }
  var res
  if (basis===1){
    var year=settlementDate.getFullYear()
    if (0 === year%4 && (year%100 !==0 || year%400 === 0)){
      var res = (redemption-pr)/pr/(maturityDate-settlementDate)*366*(1000 * 60 * 60 * 24)
      return res
    }
    else{
      var res = (redemption-pr)/pr/(maturityDate-settlementDate)*365*(1000 * 60 * 60 * 24)
      return res
    }
  }
  if (basis===2){
    var res = (redemption-pr)/pr/(maturityDate-settlementDate)*360*(1000 * 60 * 60 * 24)
    return res
  }
  if (basis===3){
    var res = (redemption-pr)/pr/(maturityDate-settlementDate)*365*(1000 * 60 * 60 * 24)
    return res
  }
  if (basis===0||basis===4){
    var month_SM=maturityDate.getFullYear()*12+maturityDate.getMonth()-settlementDate.getFullYear()*12-settlementDate.getMonth()-1
    var day_SM=month_SM*30+30-settlementDate.getDay()+maturityDate.getDay()
    var res=(redemption-pr)/pr/day_SM*360
    return res
  }
};

// TODO
exports.YIELDMAT = function() {
  throw new Error('YIELDMAT is not implemented');
};
//XW：end

exports.FACTORIAL = function (n){
  var result = 1
  for (var i=n; i>=1;i--){
    result *= i
  }
  return result
}