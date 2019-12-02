import utils from './utils'
import numeral from 'numeral'

exports.UNIQUE = function () {
  let result = [];
  for (let i = 0; i < arguments.length; ++i) {
    let hasElement = false;
    let element    = arguments[i];

    // Check if we've already seen this element.
    for (let j = 0; j < result.length; ++j) {
      hasElement = result[j] === element;
      if (hasElement) { break; }
    }

    // If we did not find it, add it to the result.
    if (!hasElement) {
      result.push(element);
    }
  }
  return result;
};

exports.FLATTEN = utils.flatten;

exports.ARGS2ARRAY = function () {
  return Array.prototype.slice.call(arguments, 0);
};

exports.REFERENCE = function (context, reference) {
  try {
    let path = reference.split('.');
    let result = context;
    for (let i = 0; i < path.length; ++i) {
      let step = path[i];
      if (step[step.length - 1] === ']') {
        let opening = step.indexOf('[');
        let index = step.substring(opening + 1, step.length - 1);
        result = result[step.substring(0, opening)][index];
      } else {
        result = result[step];
      }
    }
    return result;
  } catch (error) {}
};

exports.JOIN = function (array, separator) {
  return array.join(separator);
};

exports.NUMBERS = function () {
  let possibleNumbers = utils.flatten(arguments);
  return possibleNumbers.filter(function (el) {
    return typeof el === 'number';
  });
};

exports.NUMERAL = function (number, format) {
  return numeral(number).format(format);
};
