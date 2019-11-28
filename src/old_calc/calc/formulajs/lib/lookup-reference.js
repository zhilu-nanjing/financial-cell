var error = require('./error');
var utils = require('./utils');
function match_less_than_or_equal(matrix, lookupValue) {
  var index;
  var indexValue;
  for (var idx = 0; idx < matrix.length; idx++) {
    if (matrix[idx] === lookupValue) {
      return idx + 1;
    } else if (matrix[idx] < lookupValue) {
      if (!indexValue) {
        index = idx + 1;
        indexValue = matrix[idx];
      } else if (matrix[idx] > indexValue) {
        index = idx + 1;
        indexValue = matrix[idx];
      }
    }
  }
  if (!index) {
    return error.na;
  }
  return index;
}

function match_exactly_string(matrix, lookupValue) {
  for (var idx = 0; idx < matrix.length; idx++) {
    lookupValue = lookupValue.replace(/\?/g, '.');
    if (Array.isArray(matrix[idx])) {
      if (matrix[idx].length === 1
        && typeof matrix[idx][0] === 'string') {
        if (matrix[idx][0].toLowerCase() === lookupValue.toLowerCase()) {
          return idx + 1;
        }
      }
    } else if (typeof matrix[idx] === 'string') {
      if (matrix[idx].toLowerCase() === lookupValue.toLowerCase()) {
        return idx + 1;
      }
    }

  }
  return error.na;
}

function match_exactly_non_string(matrix, lookupValue) {
  for (var idx = 0; idx < matrix.length; idx++) {
    if (Array.isArray(matrix[idx])) {
      if (matrix[idx].length === 1) {
        if (matrix[idx][0] === lookupValue) {
          return idx + 1;
        }
      }
    } else if (matrix[idx] === lookupValue) {
      return idx + 1;
    }
  }
  //XW:统一错误变量
  return error.na;
  //XW：end
}

function match_greater_than_or_equal(matrix, lookupValue) {
  var index;
  var indexValue;
  for (var idx = 0; idx < matrix.length; idx++) {
    if (matrix[idx] === lookupValue) {
      return idx + 1;
    } else if (matrix[idx] > lookupValue) {
      if (!indexValue) {
        index = idx + 1;
        indexValue = matrix[idx];
      } else if (matrix[idx] < indexValue) {
        index = idx + 1;
        indexValue = matrix[idx];
      }
    }
  }
  if (!index) {
    return error.na;
  }
  return index;
}
exports.MATCH = function (lookupValue, matrix, matchType) {
  if (Array.isArray(matrix)
    && matrix.length === 1
    && Array.isArray(matrix[0])) {
    matrix = matrix[0];
  }
  if (!lookupValue && !matrix) {
    return error.na;
  }
  if (arguments.length === 2) {
    matchType = 1;
  }
  if (!(matrix instanceof Array)) {
    return error.na;
  }
  if (matchType === 0) {
    if (typeof lookupValue === 'string') {
      return match_exactly_string(matrix, lookupValue);
    } else {
      return match_exactly_non_string(matrix, lookupValue);
    }
  } else if (matchType === 1) {
    return match_less_than_or_equal(matrix, lookupValue);
  } else if (matchType === -1) {
    var a = matrix[0][0]
    for (var i=1;i<matrix.length;i++){
      if (matrix[i][0] > a){
        return error.na;
      }
    }
    return match_greater_than_or_equal(matrix, lookupValue);
  } else {
    return error.na;
  }
}
//XW: vlookup函数实现
exports.VLOOKUP = function (key, matrix, return_index, cumulative) {
  if(typeof cumulative == 'string' && !(cumulative == 'FALSE' || cumulative == 'TRUE')){
    return error.value;
  }
  if (cumulative == 'FALSE') {
    cumulative = false
  }else{
    cumulative = true
  }
  for (var i = 0; i < matrix.length; i++) {
    if (matrix[i][0] == key) {
      return matrix[i][return_index - 1];
    }
  }
  return error.na;
};
//XW：end


//XW:hlookup函数实现
exports.HLOOKUP = function (needle, table, index, exactmatch) {
  if (exactmatch == 'TRUE'){
    exactmatch = true
  }
  if (exactmatch == 'FALSE'){
    exactmatch = false
  }
  if (typeof table == 'string' && table.indexOf('{') >=0){
    table = utils.strToMatrix(table)
  }
  if (typeof needle === "undefined" || table[0].indexOf(needle) < 0) {
    return error.na;
  }

  index = index || 0;
  let row = table[0];

  for (let i = 0; i < row.length; i++) {
    if (exactmatch && row[i] === needle || row[i].toString().toLowerCase().indexOf(needle.toString().toLowerCase()) !== -1) {
      return index < table.length + 1 ? table[index - 1][i] : table[0][i];
    }
  }

  return error.na;
}
//XW：end
