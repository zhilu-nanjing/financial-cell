import * as numeric from 'numeric'
import * as utils from '../../calc_utils/helper'
import {ERROR_DIV0, ERROR_NUM, ERROR_VALUE, errorObj} from '../../calc_utils/error_config'
import * as statistical from './statistical'
import * as information from './information'
import {OnlyNumberExpFunction} from "../../calc_data_proxy/exp_function_proxy";
import {parseNumber, parseNumberArray} from "../../calc_utils/parse_helper";
import {flatten} from '../../calc_utils/helper'

/**
 * @return {number}
 */
function ABS_(number){
  return Math.abs(number);
};
export const ABS = new OnlyNumberExpFunction(ABS_)

/**
 *
 * @param {number} 必需。 所求角度的余弦值，必须介于 -1 到 1 之间。
 * @returns {Error|number}
 * @constructor
 */
export function ACOS(number) {
  if(typeof(number)!='number'){
    return Error(ERROR_VALUE);
  }
  return Math.acos(number);
};

/**
 *
 * @param {number} 必需。 大于或等于 1 的任意实数。
 * @returns {*|Error|number}
 * @constructor
 */
export function ACOSH(number) {
  if(typeof(number)!='number'){
    return Error(ERROR_VALUE);
  }
  return Math.log(number + Math.sqrt(number * number - 1));
};

/**
 *
 * @param {number} 必需。 Number 为所需角度的余切值。 此值必须是实数。
 * @returns {Error|number}
 * @constructor
 */
export function ACOT(number) {
  if(typeof(number)!='number'){
    return Error(ERROR_VALUE);
  }
  return Math.atan(1 / number);
};

/**
 *
 * @param {number} 必需。 Number 的绝对值必须大于 1。
 * @returns {Error|number}
 * @constructor
 */
export function ACOTH(number) {
  if(typeof(number)!='number'){
    return Error(ERROR_VALUE);
  }
  return 0.5 * Math.log((number + 1) / (number - 1));
};

/**
 *
 * @param {number} num1
 * @param {number} num2
 * @returns {*|Error}
 * @constructor
 */
export function ADD(num1, num2) {
  if(typeof(num1)!='number'||typeof(num2)!='number'){
    return Error(ERROR_VALUE);
  }
  return num1 + num2;
};

//TODO: use options
exports.AGGREGATE = function(function_num, options, ref1, ref2) {
  function_num = parseNumber(function_num);
  options = parseNumber(options);
  if (typeof ref1 == 'string') {
    return Error(ERROR_VALUE)
  }//XW:end
  if (utils.anyIsError(function_num, options)) {
    return Error(ERROR_VALUE);
  }
  switch (function_num) {
    case 1:
      return statistical.AVERAGE(ref1);
    case 2:
      return statistical.COUNT(ref1);
    case 3:
      return statistical.COUNTA(ref1);
    case 4:
      return statistical.MAX(ref1);
    case 5:
      return statistical.MIN(ref1);
    case 6:
      return exports.PRODUCT(ref1);
    case 7:
      return statistical.STDEV.S(ref1);
    case 8:
      return statistical.STDEV.P(ref1);
    case 9:
      return exports.SUM(ref1);
    case 10:
      return statistical.VAR.S(ref1);
    case 11:
      return statistical.VAR.P(ref1);
    case 12:
      return statistical.MEDIAN(ref1, ref2);
    case 13:
      return statistical.MODE.SNGL(ref1);
    case 14:
      return statistical.LARGE(ref1, ref2);
    case 15:
      if (ref2 == undefined){
        return Error(ERROR_VALUE)
      }
      return statistical.SMALL(ref1, ref2);
    case 16:
      return statistical.PERCENTILE.INC(ref1, ref2);
    case 17:
      return statistical.QUARTILE.INC(ref1, ref2);
    case 18:
      return statistical.PERCENTILE.EXC(ref1, ref2);
    case 19:
      return statistical.QUARTILE.EXC(ref1, ref2);
  }
};

/**
 *
 * @param {string}text 必需。 用引号引起的字符串、空字符串 ("") 或对包含文本的单元格的引用。
 * @returns {*|Error|number}
 * @constructor
 */
export function ARABIC(text) {
  text = text.toUpperCase()
  if (!/^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/.test(text)) {
    return Error(ERROR_VALUE);
  }
  let r = 0;
  text.replace(/[MDLV]|C[MD]?|X[CL]?|I[XV]?/g, function (i) {
    r += {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1
    }[i];
  });
  return r;
};

/**
 *
 * @param {number} 必需。 所求角度的正弦值，必须介于 -1 到 1 之间。
 * @returns {Error|number}
 * @constructor
 */
export function ASIN(number) {
  if(typeof(number)!='number'){
    return Error(ERROR_VALUE);
  }
  return Math.asin(number);
};

/**
 *
 * @param  {number} 必需。 任意实数。
 * @returns {Error|number}
 * @constructor
 */
