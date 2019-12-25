import {ERROR_NUM, ERROR_VALUE, errorObj} from '../../calc_utils/error_config';
import * as cf from '../../calc_utils/config';
import { d18991230MS, MS_PER_DAY } from '../../calc_utils/config';
import * as utils from '../../calc_utils/helper';
import {dayNum2Date, days_str2date, parseBool, parseNumber} from '../../calc_utils/parse_helper';
import {anyIsError} from "../../calc_utils/helper";
import {parseDate} from "numeric";


let WEEK_STARTS = [
  undefined,
  0,
  1,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  1,
  2,
  3,
  4,
  5,
  6,
  0
];
let WEEK_TYPES = [
  [],
  [1, 2, 3, 4, 5, 6, 7],
  [7, 1, 2, 3, 4, 5, 6],
  [6, 0, 1, 2, 3, 4, 5],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [7, 1, 2, 3, 4, 5, 6],
  [6, 7, 1, 2, 3, 4, 5],
  [5, 6, 7, 1, 2, 3, 4],
  [4, 5, 6, 7, 1, 2, 3],
  [3, 4, 5, 6, 7, 1, 2],
  [2, 3, 4, 5, 6, 7, 1],
  [1, 2, 3, 4, 5, 6, 7]
];
let WEEKEND_TYPES = [
  [],
  [6, 0],
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  undefined,
  undefined,
  undefined, [0, 0],
  [1, 1],
  [2, 2],
  [3, 3],
  [4, 4],
  [5, 5],
  [6, 6]
];

/**
 *
 * @param {number}year 年
 * @param {number}month 月
 * @param {number}day 日
 * @returns {any}
 * @constructor
 */
export function DATE(year, month, day) {
  year = parseNumber(year);
  month = parseNumber(month);
  day = parseNumber(day);
  if (anyIsError(year, month, day)) {
    return  Error(ERROR_VALUE);
  }
  if (year < 0 || month < 0 || day < 0) {
    return  Error(ERROR_NUM);
  }
  let date = new Date(year, month - 1, day); // 需要减去1才对
  return date;
};

export function stamp2DayNum(timeStamp) {
  return (timeStamp - d18991230MS) / MS_PER_DAY;
}

/**
 *
 * @param {string}date_text 必需。代表采用 Excel 日期格式的日期的文本，或是对包含这种文本的单元格的引用。
 * 例如，用于表示日期的引号内的文本字符串 "2008-1-30" 或 "30-Jan-2008"。
 * @returns {Error|*}
 * @constructor
 */
export function DATEVALUE(date_text) {
  if (typeof date_text !== 'string') {
    return Error(ERROR_VALUE);
  }
  let date = Date.parse(date_text);
  if (isNaN(date)) {
    return Error(ERROR_VALUE);
  }
  return stamp2DayNum(date);
};

export function DAY(serial_number) {
  let date = days_str2date(serial_number);
  return date.getDate();
};


/**
 *
 * @param{string} end_date 必需。 Start_date 和 End_date 是用于计算期间天数的起止日期。
 * @param {string} start_date 必需。Start_date 和 End_date 是用于计算期间天数的起止日期。
 * @returns {number}
 * @constructor
 */
export function DAYS(end_date, start_date) {
  end_date = days_str2date(end_date);
  start_date = days_str2date(start_date);
  return parseInt(stamp2DayNum(end_date) - stamp2DayNum(start_date));
};

/**
 *
 * @param {string}start_date 必需。 用于计算期间天数的起止日期。
 * @param {string}end_date 必需。 用于计算期间天数的起止日期。
 * @param {number}method 可选。 逻辑值，用于指定在计算中是采用美国方法 还是欧洲方法。
 * @returns {Error|number}
 * @constructor
 */
