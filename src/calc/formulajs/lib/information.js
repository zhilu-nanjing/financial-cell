var error = require('./error');

// TODO
exports.CELL = function() {
 throw new Error('CELL is not implemented');
};

exports.ERROR = {};
exports.ERROR.TYPE = function (error_val) {
  switch (error_val) {
    case error.nil.message:
      return 1;
    case error.div0.message:
      return 2;
    case error.value.message:
      return 3;
    case error.ref.message:
      return 4;
    case error.name.message:
      return 5;
    case error.num.message:
      return 6;
    case error.na.message:
      return 7;
    case error.data.message:
      return 8;
  }
  return error.na;
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

exports.ISERR = function(value) {
  return ([error.value.message, error.ref.message, error.div0.message, error.num.message, error.name.message, error.nil.message]).indexOf(value) >= 0 ||
    (typeof value === 'number' && (isNaN(value) || !isFinite(value)));
};

exports.ISERROR = function(value) {
  return exports.ISERR(value) || value === error.na;
};

exports.ISEVEN = function(number) {
  return (Math.floor(Math.abs(number)) & 1) ? false : true;
};

// TODO
exports.ISFORMULA = function() {
  throw new Error('ISFORMULA is not implemented');
};

exports.ISLOGICAL = function(value) {
  if(value == 'FALSE'){
    return false
  }
  return value == true || value == false;
};

exports.ISNA = function(value) {
  return value === error.na || value === error.na.message;;
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
  return arguments['0'] != null
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
  if (value === true || value.toString().toUpperCase() == 'TRUE' || value.toString().toUpperCase() == 'FALSE') {
    return 1;
  }
  if (value === false || typeof(value)=='string') {
    return 0;
  }
  if (ISERROR(value)) {
    return value;
  }
  return 0;
};

exports.NA = function() {
  return error.na;
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
  //   return error.value
  // }
  if (typeof(value) === 'string') {
    if (value.slice(0,1) == '{'){
      var arr = utils.strToMatrix(value)
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
  if (exports.ISERR(value) || value === error.na) {
    return 16;
  }
  if (Array.isArray(arr)) {
    return 64;
  }

};
