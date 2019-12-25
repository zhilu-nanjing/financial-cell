import {ERROR_NA, ERROR_VALUE, errorObj} from '../../calc_utils/error_config'
import * as utils from '../../calc_utils/helper'
import * as information from './information'
import {OnlyNumberExpFunction} from "../../calc_data_proxy/exp_function_proxy";

/**
 * 使用 AND 函数，它是一个逻辑函数，用于确定测试中的所有条件是否均为 TRUE。
 * @returns {boolean}
 * @constructor
 */
export function AND() {
  let args = utils.flatten(arguments);
  let result = 'true';
  for (let i = 0; i < args.length; i++) {
    if (!args[i]) {
      result = false;
    }
  }
  return result;
};

/**
 * index_num    必需。 用于指定所选定的数值参数。 index_num 必须是介于 1 到 254 之间的数字，或是包含 1 到 254 之间的数字的公式或单元格引用。
 如果 index_num 为 1，则 CHOOSE 返回 value1；如果为 2，则 CHOOSE 返回 value2，以此类推。
 如果 index_num 小于 1 或大于列表中最后一个值的索引号，则 CHOOSE 返回 #VALUE! 错误值。
 如果 index_num 为小数，则在使用前将被截尾取整。
 value1, value2, ...    Value1 是必需的，后续值是可选的。 1 到 254 个数值参数，
 CHOOSE 将根据 index_num 从中选择一个数值或一项要执行的操作。 参数可以是数字、单元格引用、定义的名称、公式、函数或文本。
 * @returns {*|Error}
 * @constructor
 */
function CHOOSE_() {
  if (arguments.length < 2) {
    return Error(ERROR_NA);
  }
  let index = arguments[0];
  if (index < 1 || index > 254) {
    return Error(ERROR_VALUE);
  }
  if (arguments.length < index + 1) {
    return Error(ERROR_VALUE);
  }
  return arguments[index];
};
export const CHOOSE = new OnlyNumberExpFunction(CHOOSE_)

exports.FALSE = function() {
  return false;
};

/**
 *
 * @param {string}test 要测试的条件。
 * @param {number/string}then_value logical_test 的结果为 TRUE 时，您希望返回的值。
 * @param {number/string}otherwise_value logical_test 的结果为 FALSE 时，您希望返回的值。
 * @returns {*}
 * @constructor
 */
export function IF(test, then_value, otherwise_value) {
  return test ? then_value : otherwise_value;
};

/**
 *
 * @param {number}value 必需。 检查是否存在错误的参数。
 * @param {number/string}valueIfError 必需。 公式计算错误时返回的值。 计算以下错误类型: #N/A、#VALUE!、#REF!、#DIV/0!、#NUM!、#NAME？或 #NULL!。
 * @returns {*}
 * @constructor
 */
export function IFERROR(value, valueIfError) {
  if (information.ISERROR_(value)) {
    return valueIfError;
  }
  return value;
};

exports.IFNA = function(value, value_if_na) {
  return value === errorObj.ERROR_NA ? value_if_na : value;
};

exports.NOT = function(logical) {
  return !logical;
};

exports.OR = function() {
  let args = utils.flatten(arguments);
  let result = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i]) {
      result = true;
    }
  }
  return result;
};

exports.TRUE = function() {
  return true;
};

exports.XOR = function() {
  let args = utils.flatten(arguments);
  let result = 0;
  for (let i = 0; i < args.length; i++) {
    if (args[i]) {
      result++;
    }
  }
  return (Math.floor(Math.abs(result)) & 1) ? true : false;
};

exports.SWITCH = function () {
  let result;
  if (arguments.length > 0) {
    let targetValue = arguments[0];
    let argc = arguments.length - 1;
    let switchCount = Math.floor(argc / 2);
    let switchSatisfied = false;
    let defaultClause = argc % 2 === 0 ? null : arguments[arguments.length - 1];

    if (switchCount) {
      for (let index = 0; index < switchCount; index++) {
        if (targetValue === arguments[index * 2 + 1]) {
          result = arguments[index * 2 + 2];
          switchSatisfied = true;
          break;
        }
      }
    }

    if (!switchSatisfied && defaultClause) {
      result = defaultClause;
    }
  }
  if (result == undefined){
    return errorObj.ERROR_NA
  }
  return result;
};