export function DAYS360(start_date, end_date, method) {
  method = parseBool(method);
  start_date = days_str2date(start_date);
  end_date = days_str2date(end_date);
  if (start_date instanceof Error) {
    return start_date;
  }
  if (end_date instanceof Error) {
    return end_date;
  }
  if (method instanceof Error) {
    return method;
  }
  let sm = start_date.getMonth();
  let em = end_date.getMonth();
  let sd, ed;
  if (method) {
    sd = start_date.getDate() === 31 ? 30 : start_date.getDate();
    ed = end_date.getDate() === 31 ? 30 : end_date.getDate();
  } else {
    let smd = new Date(start_date.getFullYear(), sm + 1, 0).getDate();
    let emd = new Date(end_date.getFullYear(), em + 1, 0).getDate();
    sd = start_date.getDate() === smd ? 30 : start_date.getDate();
    if (end_date.getDate() === emd) {
      if (sd < 30) {
        em++;
        ed = 1;
      } else {
        ed = 30;
      }
    } else {
      ed = end_date.getDate();
    }
  }
  return 360 * (end_date.getFullYear() - start_date.getFullYear()) +
    30 * (em - sm) + (ed - sd);
};

/**
 *
 * @param {number/string}start_date 必需。 一个代表开始日期的日期。 应使用 DATE 函数输入日期，或者将日期作为其他公式或函数的结果输入。
 * 例如，使用函数 DATE(2008,5,23) 输入 2008 年 5 月 23 日。 如果日期以文本形式输入，则会出现问题。
 * @param{number} months 必需。 start_date 之前或之后的月份数。 months 为正值将生成未来日期；为负值将生成过去日期。
 * @returns {Error|(number&Error)|*}
 * @constructor
 */
export function EDATE(start_date, months) {
  start_date = days_str2date(start_date);
  if (start_date instanceof Error) {
    return start_date;
  }
  if (isNaN(months)) {
    return Error(ERROR_VALUE);
  }
  months = parseInt(months, 10);
  start_date.setMonth(start_date.getMonth() + months);
  return start_date.toLocaleString();
};


/**
 *
 * @param {number/string}start_date 必需。 表示开始日期的日期。 应使用 DATE 函数输入日期，或者将日期作为其他公式或函数的结果输入。
 * 例如，使用函数 DATE(2008,5,23) 输入 2008 年 5 月 23 日。 如果日期以文本形式输入，则会出现问题。
 * @param {number}months 必需。 start_date 之前或之后的月份数。 months 为正值将生成未来日期；为负值将生成过去日期。
 * @returns {Error|*}
 * @constructor
 */
export function EOMONTH(start_date, months) {
  start_date = days_str2date(start_date);
  if (start_date instanceof Error) {
    return start_date;
  }
  if (isNaN(months)) {
    return Error(ERROR_VALUE);
  }
  months = parseInt(months, 10);
  return (new Date(start_date.getFullYear(), start_date.getMonth() + months + 1, 0)).toLocaleString();
};

/**
 *
 * @param {number/string}serial_number 必需。 时间值，其中包含要查找的小时数。 时间值有多种输入方式：带引号的文本字符串（例如 "6:45 PM"）、十进制数
 * （例如 0.78125 表示 6:45 PM）或其他公式或函数的结果（例如 TIMEVALUE("6:45 PM")）。
 * @returns {Error|number}
 * @constructor
 */
export function HOUR(serial_number) {
  if (typeof serial_number === 'number' && !isNaN(serial_number)){
    //XW: 参数为数字时获取对应的小时数
    return parseInt((parseFloat(serial_number)-parseInt(serial_number)) * 24)
    //XW: end
  }
  serial_number = days_str2date(serial_number);
  if (serial_number instanceof Error) {
    return serial_number;
  }
  return serial_number.getHours();
};

exports.INTERVAL = function (second) {
  if (typeof second !== 'number' && typeof second !== 'string') {
    return Error(ERROR_VALUE);
  } else {
    second = parseInt(second, 10);
  }

  let year  = Math.floor(second/946080000);
  second    = second%946080000;
  let month = Math.floor(second/2592000);
  second    = second%2592000;
  let day   = Math.floor(second/86400);
  second    = second%86400;

  let hour  = Math.floor(second/3600);
  second    = second%3600;
  let min   = Math.floor(second/60);
  second    = second%60;
  let sec   = second;

  year  = (year  > 0) ? year  + 'Y' : '';
  month = (month > 0) ? month + 'M' : '';
  day   = (day   > 0) ? day   + 'D' : '';
  hour  = (hour  > 0) ? hour  + 'H' : '';
  min   = (min   > 0) ? min   + 'M' : '';
  sec   = (sec   > 0) ? sec   + 'S' : '';

  return 'P' + year + month + day +
  'T' + hour + min + sec;
};

