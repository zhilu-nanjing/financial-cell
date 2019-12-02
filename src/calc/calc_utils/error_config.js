export const ERROR_NULL = '#NULL!';
export const ERROR_DIV0 = '#DIV/0!';
export const ERROR_VALUE = '#VALUE!';
export const ERROR_REF = '#REF!';
export const ERROR_NAME = '#NAME?';
export const ERROR_NUM = '#NUM!';
export const ERROR_NA = '#N/A';
export const ERROR_GETTING_DATA = '#GETTING_DATA!';
export const ERROR_DATE_STR = '#DATE!';
export const ERROR_CIRCULAR = '#CIRCULA!';
export const ERROR_ERROR = '#ERROR!';
export const ERROR_SYNTAX = "#SYNTAX" // 语法错误

export const errorMsgArr = [ERROR_NULL, ERROR_DIV0, ERROR_VALUE, ERROR_REF, ERROR_NAME,
  ERROR_NUM, ERROR_NA, ERROR_GETTING_DATA, ERROR_DATE_STR, ERROR_CIRCULAR,
  ERROR_ERROR, ERROR_SYNTAX];

export const errorObj = {
  ERROR_NULL: new Error(ERROR_NULL),
  ERROR_DIV0: new Error(ERROR_DIV0),
  ERROR_VALUE: new Error(ERROR_VALUE),
  ERROR_REF: new Error(ERROR_REF),
  ERROR_NAME: new Error(ERROR_NAME),
  ERROR_NUM: new Error(ERROR_NUM),
  ERROR_NA: new Error(ERROR_NA),
  ERROR_GETTING_DATA: new Error(ERROR_GETTING_DATA),
  ERROR_DATE_STR: new Error(ERROR_DATE_STR),
  ERROR_CIRCULAR: new Error(ERROR_CIRCULAR),
  ERROR_ERROR: new Error(ERROR_ERROR),
  ERROR_SYNTAX: new Error(ERROR_SYNTAX),
};



