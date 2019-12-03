import utils from './utils'
import {errorObj} from '../../calc_utils/error_config'
import numeral from 'numeral'

//TODO
exports.ASC = function(str) {
  let tmp = "";
  str= str.toString()
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375) {
      tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
    }
    else {
      tmp += String.fromCharCode(str.charCodeAt(i));
    }
  }
  return tmp
};

//TODO
exports.BAHTTEXT = function() {
 throw new Error('BAHTTEXT is not implemented');
};

exports.CHAR = function(number) {
  number = utils.parseNumber(number);
  if (number instanceof Error) {
    return number;
  }
  return String.fromCharCode(number);
};

exports.CLEAN = function(text) {
  text = text || '';
  let re = /[\0-\x1F]/g;
  return text.replace(re, "");
};

exports.CODE = function(text) {
  text = text || '';
  return text.charCodeAt(0);
};

exports.CONCATE = function() {
  let args = utils.flatten(arguments);

  let trueFound = 0;
  while ((trueFound = args.indexOf(true)) > -1) {
    args[trueFound] = 'TRUE';
  }

  let falseFound = 0;
  while ((falseFound = args.indexOf(false)) > -1) {
    args[falseFound] = 'FALSE';
  }

  return args.join('');
};
exports.CONCATENATE = function() {
  let args = utils.flatten(arguments);

  let trueFound = 0;
  while ((trueFound = args.indexOf(true)) > -1) {
    args[trueFound] = 'TRUE';
  }

  let falseFound = 0;
  while ((falseFound = args.indexOf(false)) > -1) {
    args[falseFound] = 'FALSE';
  }

  return args.join('');
};

//TODO
exports.DBCS = function() {
 throw new Error('DBCS is not implemented');
};

exports.DOLLAR = function(number, decimals) {
  decimals = (decimals === undefined) ? 2 : decimals;

  number = utils.parseNumber(number);
  decimals = utils.parseNumber(decimals);
  if (utils.anyIsError(number, decimals)) {
    return errorObj.ERROR_VALUE;
  }
  let format = '';
  if (decimals <= 0) {
    number = Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
    format = '($0,0)';
  } else if (decimals > 0) {
    format = '($0,0.' + new Array(decimals + 1).join('0') + ')';
  }
  return numeral(number).format(format);
};

exports.EXACT = function(text1, text2) {
  return text1 === text2;
};

exports.FIND = function (find_text, within_text, position) {
  position = (position === undefined) ? 0 : position;
  within_text.indexOf(find_text)
  return within_text ? within_text.indexOf(find_text, position - 1) + 1 : null;
};
exports.FIXED = function(number, decimals, no_commas) {
  decimals = (decimals === undefined) ? 2 : decimals;
  no_commas = (no_commas === undefined) ? false : no_commas;

  number = utils.parseNumber(number);
  decimals = utils.parseNumber(decimals);
  if (utils.anyIsError(number, decimals)) {
    return errorObj.ERROR_VALUE;
  }

  let format = no_commas ? '0' : '0,0';
  if (decimals <= 0) {
    number = Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  } else if (decimals > 0) {
    format += '.' + new Array(decimals + 1).join('0');
  }
  return numeral(number).format(format);
};

exports.HTML2TEXT = function (value) {
  let result = '';

  if (value) {
    if (value instanceof Array) {
      value.forEach(function (line) {
        if (result !== '') {
          result += '\n';
        }
        result += (line.replace(/<(?:.|\n)*?>/gm, ''));
      });
    } else {
      result = value.replace(/<(?:.|\n)*?>/gm, '');
    }
  }

  return result;
};
exports.INDEX = function (matrix, row_num, column_num) {
  if (typeof matrix == 'string'){
    matrix = utils.strToMatrix(matrix)
  }
  return matrix[row_num][column_num-1]
};
exports.LEFT = function(text, number) {
  number = (number === undefined) ? 1 : number;
  number = utils.parseNumber(number);
  if (number instanceof Error || typeof text !== 'string') {
    return errorObj.ERROR_VALUE;
  }
  return text ? text.substring(0, number) : null;
};

