import * as mathTrig from './math-trig';
import * as text from './text';
import * as jStat from 'jstat';
import * as utils from '../../calc_utils/helper';
import {ERROR_DIV0, ERROR_NA, ERROR_NUM, ERROR_VALUE, errorObj} from '../../calc_utils/error_config';
import * as misc from './miscellaneous';
import * as evalExpression from './expression';
import { parseBool, parseNumber, parseNumberArray } from '../../calc_utils/parse_helper';
import {OnlyNumberExpFunction} from "../../calc_data_proxy/exp_function_proxy";
import{anyIsError} from "../../calc_utils/helper";
import* as helper from "../../calc_utils/helper";

let SQRT2PI = 2.5066282746310002;

/**
 * number1, number2, ...    Number1 是必需的，后续数字是可选的。
 * 要计算其绝对偏差平均值的 1 到 255 个参数。 也可以用单一数组或对某个数组的引用来代替用逗号分隔的参数。
 * @returns {Error|number}
 * @constructor
 */
export function AVEDEV() {
  let range = parseNumberArray(utils.flatten(arguments));
  if (range instanceof Error) {
    return range;
  }
  return jStat.sum(jStat(range).subtract(jStat.mean(range)).abs()[0]) / range.length;
};

/**
 * Number1    必需。 要计算平均值的第一个数字、单元格引用或单元格区域。
   Number2, ...    可选。 要计算平均值的其他数字、单元格引用或单元格区域，最多可包含 255 个。
 * @returns {Error|(string&Error)|undefined|([]&Error)|number|*}
 * @constructor
 */
export function AVERAGE() {
  let range = utils.flattenNum(arguments); // 这个arguments是通过function.call传递过来的
  if (range instanceof Error) {
    return range;
  }
  if (range.length === 0){
    return errorObj.e
  }
  let n = range.length;
  let sum = 0;
  let count = 0;
  for (let i = 0; i < n; i++) {
    sum += range[i];
    count += 1;
  }
  return sum / count;
};


/**
 * Value1, value2, ...    Value1 是必需的，后续值是可选的。 需要计算平均值的 1 到 255 个单元格、单元格区域或值。
 * @returns {*|Error|number}
 * @constructor
 */
export function AVERAGEA() {
  // let range = utils.flattenNum(arguments);
  let range = arguments
  if (range.length === 1 && isNaN(range[0])){
    return Error(ERROR_VALUE)
  }
  let n = range.length;
  let sum = 0;
  let count = 0;
  for (let i = 0; i < n; i++) {
    let el = range[i];
    if (typeof el === 'number') {
      sum += el;
    }
    if (typeof el !== 'number') {
      sum ;
    }
    if (el !== null) {
      count++;
    }
  }
  return sum / count;
};


/**
 *
 * @param {number}range 必需。 要计算平均值的一个或多个单元格，其中包含数字或包含数字的名称、数组或引用。
 * @param {string}criteria 必需。 形式为数字、表达式、单元格引用或文本的条件，用来定义将计算平均值的单元格。
 *                 例如，条件可以表示为 32、"32"、">32"、"苹果" 或 B4。
 * @param {string}average_range 可选。 计算平均值的实际单元格组。 如果省略，则使用 range。
 * @returns {*|Error|Error|number}
 * @constructor
 */
export function AVERAGEIF (range, criteria, average_range) {
  if (arguments.length <= 1) {
    return errorObj.ERROR_NA;
  }
  average_range = average_range || range;
  range = utils.flatten(range);
  average_range = parseNumberArray(utils.flatten(average_range));

  if (average_range instanceof Error) {
    return average_range;
  }
  let average_count = 0;
  let result = 0;
  let isWildcard = criteria === void 0 || criteria === '*';
  let tokenizedCriteria = isWildcard ? null : evalExpression.parse(criteria + '');
  let filter_criteria = criteria.replace('=', '').replace('*', '').replace('<>', '')
  for (let i = 0; i < range.length; i++) {
    let value = range[i];

    if (isWildcard) {
      result += average_range[i];
      average_count++;
    } else {
      let tokens = [evalExpression.createToken(value, evalExpression.TOKEN_TYPE_LITERAL)].concat(tokenizedCriteria);
      if (criteria.indexOf('<>') >= 0){
        if (value.indexOf(filter_criteria) < 0) {
          result += average_range[i];
          average_count++;
        }
      }else if (evalExpression.compute(tokens) || value.toString().indexOf(filter_criteria) >= 0) {
        result += average_range[i];
        average_count++;
      }
    }
  }
  if (average_count === 0){
    return new Error(ERROR_DIV0)
  }
  return result / average_count;
};


/**
 *Average_range 必需。要计算平均值的一个或多个单元格，其中包含数字或包含数字的名称、数组或引用。

 Criteria_range1、criteria_range2 等 Criteria_range1 是必需的，后续 criteria_range 是可选的。在其中计算关联条件的 1 至 127 个区域。

 Criteria1、criteria2 等 Criteria1 是必需的，后续 criteria 是可选的。 形式为数字、表达式、单元格引用或文本的 1 至 127 个条件，用来定义将计算平均值的单元格。
                         例如，条件可以表示为 32、"32"、">32"、"苹果" 或 B4。
 * @returns {*|Error|number}
 * @constructor
 */
export function AVERAGEIFS() {
  // Does not work with multi dimensional ranges yet!
  //http://office.microsoft.com/en-001/excel-help/averageifs-function-HA010047493.aspx
  let args = utils.argsToArray(arguments);
  let criteriaLength = (args.length - 1) / 2;
  let range = utils.flatten(args[0]);
  let count = 0;
  let result = 0;
  for (let i = 0; i < range.length; i++) {
    let isMeetCondition = false;
    for (let j = 0; j < criteriaLength; j++) {
      let value = args[2 * j + 1][i];
      let criteria = args[2 * j + 2];
      let isWildcard = criteria === void 0 || criteria === '*';
      let computedResult = false;
      if (isWildcard) {
        computedResult = true;
      } else {
        let tokenizedCriteria = evalExpression.parse(criteria + '');
        let tokens = [evalExpression.createToken(value, evalExpression.TOKEN_TYPE_LITERAL)].concat(tokenizedCriteria);

        computedResult = evalExpression.compute(tokens);
      }
      // Criterias are calculated as AND so any `false` breakes the loop as unmeet condition
      if (!computedResult) {
        isMeetCondition = false;
        break;
      }
      isMeetCondition = true;
    }
    if (isMeetCondition) {
      result += range[i];
      count++;
    }
  }
  let average = result / count;
  if (isNaN(average)) {
      return new Error(ERROR_DIV0);
  } else {
    return average;
  }
};


exports.BETA = {};

/**
 *
 * @param {number}x 必需。 用来计算其函数的值，介于值 A 和 B 之间
 * @param {number}alpha 必需。 分布参数。
 * @param {number}beta 必需。 分布参数。
 * @param {boolean}cumulative 必需。 决定函数形式的逻辑值。 如果 cumulative 为 TRUE，则 BETA.DIST 返回累积分布函数；如果为 FALSE，则返回概率密度函数。
 * @param {number}A 可选。 x 所属区间的下界。
 * @param {number}B 可选。 x 所属区间的上界。
 * @returns {Error|number}
 * @constructor
 * @private
 */
export function BETADIST_(x, alpha, beta, cumulative, A, B) {
  if (arguments.length < 4) {
    return Error(ERROR_NUM);
  }
  A = (A === undefined) ? 0 : A;
  B = (B === undefined) ? 1 : B;
  x = parseNumber(x);
  alpha = parseNumber(alpha);
  beta = parseNumber(beta);
  A = parseNumber(A);
  B = parseNumber(B);
  cumulative = parseBool(cumulative)
  x = (x - A) / (B - A);
  return cumulative ? jStat.beta.cdf(x, alpha, beta) : jStat.beta.pdf(x, alpha, beta)/2;
};
export const BETA__DIST = new OnlyNumberExpFunction(BETADIST_)

