import errorObj, {ERROR_DIV0, ERROR_VALUE} from '../../calc_utils/error_config'
import * as stats from './statistical'
import * as maths from './math-trig'
import * as utils from '../../calc_utils/helper'

function compact(array) {
  if (!array) { return array; }
  let result = [];
  for (let i = 0; i < array.length; ++i) {
    if (!array[i]) { continue; }
    result.push(array[i]);
  }
  return result;
}

exports.FINDFIELD = function(database, title) {
  let index = null;
  for (let i = 0; i < database.length; i++) {
    if (database[i][0] === title) {
      index = i;
      break;
    }
  }

  // Return error if the input field title is incorrect
  if (index == null) {
    return Error(ERROR_VALUE);
  }
  return index;
};

//XW: 重写函数
function find_result_idx(database, criteria){
  let valid_arr = []
  let filter_arr = []
  for (let i=0; i < criteria[0].length; i++) {
    filter_arr.push(criteria[0][i])
  }
  for (let i=1; i < criteria.length; i++){
    let arr = criteria[i]
    let valid_str = []
    for (let j=0; j < filter_arr.length; j++){
      if (arr[j] !== null){
        valid_str.push(database[0].indexOf(criteria[0][j]) + '-' + arr[j])
      }
    }
    valid_arr.push(valid_str)
  }
  let result_idx = []
  for (let i=1; i < database.length; i++){
    let data = database[i]
    for(let j=0;j<valid_arr.length;j++){
      let is_valid = true
      for(let k=0;k<valid_arr[j].length;k++){
        let a = data[parseInt(valid_arr[j][k].split('-')[0])]
        let b = valid_arr[j][k].split('-')[1]
        if (b.indexOf('=') >= 0){
          is_valid = (a === b.replace('=', ''))
        }else if(!eval(a+b)){
          is_valid = false
        }
      }
      if(is_valid){
        result_idx.push(i)
      }
    }
  }
  return result_idx
}
function get_values(resultIndexes, database, field){
  let field_idx
  if (typeof field == 'number'){
    field_idx = field - 1
  }else{
    field_idx = database[0].indexOf(field)
  }
  let values= []
  for (let i=0; i< resultIndexes.length; i++){
    values.push(database[resultIndexes[i]][field_idx])
  }
  return values
}

/**
 *
 * @param {number||string}database 构成列表或数据库的单元格区域。 数据库是包含一组相关数据的列表，
 * 其中包含相关信息的行为记录，而包含数据的列为字段。 列表的第一行包含每一列的标签。
 * @param {number||string}field 指定函数所使用的列。 输入两端带双引号的列标签，如 "使用年数" 或 "产量"；
 * 或是代表列表中列位置的数字（不带引号）：1 表示第一列，2 表示第二列，依此类推。
 * @param {number||string}criteria 为包含指定条件的单元格区域。 可以为参数指定 criteria 任意区域，
 * 只要此区域包含至少一个列标签，并且列标签下至少有一个在其中为列指定条件的单元格。
 * @returns {Error|any}
 * @constructor
 */
export function DAVERAGE(database, field, criteria) {
  if (isNaN(field) && (typeof field !== "string")) {
    return Error(ERROR_VALUE);
  }
  let resultIndexes
  if (typeof field == 'number'){
    let resultIndexes = [];
    for (let i=1;i<database.length;i++){
      resultIndexes.push(i)
    }
  } else {
    resultIndexes = find_result_idx(database, criteria)//findResultIndex(database, criteria);
  }
  let targetValues = get_values(resultIndexes, database, field);
  let sum = 0
  for (let i=0; i < targetValues.length; i++){
    sum += targetValues[i]
  }
  return resultIndexes.length === 0 ? Error(ERROR_DIV0) : sum / targetValues.length;
};

/**
 *
 * @param {number/string}database 必需。 构成列表或数据库的单元格区域。
 * 数据库是包含一组相关数据的列表，其中包含相关信息的行为记录，而包含数据的列为字段。 列表的第一行包含每一列的标签。
 * @param {string}field 必需。 指定函数所使用的列。
 * 输入两端带双引号的列标签，如 "使用年数" 或 "产量"；或是代表列表中列位置的数字（不带引号）：1 表示第一列，2 表示第二列，依此类推。
 * @param {string}criteria 必需。 包含所指定条件的单元格区域。
 * 可以为参数 criteria 指定任意区域，只要此参数包含至少一个列标签，并且列标签下至少有一个在其中为列指定条件的单元格。
 * @returns {Error|*}
 * @constructor
 */
export function DCOUNT(database, field, criteria) {
  if (isNaN(field) && (typeof field !== "string")) {
    return  Error(ERROR_VALUE);
  }
  let resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  let targetValues = get_values(resultIndexes, database, field);
  return stats.COUNT(targetValues);
};