export function ASINH(number) {
  if(typeof(number)!='number'){
    return Error(ERROR_VALUE);
  }
  return Math.log(number + Math.sqrt(number * number + 1));
};

/**
 *
 * @param {number} 必需。 所求角度的正切值。
 * @returns {*|Error|number}
 * @constructor
 */
export function ATAN(number) {
  if(typeof(number)!='number'){
    return Error(ERROR_VALUE);
  }
  return Math.atan(number);
};

/**
 *
 * @param {number} number_x 必需。 点的 x 坐标。
 * @param {number} number_y 必需。 点的 y 坐标。
 * @returns {*|Error|number}
 * @constructor
 */
export function ATAN2(number_x, number_y) {
  if(typeof(number_x)!='number'||typeof(number_y)!='number'){
    return Error(ERROR_VALUE);
  }
  return Math.atan2(number_x, number_y);
};

/**
 *
 * @param {number} 必需。 -1 到 1 之间的任意实数。
 * @returns {*|Error|number}
 * @constructor
 */
export function ATANH(number) {
  if(typeof(number)!='number'){
    return Error(ERROR_VALUE);
  }
  return Math.log((1 + number) / (1 - number)) / 2;
};

/**
 *
 * @param {number} number 必需。 要转换的数字。 必须是大于或等于0且小于 2 ^ 53 的整数。
 * @param {number} radix 必需。 要将数字转换为的基础基数。 必须是大于或等于2且小于或等于36的整数。
 * @param {number} min_length  可选。 返回的字符串的最小长度。 必须是大于或等于0的整数。
 * @returns {*|Error|string}
 * @constructor
 */
export function BASE(number, radix, min_length) {
  min_length = min_length || 0;
  number = parseNumber(number);
  radix = parseNumber(radix);
  min_length = parseNumber(min_length);
  if (utils.anyIsError(number, radix, min_length)) {
    return new Error(ERROR_VALUE);
  }
  min_length = (min_length === undefined) ? 0 : min_length;
  let result = number.toString(radix);
  return new Array(Math.max(min_length + 1 - result.length, 0)).join('0') + result;
};

/**
 *
 * @param {number}number 必需。 要舍入的值。
 * @param {number}significance 必需。 要舍入到的倍数。
 * @param mode
 * @returns {*|Error|number}
 * @constructor
 */
export function CEILING_(number, significance, mode) {
  let a = significance
  significance = (significance === undefined) ? 1 : Math.abs(significance);
  mode = mode || 0;
  number = parseNumber(number);
  significance = parseNumber(significance);
  mode = parseNumber(mode);
  if (significance === 0) {
    return 0;
  }
  let precision = -Math.floor(Math.log(significance) / Math.log(10));
  if (number >= 0) {
    return exports.ROUND(Math.ceil(number / significance) * significance, precision);
  }
  else {
    if (mode === 0) {
      if (a<0){
      return -exports.ROUND(Math.ceil(Math.abs(number) / significance) * significance, precision);
      }
      else{
        return -exports.ROUND(Math.floor(Math.abs(number) / significance) * significance, precision);
      }
    }
    else {
      return -exports.ROUND(Math.ceil(Math.abs(number) / significance) * significance, precision);
    }
  }
};
export const CEILING = new OnlyNumberExpFunction(CEILING_)

exports.CEILING.MATH = CEILING;

exports.CEILING.PRECISE = CEILING;

/**
 *
 * @param {number}number 必需。 项目的数量。
 * @param {number}number_chosen 必需。 每一组合中项目的数量。
 * @returns {*|Error|number}
 * @constructor
 */
export function COMBIN(number, number_chosen) {
  number = parseNumber(number);
  number_chosen = parseNumber(number_chosen);
  return exports.FACT(number) / (exports.FACT(number_chosen) * exports.FACT(number - number_chosen));
};

/**
 *
 * @param {number}number 必需。 必须大于或等于 0 并大于或等于 Number_chosen。 非整数值将被截尾取整。
 * @param {number}number_chosen 必需。 必须大于或等于 0。 非整数值将被截尾取整。
 * @returns {number}
 * @constructor
 * @private
 */
function COMBINA_(number, number_chosen) {
  number = parseNumber(number);
  number_chosen = parseNumber(number_chosen);
  return (number === 0 && number_chosen === 0) ? 1 : exports.COMBIN(number + number_chosen - 1, number - 1);
};
export const COMBINA = new OnlyNumberExpFunction(COMBINA_)

/**
 *
 * @param {number} number 必需。 想要求余弦的角度，以弧度表示。
 * @returns {number}
 * @constructor
 * @private
 */
function COS_(number) {
  number = parseNumber(number);
  return Math.cos(number);
};
export const COS = new OnlyNumberExpFunction(COS_)

/**
 *
 * @param {number}number 必需。 想要求双曲余弦的任意实数。
 * @returns {Error|number}
 * @constructor
 */
