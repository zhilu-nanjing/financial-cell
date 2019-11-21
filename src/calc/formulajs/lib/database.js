var error = require('./error');
var stats = require('./statistical');
var maths = require('./math-trig');
var utils = require('./utils');

function compact(array) {
  if (!array) { return array; }
  var result = [];
  for (var i = 0; i < array.length; ++i) {
    if (!array[i]) { continue; }
    result.push(array[i]);
  }
  return result;
}

exports.FINDFIELD = function(database, title) {
  var index = null;
  for (var i = 0; i < database.length; i++) {
    if (database[i][0] === title) {
      index = i;
      break;
    }
  }

  // Return error if the input field title is incorrect
  if (index == null) {
    return error.value;
  }
  return index;
};

//XW: 重写函数
function find_result_idx(database, criteria){
  var valid_arr = []
  var filter_arr = []
  for (var i=0; i < criteria[0].length; i++) {
    filter_arr.push(criteria[0][i])
  }
  for (var i=1; i < criteria.length; i++){
    var arr = criteria[i]
    var valid_str = []
    for (var j=0; j < filter_arr.length; j++){
      if (arr[j] != null){
        valid_str.push(database[0].indexOf(criteria[0][j]) + '-' + arr[j])
      }
    }
    valid_arr.push(valid_str)
  }
  var result_idx = []
  for (var i=1; i < database.length; i++){
    var data = database[i]
    for(var j=0;j<valid_arr.length;j++){
      var is_valid = true
      for(var k=0;k<valid_arr[j].length;k++){
        var a = data[parseInt(valid_arr[j][k].split('-')[0])]
        var b = valid_arr[j][k].split('-')[1]
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
    var field_idx = field - 1
  }else{
    var field_idx = database[0].indexOf(field)
  }
  var values= []
  for (var i=0; i< resultIndexes.length; i++){
    values.push(database[resultIndexes[i]][field_idx])
  }
  return values
}
// Database functions
exports.DAVERAGE = function (database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return error.value;
  }
  if (typeof field == 'number'){
    var resultIndexes = [];
    for (var i=1;i<database.length;i++){
      resultIndexes.push(i)
    }
  }else{
    var resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  }
  var targetValues = get_values(resultIndexes, database, field);
  var sum = 0
  for (var i=0; i < targetValues.length; i++){
    sum += targetValues[i]
  }
  return resultIndexes.length === 0 ? error.div0 : sum / targetValues.length;
};
exports.DCOUNT = function(database, field, criteria) {
  if (isNaN(field) && (typeof field !== "string")) {
    return error.value;
  }
  var resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  var targetValues = get_values(resultIndexes, database, field);
  return stats.COUNT(targetValues);
};

exports.DCOUNTA = function(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return error.value;
  }
  var resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  var targetValues = get_values(resultIndexes, database, field);
  return stats.COUNTA(targetValues);
};

exports.DGET = function(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return error.value;
  }
  var resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  if (resultIndexes.length > 1){
    return error.num
  }
  var targetValues = get_values(resultIndexes, database, field);
  return targetValues[0];
};

exports.DMAX = function(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return error.value;
  }
  var resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  var targetValues = get_values(resultIndexes, database, field);
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
    return error.value;
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
    return error.value;
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
    return error.value;
  }
  var resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  var targetValues = get_values(resultIndexes, database, field);
  targetValues = compact(targetValues);
  return stats.STDEV.S(targetValues);
};

exports.DSTDEVP = function(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return error.value;
  }
  var resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  var targetValues = get_values(resultIndexes, database, field);
  targetValues = compact(targetValues);
  return stats.STDEV.P(targetValues);
};

exports.DSUM = function(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return error.value;
  }
  var resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  var targetValues = get_values(resultIndexes, database, field);
  return maths.SUM(targetValues);
};

exports.DVAR = function (database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return error.value;
  }
  var resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  var targetValues = get_values(resultIndexes, database, field);
  return stats.VAR.S(targetValues);
};

exports.DVARP = function (database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (typeof field !== "string")) {
    return error.value;
  }
  var resultIndexes = find_result_idx(database,criteria)//findResultIndex(database, criteria);
  var targetValues = get_values(resultIndexes, database, field);
  return stats.VAR.P(targetValues);
};
//XW：end
