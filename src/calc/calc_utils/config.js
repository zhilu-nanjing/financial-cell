
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
  exclamation: '!', // ok
  ampersand: '&', //双元运算符
  lessThen: '<', //双元运算符
  greaterThen: '>', //双元运算符
  leftParentheses: '(',
  rightParentheses: ')',
  comma: ',',
  leftBracket: '[',
  rightBracket: ']',
  leftBrace : '}',
  rightBrace : '{',
  equal: "=", // 双元运算符是否等于
  colon: ":",
  hash: "#", // 可以用作溢出运算符，新的溢出功能
  at:'@', // 引用运算符，我也不是很理解
  space: " ", // 代表可以忽略的空白，或者为交集运算符
};

export const MULTI_CHAR_OPERATOR ={
  notEqual: "<>",
  greaterEqual: ">=",
  lessEqual: "<=",
}

export const SINGLE_CHAR_OPERATOR ={
  percent: "%", // 单元运算符
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
export const d18991230 = new Date(1899, 11, 30); // js中0代表1月，11代表12月