function COSH_(number) {
  number = parseNumber(number);
  return (Math.exp(number) + Math.exp(-number)) / 2;
};
export const COSH = new OnlyNumberExpFunction(COSH_)

/**
 *
 * @param {number} number 必需。 要获得其余切值的角度，以弧度表示。
 * @returns {number}
 * @constructor
 * @private
 */
function COT_(number) {
  number = parseNumber(number);
  return 1 / Math.tan(number);
};
export const COT = new OnlyNumberExpFunction(COT_)

/**
 *
 * @param {number} number 必需。
 * @returns {Error|number}
 * @constructor
 */
function COTH_(number) {
  number = parseNumber(number);
  let e2 = Math.exp(2 * number);
  return (e2 + 1) / (e2 - 1);
};
export const COTH = new OnlyNumberExpFunction(COTH_)

/**
 *
 * @param {number}number 必需。
 * @returns {Error|number}
 * @constructor
 */
function CSC_(number) {
  number = parseNumber(number);
  return 1 / Math.sin(number);
};
export const CSC = new OnlyNumberExpFunction(CSC_)

function CSCH_(number) {
  number = parseNumber(number);
  return 2 / (Math.exp(number) - Math.exp(-number));
};
export const CSCH = new OnlyNumberExpFunction(CSCH_)

/**
 *
 * @param{string/number} number 必需
 * @param {number}radix  必需。Radix 必须是整数。
 * @returns {Error|number}
 * @constructor
 */
export function DECIMAL(number, radix) {
  if (arguments.length < 1) {
    return Error(ERROR_VALUE);
  }


  return parseInt(number, radix);
};


/**
 *
 * @param {角度}number 必需。 要转换的角度，以弧度表示。
 * @returns {Error|number}
 * @constructor
 */
export function DEGREES(number) {
  number = parseNumber(number);
  if (number instanceof Error) {
    return number;
  }
  return number * 180 / Math.PI;
};

/**
 *
 * @param {number}number 必需。 要舍入的值。
 * @returns {Error|*}
 * @constructor
 */
export function EVEN(number) {
  number = parseNumber(number);
  if (number instanceof Error) {
    return number;
  }
  return exports.CEILING_(number, -2, -1);
};

/**
 *  Number    必需。 底数 e 的指数。
 * @type {(x: number) => number}
 */
exports.EXP = Math.exp;

/**
 *
 * @param {number}number  必需。 要计算其阶乘的非负数。 如果 number 不是整数，将被截尾取整。
 * @returns {Error|number|*}
 * @constructor
 */
export function FACT(number) {
  let MEMOIZED_FACT = [];
  number = parseNumber(number);
  if (number < 0){
    return Error(ERROR_NUM)
  }
  if (number instanceof Error) {
    return number;
  }
  let n = Math.floor(number);
  if (n === 0 || n === 1) {
    return 1;
  } else if (MEMOIZED_FACT[n] > 0) {
    return MEMOIZED_FACT[n];
  } else {
    MEMOIZED_FACT[n] = exports.FACT(n - 1) * n;
    return MEMOIZED_FACT[n];
  }
};

/**
 *
 * @param {number}number 必需。 为其返回双倍阶乘的值。 如果 number 不是整数，将被截尾取整。
 * @returns {Error|number}
 * @constructor
 */
export function FACTDOUBLE(number) {
  number = parseNumber(number);
  if (number instanceof Error) {
    return number;
  }
  if (number < 0) {
    return Error(ERROR_NUM)
  }
  let n = Math.floor(number);
  if (n <= 1) {
    return 1;
  } else {
    return n * exports.FACTDOUBLE(n - 2);
  }
};

//TODO: Verify
// XW: 自己写的函数
exports.FLOOR = {};
let ROUND = function (value, places) {
  let n = value;
  let d = places;
  return Math.round(n * Math.pow(10, d)) / Math.pow(10, d);
};

/**
 *
 * @param {number}number 必需。 要向下舍入的数字。
 * @param {number}significance 可选。 要舍入到的倍数。
 * @param {number}mode 可选。 舍入负数的方向（接近或远离 0）。
 * @returns {Error|number|*}
 * @constructor
 */
export function FLOORMATH(number, significance, mode) {
  if (typeof number !=='number'){ //
    return Error(ERROR_VALUE); // ERROR_VALUE = '#VALUE!'
  }
  if (number>0&&significance<0){
    return Error(ERROR_VALUE)
  }
  if (number<0&&significance<0){
    number = -number
    significance = -significance
    let precision = -Math.floor(Math.log(significance) / Math.log(10));
    return -ROUND(Math.floor(number / significance) * significance, precision);
  }
  significance = (significance === undefined) ? 1 : significance;
  mode = (mode === undefined) ? 0 : mode;
  if (significance === 0) {
    return 0;
  }
  significance = significance ? Math.abs(significance) : 1;
  let precision = -Math.floor(Math.log(significance) / Math.log(10));
  if (number >= 0) {
    return ROUND(Math.floor(number / significance) * significance, precision);
  } else if (mode === 0 || mode === undefined) {
    return -ROUND(Math.ceil(Math.abs(number) / significance) * significance, precision);
  }
  return -ROUND(Math.floor(Math.abs(number) / significance) * significance, precision);
}