exports.LEN = function(text) {
  if (arguments.length === 0) {
    return errorObj.ERROR;
  }

  if (typeof text === 'string') {
    return text ? text.length : 0;
  }

  if (text.length) {
    return text.length;
  }

  return errorObj.ERROR_VALUE;
};

exports.LOWER = function(text) {
  if (typeof text !== 'string') {
    return errorObj.ERROR_VALUE;
  }
  return text ? text.toLowerCase() : text;
};

exports.MID = function(text, start, number) {
  start = utils.parseNumber(start);
  number = utils.parseNumber(number);
  if (utils.anyIsError(start, number) || typeof text !== 'string') {
    return number;
  }

  let begin = start - 1;
  let end = begin + number;

  return text.substring(begin, end);
};

// TODO
exports.NUMBERVALUE = function (text, decimal_separator, group_separator) {
  decimal_separator = (typeof decimal_separator === 'undefined') ? '.' : decimal_separator;
  group_separator = (typeof group_separator === 'undefined') ? ',' : group_separator;
  if (text.indexOf('%') > 0){
    text = text.replace('%', '')
    return parseFloat(text)/100
  }
  return Number(text.replace(decimal_separator, '.').replace(group_separator, ''));
};

// TODO
exports.PRONETIC = function() {
 throw new Error('PRONETIC is not implemented');
};