/**
 *
 * @param {number/string}database 必需。 构成列表或数据库的单元格区域。 数据库是包含一组相关数据的列表，
 * 其中包含相关信息的行为记录，而包含数据的列为字段。 列表的第一行包含每一列的标签。
 * @param {string}field 可选。 指定函数所使用的列。 输入两端带双引号的列标签，如 "使用年数" 或 "产量"；
 * 或是代表列表中列位置的数字（不带引号）：1 表示第一列，2 表示第二列，依此类推。
 * @param {string}criteria 必需。 包含所指定条件的单元格区域。 可以为参数 criteria 指定任意区域，
 * 只要此区域包含至少一个列标签，并且列标签下至少有一个在其中为列指定条件的单元格。
 * @returns {Error|*}
 * @constructor
 */
export function DCOUNTA(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return Error(ERROR_VALUE);
  }
  let resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  let targetValues = get_values(resultIndexes, database, field);
  return stats.COUNTA(targetValues);
};

exports.DGET = function(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return Error(ERROR_VALUE);
  }
  let resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  if (resultIndexes.length > 1){
    return errorObj.ERROR_NUM
  }
  let targetValues = get_values(resultIndexes, database, field);
  return targetValues[0];
};

/**
 *
 * @param {区域}database 必需。 构成列表或数据库的单元格区域。
 * 数据库是包含一组相关数据的列表，其中包含相关信息的行为记录，而包含数据的列为字段。 列表的第一行包含每一列的标签。
 * @param{string} field 必需。 指定函数所使用的列。
 * 输入两端带双引号的列标签，如 "使用年数" 或 "产量"；或是代表列表中列位置的数字（不带引号）：1 表示第一列，2 表示第二列，依此类推。
 * @param {区域}criteria 必需。 包含所指定条件的单元格区域。 可以为参数 criteria 指定任意区域，
 * 只要此区域包含至少一个列标签，并且列标签下至少有一个在其中为列指定条件的单元格。
 * @returns {Error|*}
 * @constructor
 */
export function DMAX(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return Error(ERROR_VALUE);
  }
  let resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  let targetValues = get_values(resultIndexes, database, field);
  let max = targetValues[0]
  for (let i=0;i<targetValues.length;i++){
    if (targetValues[i] > max){
      max = targetValues[i]
    }
  }
  return max
};

/**
 *
 * @param {区域}database 必需。 构成列表或数据库的单元格区域。
 * 数据库是包含一组相关数据的列表，其中包含相关信息的行为记录，而包含数据的列为字段。 列表的第一行包含每一列的标签。
 * @param{string} field 必需。 指定函数所使用的列。
 * 输入两端带双引号的列标签，如 "使用年数" 或 "产量"；或是代表列表中列位置的数字（不带引号）：1 表示第一列，2 表示第二列，依此类推。
 * @param {区域}criteria 必需。 包含所指定条件的单元格区域。 可以为参数 criteria 指定任意区域，
 * 只要此区域包含至少一个列标签，并且列标签下至少有一个在其中为列指定条件的单元格。
 * @returns {Error|*}
 * @constructor
 */
export function DMIN(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return Error(ERROR_VALUE);
  }
  let resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  let targetValues = get_values(resultIndexes, database, field);
  let min = targetValues[0]
  for (let i=0;i<targetValues.length;i++){
    if (targetValues[i] < min){
      min = targetValues[i]
    }
  }
  return min
};

/**
 *
 * @param {number/string}database 必需。 构成列表或数据库的单元格区域。 数据库是包含一组相关数据的列表，
 * 其中包含相关信息的行为记录，而包含数据的列为字段。 列表的第一行包含每一列的标签。
 * @param {number/string}field  必需。 指定函数所使用的列。 输入两端带双引号的列标签，如 "使用年数" 或 "产量"；
 * 或是代表列表中列位置的数字（不带引号）：1 表示第一列，2 表示第二列，依此类推。
 * @param {number/string}criteria 必需。 包含所指定条件的单元格区域。 可以为参数 criteria 指定任意区域，
 * 只要此区域包含至少一个列标签，并且列标签下至少有一个在其中为列指定条件的单元格。
 * @returns {Error|number}
 * @constructor
 */
export function DPRODUCT(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return Error(ERROR_VALUE);
  }
  let resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  let targetValues = get_values(resultIndexes, database, field);
  let result = 1;
  for (let i=0; i < targetValues.length; i++){
    result *= targetValues[i]
  }
  return result;
};