/**
 *
 * @param {number}number 必需。 要向下舍入的数字。
 * @param {number}significance 可选。 要舍入到的倍数。
 * @param {number}mode 可选。 舍入负数的方向（接近或远离 0）。
 * @returns {Error|number|*}
 * @constructor
 */
export function FLOORPRACE(number, significance, mode) {
  if (typeof number !=='number'){ //
    return Error(ERROR_VALUE); // ERROR_VALUE = '#VALUE!'
  }
  if (number<0&&significance<0){
    number = -number
    significance = -significance
    let precision = -Math.floor(Math.log(significance) / Math.log(10));
    return -ROUND(Math.floor(number / significance) * significance, precision);
  }
  significance = (significance === undefined) ? 1 : significance;
  mode = (mode === undefined) ? 0 : mode;
  if (significance === 0) {
    return 0;
  }

  significance = significance ? Math.abs(significance) : 1;
  let precision = -Math.floor(Math.log(significance) / Math.log(10));
  if (number >= 0) {
    return ROUND(Math.floor(number / significance) * significance, precision);
  } else if (mode === 0 || mode === undefined) {
    return -ROUND(Math.ceil(Math.abs(number) / significance) * significance, precision);
  }
  return -ROUND(Math.floor(Math.abs(number) / significance) * significance, precision);
}

// Deprecated
exports.FLOOR.MATH = exports.FLOORMATH;
exports.FLOOR.PRECISE = exports.FLOORPRACE;
//XW: end
// adapted http://rosettacode.org/wiki/Greatest_common_divisor#JavaScript

/**
 *number1, number2, ...    Number1 是必需的，后续数字是可选的。 介于 1 和 255 之间的值。 如果任意值不是整数，将被截尾取整。
 * @returns {Error|number}
 * @constructor
 */
export function GCD() {
  let range = parseNumberArray(flatten(arguments));
  if (range instanceof Error) {
    return range;
  }
  let n = range.length;
  let r0 = range[0];
  if (r0 < 0) {
    return Error(ERROR_NUM)
  }
  let x = r0 < 0 ? -r0 : r0;
  for (let i = 1; i < n; i++) {
    let ri = range[i];
    if (ri < 0) {
      return Error(ERROR_NUM)
    }
    let y = ri < 0 ? -ri : ri;
    while (x && y) {
      if (x > y) {
        x %= y;
      } else {
        y %= x;
      }
    }
    x += y;
  }
  return x;
};


exports.INT = function(number) {
  number = parseNumber(number);
  if (number instanceof Error) {
    return number;
  }
  return Math.floor(number);
};

//TODO: verify
exports.ISO = {
  CEILING: exports.CEILING
};

/**
 *
 * @returns {Error|*}
 * @constructor
 */
export function LCM() {
  // Credits: Jonas Raoni Soares Silva
  let o = parseNumberArray(flatten(arguments));
  if (o instanceof Error) {
    return o;
  }
  for (let i, j, n, d, r = 1;
    (n = o.pop()) !== undefined;) {
    while (n > 1) {
      if (n % 2) {
        for (i = 3, j = Math.floor(Math.sqrt(n)); i <= j && n % i; i += 2) {
          //empty
        }
        d = (i <= j) ? i : n;
      } else {
        d = 2;
      }
      for (n /= d, r *= d, i = o.length; i;
        (o[--i] % d) === 0 && (o[i] /= d) === 1 && o.splice(i, 1)) {
        //empty
      }
    }
  }
  return r;
};

exports.LN = function(number) {
  number = parseNumber(number);
  if (number instanceof Error) {
    return number;
  }
  return Math.log(number);
};

exports.LOG = function (number, base) {
  number = parseNumber(number);
  base = parseNumber(base);
  if (utils.anyIsError(base)) {
    base = 10
  }
  base = (base === undefined) ? 10 : base;
  return Math.log(number) / Math.log(base);
};

exports.LOG10 = function(number) {
  number = parseNumber(number);
  if (number instanceof Error) {
    return number;
  }
  return Math.log(number) / Math.log(10);
};

exports.MDETERM = function(matrix) {
  if (typeof matrix == 'string'){
    matrix = utils.strToMatrix(matrix);
  }
  try{
    return numeric.det(matrix);
  }catch (e) {
    return Error(ERROR_VALUE)
  }
};

exports.MINVERSE = function(matrix) {
  matrix = utils.parseMatrix(matrix);
  if (matrix instanceof Error) {
    return matrix;
  }
  return numeric.inv(matrix);
};