/**
 *
 * @param {number}probability 必需。 与 beta 分布相关的概率。
 * @param {number}alpha 必需。 分布参数。
 * @param {number}beta  必需。 分布参数。
 * @param {number}A 可选。 x 所属区间的下界。
 * @param {number}B 可选。 x 所属区间的上界。
 * @returns {*|Error}
 * @constructor
 */
export function BETAINV_(probability, alpha, beta, A, B) {
  A = (A === undefined) ? 0 : A;
  B = (B === undefined) ? 1 : B;
  probability = parseNumber(probability);
  alpha = parseNumber(alpha);
  beta = parseNumber(beta);
  A = parseNumber(A);
  B = parseNumber(B);
  if(probability<=0||probability>1||alpha<=0||beta<=0){
    return Error(ERROR_NUM)
  }
  return jStat.beta.inv(probability, alpha, beta) * (B - A) + A;
};
export const BETA__INV = new OnlyNumberExpFunction(BETAINV_)

exports.BINOM = {};

/**
 *
 * @param {number} successes 必需。 试验的成功次数。
 * @param {number} trials 必需。 独立试验次数。
 * @param {number} probability 必需。 每次试验成功的概率。
 * @param {boolean} cumulative 必需。 决定函数形式的逻辑值。 如果 cumulative 为 TRUE，则 BINOM.DIST 返回累积分布函数，
 *                  即最多存在 number_s 次成功的概率；如果为 FALSE，则返回概率密度函数，即存在 number_s 次成功的概率。
 * @returns {*|number}
 * @constructor
 * @private
 */
function BINOMDIST_(successes, trials, probability, cumulative) {
  successes = parseNumber(successes);
  trials = parseNumber(trials);
  probability = parseNumber(probability);
  cumulative = parseBool(cumulative)
  cumulative = parseNumber(cumulative);
  if(successes<0||successes>trials||probability<0||probability>1){
    return Error(ERROR_NUM)
  }
  return (cumulative) ? jStat.binomial.cdf(successes, trials, probability) : jStat.binomial.pdf(successes, trials, probability);
};
export const BINOM__DIST = new OnlyNumberExpFunction(BINOMDIST_)

/**
 *
 * @param {number} trials  必需。 贝努利试验次数。
 * @param {number} probability 必需。 一次试验中成功的概率。
 * @param {number} alpha 必需。 临界值。
 * @returns {number}
 * @constructor
 * @private
 */
function BINOMINV_(trials, probability, alpha) {
  trials = parseNumber(trials);
  probability = parseNumber(probability);
  alpha = parseNumber(alpha);
  if(trials<0||probability<0||probability>1||alpha<0||alpha>1){
    return Error(ERROR_NUM)
  }
  let x = 0;
  while (x <= trials) {
    if (jStat.binomial.cdf(x, trials, probability) >= alpha) {
      return x;
    }
    x++;
  }
};
export const BINOM__INV = new OnlyNumberExpFunction(BINOMINV_)

/**
 *
 * @param {Number}x 必需。 用来计算分布的数值
 * @param {Number}k 必需。 自由度数,即样本个数
 * @param {Boolean}cumulative 必需。 决定函数形式的逻辑值
 * @returns {*|Error}
 * @constructor
 */
