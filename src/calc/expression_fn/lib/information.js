import {errorObj, errorMsgArr} from '../../calc_utils/error_config'

// TODO
exports.CELL = function() {
 throw new Error('CELL is not implemented');
};

exports.ERROR = {};
exports.ERROR.TYPE = function (error_val) { // 判断错误类型
    let msgIndice = errorMsgArr.indexOf(error_val)
    if (msgIndice > -1){
      return msgIndice
    }
    else {
      return errorObj.ERROR_NA;
    }
};

// TODO
exports.INFO = function() {
 throw new Error('INFO is not implemented');
};

exports.ISBLANK = function(value) {
  return value === null;
};

exports.ISBINARY = function (number) {
  return (/^[01]{1,10}$/).test(number);
};

exports.ISERR = function(value) { // 是否是错误1
  return errorMsgArr.indexOf(value) >= 0 ||
    (typeof value === 'number' && (isNaN(value) || !isFinite(value)));
};

exports.ISERROR = function(value) { // 是否是错误2
  return exports.ISERR(value) || value === errorObj.ERROR_NA;
};

exports.ISEVEN = function(number) {
  return (Math.floor(Math.abs(number)) & 1) ? false : true;
};

// TODO
exports.ISFORMULA = function() {
  throw new Error('ISFORMULA is not implemented');
};

exports.ISLOGICAL = function(value) {
  if(value === 'FALSE'){
    return false
  }
  return value === true || value === false;
};

exports.ISNA = function(value) {
  return value === errorObj.ERROR_NA || value === errorObj.ERROR_NA.message;;
};

exports.ISNONTEXT = function(value) {
  return typeof(value) !== 'string';
};

exports.ISNUMBER = function(value) {
  return typeof(value) === 'number' && !isNaN(value) && isFinite(value);
};

exports.ISODD = function(number) {
  return (Math.floor(Math.abs(number)) & 1) ? true : false;
};

// TODO
exports.ISREF = function() {
  return arguments['0'] !== null
};

exports.ISTEXT = function(value) {
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
  return errorObj.ERROR_NA;
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
      let arr = utils.strToMatrix(value)
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
  if (exports.ISERR(value) || value === errorObj.ERROR_NA) {
    return 16;
  }
  if (Array.isArray(arr)) {
    return 64;
  }

};