exports.MMULT = function(matrix1, matrix2) {
  matrix1 = utils.parseMatrix(matrix1);
  matrix2 = utils.parseMatrix(matrix2);
  if (utils.anyIsError(matrix1, matrix2)) {
    return Error(ERROR_VALUE);
  }
  console.log(numeric.dot(matrix1, matrix2))
  return numeric.dot(matrix1, matrix2);
};

exports.MOD = function(dividend, divisor) {
  dividend = parseNumber(dividend);
  divisor = parseNumber(divisor);
  if (utils.anyIsError(dividend, divisor)) {
    return Error(ERROR_VALUE);
  }
  if (divisor === 0) {
    return errorObj.ERROR_DIV0;
  }
  let modulus = Math.abs(dividend % divisor);
  return (divisor > 0) ? modulus : -modulus;
};

  exports.MROUND = function(number, multiple) {
  number = parseNumber(number);
  multiple = parseNumber(multiple);
  if (utils.anyIsError(number, multiple)) {
    return Error(ERROR_VALUE);
  }
  if (number * multiple < 0) {
    return Error(ERROR_VALUE);
  }

  return Math.round(number / multiple) * multiple;
};

exports.MULTINOMIAL = function() {
  let args = parseNumberArray(utils.flatten(arguments));
  if (args instanceof Error) {
    return args;
  }
  let sum = 0;
  let divisor = 1;
  for (let i = 0; i < args.length; i++) {
    sum += args[i];
    divisor *= exports.FACT(args[i]);
  }
  return exports.FACT(sum) / divisor;
};

exports.MUNIT = function(dimension) {
  dimension = parseNumber(dimension);
  if (dimension instanceof Error) {
    return dimension;
  }
  return numeric.identity(dimension);
};

exports.ODD = function(number) {
  number = parseNumber(number);
  if (number instanceof Error) {
    return number;
  }
  let temp = Math.ceil(Math.abs(number));
  temp = (temp & 1) ? temp : temp + 1;
  return (number > 0) ? temp : -temp;
};

exports.PI = function() {
  return Math.PI;
};

exports.POWER = function(number, power) {
  number = parseNumber(number);
  power = parseNumber(power);
  if (utils.anyIsError(number, power)) {
    return Error(ERROR_VALUE);
  }
  let result = Math.pow(number, power);
  if (isNaN(result)) {
    return Error(ERROR_VALUE);
  }

  return result;
};

exports.PRODUCT = function() {
  let args = parseNumberArray(utils.flatten(arguments));
  if (args instanceof Error) {
    return args;
  }
  let result = 1;
  for (let i = 0; i < args.length; i++) {
    result *= args[i];
  }
  return result;
};

exports.QUOTIENT = function(numerator, denominator) {
  numerator = parseNumber(numerator);
  denominator = parseNumber(denominator);
  if (utils.anyIsError(numerator, denominator)) {
    return Error(ERROR_VALUE);
  }
  return parseInt(numerator / denominator, 10);
};

exports.RADIANS = function(number) {
  number = parseNumber(number);
  if (number instanceof Error) {
    return number;
  }
  return number * Math.PI / 180;
};

exports.RAND = function() {
  if (arguments.length > 0 && arguments[0] !== undefined){
    return Error(ERROR_VALUE)
  }
  return Math.random();
};

exports.RANDBETWEEN = function(bottom, top) {
  bottom = parseNumber(bottom);
  top = parseNumber(top);
  if (utils.anyIsError(bottom, top)) {
    return Error(ERROR_VALUE);
  }
  // Creative Commons Attribution 3.0 License
  // Copyright (c) 2012 eqcode
  return bottom + Math.ceil((top - bottom + 1) * Math.random()) - 1;
};

// TODO
exports.ROMAN = function(number) {
  number = parseNumber(number);
  if (number instanceof Error) {
    return number;
  }
  // The MIT License
  // Copyright (c) 2008 Steven Levithan
  let digits = String(number).split('');
  let key = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM', '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC', '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
  let roman = '';
  let i = 3;
  while (i--) {
    roman = (key[+digits.pop() + (i * 10)] || '') + roman;
  }
  return new Array(+digits.join('') + 1).join('M') + roman;
};

exports.ROUND = function (number, digits) {
  number = parseNumber(number);
  digits = parseNumber(digits);
  if (utils.anyIsError(number, digits)) {
    return Error(ERROR_VALUE);
  }
  if (number < 0){
    number = 0-number
    return 0-Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits);
  }
  return Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits);
};

exports.ROUNDDOWN = function(number, digits) {
  number = parseNumber(number);
  digits = parseNumber(digits);
  if (utils.anyIsError(number, digits)) {
    return Error(ERROR_VALUE);
  }
  let sign = (number > 0) ? 1 : -1;
  return sign * (Math.floor(Math.abs(number) * Math.pow(10, digits))) / Math.pow(10, digits);
};

