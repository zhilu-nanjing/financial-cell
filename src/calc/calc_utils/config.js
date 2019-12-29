


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
  created: "created",// 被修改或新建
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
export const EmptyMultiSheetObj = { Sheet1: { A1: { f: '' } } };
export const NOT_CONVERT = 'NOT_CONVERT';










export const OPERATOR = 'operator_single_func.js';
export const SPLIT_MARK = 'split_mark';// 逗号，分号这样分割不同语法单元的标记
export const CONTAINER = 'container';// 括号双引号能包含其他单元这样的标记， 字符串不含有标志起始结尾的双引号
export const RAW_VALUE = 'raw_value';// 直接输入的数字。 {1,2,3}这样的矩阵属于复合型单元。
export const RAW_ARRAY = 'raw_array'
export const SINGLE_REF = 'single_ref';// 单一引用，associatedValue有isColAbsolute, isRowAbsolute 这样的方法
export const RANG_REF = 'range_ref';// 范围引用associatedValue有isBeginColAbsolute, isBeginRowAbsolute 这样的方法
export const USELESS = 'useless';// 被忽略的部分
export const EXP_FN = 'exp_fn';// 表达式函数
export const VALUE_NAME = 'value_name';// 变量或常量的名字
export const SOLVE_FAIL_OBJ = { msg: 'solve_fail' };// 求解不成功
export const SHEET_NAME = 'sheet_name';
export const COL_NAME = 'col_name';
export const ROW_NAME = 'row_name';
export const ABSOLUTE_MARK = 'absolute_mark';
export const CellVTypeObj = {
  CellVDateTime: 'CellVDateTime',
  CellVError: 'CellVError',
  CellVEmpty: 'CellVEmpty',
  CellVNumber: 'CellVNumber',
  CellVString: 'CellVString',
  CellVHyperLink: 'CellVHyperLink',
  CellVBool: 'CellVBool',
  CellVArray: 'CellVArray',
};
export const SHEET1A1 = "sheet1!A1"
export const A1 = "A1"
export const BOOL = 'bool';
export const A1A2 = 'A1:A2';
export const SHEET1A1A2 = 'sheet1!A1:A2';
export const SHEET1AA = 'sheet1!A:A';
export const AA = 'A:A';
