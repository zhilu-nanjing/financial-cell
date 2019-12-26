import {errorObj, errorMsgArr, ERROR_NA} from '../../calc_utils/error_config'
import {
  AllowErrorExpFunction,
  NotConvertExpFunction
} from '../../calc_data_proxy/exp_function_proxy';

// TODO
exports.CELL = function() {
 throw new Error('CELL is not implemented');
};

exports.ERROR = {};
exports.ERROR.TYPE = function (error_val) { // 判断错误类型
  let msgIndice = errorMsgArr.indexOf(error_val) + 1
    if (msgIndice > -1){
      return msgIndice
    }
    else {
      return Error(ERROR_NA);
    }
};

// TODO
exports.INFO = function() {
 throw new Error('INFO is not implemented');
};

///////////// Jobs： ISBLANK函数能够处理Error，因此要这么写。 后面的ISERR与ISERROR都需要改写。
/**
 *
 * @param arg 必需。 指的是要测试的值。 参数 value 可以是空白（空单元格）、错误值、逻辑值、文本、数字、引用值，或者引用要测试的以上任意值的名称。
 * @returns {boolean}
 */
function isBlank(arg){ // 仿照这个写法
  if(arg.hasOwnProperty("cellVTypeName")){
    return ["CellVEmpty", "CellVError"].includes(arg.cellVTypeName)
  }
  return false
}
export const ISBLANK = new NotConvertExpFunction(isBlank) // 所有的数值都不会转化

/**
 *
 * @param value 必需。 指的是要测试的值。
 * @returns {boolean}
 * @constructor
 * @private
 */
function ISERR_(value) { // 是否是错误1
  return errorMsgArr.indexOf(value) >= 0 ||
    (typeof value === 'number' && (isNaN(value) || !isFinite(value)));
};
export const ISERR = new NotConvertExpFunction(ISERR_)

/**
 *
 * @param value value 必需。 指的是要测试的值。
 * @returns {boolean}
 * @constructor
 * @private
 */
export function ISERROR_(value) { // 是否是错误2
  return ISERR_(value) || value === Error(ERROR_NA);
};
export const ISERROR = new NotConvertExpFunction(ISERROR_)

exports.ISBINARY = function (number) {
  return (/^[01]{1,10}$/).test(number);
};

/**
 *
 * @param {number}number 必需。 要测试的值。 如果 number 不是整数，将被截尾取整。
 * @returns {boolean}
 * @constructor
 */
export function ISEVEN(number) {
  return (Math.floor(Math.abs(number)) & 1) ? false : true;
};


// TODO
exports.ISFORMULA = function() {
  throw new Error('ISFORMULA is not implemented');
};

/**
 *
 * @param value 必需。 指的是要测试的值。
 * @returns {boolean}
 * @constructor
 */
export function ISLOGICAL(value) {
  //
  if (value === true || value === "TRUE" || value === false || value === "FALSE") {
    return true
  } else {
    return false
    // return value === true || value === false;
  }
};

/**
 *
 * @param value 必需。 指的是要测试的值。
 * @returns {boolean}
 * @constructor
 */
export function ISNA(value) {
  return value === Error(ERROR_NA) || value === Error(ERROR_NA).message;
  ;
};

/**
 *
 * @param value 必需。 指的是要测试的值。
 * @returns {boolean}
 * @constructor
 */
export function ISNONTEXT(value) {
  return typeof(value) !== 'string';
};

/**
 *
 * @param value 必需。 指的是要测试的值。
 * @returns {boolean}
 * @constructor
 */
export function ISNUMBER(value) {
  return typeof(value) === 'number' && !isNaN(value) && isFinite(value);
};

/**
 *
 * @param {number}number 必需。 要测试的值。 如果 number 不是整数，将被截尾取整。
 * @returns {boolean}
 * @constructor
 */
export function ISODD(number) {
  return (Math.floor(Math.abs(number)) & 1) ? true : false;
};

// TODO
/**
 * @param value 必需。 指的是要测试的值。
 * @returns {boolean}
 * @constructor
 */
export function ISREF(value) {
  if (value === undefined) {
    return false
  }
  return arguments['0'] !== null
};

/**
 *
 * @param value 必需。 指的是要测试的值。
 * @returns {boolean}
 * @constructor
 */
export function ISTEXT(value) {
  return typeof(value) === 'string';
};

exports.N = function (value) {
  if (typeof(value) === 'number' && !isNaN(value) && isFinite(value)) {
    return value;
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  if (value === true || value.toString().toUpperCase() === 'TRUE' || value.toString().toUpperCase() == 'FALSE') {
    return 1;
  }
  if (value === false || typeof(value)==='string') {
    return 0;
  }
  if (ISERROR(value)) {
    return value;
  }
  return 0;
};

exports.NA = function() {
  return Error(ERROR_NA);
};


// TODO
exports.SHEET = function() {
  throw new Error('SHEET is not implemented');
};

// TODO
exports.SHEETS = function() {
  throw new Error('SHEETS is not implemented');
};

exports.TYPE = function (value) {
  if (typeof(value) === 'number' && !isNaN(value) && isFinite(value)) {
    return 1;
  }
  // if (typeof(value) !== 'string' && isNaN(value)){
  //   return errorObj.ERROR_VALUE
  // }
  if (typeof(value) === 'string') {
    if (value.slice(0,1) == '{'){
      let arr = helper.strToMatrix(value)
      if (Array.isArray(arr)) {
        return 64;
      }
    }else{
      return 2
    }
  }
  if(value == 'FALSE'){
    return false
  }
  if (value == true || value == false) {
    return 4;
  }
  if (exports.ISERR(value) || value === Error(ERROR_NA)) {
    return 16;
  }
  if (Array.isArray(arr)) {
    return 64;
  }

};