export function CHISQ__DIST(x, k, cumulative) {
  cumulative = parseBool(cumulative)
  if (x < 0){
    return Error(ERROR_NUM)
  }
  x = parseNumber(x);
  k = parseNumber(k);
  if (anyIsError(x, k)) {
    return Error(ERROR_NUM);
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
export function CHISQ__DIST__RT(x, k) {
  if (!x || !k) {
    return Error(ERROR_VALUE);
  }

  if (x < 1 || k > Math.pow(10, 10)) {
    return Error(ERROR_NUM);
  }

  if ((typeof x !== 'number') || (typeof k !== 'number')) {
    return Error(ERROR_VALUE);
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
export  function CHISQ__INV(probability, k) {
  probability = parseNumber(probability);
  k = parseNumber(k);
  return jStat.chisquare.inv(probability, k);
};

/**
 *
 * @param x {Number}probability 必需。 与 χ2 分布相关联的概率。
 * @param k {Number}k 必需。 自由度数。
 * @returns {*|Error}
 * @constructor
 */
export function CHISQ__INV__RT(probability, k) {
  if (!probability | !k) {
    return Error(ERROR_VALUE);
  }

  if (probability < 0 || probability > 1 || k < 1 || k > Math.pow(10, 10)) {
    return Error(ERROR_NUM);
  }

  if ((typeof probability !== 'number') || (typeof k !== 'number')) {
    return Error(ERROR_VALUE);
  }

  return jStat.chisquare.inv(1.0 - probability, k);
};

/**
 *
 * @param {number}observed 必需。 包含观察值的数据区域，用于检验预期值。
 * @param {number}expected 必需。 包含行列汇总的乘积与总计值之比率的数据区域。
 * @returns {*|Error|number}
 * @constructor
 */
function CHISQTEST_(observed, expected) {
  if (arguments.length !== 2) {
    return Error(ERROR_NA);
  }

  if ((!(observed instanceof Array)) || (!(expected instanceof Array))) {
    return Error(ERROR_VALUE);
  }

  if (observed.length !== expected.length) {
    return Error(ERROR_VALUE);
  }

  if (observed[0] && expected[0] &&
      observed[0].length !== expected[0].length) {
    return Error(ERROR_VALUE);
  }

  let row = observed.length;
  let tmp, i, j;
  for (i = 0; i < row; i ++) {
    if (!(observed[i] instanceof Array)) {
      tmp = observed[i];
      observed[i] = [];
      observed[i].push(tmp);
    }
    if (!(expected[i] instanceof Array)) {
      tmp = expected[i];
      expected[i] = [];
      expected[i].push(tmp);
    }
  }
  let col = observed[0].length;
  let dof = (col === 1) ? row-1 : (row-1)*(col-1);
  let xsqr = 0;
  let Pi =Math.PI;
  for (i = 0; i < row; i ++) {
    for (j = 0; j < col; j ++) {
      xsqr += Math.pow((observed[i][j] - expected[i][j]), 2) / expected[i][j];
    }
  }
  function ChiSq(xsqr, dof) {
    let p = Math.exp(-0.5 * xsqr);
    if((dof%2) === 1) {
      p = p * Math.sqrt(2 * xsqr/Pi);
    }
    let k = dof;
    while(k >= 2) {
      p = p * xsqr/k;
      k = k - 2;
    }
    let t = p;
    let a = dof;
    while (t > 0.0000000001*p) {
      a = a + 2;
      t = t * xsqr/a;
      p = p + t;
    }
    return 1-p;
  }
  return Math.round(ChiSq(xsqr, dof) * 1000000) / 1000000;
};
export const CHISQ__TEST = new OnlyNumberExpFunction(CHISQTEST_)

/**
 * 可选。 要返回其列号的单元格或单元格范围。
 * @returns {number}
 * @constructor
 */
export function COLUMN() {
  let col_list = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  let cell_name = this.args[0].cellFormulaProxy.name
  cell_name = cell_name.replace(/\d+/g,'')
  return col_list.indexOf(cell_name)+1
};

/**
 *
 * @param matrix 必需。 要计算列数的数组、数组公式或是对单元格区域的引用。
 * @returns {*|Error|number}
 * @constructor
 */
export  function COLUMNS(matrix) {
  if (typeof matrix === 'string'){
    matrix = utils.strToMatrix(matrix)
  }
  if (!(matrix instanceof Array)) {
    return Error(ERROR_VALUE);
  }
  if (matrix.length === 0) {
    return 0;
  }
  return jStat.cols(matrix);
};

exports.CONFIDENCE = {};

/**
 *
 * @param {number} alpha 必需。 用来计算置信水平的显著性水平。
 * 置信水平等于 100*(1 - alpha)%，亦即，如果 alpha 为 0.05，则置信水平为 95%。
 * @param {number} sd 必需。 数据区域的总体标准偏差，假定为已知。
 * @param {number}n 必需。 样本大小。
 * @returns {number}
 * @constructor
 * @private
 */
function CONFIDENCENORM_(alpha, sd, n) {
  alpha = parseNumber(alpha);
  sd = parseNumber(sd);
  n = parseNumber(n);
  return jStat.normalci(1, alpha, sd, n)[1] - 1;
};
export const CONFIDENCE__NORM = new OnlyNumberExpFunction(CONFIDENCENORM_)

/**
 *
 * @param {number}alpha 必需。 用来计算置信水平的显著性水平。 置信水平等于 100*(1 - alpha)%，亦即，如果 alpha 为 0.05，则置信水平为 95%。
 * @param {number}sd 必需。 数据区域的总体标准偏差，假定为已知。
 * @param {number}n 必需。 样本大小。
 * @returns {number}
 * @constructor
 */
export function CONFIDENCE__T(alpha, sd, n) {
  alpha = parseNumber(alpha);
  sd = parseNumber(sd);
  n = parseNumber(n);
  return jStat.tci(1, alpha, sd, n)[1] - 1;
};


exports.IFS = function() {
  for (let i = 0; i + 1 < arguments.length; i += 2) {
    let cond = arguments[i];
    let val = arguments[i + 1];
    if (cond) {
      return val;
    }
  }
  return errorObj.ERROR_NA;
}

/**
 *
 * @param {number} array1 必需。 单元格值的范围。
 * @param {number} array2 必需。 单元格值的第二个区域。
 * @returns {Error|*}
 * @constructor
 */
export function CORREL(array1, array2) {
  array1 = parseNumberArray(utils.flatten(array1));
  array2 = parseNumberArray(utils.flatten(array2));
  if (anyIsError(array1, array2)) {
    return Error(ERROR_VALUE);
  }
  return jStat.corrcoeff(array1, array2);
};

/**
 *  函数计算包含数字的单元格个数以及参数列表中数字的个数。
 * @returns {*}
 * @constructor
 */
export function COUNT() {
  return helper.numbers(helper.flatten(arguments)).length;
};

/**
 * 函数计算范围中不为空的单元格的个数。
 * @returns {number}
 * @constructor
 */
export function COUNTA() {
  let range = helper.flatten(arguments);
  return range.length - exports.COUNTBLANK(range);
};

exports.COUNTIN = function (range, value) {
  let result = 0;
  for (let i = 0; i < range.length; i++) {
    if (range[i] === value) {
      result++;
    }
  }
  return result;
};

/**
 * 计算单元格区域中的空单元格的数量。
 * @returns {number}
 * @constructor
 */
export function COUNTBLANK() {
  let range = utils.flatten(arguments);
  let blanks = 0;
  let element;
  for (let i = 0; i < range.length; i++) {
    element = range[i];
    if (element === null || element === '') {
      blanks++;
    }
  }
  return blanks;
};

/**
 *
 * @param {number} range 范围
 * @param {string} criteria 条件
 * @returns {Error|number|*}
 * @constructor
 */
export function COUNTIF(range, criteria) {
  range = helper.flatten(range);
  if (criteria === undefined) {
    return Error(ERROR_VALUE);
  }
  let isWildcard = criteria === void 0 || criteria === '*';

  if (isWildcard) {
    return range.length;
  }
  let matches = 0;
  let tokenizedCriteria = evalExpression.parse(criteria + '');
  for (let i = 0; i < range.length; i++) {
    let value = range[i];
    let tokens = [evalExpression.createToken(value, evalExpression.TOKEN_TYPE_LITERAL)].concat(tokenizedCriteria);
    if (evalExpression.compute(tokens)) {
      matches++;
    }
  }
  return matches;
};

exports.COUNTIFS = function () {
  let args = utils.argsToArray(arguments);
  let results = new Array(utils.flatten(args[0]).length);

  for (let i = 0; i < results.length; i++) {
    results[i] = true;
  }
  for (i = 0; i < args.length; i += 2) {
    let range = utils.flatten(args[i]);
    let criteria = args[i + 1];
    let isWildcard = criteria === void 0 || criteria === '*';

    if (!isWildcard) {
      let tokenizedCriteria = evalExpression.parse(criteria + '');

      for (let j = 0; j < range.length; j++) {
        let value = range[j];
        let tokens = [evalExpression.createToken(value, evalExpression.TOKEN_TYPE_LITERAL)].concat(tokenizedCriteria);
        results[j] = results[j] && evalExpression.compute(tokens);
      }
    }
  }
  let result = 0;
  for (i = 0; i < results.length; i++) {
    if (results[i]) {
      result++;
    }
  }
  return result;
};

exports.COUNTUNIQUE = function () {
  return misc.UNIQUE.apply(null, utils.flatten(arguments)).length;
};

exports.COVARIANCE = {};

/**
 *
 * @param {array} array1 必需。 整数的第一个单元格区域。
 * @param {array} array2 必需。 整数的第二个单元格区域。
 * @returns {Error|number}
 * @constructor
 */
export function COVARIANCE__P(array1, array2) {
  array1 = parseNumberArray(utils.flatten(array1));
  array2 = parseNumberArray(utils.flatten(array2));
  if (anyIsError(array1, array2)) {
    return Error(ERROR_VALUE);
  }
  let mean1 = jStat.mean(array1);
  let mean2 = jStat.mean(array2);
  let result = 0;
  let n = array1.length;
  for (let i = 0; i < n; i++) {
    result += (array1[i] - mean1) * (array2[i] - mean2);
  }
  return result / n;
};

/**
 *
 * @param {array} array1  必需。 整数的第一个单元格区域。
 * @param {array} array2 必需。 整数的第二个单元格区域。
 * @returns {Error|*}
 * @constructor
 */
export function COVARIANCE__S(array1, array2) {
  if (typeof array1 === "string") {
    array1 = utils.strToMatrix(array1);
  }
  if (typeof array2 === "string") {
    array2 = utils.strToMatrix(array2);
  }
  array1 = parseNumberArray(utils.flatten(array1));
  array2 = parseNumberArray(utils.flatten(array2));
  if (anyIsError(array1, array2)) {
    return Error(ERROR_VALUE);
  }
  return jStat.covariance(array1, array2);
};

exports.DEVSQ = function() {
  let range = parseNumberArray(utils.flatten(arguments));
  if (range instanceof Error) {
    return range;
  }
  let mean = jStat.mean(range);
  let result = 0;
  for (let i = 0; i < range.length; i++) {
    result += Math.pow((range[i] - mean), 2);
  }
  return result;
};

exports.EXPON = {};

exports.EXPON.DIST = function(x, lambda, cumulative) {
  cumulative = parseBool(cumulative)
  x = parseNumber(x);
  lambda = parseNumber(lambda);
  if (anyIsError(x, lambda)) {
    return Error(ERROR_VALUE);
  }
  return (cumulative) ? jStat.exponential.cdf(x, lambda) : jStat.exponential.pdf(x, lambda);
};

exports.F = {};

exports.F.DIST = function (x, d1, d2, cumulative) {
  x = parseNumber(x);
  d1 = parseNumber(d1);
  d2 = parseNumber(d2);
  if (anyIsError(x, d1, d2)) {
    return Error(ERROR_VALUE);
  }
  if (cumulative === undefined){
    cumulative = true
  }
  if(typeof cumulative === 'string' && !(cumulative === 'FALSE' || cumulative === 'TRUE')){
    return Error(ERROR_VALUE)
  }
  if (cumulative === 'FALSE'){
    cumulative = false
  }
  return (cumulative) ? jStat.centralF.cdf(x, d1, d2) : jStat.centralF.pdf(x, d1, d2);
};

exports.F.DIST.RT = function (x, d1, d2) {
  if (arguments.length !== 3) {
    return errorObj.ERROR_NA;
  }

  if (x < 0 || d1 < 1 || d2 < 1) {
    return errorObj.ERROR_NUM;
  }

  if ((typeof x !== 'number') || (typeof d1 !== 'number') || (typeof d2 !== 'number')) {
    return Error(ERROR_VALUE);
  }

  return 1 - jStat.centralF.cdf(x, d1, d2);
};

exports.F.INV = function (p, d1, d2) {
  if (arguments.length !== 3) {
    return errorObj.ERROR_NA;
  }

  if (p < 0 || p > 1 || d1 < 1 || d1 > Math.pow(10, 10) || d2 < 1 || d2 > Math.pow(10, 10)) {
    return errorObj.ERROR_NUM;
  }

  if ((typeof p !== 'number') || (typeof d1 !== 'number') || (typeof d2 !== 'number')) {
    return Error(ERROR_VALUE);
  }

  return jStat.centralF.inv(1.0 - p, d1, d2);
};

exports.F.INV.RT = function (p, d1, d2) {
  if (arguments.length !== 3) {
    return errorObj.ERROR_NA;
  }

  if (p < 0 || p > 1 || d1 < 1 || d1 > Math.pow(10, 10) || d2 < 1 || d2 > Math.pow(10, 10)) {
    return errorObj.ERROR_NUM;
  }

  if ((typeof p !== 'number') || (typeof d1 !== 'number') || (typeof d2 !== 'number')) {
    return Error(ERROR_VALUE);
  }

  return jStat.centralF.inv(1.0 - p, d1, d2);
};

exports.F.TEST = function (array1, array2) {
  if (!array1 || !array2) {
    return errorObj.ERROR_NA;
  }

  if (!(array1 instanceof Array) || !(array2 instanceof Array)) {
    return errorObj.ERROR_NA;
  }

  if (array1.length < 2 || array2.length < 2) {
    return errorObj.ERROR_DIV0;
  }

  let sumOfSquares = function (values, x1) {
    let sum = 0;
    for (let i = 0; i < values.length; i++) {
      sum += Math.pow((values[i] - x1), 2);
    }
    return sum;
  };

  let x1 = mathTrig.SUM(array1) / array1.length;
  let x2 = mathTrig.SUM(array2) / array2.length;
  let sum1 = sumOfSquares(array1, x1) / (array1.length - 1);
  let sum2 = sumOfSquares(array2, x2) / (array2.length - 1);

  return sum1 / sum2;
};

exports.FISHER = function(x) {
  x = parseNumber(x);
  if (x instanceof Error) {
    return x;
  }
  return Math.log((1 + x) / (1 - x)) / 2;
};

exports.FISHERINV = function(y) {
  y = parseNumber(y);
  if (y instanceof Error) {
    return y;
  }
  let e2y = Math.exp(2 * y);
  return (e2y - 1) / (e2y + 1);
};

exports.FORECAST = function(x, data_y, data_x) {
  x = parseNumber(x);
  data_y = parseNumberArray(utils.flatten(data_y));
  data_x = parseNumberArray(utils.flatten(data_x));
  if (anyIsError(x, data_y, data_x)) {
    return Error(ERROR_VALUE);
  }
  let xmean = jStat.mean(data_x);
  let ymean = jStat.mean(data_y);
  let n = data_x.length;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (data_x[i] - xmean) * (data_y[i] - ymean);
    den += Math.pow(data_x[i] - xmean, 2);
  }
  let b = num / den;
  let a = ymean - b * xmean;
  return a + b * x;
};

exports.FREQUENCY = function(data, bins) {
  data = parseNumberArray(utils.flatten(data));
  bins = parseNumberArray(utils.flatten(bins));
  if (anyIsError(data, bins)) {
    return Error(ERROR_VALUE);
  }
  let n = data.length;
  let b = bins.length;
  let r = [];
  for (let i = 0; i <= b; i++) {
    r[i] = 0;
    for (let j = 0; j < n; j++) {
      if (i === 0) {
        if (data[j] <= bins[0]) {
          r[0] += 1;
        }
      } else if (i < b) {
        if (data[j] > bins[i - 1] && data[j] <= bins[i]) {
          r[i] += 1;
        }
      } else if (i === b) {
        if (data[j] > bins[b - 1]) {
          r[b] += 1;
        }
      }
    }
  }
  return r;
};


exports.GAMMA = function(number) {
  number = parseNumber(number);
  if (number instanceof Error) {
    return number;
  }

  if (number === 0) {
    return errorObj.ERROR_NUM;
  }

  if (parseInt(number, 10) === number && number < 0) {
    return errorObj.ERROR_NUM;
  }

  return jStat.gammafn(number);
};

exports.GAMMA.DIST = function(value, alpha, beta, cumulative) {
  cumulative = parseBool(cumulative)
  if (arguments.length !== 4) {
    return errorObj.ERROR_NA;
  }

  if (value < 0 || alpha <= 0 || beta <= 0) {
    return Error(ERROR_VALUE);
  }

  if ((typeof value !== 'number') || (typeof alpha !== 'number') || (typeof beta !== 'number')) {
    return Error(ERROR_VALUE);
  }

  return cumulative ? jStat.gamma.cdf(value, alpha, beta, true) : jStat.gamma.pdf(value, alpha, beta, false);
};

exports.GAMMA.INV = function(probability, alpha, beta) {
  if (arguments.length !== 3) {
    return errorObj.ERROR_NA;
  }

  if (probability < 0 || probability > 1 || alpha <= 0 || beta <= 0) {
    return errorObj.ERROR_NUM;
  }

  if ((typeof probability !== 'number') || (typeof alpha !== 'number') || (typeof beta !== 'number')) {
    return Error(ERROR_VALUE);
  }

  return jStat.gamma.inv(probability, alpha, beta);
};

exports.GAMMALN = function(number) {
  number = parseNumber(number);
  if (number instanceof Error) {
    return number;
  }
  return jStat.gammaln(number);
};

exports.GAMMALN.PRECISE = function(x) {
  if (arguments.length !== 1) {
    return errorObj.ERROR_NA;
  }

  if (x <= 0) {
    return errorObj.ERROR_NUM;
  }

  if (typeof x !== 'number') {
    return Error(ERROR_VALUE);
  }

  return jStat.gammaln(x);
};

exports.GAUSS = function(z) {
  z = parseNumber(z);
  if (z instanceof Error) {
    return z;
  }
  return jStat.normal.cdf(z, 0, 1) - 0.5;
};

exports.GEOMEAN = function() {
  let args = parseNumberArray(utils.flatten(arguments));
  if (args instanceof Error) {
    return args;
  }
  return jStat.geomean(args);
};

exports.GROWTH = function(known_y, known_x, new_x, use_const) {
  // Credits: Ilmari Karonen (http://stackoverflow.com/questions/14161990/how-to-implement-growth-function-in-javascript)

  known_y = parseNumberArray(known_y);
  if (known_y instanceof Error) {
    return known_y;
  }

  // Default values for optional parameters:
  let i;
  if (known_x === undefined) {
    known_x = [];
    for (i = 1; i <= known_y.length; i++) {
      known_x.push(i);
    }
  }
  if (new_x === undefined) {
    new_x = [];
    for (i = 1; i <= known_y.length; i++) {
      new_x.push(i);
    }
  }

  known_x = parseNumberArray(known_x);
  new_x = parseNumberArray(new_x);
  if (anyIsError(known_x, new_x)) {
    return Error(ERROR_VALUE);
  }


  if (use_const === undefined) {
    use_const = true;
  }

  // Calculate sums over the data:
  let n = known_y.length;
  let avg_x = 0;
  let avg_y = 0;
  let avg_xy = 0;
  let avg_xx = 0;
  for (i = 0; i < n; i++) {
    let x = known_x[i];
    let y = Math.log(known_y[i]);
    avg_x += x;
    avg_y += y;
    avg_xy += x * y;
    avg_xx += x * x;
  }
  avg_x /= n;
  avg_y /= n;
  avg_xy /= n;
  avg_xx /= n;

  // Compute linear regression coefficients:
  let beta;
  let alpha;
  if (use_const) {
    beta = (avg_xy - avg_x * avg_y) / (avg_xx - avg_x * avg_x);
    alpha = avg_y - beta * avg_x;
  } else {
    beta = avg_xy / avg_xx;
    alpha = 0;
  }

  // Compute and return result array:
  let new_y = [];
  for (i = 0; i < new_x.length; i++) {
    new_y.push(Math.exp(alpha + beta * new_x[i]));
  }
  return new_y;
};

exports.HARMEAN = function() {
  let range = parseNumberArray(utils.flatten(arguments));
  if (range instanceof Error) {
    return range;
  }
  let n = range.length;
  let den = 0;
  for (let i = 0; i < n; i++) {
    den += 1 / range[i];
  }
  return n / den;
};

exports.HYPGEOM = {};

exports.HYPGEOM.DIST = function(x, n, M, N, cumulative) {
  cumulative = parseBool(cumulative)
  x = parseNumber(x);
  n = parseNumber(n);
  M = parseNumber(M);
  N = parseNumber(N);
  if (anyIsError(x, n, M, N)) {
    return Error(ERROR_VALUE);
  }

  function pdf(x, n, M, N) {
    return mathTrig.COMBIN(M, x) * mathTrig.COMBIN(N - M, n - x) / mathTrig.COMBIN(N, n);
  }

  function cdf(x, n, M, N) {
    let result = 0;
    for (let i = 0; i <= x; i++) {
      result += pdf(i, n, M, N);
    }
    return result;
  }

  return (cumulative) ? cdf(x, n, M, N) : pdf(x, n, M, N);
};

exports.INTERCEPT = function(known_y, known_x) {
  known_y = parseNumberArray(known_y);
  known_x = parseNumberArray(known_x);
  if (anyIsError(known_y, known_x)) {
    return Error(ERROR_VALUE);
  }
  if (known_y.length !== known_x.length) {
    return errorObj.ERROR_NA;
  }
  return exports.FORECAST(0, known_y, known_x);
};

exports.KURT = function() {
  let range = parseNumberArray(utils.flatten(arguments));
  if (range instanceof Error) {
    return range;
  }
  let mean = jStat.mean(range);
  let n = range.length;
  let sigma = 0;
  for (let i = 0; i < n; i++) {
    sigma += Math.pow(range[i] - mean, 4);
  }
  sigma = sigma / Math.pow(jStat.stdev(range, true), 4);
  return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sigma - 3 * (n - 1) * (n - 1) / ((n - 2) * (n - 3));
};

exports.LARGE = function(range, k) {
  range = utils.flatten(range)
  let arr = []
  for ( let i=0;i<range.length;i++){
    if (parseFloat(range[i])){
      arr.push((parseFloat(range[i])))
    }
  }
  range = arr;
  k = parseNumber(k);
  if (anyIsError(range, k)) {
    return range;
  }
  return range.sort(function (a, b) {
    return b - a;
  })[k - 1];
};

exports.LINEST = function(data_y, data_x) {
  data_y = parseNumberArray(utils.flatten(data_y));
  data_x = parseNumberArray(utils.flatten(data_x));
  if (anyIsError(data_y, data_x)) {
    return Error(ERROR_VALUE);
  }
  let ymean = jStat.mean(data_y);
  let xmean = jStat.mean(data_x);
  let n = data_x.length;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (data_x[i] - xmean) * (data_y[i] - ymean);
    den += Math.pow(data_x[i] - xmean, 2);
  }
  let m = num / den;
  let b = ymean - m * xmean;
  return [m, b];
};

// According to Microsoft:
// http://office.microsoft.com/en-us/starter-help/logest-function-HP010342665.aspx
// LOGEST returns are based on the following linear model:
// ln y = x1 ln m1 + ... + xn ln mn + ln b
exports.LOGEST = function(data_y, data_x) {
  data_y = parseNumberArray(utils.flatten(data_y));
  data_x = parseNumberArray(utils.flatten(data_x));
  if (anyIsError(data_y, data_x)) {
    return Error(ERROR_VALUE);
  }
  for (let i = 0; i < data_y.length; i ++) {
    data_y[i] = Math.log(data_y[i]);
  }

  let result = exports.LINEST(data_y, data_x);
  result[0] = Math.round(Math.exp(result[0])*1000000)/1000000;
  result[1] = Math.round(Math.exp(result[1])*1000000)/1000000;
  return result;
};

exports.LOGNORM = {};

exports.LOGNORM.DIST = function(x, mean, sd, cumulative) {
  cumulative = parseBool(cumulative)
  x = parseNumber(x);
  mean = parseNumber(mean);
  sd = parseNumber(sd);
  if (anyIsError(x, mean, sd)) {
    return Error(ERROR_VALUE);
  }
  return (cumulative) ? jStat.lognormal.cdf(x, mean, sd) : jStat.lognormal.pdf(x, mean, sd);
};

exports.LOGNORM.INV = function(probability, mean, sd) {
  probability = parseNumber(probability);
  mean = parseNumber(mean);
  sd = parseNumber(sd);
  if (anyIsError(probability, mean, sd)) {
    return Error(ERROR_VALUE);
  }
  return jStat.lognormal.inv(probability, mean, sd);
};

exports.MAX = function() {
  let range = utils.arrayValuesToNumbers(utils.flatten(arguments));
  return (range.length === 0) ? 0 : Math.max.apply(Math, range);
};

exports.MAXA = function() {
  let range = utils.arrayValuesToNumbers(utils.flatten(arguments));
  return (range.length === 0) ? 0 : Math.max.apply(Math, range);
};

exports.MEDIAN = function() {
  let arr = utils.arrayValuesToNumbers(utils.flatten(arguments));
  let arr2 = []
  for (let i=0;i<arr.length;i++){
    if (typeof arr[i] === 'number'){
      arr2.push(arr[i])
    }
  }
  let range = utils.arrayValuesToNumbers(utils.flatten(arr2));
  return jStat.median(range);
};

exports.MIN = function() {
  let range = utils.flatten(arguments);
  return (range.length === 0) ? 0 : Math.min.apply(Math, range);
};

exports.MINA = function() {
  let range = utils.arrayValuesToNumbers(utils.flatten(arguments));
  return (range.length === 0) ? 0 : Math.min.apply(Math, range);
};

exports.MODE = {};

exports.MODE.MULT = function() {
  // Credits: Roönaän
  let range = parseNumberArray(utils.flatten(arguments));
  if (range instanceof Error) {
    return range;
  }
  let n = range.length;
  let count = {};
  let maxItems = [];
  let max = 0;
  let currentItem;

  for (let i = 0; i < n; i++) {
    currentItem = range[i];
    count[currentItem] = count[currentItem] ? count[currentItem] + 1 : 1;
    if (count[currentItem] > max) {
      max = count[currentItem];
      maxItems = [];
    }
    if (count[currentItem] === max) {
      maxItems[maxItems.length] = currentItem;
    }
  }
  return maxItems;
};

exports.MODE.SNGL = function() {
  let range = parseNumberArray(utils.flatten(arguments));
  if (range instanceof Error) {
    return range;
  }
  return exports.MODE.MULT(range).sort(function(a, b) {
    return a - b;
  })[0];
};

exports.NEGBINOM = {};

exports.NEGBINOM.DIST = function(k, r, p, cumulative) {
  cumulative = parseBool(cumulative)
  k = parseNumber(k);
  r = parseNumber(r);
  p = parseNumber(p);
  if (anyIsError(k, r, p)) {
    return Error(ERROR_VALUE);
  }
  return (cumulative) ? jStat.negbin.cdf(k, r, p) : jStat.negbin.pdf(k, r, p);
};

exports.NORM = {};

exports.NORM.DIST = function(x, mean, sd, cumulative) {
  cumulative = parseBool(cumulative)
  x = parseNumber(x);
  mean = parseNumber(mean);
  sd = parseNumber(sd);
  if (anyIsError(x, mean, sd)) {
    return Error(ERROR_VALUE);
  }
  if (sd <= 0) {
    return errorObj.ERROR_NUM;
  }

  // Return normal distribution computed by jStat [http://jstat.org]
  return (cumulative) ? jStat.normal.cdf(x, mean, sd) : jStat.normal.pdf(x, mean, sd);
};

exports.NORM.INV = function(probability, mean, sd) {
  probability = parseNumber(probability);
  mean = parseNumber(mean);
  sd = parseNumber(sd);
  if (anyIsError(probability, mean, sd)) {
    return Error(ERROR_VALUE);
  }
  return jStat.normal.inv(probability, mean, sd);
};

exports.NORM.S = {};

exports.NORM.S.DIST = function(z, cumulative) {
  cumulative = parseBool(cumulative)
  z = parseNumber(z);
  if (z instanceof Error) {
    return Error(ERROR_VALUE);
  }
  return (cumulative) ? jStat.normal.cdf(z, 0, 1) : jStat.normal.pdf(z, 0, 1);
};

exports.NORM.S.INV = function(probability) {
  probability = parseNumber(probability);
  if (probability instanceof Error) {
    return Error(ERROR_VALUE);
  }
  return jStat.normal.inv(probability, 0, 1);
};

exports.PEARSON = function(data_x, data_y) {
  data_y = parseNumberArray(utils.flatten(data_y));
  data_x = parseNumberArray(utils.flatten(data_x));
  if (anyIsError(data_y, data_x)) {
    return Error(ERROR_VALUE);
  }
  let xmean = jStat.mean(data_x);
  let ymean = jStat.mean(data_y);
  let n = data_x.length;
  let num = 0;
  let den1 = 0;
  let den2 = 0;
  for (let i = 0; i < n; i++) {
    num += (data_x[i] - xmean) * (data_y[i] - ymean);
    den1 += Math.pow(data_x[i] - xmean, 2);
    den2 += Math.pow(data_y[i] - ymean, 2);
  }
  return num / Math.sqrt(den1 * den2);
};

exports.PERCENTILE = {};

exports.PERCENTILE.EXC = function(array, k) {
  array = parseNumberArray(utils.flatten(array));
  k = parseNumber(k);
  if (anyIsError(array, k)) {
    return Error(ERROR_VALUE);
  }
  array = array.sort(function(a, b) {
    {
      return a - b;
    }
  });
  let n = array.length;
  if (k < 1 / (n + 1) || k > 1 - 1 / (n + 1)) {
    return errorObj.ERROR_NUM;
  }
  let l = k * (n + 1) - 1;
  let fl = Math.floor(l);
  return utils.cleanFloat((l === fl) ? array[l] : array[fl] + (l - fl) * (array[fl + 1] - array[fl]));
};

exports.PERCENTILE.INC = function(array, k) {
  array = parseNumberArray(utils.flatten(array));
  k = parseNumber(k);
  if (anyIsError(array, k)) {
    return Error(ERROR_VALUE);
  }
  array = array.sort(function(a, b) {
    return a - b;
  });
  let n = array.length;
  let l = k * (n - 1);
  let fl = Math.floor(l);
  return utils.cleanFloat((l === fl) ? array[l] : array[fl] + (l - fl) * (array[fl + 1] - array[fl]));
};

exports.PERCENTRANK = {};

exports.PERCENTRANK.EXC = function(array, x, significance) {
  significance = (significance === undefined) ? 3 : significance;
  array = parseNumberArray(utils.flatten(array));
  x = parseNumber(x);
  significance = parseNumber(significance);
  if (anyIsError(array, x, significance)) {
    return Error(ERROR_VALUE);
  }
  array = array.sort(function(a, b) {
    return a - b;
  });
  let uniques = misc.UNIQUE.apply(null, array);
  let n = array.length;
  let m = uniques.length;
  let power = Math.pow(10, significance);
  let result = 0;
  let match = false;
  let i = 0;
  while (!match && i < m) {
    if (x === uniques[i]) {
      result = (array.indexOf(uniques[i]) + 1) / (n + 1);
      match = true;
    } else if (x >= uniques[i] && (x < uniques[i + 1] || i === m - 1)) {
      result = (array.indexOf(uniques[i]) + 1 + (x - uniques[i]) / (uniques[i + 1] - uniques[i])) / (n + 1);
      match = true;
    }
    i++;
  }
  return Math.floor(result * power) / power;
};

exports.PERCENTRANK.INC = function(array, x, significance) {
  significance = (significance === undefined) ? 3 : significance;
  array = parseNumberArray(utils.flatten(array));
  x = parseNumber(x);
  significance = parseNumber(significance);
  if (anyIsError(array, x, significance)) {
    return Error(ERROR_VALUE);
  }
  array = array.sort(function(a, b) {
    return a - b;
  });
  let uniques = misc.UNIQUE.apply(null, array);
  let n = array.length;
  let m = uniques.length;
  let power = Math.pow(10, significance);
  let result = 0;
  let match = false;
  let i = 0;
  while (!match && i < m) {
    if (x === uniques[i]) {
      result = array.indexOf(uniques[i]) / (n - 1);
      match = true;
    } else if (x >= uniques[i] && (x < uniques[i + 1] || i === m - 1)) {
      result = (array.indexOf(uniques[i]) + (x - uniques[i]) / (uniques[i + 1] - uniques[i])) / (n - 1);
      match = true;
    }
    i++;
  }
  return Math.floor(result * power) / power;
};

exports.PERMUT = function(number, number_chosen) {
  number = parseNumber(number);
  number_chosen = parseNumber(number_chosen);
  if (anyIsError(number, number_chosen)) {
    return Error(ERROR_VALUE);
  }
  return mathTrig.FACT(number) / mathTrig.FACT(number - number_chosen);
};

exports.PERMUTATIONA = function(number, number_chosen) {
  number = parseNumber(number);
  number_chosen = parseNumber(number_chosen);
  if (anyIsError(number, number_chosen)) {
    return Error(ERROR_VALUE);
  }
  return Math.pow(number, number_chosen);
};

exports.PHI = function(x) {
  x = parseNumber(x);
  if (x instanceof Error) {
    return Error(ERROR_VALUE);
  }
  return Math.exp(-0.5 * x * x) / SQRT2PI;
};

exports.POISSON = {};

exports.POISSON.DIST = function(x, mean, cumulative) {
  cumulative = parseBool(cumulative)
  x = parseNumber(x);
  mean = parseNumber(mean);
  if (anyIsError(x, mean)) {
    return Error(ERROR_VALUE);
  }
  return (cumulative) ? jStat.poisson.cdf(x, mean) : jStat.poisson.pdf(x, mean);
};

exports.PROB = function(range, probability, lower, upper) {
  if (lower === undefined) {
    return 0;
  }
  upper = (upper === undefined) ? lower : upper;

  range = parseNumberArray(utils.flatten(range));
  probability = parseNumberArray(utils.flatten(probability));
  lower = parseNumber(lower);
  upper = parseNumber(upper);
  if (anyIsError(range, probability, lower, upper)) {
    return Error(ERROR_VALUE);
  }

  if (lower === upper) {
    return (range.indexOf(lower) >= 0) ? probability[range.indexOf(lower)] : 0;
  }

  let sorted = range.sort(function(a, b) {
    return a - b;
  });
  let n = sorted.length;
  let result = 0;
  for (let i = 0; i < n; i++) {
    if (sorted[i] >= lower && sorted[i] <= upper) {
      result += probability[range.indexOf(sorted[i])];
    }
  }
  return result;
};

exports.QUARTILE = {};

exports.QUARTILE.EXC = function(range, quart) {
  range = parseNumberArray(utils.flatten(range));
  quart = parseNumber(quart);
  if (anyIsError(range, quart)) {
    return Error(ERROR_VALUE);
  }
  switch (quart) {
    case 1:
      return exports.PERCENTILE.EXC(range, 0.25);
    case 2:
      return exports.PERCENTILE.EXC(range, 0.5);
    case 3:
      return exports.PERCENTILE.EXC(range, 0.75);
    default:
      return errorObj.ERROR_NUM;
  }
};

exports.QUARTILE.INC = function(range, quart) {
  range = parseNumberArray(utils.flatten(range));
  quart = parseNumber(quart);
  if (anyIsError(range, quart)) {
    return Error(ERROR_VALUE);
  }
  switch (quart) {
    case 1:
      return exports.PERCENTILE.INC(range, 0.25);
    case 2:
      return exports.PERCENTILE.INC(range, 0.5);
    case 3:
      return exports.PERCENTILE.INC(range, 0.75);
    default:
      return errorObj.ERROR_NUM;
  }
};

exports.RANK = {};

exports.RANK.AVG = function(number, range, order) {
  number = parseNumber(number);
  range = parseNumberArray(utils.flatten(range));
  if (anyIsError(number, range)) {
    return Error(ERROR_VALUE);
  }
  range = utils.flatten(range);
  order = order || false;
  let sort = (order) ? function(a, b) {
    return a - b;
  } : function(a, b) {
    return b - a;
  };
  range = range.sort(sort);

  let length = range.length;
  let count = 0;
  for (let i = 0; i < length; i++) {
    if (range[i] === number) {
      count++;
    }
  }

  return (count > 1) ? (2 * range.indexOf(number) + count + 1) / 2 : range.indexOf(number) + 1;
};

exports.RANK.EQ = function(number, range, order) {
  number = parseNumber(number);
  range = parseNumberArray(utils.flatten(range));
  if (anyIsError(number, range)) {
    return Error(ERROR_VALUE);
  }
  order = order || false;
  let sort = (order) ? function(a, b) {
    return a - b;
  } : function(a, b) {
    return b - a;
  };
  range = range.sort(sort);
  return range.indexOf(number) + 1;
};

exports.ROW = function(matrix, index) {
  if (arguments.length !== 2) {
    return errorObj.ERROR_NA;
  }

  if (index < 0) {
    return errorObj.ERROR_NUM;
  }

  if (!(matrix instanceof Array) || (typeof index !== 'number')) {
    return Error(ERROR_VALUE);
  }

  if (matrix.length === 0) {
    return undefined;
  }

  return jStat.row(matrix, index);
};

exports.ROWS = function(matrix) {
  if (arguments.length !== 1) {
    return errorObj.ERROR_NA;
  }

  if (!(matrix instanceof Array)) {
    return Error(ERROR_VALUE);
  }

  if (matrix.length === 0) {
    return 0;
  }

  return jStat.rows(matrix);
};

exports.RSQ = function(data_x, data_y) { // no need to flatten here, PEARSON will take care of that
  data_x = parseNumberArray(utils.flatten(data_x));
  data_y = parseNumberArray(utils.flatten(data_y));
  if (anyIsError(data_x, data_y)) {
    return Error(ERROR_VALUE);
  }
  return Math.pow(exports.PEARSON(data_x, data_y), 2);
};

exports.SKEW = function() {
  let range = parseNumberArray(utils.flatten(arguments));
  if (range instanceof Error) {
    return range;
  }
  let mean = jStat.mean(range);
  let n = range.length;
  let sigma = 0;
  for (let i = 0; i < n; i++) {
    sigma += Math.pow(range[i] - mean, 3);
  }
  return n * sigma / ((n - 1) * (n - 2) * Math.pow(jStat.stdev(range, true), 3));
};

exports.SKEW.P = function() {
  let range = parseNumberArray(utils.flatten(arguments));
  if (range instanceof Error) {
    return range;
  }
  let mean = jStat.mean(range);
  let n = range.length;
  let m2 = 0;
  let m3 = 0;
  for (let i = 0; i < n; i++) {
    m3 += Math.pow(range[i] - mean, 3);
    m2 += Math.pow(range[i] - mean, 2);
  }
  m3 = m3 / n;
  m2 = m2 / n;
  return m3 / Math.pow(m2, 3 / 2);
};

exports.SLOPE = function(data_y, data_x) {
  data_y = parseNumberArray(utils.flatten(data_y));
  data_x = parseNumberArray(utils.flatten(data_x));
  if (anyIsError(data_y, data_x)) {
    return Error(ERROR_VALUE);
  }
  let xmean = jStat.mean(data_x);
  let ymean = jStat.mean(data_y);
  let n = data_x.length;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (data_x[i] - xmean) * (data_y[i] - ymean);
    den += Math.pow(data_x[i] - xmean, 2);
  }
  return num / den;
};

exports.SMALL = function(range, k) {
  range = parseNumberArray(utils.flatten(range));
  k = parseNumber(k);
  if (anyIsError(range, k)) {
    return range;
  }
  return range.sort(function(a, b) {
    return a - b;
  })[k - 1];
};

exports.STANDARDIZE = function(x, mean, sd) {
  x = parseNumber(x);
  mean = parseNumber(mean);
  sd = parseNumber(sd);
  if (anyIsError(x, mean, sd)) {
    return Error(ERROR_VALUE);
  }
  return (x - mean) / sd;
};

exports.STDEV = {};

exports.STDEV.P = function() {
  let v = exports.VAR.P.apply(this, arguments);
  return Math.sqrt(v);
};

exports.STDEV.S = function() {
  let v = exports.VAR.S.apply(this, arguments);
  return Math.sqrt(v);
};

exports.STDEVA = function() {
  let v = exports.VARA.apply(this, arguments);
  return Math.sqrt(v);
};

exports.STDEVPA = function() {
  let v = exports.VARPA.apply(this, arguments);
  return Math.sqrt(v);
};


exports.STEYX = function(data_y, data_x) {
  data_y = parseNumberArray(utils.flatten(data_y));
  data_x = parseNumberArray(utils.flatten(data_x));
  if (anyIsError(data_y, data_x)) {
    return Error(ERROR_VALUE);
  }
  let xmean = jStat.mean(data_x);
  let ymean = jStat.mean(data_y);
  let n = data_x.length;
  let lft = 0;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    lft += Math.pow(data_y[i] - ymean, 2);
    num += (data_x[i] - xmean) * (data_y[i] - ymean);
    den += Math.pow(data_x[i] - xmean, 2);
  }
  return Math.sqrt((lft - num * num / den) / (n - 2));
};