/**
 *
 * @param {string/number}date 必需。 日期是 Excel 用于日期和时间计算的日期-时间代码。
 * @returns {Error|number}
 * @constructor
 */
export function ISOWEEKNUM(date) {
  date = days_str2date(date);
  if (date instanceof Error) {
    return date;
  }

  date.setHours(0, 0, 0);
  date.setDate(date.getDate() + 4 - (date.getDay() || 7));
  let yearStart = new Date(date.getFullYear(), 0, 1);
  return Math.ceil((((date - yearStart) / cf.MS_PER_DAY) + 1) / 7);
};

exports.MINUTE = function(serial_number) {
    let Formulas = window.jsSpreadsheet.AllFormulas;
    return Formulas.MINUTE(serial_number);
};

exports.MONTH = function(serial_number) {
  serial_number = days_str2date(serial_number);
  if (serial_number instanceof Error) {
    return serial_number;
  }
  return serial_number.getMonth() + 1;
};

exports.NETWORKDAYS = function (start_date, end_date, holidays) {
  if (holidays instanceof Array){
    holidays = utils.flatten(holidays)
  }
  let Formulas = window.jsSpreadsheet.AllFormulas;
  return Formulas.NETWORKDAYS(start_date, end_date, holidays);
};
exports.NETWORKDAYSINTL = function (start_date, end_date, weekend, holidays) {
  if (typeof holidays == 'string' && holidays.indexOf('{') >=0){
    holidays = days_str2dateArray(utils.strToMatrix(holidays)[0])
  }
  try{
    let Formulas = window.jsSpreadsheet.AllFormulas;
    return Formulas.NETWORKDAYS$INTL(start_date, end_date, weekend, holidays);
  }catch (e) {
    start_date = utils.ExcelDateToJSDate(days_str2date(start_date));
    end_date = utils.ExcelDateToJSDate(days_str2date(end_date));
    if (start_date instanceof Error) {
      return start_date;
    }
    if (end_date instanceof Error) {
      return end_date;
    }
    if (weekend === undefined) {
      weekend = WEEKEND_TYPES[1];
    } else if (typeof weekend=='string' && weekend.length === 7) {
      let arr = []
      for (let i=0;i<weekend.length;i++){
        if (weekend[i] == '1'){
          arr.push(((i+1)>6)? 0: i+1)
        }
      }
      weekend = arr
    }else {
      weekend = WEEKEND_TYPES[weekend];
    }
    if (!(weekend instanceof Array)) {
      return Error(ERROR_VALUE);
    }
    if (holidays === undefined) {
      holidays = [];
    } else if (!(holidays instanceof Array)) {
      holidays = [holidays];
    }
    for (let i = 0; i < holidays.length; i++) {
      let h = days_str2date(holidays[i]);
      if (h instanceof Error) {
        return h;
      }
      holidays[i] = h;
    }
    let days = (end_date - start_date) / cf.MS_PER_DAY + 1;
    let total = days;
    let day = start_date;
    for (i = 0; i < days; i++) {
      let d = (new Date().getTimezoneOffset() > 0) ? day.getUTCDay() : day.getDay();
      let dec = false;
      if (d === weekend[0] || d === weekend[1]) {
        dec = true;
      }
      for (let j = 0; j < holidays.length; j++) {
        let holiday = holidays[j];
        if (holiday.getDate() === day.getDate() &&
          holiday.getMonth() === day.getMonth() &&
          holiday.getFullYear() === day.getFullYear()) {
          dec = true;
          break;
        }
      }
      if (dec) {
        total--;
      }
      day.setDate(day.getDate() + 1);
    }
    return total;
  }
};


