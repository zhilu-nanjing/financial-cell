"use strict";
import {RawValue} from '../expression/RawValue.js'
import {str_2_val} from '../expression/str_2_val.js'
import finder from './finder'

export class Calculator { // 这个应该是对重对外暴露的类。

    constructor(workbook, exec_formula) {
        this.workbook = workbook;
        this.expressions = [];
        this.exec_formula = exec_formula;
        this.variables = {};
        this.formulas = finder.find_all_cells_with_formulas(workbook, exec_formula);
        for (let i = this.formulas.length - 1; i >= 0; i--) {
            let exp = exec_formula.build_expression(this.formulas[i]);
            this.expressions.push(exp);
        }
        this.calcNames();
    }

    setVar(var_name, value) {
        let variable = this.variables[var_name];
        if (variable) {
            variable.setValue(value);
        } else {
            this.expressions.forEach(exp => {
                this.setVarOfExpression(exp, var_name, value);
            });
        }
    }

    getVars() {
        let vars = {};
        for (let k in this.variables) {
            vars[k] = this.variables[k].calc();
        }
        return vars;
    }

    calcNames() {
        if (!this.workbook || !this.workbook.Workbook || !this.workbook.Workbook.Names) {
            return;
        }
        this.workbook.Workbook.Names.forEach(item => {
            let val = this.getRef(item.Ref);
            this.variables[item.Name] = val;
            this.expressions.forEach(exp => {
                this.setVarOfExpression(exp, item.Name);
            });
        });
    }

    getRef(ref_name) {
        if (!this.formulas.length) {
            throw new Error("No cellFormulaProxy found.");
        }
        let first_formula = this.formulas[0];
        let formula_ref = first_formula.formula_ref;
        let formula = {
            formula_ref: formula_ref,
            wb: this.workbook,
            exec_formula: this.exec_formula
        };
        return str_2_val(ref_name, formula);
    }

    setVarOfExpression(exp, var_name, value) {
        for (let i = 0; i < exp.args.length; i++) {
            let arg = exp.args[i];
            if (arg === var_name) {
                exp.args[i] = this.variables[var_name] || (this.variables[var_name] = new RawValue(value));
            } else if (typeof arg === 'object' && (arg.name === 'Expression' || arg.name === 'UserFn')) {
                this.setVarOfExpression(arg, var_name, value);
            }
        }
    }

    execute() {
        this.expressions.forEach(exp => {
            exp.update_cell_value();
        });
    }
}