exports.ROUNDUP = function(number, digits) {
  number = parseNumber(number);
  digits = parseNumber(digits);
  if (utils.anyIsError(number, digits)) {
    return Error(ERROR_VALUE);
  }
  let sign = (number > 0) ? 1 : -1;
  return sign * (Math.ceil(Math.abs(number) * Math.pow(10, digits))) / Math.pow(10, digits);
};

exports.SEC = function(number) {
  number = parseNumber(number);
  if (number instanceof Error) {
    return number;
  }
  return 1 / Math.cos(number);
};

exports.SECH = function(number) {
  number = parseNumber(number);
  if (number instanceof Error) {
    return number;
  }
  return 2 / (Math.exp(number) + Math.exp(-number));
};

exports.SERIESSUM = function(x, n, m, coefficients) {
  x = parseNumber(x);
  n = parseNumber(n);
  m = parseNumber(m);
  coefficients = parseNumberArray(coefficients);
  if (utils.anyIsError(x, n, m, coefficients)) {
    return Error(ERROR_VALUE);
  }
  let result = coefficients[0] * Math.pow(x, n);
  for (let i = 1; i < coefficients.length; i++) {
    result += coefficients[i] * Math.pow(x, n + i * m);
  }
  return result;
};

exports.SIGN = function(number) {
  number = parseNumber(number);
  if (number instanceof Error) {
    return number;
  }
  if (number < 0) {
    return -1;
  } else if (number === 0) {
    return 0;
  } else {
    return 1;
  }
};

exports.SIN = function(number) {
  number = parseNumber(number);
  if (number instanceof Error) {
    return number;
  }
  return Math.sin(number);
};

  exports.SINH = function(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    return (Math.exp(number) - Math.exp(-number)) / 2;
  };

  exports.SQRT = function(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    if (number < 0) {
      return Error(ERROR_VALUE);
    }
    return Math.sqrt(number);
  };

  exports.SQRTPI = function(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    return Math.sqrt(number * Math.PI);
  };

exports.SUBTOTAL = function(function_code, ref1) {
  function_code = parseNumber(function_code);
  if (function_code instanceof Error) {
    return function_code;
  }
  switch (function_code) {
    case 1:
      return statistical.AVERAGE(ref1);
    case 2:
      return statistical.COUNT(ref1);
    case 3:
      return statistical.COUNTA(ref1);
    case 4:
      return statistical.MAX(ref1);
    case 5:
      return statistical.MIN(ref1);
    case 6:
      return exports.PRODUCT(ref1);
    case 7:
      return statistical.STDEV.S(ref1);
    case 8:
      return statistical.STDEV.P(ref1);
    case 9:
      return exports.SUM(ref1);
    case 10:
      return statistical.VAR.S(ref1);
    case 11:
      return statistical.VAR.P(ref1);
      // no hidden values for us
    case 101:
      return statistical.AVERAGE(ref1);
    case 102:
      return statistical.COUNT(ref1);
    case 103:
      return statistical.COUNTA(ref1);
    case 104:
      return statistical.MAX(ref1);
    case 105:
      return statistical.MIN(ref1);
    case 106:
      return exports.PRODUCT(ref1);
    case 107:
      return statistical.STDEV.S(ref1);
    case 108:
      return statistical.STDEV.P(ref1);
    case 109:
      return exports.SUM(ref1);
    case 110:
      return statistical.VAR.S(ref1);
    case 111:
      return statistical.VAR.P(ref1);

  }
};


exports.MINUS = function (num1, num2) {
  if (arguments.length !== 2) {
    return errorObj.ERROR_NA;
  }

  num1 = parseNumber(num1);
  num2 = parseNumber(num2);
  if (utils.anyIsError(num1, num2)) {
    return Error(ERROR_VALUE);
  }

  return num1 - num2;
};

exports.DIVIDE = function (dividend, divisor) {
  if (arguments.length !== 2) {
    return errorObj.ERROR_NA;
  }

  dividend = parseNumber(dividend);
  divisor = parseNumber(divisor);
  if (utils.anyIsError(dividend, divisor)) {
    return Error(ERROR_VALUE);
  }

  if (divisor === 0) {
    return errorObj.ERROR_DIV0;
  }

  return dividend / divisor;
};

exports.MULTIPLY = function (factor1, factor2) {
  if (arguments.length !== 2) {
    return errorObj.ERROR_NA;
  }

  factor1 = parseNumber(factor1);
  factor2 = parseNumber(factor2);
  if (utils.anyIsError(factor1, factor2)) {
    return Error(ERROR_VALUE);
  }

  return factor1 * factor2;
};

exports.GTE = function (num1, num2) {
  if (arguments.length !== 2) {
    return errorObj.ERROR_NA;
  }

  num1 = parseNumber(num1);
  num2 = parseNumber(num2);
  if (utils.anyIsError(num1, num2)) {
    return errorObj.ERROR_ERROR;
  }

  return num1 >= num2;
};

exports.LT = function (num1, num2) {
  if (arguments.length !== 2) {
    return errorObj.ERROR_NA;
  }

  num1 = parseNumber(num1);
  num2 = parseNumber(num2);
  if (utils.anyIsError(num1, num2)) {
    return errorObj.ERROR_ERROR;
  }

  return num1 < num2;
};