exports.TRANSPOSE = function(matrix) {
  if (!matrix) {
    return errorObj.ERROR_NA;
  }
  return jStat.transpose(matrix);
};

exports.T = text.T;

exports.T.DIST = function (x, df, cumulative) {
  cumulative = parseBool(cumulative)
  x = parseNumber(x);
  df = parseNumber(df);
  if (anyIsError(x, df)) {
    return Error(ERROR_VALUE);
  }
  return (cumulative) ? jStat.studentt.cdf(x, df) : jStat.studentt.pdf(x, df);
};

exports.T.DIST['2T'] = function(x, df) {
  if (arguments.length !== 2) {
    return errorObj.ERROR_NA;
  }

  if (x < 0 || df < 1) {
    return errorObj.ERROR_NUM;
  }

  if ((typeof x !== 'number') || (typeof df !== 'number')) {
    return Error(ERROR_VALUE);
  }

  return (1 - jStat.studentt.cdf(x , df)) * 2;
};

exports.T.DIST.RT = function(x, df) {
  if (arguments.length !== 2) {
    return errorObj.ERROR_NA;
  }

  if (x < 0 || df < 1) {
    return errorObj.ERROR_NUM;
  }

  if ((typeof x !== 'number') || (typeof df !== 'number')) {
    return Error(ERROR_VALUE);
  }

  return 1 - jStat.studentt.cdf(x , df);
};

