"use strict";

import {parseExpression} from '../expression/expression_builder.js';

let xlsx_Fx = {};
let xlsx_raw_Fx = {};

import_functions(require('../expression_fn/index'));
import_raw_functions(require('../old/formulas-raw.js'));

function import_raw_functions(functions, opts) {
    for (let key in functions) {
        xlsx_raw_Fx[key] = functions[key];
    }
}

function import_functions(formulajs, opts) {
    opts = opts || {};
    let prefix = opts.prefix || '';
    for (let key in formulajs) {
        let obj = formulajs[key];
        if (typeof(obj) === 'function') {
            if (opts.override || !xlsx_Fx[prefix + key]) {
                xlsx_Fx[prefix + key] = obj;
            }
            // else {
            //     console.log(prefix + key, 'already exists.');
            //     console.log('  to override:');
            //     console.log('    XLSX_CALC.import_functions(yourlib, {override: true})');
            // }
        }
        else if (typeof(obj) === 'object') {
            import_functions(obj, my_assign(opts, { prefix: key + '.' }));
        }
    }
}

function my_assign(dest, source) {
    let obj = JSON.parse(JSON.stringify(dest));
    for (let k in source) {
        obj[k] = source[k];
    }
    return obj;
}

function build_expression(formula) {
    return parseExpression(formula, {xlsx_Fx: xlsx_Fx, xlsx_raw_Fx: xlsx_raw_Fx});
    // xlsx_raw_Fx = {AND, IF, IFERROR, OFFSET}
    // xlsx_Fx = {FLOOR, AVERGAE ... }
}

export function exec_formula(formula) { // cellFormulaProxy.cell.f = "Average(1,2,3,4,5)
    let root_exp = build_expression(formula);
    root_exp.update_cell_value();
}

exec_formula.set_fx = function set_fx(name, fn) {
    xlsx_Fx[name] = fn;
};

exec_formula.exec_fx = function exec_fx(name, args) {
    return xlsx_Fx[name].apply(this, args);
};

exec_formula.localizeFunctions = function(dic) {
    for (let newName in dic) {
        let oldName = dic[newName];
        if (xlsx_Fx[oldName]) {
            xlsx_Fx[newName] = xlsx_Fx[oldName];
        }
        if (xlsx_raw_Fx[oldName]) {
            xlsx_raw_Fx[newName] = xlsx_raw_Fx[oldName];
        }
    }
};

exec_formula.import_functions = import_functions;
exec_formula.import_raw_functions = import_raw_functions;
exec_formula.build_expression = build_expression;
exec_formula.xlsx_Fx = xlsx_Fx;