exports.LTE = function (num1, num2) {
  if (arguments.length !== 2) {
    return errorObj.ERROR_NA;
  }

  num1 = parseNumber(num1);
  num2 = parseNumber(num2);
  if (utils.anyIsError(num1, num2)) {
    return errorObj.ERROR_ERROR;
  }

  return num1 <= num2;
};

exports.EQ = function (value1, value2) {
  if (arguments.length !== 2) {
    return errorObj.ERROR_NA;
  }

  return value1 === value2;
};

exports.NE = function (value1, value2) {
  if (arguments.length !== 2) {
    return errorObj.ERROR_NA;
  }

  return value1 !== value2;
};

exports.POW = function (base, exponent) {
  if (arguments.length !== 2) {
    return errorObj.ERROR_NA;
  }

  base = parseNumber(base);
  exponent = parseNumber(exponent);
  if (utils.anyIsError(base, exponent)) {
    return errorObj.ERROR_ERROR;
  }

  return exports.POWER(base, exponent);
};

exports.SUM = function() {
  let result = 0;
  let argsKeys = Object.keys(arguments);
  for (let i = 0; i < argsKeys.length; ++i) {
    let elt = arguments[argsKeys[i]];
    if (typeof elt === 'number') {
      result += elt;
    } else if (typeof elt === 'string') {
      let parsed = parseFloat(elt);
      !isNaN(parsed) && (result += parsed);
    } else if (Array.isArray(elt)) {
      result += exports.SUM.apply(null, elt);
    }
  }
  return result;
};

exports.SUMIF = function(range, criteria) {
  range = parseNumberArray(utils.flatten(range));
  if (range instanceof Error) {
    return range;
  }
  let result = 0;
  for (let i = 0; i < range.length; i++) {
    result += (eval(range[i] + criteria)) ? range[i] : 0; // jshint ignore:line
  }
  return result;
};
//XW： SUMIFS函数
exports.SUMIFS = function() {
  let args = utils.argsToArray(arguments);
  let range = utils.flatten(args.shift());
  if (range instanceof Error) {
    return range;
  }
  if (args.length % 2 !== 0) {
    return Error(ERROR_VALUE);
  }
  for (let i = 0; i < args.length; i += 2) {
    if (args[i].length !== range.length || !args[i + 1]) {
      return Error(ERROR_VALUE);
    }
  }
  let arr = [];
  let result = 0;
  for (let i = 0; i < args.length; i += 2) {
    let s_arr = [];
    for (let j = 0; j < args[i].length; j++) {
      let compareValue = args[i + 1] + "";
      if (compareValue.lastIndexOf(">=") == 0) {
        compareValue = compareValue.replace(/>=/, "");
        if (isNaN(compareValue)) {
          str = true;
        }
        if (compareValue * 1 <= args[i][j][0]) {
          s_arr.push(j);
        }
      }else if (compareValue.lastIndexOf("<=") == 0) {
        compareValue = compareValue.replace(/<=/, "");
        if(isNaN(compareValue)) {
          str = true;
        }
        if (compareValue * 1 >= args[i][j][0]) {
          s_arr.push(j);
        }
      }
      compareValue = compareValue.replace("=", "");
      if (compareValue.lastIndexOf("<>") == 0) {
        compareValue = compareValue.replace(/<>/, "");
        if (compareValue !== args[i][j][0]) {
          s_arr.push(j);
        }
      } else {
        let str = false;
        if (compareValue.lastIndexOf("<") == 0) {
          compareValue = compareValue.replace(/</, "");
          if(isNaN(compareValue)) {
            str = true;
          }
          if (compareValue * 1 > args[i][j][0]) {
            s_arr.push(j);
          }
        } else if (compareValue.lastIndexOf(">") == 0) {
          compareValue = compareValue.replace(/>/, "");
          if(isNaN(compareValue)) {
            str = true;
          }
          if (compareValue * 1 < args[i][j][0]) {
            s_arr.push(j);
          }
        } else {
          if (compareValue.indexOf('*') > 0){
            let v = compareValue
            v = v.replace('*', '')
            if (typeof args[i][j][0] == 'string' && args[i][j][0].indexOf(v) >= 0){
              s_arr.push(j);
            }
          }
          if(isNaN(compareValue)) {
            if(compareValue === args[i][j][0]) {
              s_arr.push(j);
            }
          } else {
            if(compareValue * 1 === args[i][j][0]) {
              s_arr.push(j);
            }

          }
        }
        if(str) {
          return Error(ERROR_VALUE);
        }
      }

    }
    arr.push(s_arr);
  }

  let resultArr = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      let value = arr[i][j];
      let enter = 1;
      for (let k = 0; enter !== 3 && k < arr.length; k++) {
        if (k !== i && arr[k].indexOf(value) !== -1) {
          enter = 2;
        } else if (k !== i) {
          enter = 3;
        }
      }
      if (enter == 1 && arr.length > 1) {
        enter = 3;
      } else if (enter == 1 && arr.length === 1) {
        enter = 2;
      }
      if (enter == 2 && resultArr.indexOf(value) == -1) {
        resultArr.push(value);
      }
    }
  }

  if (arr.length <= 0) {
    return Error(ERROR_VALUE);
  }

  for (let i = 0; i < resultArr.length; i++) {
    let a = range[resultArr[i]];
    if (a && !isNaN(a)) {
      result += a;
    } else {
      return 0;
    }
  }

  return result;
};
//XW：end