exports.PROPER = function(text) {
  if (text === undefined || text.length === 0) {
    return errorObj.ERROR_VALUE;
  }
  if (text === true) {
    text = 'TRUE';
  }
  if (text === false) {
    text = 'FALSE';
  }
  if (isNaN(text) && typeof text === 'number') {
    return errorObj.ERROR_VALUE;
  }
  if (typeof text === 'number') {
    text = '' + text;
  }

  return text.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

exports.REGEXEXTRACT = function (text, regular_expression) {
  let match = text.match(new RegExp(regular_expression));
  return match ? (match[match.length > 1 ? match.length - 1 : 0]) : null;
};

exports.REGEXMATCH = function (text, regular_expression, full) {
  let match = text.match(new RegExp(regular_expression));
  return full ? match : !!match;
};

exports.REGEXREPLACE = function (text, regular_expression, replacement) {
  return text.replace(new RegExp(regular_expression), replacement);
};

exports.REPLACE = function(text, position, length, new_text) {
  position = utils.parseNumber(position);
  length = utils.parseNumber(length);
  if (utils.anyIsError(position, length) ||
    typeof text !== 'string' ||
    typeof new_text !== 'string') {
    return errorObj.ERROR_VALUE;
  }
  return text.substr(0, position - 1) + new_text + text.substr(position - 1 + length);
};

exports.REPT = function(text, number) {
  number = utils.parseNumber(number);
  if (number instanceof Error) {
    return number;
  }
  return new Array(number + 1).join(text);
};

exports.RIGHT = function(text, number) {
  number = (number === undefined) ? 1 : number;
  number = utils.parseNumber(number);
  if (number instanceof Error) {
    return number;
  }
  return text ? text.substring(text.length - number) : null;
};

exports.SEARCH = function(find_text, within_text, position) {
  let foundAt;
  if (typeof find_text !== 'string' || typeof within_text !== 'string') {
    return errorObj.ERROR_VALUE;
  }
  position = (position === undefined) ? 0 : position;
  foundAt = within_text.toLowerCase().indexOf(find_text.toLowerCase(), position - 1)+1;
  return (foundAt === 0)?errorObj.ERROR_VALUE:foundAt;
};

exports.SPLIT = function (text, separator) {
  return text.split(separator);
};

exports.SUBSTITUTE = function(text, old_text, new_text, occurrence) {
  if (!text || !old_text || !new_text) {
    return text;
  } else if (occurrence === undefined) {
    return text.replace(new RegExp(old_text, 'g'), new_text);
  } else {
    let index = 0;
    let i = 0;
    while (text.indexOf(old_text, index) > 0) {
      index = text.indexOf(old_text, index + 1);
      i++;
      if (i === occurrence) {
        return text.substring(0, index) + new_text + text.substring(index + old_text.length);
      }
    }
  }
};

exports.T = function(value) {
  if (value == 'TRUE' || value == 'FALSE'){
    return ''
  }
  return (typeof value === "string") ? value : '';
};

// TODO incomplete implementation
function num2e(num){
  let p = Math.floor(Math.log(num)/Math.LN10);
  let n = num * Math.pow(10, -p);
  if (p.toString().length < 10){
    p = '0' + p
  }
  return n + 'E+' + p;
}
function allzero(num){
  num = num.toString()
  for (let i=0;i<num.length;i++){
    if (num[i] !== '0'){
      return false
    }
  }
  return true
}
function decimalsToFractional(decimals){
  formatDecimals = decimals.toFixed(2);
  let denominator = 3;//初始化分母
  let numerator  = formatDecimals*3;//初始化分子
  let bigger = 0;
  function  recursion (){
    bigger = denominator>numerator?denominator:numerator;
    for(let i=bigger;i>1;i--){
      if(Number.isInteger(numerator/i)&&Number.isInteger(denominator/i)){
        numerator=numerator/i;
        denominator=denominator/i;
        recursion();
      }
    }
  }
  recursion();
  numerator = parseInt(numerator)
  return `${numerator}/${denominator}`
}
exports.TEXT = function (value, format) {
  try{
    if (format.indexOf('%') >= 0){
      let fixed = format.split('.')[1].length-1
      return (parseFloat(value) *100).toFixed(fixed) + '%'
    }
    let Formulas = window.jsSpreadsheet.AllFormulas;
    let result = Formulas.TEXT(value, format);
    console.log(result)
  }catch (e) {
    let result = undefined
  }
  if (result == undefined){
    if (format.indexOf('#') >= 0 && format.indexOf('?/?') >=0){
      let x = parseFloat(value) - parseInt(value);
      if (parseInt(value) !== 0){
        return parseInt(value) + ' ' + decimalsToFractional(x)
      }
      return decimalsToFractional(x)
    }
    if (format.indexOf('E+') >=0){
      return num2e(value)
    }else if(allzero(value)){
      let result = ''
      for (let i=0;i<format.length-value.length; i++){
        result += '0'
      }
      return result + value
    }else if (format.indexOf('#') >=0){
      let fmt = format
      if (format.indexOf('[')>=0 && format.indexOf(';')>=0){
        let valid = format.split('#')[0]
        fmt = format.split(']')[1].split(';')
        valid = valid.replace('[', '').replace(']', '')
        if (eval(value + valid)){
          fmt = fmt[0]
        }else {
          fmt = fmt[1]
        }
      }
      if (format.indexOf('#') >=0 && format.indexOf('.' >=0) && format.indexOf('0') >=0 && format.indexOf('°') <=0){
        if (value.toString().split('.')[1].length > format.split('.')[1].length){
          value = value.toFixed(format.split('.')[1].length)
        }
        value = value.toString()
        let result = ''
        let n = 0
        for (let i=0; i< fmt.length; i ++){
          if (fmt[i] == '#' || fmt[i] == '0' || fmt[i] == '.'){
            result += value[n]
            n += 1
          }else{
            result += fmt[i]
          }
        }
        return result
      }
      fmt = fmt.replace('##0', '##')
      value = value.toString()
      let result = ''
      let n = 0
      for (let i=0; i< fmt.length; i ++){
        if (fmt[i] == '#' || fmt[i] == '0'){
          result += value[n]
          n += 1
        }else{
          result += fmt[i]
        }
      }
      return result
    }
  }
  return result
};

exports.TRIM = function(text) {
  if (typeof text !== 'string') {
    return errorObj.ERROR_VALUE;
  }
  return text.replace(/ +/g, ' ').trim();
};

exports.UNICHAR = function (text) {
  if (text == 0){
    return errorObj.ERROR_VALUE
  }
  return String.fromCharCode(text);
};

exports.UNICODE = function (text){
  return text.charCodeAt(0)
}

exports.UPPER = function(text) {
  if (typeof text !== 'string') {
    return errorObj.ERROR_VALUE;
  }
  return text.toUpperCase();
};

exports.VALUE = function(text) {
  if (typeof text !== 'string') {
    return errorObj.ERROR_VALUE;
  }
  return numeral().unformat(text);
};