exports.NETWORKDAYS.INTL = function (start_date, end_date, weekend, holidays) {
  if (typeof holidays == 'string' && holidays.indexOf('{') >=0){
    holidays = days_str2dateArray(utils.strToMatrix(holidays))
  }
  start_date = utils.ExcelDateToJSDate(start_date);
  end_date = utils.ExcelDateToJSDate(end_date);
  if (start_date instanceof Error) {
    return start_date;
  }
  if (end_date instanceof Error) {
    return end_date;
  }
  if (weekend === undefined) {
    weekend = WEEKEND_TYPES[1];
  } else {
    weekend = WEEKEND_TYPES[weekend];
  }
  if (!(weekend instanceof Array)) {
    return Error(ERROR_VALUE);
  }
  if (holidays === undefined) {
    holidays = [];
  } else if (!(holidays instanceof Array)) {
    holidays = [holidays];
  }
  for (let i = 0; i < holidays.length; i++) {
    let h = days_str2date(holidays[i]);
    if (h instanceof Error) {
      return h;
    }
    holidays[i] = h;
  }
  let days = (end_date - start_date) / cf.MS_PER_DAY + 1;
  let total = days;
  let day = start_date;
  for (i = 0; i < days; i++) {
    let d = (new Date().getTimezoneOffset() > 0) ? day.getUTCDay() : day.getDay();
    let dec = false;
    if (d === weekend[0] || d === weekend[1]) {
      dec = true;
    }
    for (let j = 0; j < holidays.length; j++) {
      let holiday = holidays[j];
      if (holiday.getDate() === day.getDate() &&
        holiday.getMonth() === day.getMonth() &&
        holiday.getFullYear() === day.getFullYear()) {
        dec = true;
        break;
      }
    }
    if (dec) {
      total--;
    }
    day.setDate(day.getDate() + 1);
  }
  return total;
};

exports.NOW = function() {
  return new Date();
};

exports.SECOND = function(serial_number) {
  serial_number = days_str2date(serial_number);
  if (serial_number instanceof Error) {
    return serial_number;
  }
  return serial_number.getSeconds();
};

exports.TIME = function(hour, minute, second) {
  hour = parseNumber(hour);
  minute = parseNumber(minute);
  second = parseNumber(second);
  if (anyIsError(hour, minute, second)) {
    return Error(ERROR_VALUE);
  }
  if (hour < 0 || minute < 0 || second < 0) {
    return Error(ERROR_NUM);
  }
  return (3600 * hour + 60 * minute + second) / 86400;
};

exports.TIMEVALUE = function(time_text) {
  let Formulas = window.jsSpreadsheet.AllFormulas;
  try{
    return Formulas.TIMEVALUE(time_text);
  }catch(e){
    return Error(ERROR_VALUE)
  }
};

exports.TODAY = function() {
  let Formulas = window.jsSpreadsheet.AllFormulas;
  return Formulas.TODAY()
};

exports.WEEKDAY = function(serial_number, return_type) {
  serial_number = days_str2date(serial_number);
  if (serial_number instanceof Error) {
    return serial_number;
  }
  if (return_type === undefined) {
    return_type = 1;
  }
  let day = serial_number.getDay();
  return WEEK_TYPES[return_type][day];
};

exports.WEEKNUM = function(serial_number, return_type) {
  serial_number = days_str2date(serial_number);
  if (serial_number instanceof Error) {
    return serial_number;
  }
  if (return_type === undefined) {
    return_type = 1;
  }
  if (return_type === 21) {
    return this.ISOWEEKNUM(serial_number);
  }
  let week_start = WEEK_STARTS[return_type];
  let jan = new Date(serial_number.getFullYear(), 0, 1);
  let inc = jan.getDay() < week_start ? 1 : 0;
  jan -= Math.abs(jan.getDay() - week_start) * cf.MS_PER_DAY;
  return Math.floor(((serial_number - jan) / cf.MS_PER_DAY) / 7 + 1) + inc;
};

