"use strict";

const RawValue = require('./RawValue.js');
const Range = require('./Range.js');
const str_2_val = require('./str_2_val.js');
//XW：统一报错
var error = require('./formulajs/lib/error');
//XW：end

const MS_PER_DAY = 24 * 60 * 60 * 1000;

var exp_id = 0;

module.exports = function Exp(formula) {
    var self = this;
    self.id = ++exp_id;   // id 是一个递增序列，其中root_exp的id为1
    self.args = [];
    self.name = 'Expression';
    self.update_cell_value = update_cell_value;
    self.formula = formula;

    function update_cell_value() {
        try {
            if (Array.isArray(self.args)
                    && self.args.length === 1
                    && self.args[0] instanceof Range) {
                throw error.value;
            }
            formula.cell.v = self.calc();

            if (typeof(formula.cell.v) === 'string') {
                formula.cell.t = 's';
            }
            else if (typeof(formula.cell.v) === 'number') {
                formula.cell.t = 'n';
            }
        }
        catch (e) {
            var errorValues = {
                '#NULL!': 0x00,
                '#DIV/0!': 0x07,
                '#VALUE!': 0x0F,
                '#REF!': 0x17,
                '#NAME?': 0x1D,
                '#NUM!': 0x24,
                '#N/A': 0x2A,
                '#GETTING_DATA': 0x2B
            };
            if (errorValues[e.message] !== undefined) {
                formula.cell.t = 'e';
                formula.cell.w = e.message;
                formula.cell.v = errorValues[e.message];
            }
            else {
                throw e;
            }
        }
        finally {
            formula.status = 'done';
        }
    }
    function isEmpty(value) {
        return value === undefined || value === null || value === "";
    }

    function checkVariable(obj) {
        if (typeof obj.calc !== 'function') {
            return 0;
        }
        return 1;
    }

    function exec(op, args, fn) {
        for (var i = 0; i < args.length; i++) {
            if (args[i] === op) {
                try {
                    if (i === 0 && op === '+') {
                        let as = checkVariable(args[i + 1]);
                        if (!as)
                            break;
                        let r = args[i + 1].calc();
                        args.splice(i, 2, new RawValue(r));
                    } else {
                        let as = checkVariable(args[i - 1]);
                        if (!as)
                            break;
                        as = checkVariable(args[i + 1]);
                        if (!as)
                            break;
                        let r = fn(args[i - 1].calc(), args[i + 1].calc());
                        args.splice(i - 1, 3, new RawValue(r));
                        i--;
                    }
                }
                catch (e) {
                    // console.log('[Exp.js] - ' + formula.name + ': evaluating ' + formula.cell.f + '\n' + e.message);
                    throw e;
                }
            }
        }
    }

    function exec_minus(args) {
        for (var i = args.length; i--;) {
            if (args[i] === '-') {
                checkVariable(args[i + 1]);
                var b = args[i + 1].calc();
                if (i > 0 && typeof args[i - 1] !== 'string') {
                    args.splice(i, 1, '+');
                    if (b instanceof Date) {
                        b = Date.parse(b);
                        checkVariable(args[i - 1]);
                        var a = args[i - 1].calc();
                        if (a instanceof Date) {
                            a = Date.parse(a) / MS_PER_DAY;
                            b = b / MS_PER_DAY;
                            args.splice(i - 1, 1, new RawValue(a));
                        }
                    }
                    args.splice(i + 1, 1, new RawValue(-b));
                }
                else {
                    args.splice(i, 2, new RawValue(-b));
                }
            }
        }
    }
    self.calc = function() {
        let args = self.args.concat();
        //XW: 对函数参数做转换、判断
        try{
            for (var i=0;i<args.length;i++){
                if (args[i].name == 'RefValue'){
                    var sheet = args[i].formula.sheet
                    //未定义单元格f置为default_0
                    if (sheet[args[i].str_expression] === undefined){
                        args[i].formula.sheet[args[i].str_expression] = {v: 'default_0'}
                    }
                    //=A0形式参数报错
                    if (args[i].str_expression.slice(1, args[i].str_expression.length) == '0'){
                        return error.name;
                    }
                }
            }
        }catch (e) {
        }
        try{
            //形如2019年10月19日参数转为2019-10-19
            if (args[0].name == 'RefValue' && args[1] == '-' && args[2].name == 'RefValue'){
                var sheet = args[0].formula.sheet
                var a = sheet[args[0].str_expression].v
                var b = sheet[args[2].str_expression].v
                var a = a.replace('年', '-').replace('月', '-').replace('日', '')
                var b = b.replace('年', '-').replace('月', '-').replace('日', '')
                return datedifference(a, b)
            }
        }catch (e) {
        }
        //XW：end
        exec_minus(args);
        exec('^', args, function(a, b) {
            return Math.pow(a, b);
        });
        exec('/', args, function(a, b) {
            if (b == 0) {
                throw error.div0;
            }
            return (+a) / (+b);
        });
        exec('*', args, function(a, b) {
            return (+a) * (+b);
        });
        exec('+', args, function(a, b) {
            if (a instanceof Date && typeof b === 'number') {
                b = b * MS_PER_DAY;
            }
            return (+a) + (+b);
        });
        exec('&', args, function(a, b) {
            return '' + a + b;
        });
        exec('<', args, function(a, b) {
            return a < b;
        });
        exec('>', args, function(a, b) {
            return a > b;
        });
        exec('>=', args, function(a, b) {
            return a >= b;
        });
        exec('<=', args, function(a, b) {
            return a <= b;
        });
        exec('<>', args, function(a, b) {
            if (a instanceof Date && b instanceof Date) {
                return a.getTime() !== b.getTime();
            }
            if (isEmpty(a) && isEmpty(b)) {
                return false;
            }
            return a != b;
        });
        exec('=', args, function(a, b) {
            if (a instanceof Date && b instanceof Date) {
                return a.getTime() === b.getTime();
            }
            if (isEmpty(a) && isEmpty(b)) {
                return true;
            }
            if ((a == null && b === 0) || (a === 0 && b == null)) {
                return true;
            }
            if (typeof a === 'string' && typeof b === 'string' && a.toLowerCase() === b.toLowerCase()) {
                return true;
            }
            return a == b;
        });
        if (args.length == 1) {
            if (typeof(args[0].calc) !== 'function') {
                return args[0];
            }
            else {
                return args[0].calc();
            }
        }
    };

    var last_arg;
    self.push = function(buffer, position_i) {
        if (buffer) {
            var v = str_2_val(buffer, formula, position_i);
            if (((v === '=') && (last_arg == '>' || last_arg == '<')) || (last_arg == '<' && v === '>')) {
                self.args[self.args.length - 1] += v;
            }
            else {
                self.args.push(v);
            }
            last_arg = v;
            //console.log(self.id, '-->', v);
        }
    };
};
