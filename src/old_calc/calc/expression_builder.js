const Exp = require('./Exp.js');
const RawValue = require('./RawValue.js');
const UserFnExecutor = require('./UserFnExecutor.js');
const UserRawFnExecutor = require('./UserRawFnExecutor.js');
const common_operations = {
    '*': 'multiply',
    '+': 'plus',
    '-': 'minus',
    '/': 'divide',
    '^': 'power',
    '&': 'concat',
    '<': 'lt',
    '>': 'gt',
    '=': 'eq'
};

module.exports = function expression_builder(formula, opts) { // 核心的解析公式的方法
    formula.status = 'working';

    var xlsx_Fx = opts.xlsx_Fx || {};
    var xlsx_raw_Fx = opts.xlsx_raw_Fx || {};

    var root_exp;
    var str_formula = formula.cell.f;
    if (str_formula[0] == '=') {
        str_formula = str_formula.substr(1); // =adsf 会变为adsf
    }
    var exp_obj = root_exp = new Exp(formula);  // 封装公式实例
    var buffer = '',
        was_string = false;
    var fn_stack = [{ // 这个是函数调用栈？
        exp: exp_obj
    }];

    /**
     * state pattern in functional way
     */
    function string(char) {
        if (char === '"') {
            exp_obj.push(new RawValue(buffer));
            was_string = true;
            buffer = '';
            state = start;
        } else {
            buffer += char;
        }
    }

    function single_quote(char) {
        if (char === "'") {
            state = start;
        }
        buffer += char;
    }

    function ini_parentheses() {
        var o, trim_buffer = buffer.trim(),
            special = xlsx_Fx[trim_buffer];
        var special_raw = xlsx_raw_Fx[trim_buffer];
        if (special_raw) {
            special = new UserRawFnExecutor(special_raw, formula);
        }
        else if (special) {
            special = new UserFnExecutor(special, formula);
        }
        else if (trim_buffer) {
            //Error: "Worksheet 1"!D145: Function INDEX not found
            throw new Error('"' + formula.sheet_name + '"!' + formula.name + ': Function ' + buffer + ' not found');
        }
        o = new Exp(formula);
        fn_stack.push({
            exp: o,
            special: special
        });
        exp_obj = o;
        buffer = '';
    }

    function end_parentheses() {
        var v, stack = fn_stack.pop();
        exp_obj = stack.exp;
        exp_obj.push(buffer,position_i);
        v = exp_obj;
        buffer = '';
        exp_obj = fn_stack[fn_stack.length - 1].exp;
        if (stack.special) {
            stack.special.push(v);
            exp_obj.push(stack.special, position_i);
        }
        else {
            exp_obj.push(v, position_i);
        }
    }

    function add_operation(char) {
        if (!was_string) {
            exp_obj.push(buffer, position_i);
        }
        was_string = false;
        exp_obj.push(char, position_i);
        buffer = '';
    }

    function start(char) {
        if (char === '"') {
            state = string;
            buffer = "";
        } else if (char === "'") {
            state = single_quote;
            buffer = "'";
        } else if (char === '(') {
            ini_parentheses();
        } else if (char === ')') {
            end_parentheses();
        } else if (common_operations[char]) {
            add_operation(char);
        } else if (char === ',' && fn_stack[fn_stack.length - 1].special) {
            was_string = false;
            fn_stack[fn_stack.length - 1].exp.push(buffer, position_i);
            fn_stack[fn_stack.length - 1].special.push(fn_stack[fn_stack.length - 1].exp);
            fn_stack[fn_stack.length - 1].exp = exp_obj = new Exp(formula);
            buffer = '';
        } else {
            buffer += char;
        }
    }

    var state = start;
    var position_i = 0;

    for (; position_i < str_formula.length; position_i++) {
        state(str_formula[position_i]); // 逐字符解析函数
    }
    root_exp.push(buffer, position_i); // root_exp 是一个Exp实例，这个实例会引用一个Exp数组
    return root_exp;

}
