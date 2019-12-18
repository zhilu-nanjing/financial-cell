import {errorObj} from '../../calc_utils/error_config'
import * as utils from '../../calc_utils/helper'
import * as information from './information'

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

exports.CHOOSE = function() {
  if (arguments.length < 2) {
    return errorObj.ERROR_NA;
  }

  let index = arguments[0];
  if (index < 1 || index > 254) {
    return errorObj.ERROR_VALUE;
  }

  if (arguments.length < index + 1) {
    return errorObj.ERROR_VALUE;
  }

  return arguments[index];
};

exports.FALSE = function() {
  return false;
};

exports.IF = function(test, then_value, otherwise_value) {
  return test ? then_value : otherwise_value;
};

exports.IFERROR = function(value, valueIfError) {
  if (information.ISERROR(value)) {
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
