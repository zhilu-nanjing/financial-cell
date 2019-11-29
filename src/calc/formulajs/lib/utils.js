var error = require('./error');

function flattenShallow(array) {
  if (!array || !array.reduce) { return array; }
  return array.reduce(function(a, b) {
    var aIsArray = Array.isArray(a);
    var bIsArray = Array.isArray(b);
    if (aIsArray && bIsArray ) {
      return a.concat(b);
    }
    if (aIsArray) {
      a.push(b);
      return a;
    }
    if (bIsArray) {
      return [a].concat(b);
    }
    return [a, b];
  });
}

function isFlat(array) {
  if (!array) { return false; }
  for (var i = 0; i < array.length; ++i) {
    if (Array.isArray(array[i])) {
      return false;
    }
  }
  return true;
}

exports.flatten = function() {
  var result = exports.argsToArray.apply(null, arguments);
  while (!isFlat(result)) {
    result = flattenShallow(result);
  }
  return result;
};

exports.argsToArray = function(args) {
  return Array.prototype.slice.call(args, 0);
};

exports.numbers = function() {
  var possibleNumbers = this.flatten.apply(null, arguments);
  return possibleNumbers.filter(function(el) {
    return typeof el === 'number';
  });
};
//XW: 将参数解析成数字数组，若有不符合要求的报错，default0忽略
function parse(a){
  if (a instanceof Error){
    return a
  }
  if (a instanceof Array){
    var arr = []
    for (var i=0;i<a.length;i++){
      if (typeof a[i][0] === 'string' && a[i][0] !== 'default_0'){
        return error.name
      }
      if (typeof a[i][0] === 'number'){
        arr.push(a[i][0])
      }
      if (a[i][0] instanceof Object){
        return error.name
      }
    }
    return arr
  }
  if (typeof a === 'string'){
    if (a === 'default_0'){
      return 'pass'
    }else{
      return error.name
    }
  }
  if (typeof a === 'number'){
    return a
  }
}
exports.flattenNum = function(args) {
  try{
    if (args.length === 1 && args[0][0] === 'default_0'){
      return error.div0
    }
    var arr = []
    for( var i=0;i<args.length;i++){
      var p = parse(args[i])
      if (p === undefined){
        return error.name
      }
      if (p instanceof Error){
        return p
      }else if(p !== 'pass'){
        if (p instanceof Array){
          for (var n=0; n < p.length;n++){
            arr.push(p[n])
          }
        }else{
          arr.push(p)
        }
      }
    }
    return arr
  }catch{
    return error.name
  }
};
//XW:end

exports.cleanFloat = function(number) {
  var power = 1e14;
  return Math.round(number * power) / power;
};

exports.parseBool = function(bool) {
  if (bool === undefined){
    return true
  }
  if (typeof bool === 'boolean') {
    return bool;
  }

  if (bool instanceof Error) {
    return bool;
  }

  if (typeof bool === 'number') {
    return bool !== 0;
  }

  if (typeof bool === 'string') {
    var up = bool.toUpperCase();
    if (up === 'TRUE') {
      return true;
    }

    if (up === 'FALSE') {
      return false;
    }
  }

  if (bool instanceof Date && !isNaN(bool)) {
    return true;
  }

  return error.value;
};

exports.parseNumber = function(string) {
  if (string === undefined || string === '') {
    return error.value;
  }
  if (!isNaN(string)) {
    return parseFloat(string);
  }
  return error.value;
};

exports.parseNumberArray = function(arr) {
  var len;
  if (!arr || (len = arr.length) === 0) {
    return error.value;
  }
  var parsed;
  while (len--) {
    parsed = exports.parseNumber(arr[len]);
    if (parsed === error.value) {
      return parsed;
    }
    arr[len] = parsed;
  }
  return arr;
};

