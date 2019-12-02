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



// export const errorValues = { // 这个变量没有意义了
//   ERROR_NULL: 0x00,
//   ERROR_DIV0: 0x07,
//   ERROR_VALUE: 0x0F,
//   ERROR_REF: 0x17,
//   ERROR_NAME: 0x1D,
//   ERROR_NUM: 0x24,
//   ERROR_NA: 0x2A,
//   ERROR_GETTING_DATA: 0x2B, // 16进制
//   ERROR_DATE_STR: 0x2C, // 日期格式转化错误，还没用到
//   ERROR_CIRCULAR: 0x2D, // 循环依赖，模仿google sheet的处理方法，直接报错。Excel中是显示箭头。
// };
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

// exports.nil =
// exports.div0 = new Error(ERROR_DIV0);
// exports.
// exports.ref = new Error(ERROR_REF);
// exports.name = new Error(ERROR_NAME);
// exports.num = new Error(ERROR_NUM);
// exports.na = new Error(ERROR_NA);
// exports.error = new Error(ERROR_ERROR); // 在core的代码里面会返回ERROR_ERROR错误
// exports.data = new Error(ERROR_GETTING_DATA);


