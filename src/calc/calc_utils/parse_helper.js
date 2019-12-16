import { errorObj } from './error_config';
import { d18991230MS, MS_PER_DAY } from './config';
// 与解析或格式转换有关的函数在这里


/////////////////// 格式转换 //////////////////////

/**
 *
 * @param {Number} dayNum
 * @return {Date}
 */
export function dayNum2Date(dayNum) {
  return new Date(d18991230MS + dayNum * MS_PER_DAY); // 转化为毫秒数
}


export function days_str2date(date) { // "20156" -> Date()
  let theDate;
  if (!isNaN(date)) {
    if (date instanceof Date) {
      theDate = date;
    }
    let d = parseInt(date, 10);
    if (d < 0) {
      return errorObj.ERROR_NUM;
    }
    theDate = new Date(d18991230MS + d * MS_PER_DAY);
  }
  if (typeof date === 'string') {
    theDate = new Date(date);
    if (!isNaN(date)) {
      theDate = date;
    }
  }
  if (theDate instanceof Date) {
    return theDate;
  }
  return errorObj.ERROR_VALUE;
}

export function parseBool(bool) {
  if (bool === undefined) {
    return true;
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
    let up = bool.toUpperCase();
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

  return errorObj.ERROR_VALUE;
}

export function parseNumber(string) {
  if (string === undefined || string === '') {
    return errorObj.ERROR_VALUE;
  }
  if (!isNaN(string)) {
    return parseFloat(string);
  }
  return errorObj.ERROR_VALUE;
}

export function parseNumberArray(arr) {
  let len;
  if (!arr || (len = arr.length) === 0) {
    return errorObj.ERROR_VALUE;
  }
  let parsed;
  while (len--) {
    parsed = parseNumber(arr[len]);
    if (parsed === errorObj.ERROR_VALUE) {
      return parsed;
    }
    arr[len] = parsed;
  }
  return arr;
}

export function parseMatrix(matrix) {
  let n;
  if (!matrix || (n = matrix.length) === 0) {
    return errorObj.ERROR_VALUE;
  }
  let pnarr;
  for (let i = 0; i < matrix.length; i++) {
    pnarr = parseNumberArray(matrix[i]);
    matrix[i] = pnarr;
    if (pnarr instanceof Error) {
      return pnarr;
    }
  }
  return matrix;
}


export function parseDateArray(arr) {
  let len = arr.length;
  let parsed;
  while (len--) {
    parsed = days_str2date(arr[len]);
    if (parsed === errorObj.ERROR_VALUE) {
      return parsed;
    }
    arr[len] = parsed;
  }
  return arr;
}





////////////////////////////////////  老函数 ///////////////////////////////////////////////////////

//XW:{}中参数解析,将{1,2,3；4,5,6}这样的参数解析为数组结构
export function str2int(arg) {
  if (!isNaN(parseInt(arg))) {
    return parseInt(arg);
  }
  return arg.replace('"', '')
    .replace('"', ''); // todo: 这个replace是对的么？
}

//XW：end
//XW: 将参数解析成数字数组，若有不符合要求的报错，default0忽略
export function parse(a) {
  if (a instanceof Error) {
    return a;
  }
  if (a instanceof Array) {
    let arr = [];
    for (let i = 0; i < a.length; i++) {
      if (typeof a[i][0] === 'string' && a[i][0] !== 'default_0') {
        return errorObj.ERROR_NAME;
      }
      if (typeof a[i][0] === 'number') {
        arr.push(a[i][0]);
      }
      if (a[i][0] instanceof Object) {
        return errorObj.ERROR_NAME;
      }
    }
    return arr;
  }
  if (typeof a === 'string') {
    if (a === 'default_0') {
      return 'pass';
    } else {
      return errorObj.ERROR_NAME;
    }
  }
  if (typeof a === 'number') {
    return a;
  }
}

