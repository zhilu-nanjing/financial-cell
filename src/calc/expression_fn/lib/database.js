let errorObj = require('../../calc_utils/error_config');
let stats = require('./statistical');
let maths = require('./math-trig');
let utils = require('./utils');

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
    return errorObj.ERROR_VALUE;
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
          is_valid = (a == b.replace('=', ''))
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
  if (typeof field == 'number'){
    let field_idx = field - 1
  }else{
    let field_idx = database[0].indexOf(field)
  }
  let values= []
  for (let i=0; i< resultIndexes.length; i++){
    values.push(database[resultIndexes[i]][field_idx])
  }
  return values
}
// Database functions
exports.DAVERAGE = function (database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return errorObj.ERROR_VALUE;
  }
  if (typeof field == 'number'){
    let resultIndexes = [];
    for (let i=1;i<database.length;i++){
      resultIndexes.push(i)
    }
  }else{
    let resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  }
  let targetValues = get_values(resultIndexes, database, field);
  let sum = 0
  for (let i=0; i < targetValues.length; i++){
    sum += targetValues[i]
  }
  return resultIndexes.length === 0 ? errorObj.ERROR_DIV0 : sum / targetValues.length;
};
exports.DCOUNT = function(database, field, criteria) {
  if (isNaN(field) && (typeof field !== "string")) {
    return errorObj.ERROR_VALUE;
  }
  let resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  let targetValues = get_values(resultIndexes, database, field);
  return stats.COUNT(targetValues);
};

exports.DCOUNTA = function(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return errorObj.ERROR_VALUE;
  }
  let resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  let targetValues = get_values(resultIndexes, database, field);
  return stats.COUNTA(targetValues);
};

exports.DGET = function(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return errorObj.ERROR_VALUE;
  }
  let resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  if (resultIndexes.length > 1){
    return errorObj.ERROR_NUM
  }
  let targetValues = get_values(resultIndexes, database, field);
  return targetValues[0];
};

exports.DMAX = function(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return errorObj.ERROR_VALUE;
  }
  let resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  let targetValues = get_values(resultIndexes, database, field);
  var max = targetValues[0]
  for (var i=0;i<targetValues.length;i++){
    if (targetValues[i] > max){
      max = targetValues[i]
    }
  }
  return max
};

exports.DMIN = function(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return errorObj.ERROR_VALUE;
  }
  var resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  var targetValues = get_values(resultIndexes, database, field);
  var min = targetValues[0]
  for (var i=0;i<targetValues.length;i++){
    if (targetValues[i] < min){
      min = targetValues[i]
    }
  }
  return min
};

exports.DPRODUCT = function(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return errorObj.ERROR_VALUE;
  }

  var resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  var targetValues = get_values(resultIndexes, database, field);
  var result = 1;
  for (var i=0; i < targetValues.length; i++){
    result *= targetValues[i]
  }
  return result;
};

exports.DSTDEV = function(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return errorObj.ERROR_VALUE;
  }
  var resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  var targetValues = get_values(resultIndexes, database, field);
  targetValues = compact(targetValues);
  return stats.STDEV.S(targetValues);
};

exports.DSTDEVP = function(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return errorObj.ERROR_VALUE;
  }
  var resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  var targetValues = get_values(resultIndexes, database, field);
  targetValues = compact(targetValues);
  return stats.STDEV.P(targetValues);
};

exports.DSUM = function(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return errorObj.ERROR_VALUE;
  }
  var resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  var targetValues = get_values(resultIndexes, database, field);
  return maths.SUM(targetValues);
};

exports.DVAR = function (database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return errorObj.ERROR_VALUE;
  }
  var resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  var targetValues = get_values(resultIndexes, database, field);
  return stats.VAR.S(targetValues);
};

exports.DVARP = function (database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return errorObj.ERROR_VALUE;
  }
  var resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  var targetValues = get_values(resultIndexes, database, field);
  return stats.VAR.P(targetValues);
};
//XW：end
