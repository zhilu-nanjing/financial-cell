


export const MS_PER_DAY = 86400000; // 24 * 60 * 60 * 1000
export const common_operations = { // todo: 需要把这个常数放到config里面
  '*': 'multiply',
  '+': 'plus',
  '-': 'subtractDays',
  '/': 'divide',
  '^': 'power',
  '&': 'concat',
  '<': 'lt',
  '>': 'gt',
  '=': 'eq'
};

export const FORMULA_STATUS = {
  created: "created",
  edited: "edited", // 被修改了
  working: "working",
  solved: "solved",
}

export const MARK_OBJ= { // todo: 需要把这个常数放到config里面
  percent: "%", // 单元运算符
  star : '*', //双元运算符
  plus: '+', //双元运算符
  dash: '-', //双元运算符 或单元运算符
  slash: '/', //双元运算符
  caret: '^', //双元运算符
  ampersand: '&', //双元运算符
  lessThen: '<', //双元运算符
  greaterThen: '>', //双元运算符
  equal: "=", // 双元运算符是否等于

  exclamation: '!', // ok

  leftParentheses: '(',
  rightParentheses: ')',
  comma: ',',
  leftBracket: '[',
  rightBracket: ']',
  leftBrace : '{',
  rightBrace : '}',
  colon: ":",
  hash: "#", // 可以用作溢出运算符，新的溢出功能
  at:'@', // 引用运算符，我也不是很理解
  space: " ", // 代表可以忽略的空白，或者为交集运算符
  doubleQue: '"',
};

export const MULTI_CHAR_OPERATOR ={
  notEqual: "<>",
  greaterEqual: ">=",
  lessEqual: "<=",
}

export const SINGLE_CHAR_OPERATOR ={
  percent: "%", // 单元运算符
  minus: "-", // 单元或双元运算符
  star : '*', //双元运算符
  plus: '+', //双元运算符
  slash: '/', //双元运算符
  caret: '^', //双元运算符
  ampersand: '&', //双元运算符
  lessThen: '<', //双元运算符
  greaterThen: '>', //双元运算符
  equal: "=", // 双元运算符是否等于
}

export const PRE_DEFINED_CONST={
  true: "TRUE",
  false:"FALSE"
}

export const MONEY_UNIT_OBJ = {
  dollar:"$",
}

export const FORCE_STR_MARK ="'"

// 这个日期作为日期的起点
export const d18991230 = new Date(1899, 11, 30); // js中0代表1月，11代表12月; 有误差

export const d18991230MS = -2209161600000 - 8 * 3600 * 1000 // 东八区
export const d18991230STR = "1899/12/30"
export const ALL_DIGIT_PATTERN_STR = `^\\d+$`;
export const INT_WITH_COMMA_PATTERN = /^0*[1-9]\d*(,\d{3})+$/;
export const FLOAT_WITH_COMMA_PATTERN = /^0*[1-9]\d*(,\d{3})+(\.\d+)?$/;
export const CLEAN_FLOAT_PATTERN = /^\d*(\.\d+)?$/;
export const E_PATTERN = /[eE]/;
export const TO_PARA_TYPE = { // 可以转换成的数据类型
  date: 'date',
  string: 'string',
  number: 'number'
};
export const INVALID_MATRIX = 'INVALID_MATRIX';
export const NOT_NUMBER = 'NOT_NUMBER';
export const SHAPE_DIFF = 'SHARPE_DIFF';
export const NOT_SUPPORT = 'NOT_SUPPORT';
