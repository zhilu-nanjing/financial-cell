import { errorObj } from './error_config';
import { parse, parseNumber, str2int } from './parse_helper';


////////////////////////////////////////老函数

function flattenShallow(array) {
  if (!array || !array.reduce) { return array; }
  return array.reduce(function(a, b) {
    let aIsArray = Array.isArray(a);
    let bIsArray = Array.isArray(b);
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
  for (let i = 0; i < array.length; ++i) {
    if (Array.isArray(array[i])) {
      return false;
    }
  }
  return true;
}

export function flatten(){
  let result = argsToArray.apply(null, arguments);
  while (!isFlat(result)) {
    result = flattenShallow(result);
  }
  return result;
}
export function argsToArray(args) {
  return Array.prototype.slice.call(args, 0);
}
export function numbers() {
  let possibleNumbers = flatten.apply(null, arguments);
  return possibleNumbers.filter(function(el) {
    return typeof el === 'number';
  });
}
export function flattenNum(args) { // todo: 这个函数有点复杂，需要优化
  try{
    if (args.length === 1 && args[0][0] === 'default_0'){
      return errorObj.ERROR_DIV0
    }
    let arr = []
    for( let i=0;i<args.length;i++){
        let arg = (args[i])

      if (arg === undefined){
        return errorObj.ERROR_NAME
      }
      if (arg instanceof Error){
        return arg
      }else if(arg !== 'pass'){
        if (arg instanceof Array){
          for (let n=0; n < arg.length;n++){
            arr.push(arg[n])
          }
        }else{
          arr.push(arg)
        }
      }
    }
    return arr
  }catch{
    return errorObj.ERROR_NAME
  }
}
//XW:end

export function cleanFloat(number) {
  let power = 1e14;
  return Math.round(number * power) / power;
}
export function Copy(obj) {
  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" !== typeof obj) return obj;
  // Handle Date
  if (obj instanceof Date) {
    let copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }
  // Handle Array
  if (obj instanceof Array) {
    let copy = [];
    for (let i = 0; i < obj.length; ++i) {
      copy[i] = Copy(obj[i]); // 递归copy
    }
    return copy;
  }
  // Handle Object
  if (obj instanceof Object) {
    let copy = {};
    for (let attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = Copy(obj[attr]);
    }
    return copy;
  }
  throw new Error("Unable to copy obj! Its type isn't supported.");
}

export function strToMatrix(str) {
  let arg = str.slice(2,str.length-2).split(',')
  let matrix = [];
  let arr = []
  for (let i=0; i < arg.length; i++){
    let num = arg[i].toString()
    if (num.indexOf(';') > 0) {
      arr.push(str2int(num.split(';')[0]))
      matrix.push(arr)
      arr = [str2int(num.split(';')[1])]
    }else{
      arr.push(str2int(num))
    }
  }
  matrix.push(arr)
  return matrix
}
export function anyIsError() {
  let n = arguments.length;
  while (n--) {
    if (arguments[n] instanceof Error) {
      return true;
    }
  }
  return false;
}
export function arrayValuesToNumbers(arr) {
  let n = arr.length;
  let el;
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
      let number = parseNumber(el);
      if (number instanceof Error) {
        arr[n] = 0;
      } else {
        arr[n] = number;
      }
    }
  }
  return arr;
}
export function rest(array, idx) {
  idx = idx || 1;
  if (!array || typeof array.slice !== 'function') {
    return array;
  }
  return array.slice(idx);
}
export function initial(array, idx) {
  idx = idx || 1;
  if (!array || typeof array.slice !== 'function') {
    return array;
  }
  return array.slice(0, array.length - idx);
}

export function compareFloat(a, b, toleration = 0.001) {
  return Math.abs(a - b) < toleration;
}

export function isArrayBeginWithOther(aArray, other) {
  return other.every((e, index) => e === aArray[index]);
}