exports.parseMatrix = function(matrix) {
  var n;
  if (!matrix || (n = matrix.length) === 0) {
    return error.value;
  }
  var pnarr;
  for (var i = 0; i < matrix.length; i++) {
    pnarr = exports.parseNumberArray(matrix[i]);
    matrix[i] = pnarr;
    if (pnarr instanceof Error) {
      return pnarr;
    }
  }
  return matrix;
};

var d1900 = new Date(1900, 0, 1);
exports.parseDate = function(date) {
  if (!isNaN(date)) {
    if (date instanceof Date) {
      return new Date(date);
    }
    var d = parseInt(date, 10);
    if (d < 0) {
      return error.num;
    }
    if (d <= 60) {
      return new Date(d1900.getTime() + (d - 1) * 86400000);
    }
    return new Date(d1900.getTime() + (d - 2) * 86400000);
  }
  if (typeof date === 'string') {
    date = new Date(date);
    if (!isNaN(date)) {
      return date;
    }
  }
  return error.value;
};
exports.Copy =  function (obj) {
  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;
  // Handle Date
  if (obj instanceof Date) {
    var copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }
  // Handle Array
  if (obj instanceof Array) {
    var copy = [];
    for (var i = 0; i < obj.length; ++i) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }
  // Handle Object
  if (obj instanceof Object) {
    var copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }
  throw new Error("Unable to copy obj! Its type isn't supported.");
};
//XW:{}中参数解析,将{1,2,3；4,5,6}这样的参数解析为数组结构
function parse_arg(arg) {
  if(!isNaN(parseInt(arg))){
    return parseInt(arg)
  }
  return arg.replace('"', '').replace('"', '')
}
exports.strToMatrix = function (str) {
  var arg = str.slice(2,str.length-2).split(',')
  var matrix = [];
  var arr = []
  for (var i=0; i < arg.length; i++){
    var num = arg[i].toString()
    if (num.indexOf(';') > 0) {
      arr.push(parse_arg(num.split(';')[0]))
      matrix.push(arr)
      arr = [parse_arg(num.split(';')[1])]
    }else{
      arr.push(parse_arg(num))
    }
  }
  matrix.push(arr)
  return matrix
}
//XW: end
//XW：excel日期转js日期
exports.ExcelDateToJSDate = function (date) {
  if (typeof date == 'string'){
    date = utils.parseDate(issue)
  }
  return (date instanceof Date) ? date : new Date(Math.round((date - 25569)*86400*1000));
}
//XW：end
//XW：判定是否是数字
exports.isNumber = function (val) {
  var regPos = /^\d+(\.\d+)?$/; //非负浮点数
  var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  if(regPos.test(val) || regNeg.test(val)) {
    return true;
  } else {
    return false;
  }
}
//XW：end
exports.parseDateArray = function(arr) {
  var len = arr.length;
  var parsed;
  while (len--) {
    parsed = this.parseDate(arr[len]);
    if (parsed === error.value) {
      return parsed;
    }
    arr[len] = parsed;
  }
  return arr;
};

exports.anyIsError = function() {
  var n = arguments.length;
  while (n--) {
    if (arguments[n] instanceof Error) {
      return true;
    }
  }
  return false;
};

exports.arrayValuesToNumbers = function(arr) {
  var n = arr.length;
  var el;
  while (n--) {
    el = arr[n];
    if (typeof el === 'number') {
      continue;
    }
    if (el === true) {
      arr[n] = 1;
      continue;
    }
    if (el === false) {
      arr[n] = 0;
      continue;
    }
    if (typeof el === 'string') {
      var number = this.parseNumber(el);
      if (number instanceof Error) {
        arr[n] = 0;
      } else {
        arr[n] = number;
      }
    }
  }
  return arr;
};

exports.rest = function(array, idx) {
  idx = idx || 1;
  if (!array || typeof array.slice !== 'function') {
    return array;
  }
  return array.slice(idx);
};

exports.initial = function(array, idx) {
  idx = idx || 1;
  if (!array || typeof array.slice !== 'function') {
    return array;
  }
  return array.slice(0, array.length - idx);
};