/**
 *
 * @param {number/string}database 必需。 构成列表或数据库的单元格区域。 数据库是包含一组相关数据的列表，
 * 其中包含相关信息的行为记录，而包含数据的列为字段。 列表的第一行包含每一列的标签。
 * @param {number/string}field  必需。 指定函数所使用的列。 输入两端带双引号的列标签，如 "使用年数" 或 "产量"；
 * 或是代表列表中列位置的数字（不带引号）：1 表示第一列，2 表示第二列，依此类推。
 * @param {number/string}criteria 必需。 包含所指定条件的单元格区域。 可以为参数 criteria 指定任意区域，
 * 只要此区域包含至少一个列标签，并且列标签下至少有一个在其中为列指定条件的单元格。
 * @returns {Error|number}
 * @constructor
 */
export function DSTDEV(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return Error(ERROR_VALUE);
  }
  let resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  let targetValues = get_values(resultIndexes, database, field);
  targetValues = compact(targetValues);
  return stats.STDEV.S(targetValues);
};


/**
 *
 * @param {number/string}database 必需。 构成列表或数据库的单元格区域。 数据库是包含一组相关数据的列表，
 * 其中包含相关信息的行为记录，而包含数据的列为字段。 列表的第一行包含每一列的标签。
 * @param {number/string}field  必需。 指定函数所使用的列。 输入两端带双引号的列标签，如 "使用年数" 或 "产量"；
 * 或是代表列表中列位置的数字（不带引号）：1 表示第一列，2 表示第二列，依此类推。
 * @param {number/string}criteria 必需。 包含所指定条件的单元格区域。 可以为参数 criteria 指定任意区域，
 * 只要此区域包含至少一个列标签，并且列标签下至少有一个在其中为列指定条件的单元格。
 * @returns {Error|number}
 * @constructor
 */
export function DSTDEVP(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return Error(ERROR_VALUE);
  }
  let resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  let targetValues = get_values(resultIndexes, database, field);
  targetValues = compact(targetValues);
  return stats.STDEV.P(targetValues);
};

/**
 *
 * @param {number/string}database 必需。 构成列表或数据库的单元格区域。 数据库是包含一组相关数据的列表，
 * 其中包含相关信息的行为记录，而包含数据的列为字段。 列表的第一行包含每一列的标签。
 * @param {number/string}field  必需。 指定函数所使用的列。 输入两端带双引号的列标签，如 "使用年数" 或 "产量"；
 * 或是代表列表中列位置的数字（不带引号）：1 表示第一列，2 表示第二列，依此类推。
 * @param {number/string}criteria 必需。 包含所指定条件的单元格区域。 可以为参数 criteria 指定任意区域，
 * 只要此区域包含至少一个列标签，并且列标签下至少有一个在其中为列指定条件的单元格。
 * @returns {Error|number}
 * @constructor
 */
export function DSUM(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return Error(ERROR_VALUE);
  }
  let resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  let targetValues = get_values(resultIndexes, database, field);
  return maths.SUM(targetValues);
};


/**
 *
 * @param {number/string}database 必需。 构成列表或数据库的单元格区域。 数据库是包含一组相关数据的列表，
 * 其中包含相关信息的行为记录，而包含数据的列为字段。 列表的第一行包含每一列的标签。
 * @param {number/string}field  必需。 指定函数所使用的列。 输入两端带双引号的列标签，如 "使用年数" 或 "产量"；
 * 或是代表列表中列位置的数字（不带引号）：1 表示第一列，2 表示第二列，依此类推。
 * @param {number/string}criteria 必需。 包含所指定条件的单元格区域。 可以为参数 criteria 指定任意区域，
 * 只要此区域包含至少一个列标签，并且列标签下至少有一个在其中为列指定条件的单元格。
 * @returns {Error|number}
 * @constructor
 */
export function DVAR(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return Error(ERROR_VALUE);
  }
  let resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  let targetValues = get_values(resultIndexes, database, field);
  return stats.VAR.S(targetValues);
};

/**
 *
 * @param {number/string}database 必需。 构成列表或数据库的单元格区域。 数据库是包含一组相关数据的列表，
 * 其中包含相关信息的行为记录，而包含数据的列为字段。 列表的第一行包含每一列的标签。
 * @param {number/string}field  必需。 指定函数所使用的列。 输入两端带双引号的列标签，如 "使用年数" 或 "产量"；
 * 或是代表列表中列位置的数字（不带引号）：1 表示第一列，2 表示第二列，依此类推。
 * @param {number/string}criteria 必需。 包含所指定条件的单元格区域。 可以为参数 criteria 指定任意区域，
 * 只要此区域包含至少一个列标签，并且列标签下至少有一个在其中为列指定条件的单元格。
 * @returns {Error|number}
 * @constructor
 */
export function DVARP(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return Error(ERROR_VALUE);
  }
  let resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  let targetValues = get_values(resultIndexes, database, field);
  return stats.VAR.P(targetValues);
};
//XW：end