exports.WORKDAY = function (start_date, days, holidays) {
  if (holidays !== undefined){
    holidays = utils.flatten(holidays)
  }
  let Formulas = window.jsSpreadsheet.AllFormulas;
  return Formulas.WORKDAY(start_date, days, holidays);
};
exports.WORKDAYINTL = function (start_date, days, weekend, holidays) {
  // let Formulas = window.jsSpreadsheet.AllFormulas;
  // return Formulas.WORKDAY$INTL(start_date, days, weekend, holidays);
  start_date = days_str2date(start_date);
  if (start_date instanceof Error) {
    return start_date;
  }
  if (weekend == 0){
    return Error(ERROR_NUM)
  }
  days = parseNumber(days);
  if (days instanceof Error) {
    return days;
  }
  if (days < 0) {
    return Error(ERROR_NUM);
  }
  if (weekend === undefined) {
    weekend = WEEKEND_TYPES[1];
  } else {
    weekend = WEEKEND_TYPES[weekend];
  }
  if (!(weekend instanceof Array)) {
    return Error(ERROR_VALUE);
  }
  if (holidays === undefined) {
    holidays = [];
  } else if (!(holidays instanceof Array)) {
    holidays = [holidays];
  }
  for (let i = 0; i < holidays.length; i++) {
    let h = days_str2date(holidays[i]);
    if (h instanceof Error) {
      return h;
    }
    holidays[i] = h;
  }
  let d = 0;
  while (d < days) {
    start_date.setDate(start_date.getDate() + 1);
    let day = start_date.getDay();
    if (day === weekend[0] || day === weekend[1]) {
      continue;
    }
    for (let j = 0; j < holidays.length; j++) {
      let holiday = holidays[j];
      if (holiday.getDate() === start_date.getDate() &&
        holiday.getMonth() === start_date.getMonth() &&
        holiday.getFullYear() === start_date.getFullYear()) {
        d--;
        break;
      }
    }
    d++;
  }
  let year = start_date.getFullYear();
  let month = start_date.getMonth();
  let day = start_date.getDay();
  return year+ '/' + month + '/' + day;
};

exports.YEAR = function(serial_number) {
  serial_number = days_str2date(serial_number);
  if (serial_number instanceof Error) {
    return serial_number;
  }
  return serial_number.getFullYear();
};

function isLeapYear(year) {
  return new Date(year, 1, 29).getMonth() === 1;
}

// TODO : Use DAYS ?
function daysBetween(start_date, end_date) {
  return Math.ceil((end_date - start_date) / cf.MS_PER_DAY);
}

exports.YEARFRAC = function(start_date, end_date, basis) {
  start_date = days_str2date(start_date);
  if (start_date instanceof Error) {
    return start_date;
  }
  end_date = days_str2date(end_date);
  if (end_date instanceof Error) {
    return end_date;
  }

  basis = basis || 0;
  let sd = start_date.getDate();
  let sm = start_date.getMonth() ;
  let sy = start_date.getFullYear();
  let ed = end_date.getDate();
  let em = end_date.getMonth();
  let ey = end_date.getFullYear();

  switch (basis) {
    case 0:
      // US (NASD) 30/360
      if (sd === 31 && ed === 31) {
        sd = 30;
        ed = 30;
      } else if (sd === 31) {
        sd = 30;
      } else if (sd === 30 && ed === 31) {
        ed = 30;
      }
      return ((ed + em * 30 + ey * 360) - (sd + sm * 30 + sy * 360)) / 360;
    case 1:
      // Actual/actual
      let feb29Between = function(date1, date2) {
        let year1 = date1.getFullYear();
        let mar1year1 = new Date(year1, 2, 1);
        if (isLeapYear(year1) && date1 < mar1year1 && date2 >= mar1year1) {
          return true;
        }
        let year2 = date2.getFullYear();
        let mar1year2 = new Date(year2, 2, 1);
        return (isLeapYear(year2) && date2 >= mar1year2 && date1 < mar1year2);
      };
      let ylength = 365;
      if (sy === ey || ((sy + 1) === ey) && ((sm > em) || ((sm === em) && (sd >= ed)))) {
        if ((sy === ey && isLeapYear(sy)) ||
            feb29Between(start_date, end_date) ||
            (em === 1 && ed === 29)) {
          ylength = 366;
        }
        return daysBetween(start_date, end_date) / ylength;
      }
      let years = (ey - sy) + 1;
      let days = (new Date(ey + 1, 0, 1) - new Date(sy, 0, 1)) / cf.MS_PER_DAY;
      let average = days / years;
      return daysBetween(start_date, end_date) / average;
    case 2:
      // Actual/360
      return daysBetween(start_date, end_date) / 360;
    case 3:
      // Actual/365
      return daysBetween(start_date, end_date) / 365;
    case 4:
      // European 30/360
      if (sd === 31 && ed === 31) {
        sd = 30;
        ed = 30;
      } else if (sd === 31) {
        sd = 30;
      } else if (sd === 30 && ed === 31) {
        ed = 30;
      }
      return ((ed + em * 30 + ey * 360) - (sd + sm * 30 + sy * 360)) / 360;
  }
};