exports.T.INV = function (probability, df) {
  // probability = utils.parseNumber(probability);
  // df = utils.parseNumber(df);
  // if (anyIsError(probability, df)) {
  //   return Error(ERROR_VALUE);
  // }
  // let res = jStat.studentt.inv(probability, df);
  // return res
  probability = parseNumber(probability);
  df = parseNumber(df);
  if (probability <= 0 || probability > 1 || df < 1) {
    return errorObj.ERROR_NUM;
  }
  if (anyIsError(probability, df)) {
    return Error(ERROR_VALUE);
  }
  return Math.abs(jStat.studentt.inv(probability/2, df));
};

exports.T.INV['2T'] = function(probability, df) {
  probability = parseNumber(probability);
  df = parseNumber(df);
  if (probability <= 0 || probability > 1 || df < 1) {
    return errorObj.ERROR_NUM;
  }
  if (anyIsError(probability, df)) {
    return Error(ERROR_VALUE);
  }
  return Math.abs(jStat.studentt.inv(probability/2, df));
};

// The algorithm can be found here:
// http://www.chem.uoa.gr/applets/AppletTtest/Appl_Ttest2.html
exports.T.TEST = function(data_x, data_y) {
  data_x = parseNumberArray(utils.flatten(data_x));
  data_y = parseNumberArray(utils.flatten(data_y));
  if (anyIsError(data_x, data_y)) {
    return Error(ERROR_VALUE);
  }

  let mean_x = jStat.mean(data_x);
  let mean_y = jStat.mean(data_y);
  let s_x = 0;
  let s_y = 0;
  let i;

  for (i = 0; i < data_x.length; i++) {
    s_x += Math.pow(data_x[i] - mean_x, 2);
  }
  for (i = 0; i < data_y.length; i++) {
    s_y += Math.pow(data_y[i] - mean_y, 2);
  }

  s_x = s_x / (data_x.length-1);
  s_y = s_y / (data_y.length-1);

  let t = Math.abs(mean_x - mean_y) / Math.sqrt(s_x/data_x.length + s_y/data_y.length);

  return exports.T.DIST['2T'](t, data_x.length+data_y.length-2);
};