exports.SUMPRODUCT = function() {
  if (!arguments || arguments.length === 0) {
    return Error(ERROR_VALUE);
  }
  let arrays = arguments.length + 1;
  let result = 0;
  let product;
  let k;
  let _i;
  let _ij;
  for (let i = 0; i < arguments[0].length; i++) {
    if (!(arguments[0][i] instanceof Array)) {
      product = 1;
      for (k = 1; k < arrays; k++) {
        _i = parseNumber(arguments[k - 1][i]);
        if (_i instanceof Error) {
          return _i;
        }
        product *= _i;
      }
      result += product;
    } else {
      for (let j = 0; j < arguments[0][i].length; j++) {
        product = 1;
        for (k = 1; k < arrays; k++) {
          _ij = parseNumber(arguments[k - 1][i][j]);
          if (_ij instanceof Error) {
            return _ij;
          }
          product *= _ij;
        }
        result += product;
      }
    }
  }
  return result;
};

exports.SUMSQ = function() {
  let numbers = parseNumberArray(utils.flatten(arguments));
  if (numbers instanceof Error) {
    return numbers;
  }
  let result = 0;
  let length = numbers.length;
  for (let i = 0; i < length; i++) {
    result += (information.ISNUMBER(numbers[i])) ? numbers[i] * numbers[i] : 0;
  }
  return result;
};

exports.SUMX2MY2 = function (array_x, array_y) {
  if (typeof array_x === "string") {
    array_x = utils.strToMatrix(array_x);
  }
  if (typeof array_y === "string") {
    array_y = utils.strToMatrix(array_y);
  }
  if (utils.anyIsError(array_x, array_y)) {
    return Error(ERROR_VALUE);
  }
  let result = 0;
  array_x = parseNumberArray(utils.flatten(array_x));
  array_y = parseNumberArray(utils.flatten(array_y));
  for (let i = 0; i < array_x.length; i++) {
    result += array_x[i] * array_x[i] - array_y[i] * array_y[i];
  }
  return result;
};

exports.SUMX2PY2 = function (array_x, array_y) {
  //XW: 参数转数组
  if (typeof array_x == "string") {
    array_x = utils.strToMatrix(array_x);
  }
  if (typeof array_y == "string") {
    array_y = utils.strToMatrix(array_y);
  }
  //XW：end
  if (utils.anyIsError(array_x, array_y)) {
    return Error(ERROR_VALUE);
  }
  let result = 0;
  array_x = parseNumberArray(utils.flatten(array_x));
  array_y = parseNumberArray(utils.flatten(array_y));
  for (let i = 0; i < array_x.length; i++) {
    result += array_x[i] * array_x[i] + array_y[i] * array_y[i];
  }
  return result;
};

exports.SUMXMY2 = function(array_x, array_y) {
  if (typeof array_x === "string") {
    array_x = utils.strToMatrix(array_x);
  }
  if (typeof array_y === "string") {
    array_y = utils.strToMatrix(array_y);
  }
  array_x = parseNumberArray(utils.flatten(array_x));
  array_y = parseNumberArray(utils.flatten(array_y));
  if (utils.anyIsError(array_x, array_y)) {
    return Error(ERROR_VALUE);
  }
  let result = 0;
  array_x = utils.flatten(array_x);
  array_y = utils.flatten(array_y);
  for (let i = 0; i < array_x.length; i++) {
    result += Math.pow(array_x[i] - array_y[i], 2);
  }
  return result;
};

exports.TAN = function(number) {
  number = parseNumber(number);
  if (number instanceof Error) {
    return number;
  }
  return Math.tan(number);
};

exports.TANH = function(number) {
  number = parseNumber(number);
  if (number instanceof Error) {
    return number;
  }
  let e2 = Math.exp(2 * number);
  return (e2 - 1) / (e2 + 1);
};

exports.TRUNC = function(number, digits) {
  digits = (digits === undefined) ? 0 : digits;
  number = parseNumber(number);
  digits = parseNumber(digits);
  if (utils.anyIsError(number, digits)) {
    return Error(ERROR_VALUE);
  }
  let sign = (number > 0) ? 1 : -1;
  return sign * (Math.floor(Math.abs(number) * Math.pow(10, digits))) / Math.pow(10, digits);
};