exports.TREND = function (data_y, data_x, new_data_x) {
  data_y = parseNumberArray(utils.flatten(data_y));
  data_x = parseNumberArray(utils.flatten(data_x));
  let linest = exports.LINEST(data_y, data_x);
  let m = linest[0];
  let b = linest[1];
  return m * new_data_x + b
};

exports.TRIMMEAN = function (range, percent) {
  range = parseNumberArray(utils.flatten(range));
  percent = parseNumber(percent);
  if (anyIsError(range, percent)) {
    return Error(ERROR_VALUE);
  }
  let trim = mathTrig.FLOORMATH(range.length * percent, 2) / 2;
  return jStat.mean(utils.initial(utils.rest(range.sort(function (a, b) {
    return a - b;
  }), trim), trim));
};

exports.VAR = {};

exports.VAR.P = function () {
  let range = utils.numbers(utils.flatten(arguments));
  if (range.length===0){
    return Error(ERROR_VALUE)
  }
  let n = range.length;
  let sigma = 0;
  let mean = exports.AVERAGE(range);
  for (let i = 0; i < n; i++) {
    sigma += Math.pow(range[i] - mean, 2);
  }
  if (isNaN(sigma / n)){
    return Error(ERROR_VALUE)
  }else{
    return sigma / n;
  }
};

exports.VAR.S = function() {
  let range = utils.numbers(utils.flatten(arguments));
  let n = range.length;
  let sigma = 0;
  let mean = exports.AVERAGE(range);
  for (let i = 0; i < n; i++) {
    sigma += Math.pow(range[i] - mean, 2);
  }
  return sigma / (n - 1);
};

exports.VARA = function() {
  let range = utils.flatten(arguments);
  let n = range.length;
  let sigma = 0;
  let count = 0;
  let mean = exports.AVERAGEA(range);
  for (let i = 0; i < n; i++) {
    let el = range[i];
    if (typeof el === 'number') {
      sigma += Math.pow(el - mean, 2);
    } else if (el === true) {
      sigma += Math.pow(1 - mean, 2);
    } else {
      sigma += Math.pow(0 - mean, 2);
    }

    if (el !== null) {
      count++;
    }
  }
  return sigma / (count - 1);
};

exports.VARPA = function() {
  let range = utils.flatten(arguments);
  let n = range.length;
  let sigma = 0;
  let count = 0;
  let mean = exports.AVERAGEA(range);
  for (let i = 0; i < n; i++) {
    let el = range[i];
    if (typeof el === 'number') {
      sigma += Math.pow(el - mean, 2);
    } else if (el === true) {
      sigma += Math.pow(1 - mean, 2);
    } else {
      sigma += Math.pow(0 - mean, 2);
    }

    if (el !== null) {
      count++;
    }
  }
  return sigma / count;
};

exports.WEIBULL = {};

exports.WEIBULL.DIST = function(x, alpha, beta, cumulative) {
  //XW:参数判断
  cumulative = parseBool(cumulative)
  //XW：end
  x = parseNumber(x);
  alpha = parseNumber(alpha);
  beta = parseNumber(beta);
  if (anyIsError(x, alpha, beta)) {
    return Error(ERROR_VALUE);
  }
  return (cumulative) ? 1 - Math.exp(-Math.pow(x / beta, alpha)) : Math.pow(x, alpha - 1) * Math.exp(-Math.pow(x / beta, alpha)) * alpha / Math.pow(beta, alpha);
};

exports.Z = {};

exports.Z.TEST = function (range, x, sd) {
  range = parseNumberArray(utils.flatten(range));
  x = parseNumber(x);
  if (anyIsError(range, x)) {
    return Error(ERROR_VALUE);
  }

  sd = sd || exports.STDEV.S(range);
  let n = range.length;
  return 1 - exports.NORM.S.DIST((exports.AVERAGE(range) - x) / (sd / Math.sqrt(n)), true);
};
