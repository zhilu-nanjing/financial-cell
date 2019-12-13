"use strict";
import {FORMULA_STATUS}  from "../calc_utils/config"
import {RawValue} from './raw_value.js';
import {Range} from './range_ref.js';
import {errorObj, errorMsgArr}  from '../calc_utils/error_config'
import {CellVDateTime, CellVEmpty, convertToCellV} from "../cell_value_type/cell_value";
import { str_2_val } from './exp_section';


let exp_id = 0; // 全局变量
/**
 * @property {CalcCell} calcCell
 */
export class StructuralExp {
    // 代表语法树上面的一个节点。这个几点的args是代表树枝，
    // 可以为RawValue，RefValue，LazyValue或字符或FormulaExp; 存在括号的时候，会把括号内的表达式构造为FormulaExp
    constructor(calcCell) {
        this.id = ++exp_id;   // id 是一个递增序列，其中root_exp的id为1
        this.args = [];
        this.name = 'Expression';
        this.calcCell = calcCell;
        this.last_arg = "";
    }


    isEmpty(value) {
        return value === undefined || value === null || value === "";
    }

    hasCalcMethod(obj) {
        return typeof obj.solveExpression === 'function'
    }
    convertDateToNumber(res){
        if(res instanceof CellVDateTime){
            return res.toNumber()
        }
        else {
            return res
        }
    }
    execCalcMethod(obj, isConvertDateToNumber = true){
        if(this.hasCalcMethod(obj)){
            let res = obj.solveExpression()
            if(isConvertDateToNumber){
                res = this.convertDateToNumber(res)
            }
            return res
        }
        else {
            throw errorObj.ERROR_SYNTAX
        }
    }

    execOperatorWith2Args(op, args, fn) { // fn含有两个参数，因为运算符有优先级顺序，所以需要依次执行
        for (let i = 0; i < args.length; i++) { // todo: 后面会修改args，这样不是很恰当
            if (args[i] === op) {
                try {
                    let r = fn(this.execCalcMethod(args[i-1]), this.execCalcMethod(args[i+1]));// 这里存在递归
                    args.splice(i - 1, 3, new RawValue(r));
                    i--;
                } catch (e) { // 上面一旦出现错误，就直接跳出了
                    console.log('[structural_exp.js] - ' + this.name + ': evaluating ' + this.calcCell.cellObj.f + '\n' + e.message);
                    throw e;
                }
            }
        }
    }

    exec_minus(args) { // =1.1^-12；=1.1*-12 在负号之前有其他运算符
        for (let i = args.length; i--;) {
            if (args[i] === '-') {
                this.execCalcMethod(args[i+1])
                if (i > 0 && typeof args[i - 1] === 'string') {
                    args.splice(i, 2, new RawValue(-args[i+1]));// 替换2个原有arg
                }
            }

        }
    }

    exec_plus(args){
        if (args[0] === '+') { // 第一个运算符符就是加号
            let r = this.execCalcMethod(args[1]); // 这里存在递归
            args.splice(0, 2, new RawValue(r));
        }
    }

    /**
     * 预处理refValue类型的数值
     * @return {*|Error}
     */
    dealAllRefValue(){
        let self = this;
        let args = self.args.concat(); // 应该使用来做个浅复制
        let sheet
        try {
            for (let i = 0; i < args.length; i++) { // 遍历所有的参数
                if (args[i].name === 'RefValue') { // 属于引用的字符串
                    sheet = args[i].calcCell.calcSheet;
                    //未定义单元格f置为default_0
                    let cellName = args[i].str_expression
                    if (sheet.getCellByName(cellName) === undefined){ // 判定空单元格，args[i].str_expression = "A28", sheet是一个obj, value 是 ｛v:,f:}这种形式的obj
                        sheet.addCalcCell(cellName, {v: new CellVEmpty()}, FORMULA_STATUS.solved)   // 未定义的值赋值
                    }
                    //=A0形式参数报错
                    if (args[i].str_expression.slice(1, args[i].str_expression.length) === '0') {
                        return errorObj.ERROR_NAME;
                    }
                }
            }
        } catch (e) {
        }
    }


    exeAllTwoArgOperator(args, self) {
        this.execOperatorWith2Args('^', args, function (a, b) {
            return Math.pow(+a, +b);
        });
        this.execOperatorWith2Args('/', args, function (a, b) {
            if (b === 0) {
                throw errorObj.ERROR_DIV0;
            }
            return (+a) / (+b);
        });
        this.execOperatorWith2Args('*', args, function (a, b) {
            return (+a) * (+b);
        });
        this.execOperatorWith2Args('-', args, function (a, b) { // 执行减法
            return a - b;
        });

        this.execOperatorWith2Args('+', args, function (a, b) { // 执行加法
            return (+a) + (+b);
        });
        this.execOperatorWith2Args('&', args, function (a, b) {
            return '' + a + b;
        });
        this.execOperatorWith2Args('<', args, function (a, b) {
            return a < b;
        });
        this.execOperatorWith2Args('>', args, function (a, b) {
            return a > b;
        });
        this.execOperatorWith2Args('>=', args, function (a, b) {
            return a >= b;
        });
        this.execOperatorWith2Args('<=', args, function (a, b) {
            return a <= b;
        });
        this.execOperatorWith2Args('<>', args, function (a, b) {
            if (self.isEmpty(a) && self.isEmpty(b)) {
                return false;
            }
            return a !== b;
        });
        this.execOperatorWith2Args('=', args, function (a, b) {
            if (self.isEmpty(a) && self.isEmpty(b)) {
                return true;
            }
            if ((a === null && b === 0) || (a === 0 && b === null)) {
                return true;
            }
            if (typeof a === 'string' && typeof b === 'string' && a.toLowerCase() === b.toLowerCase()) {
                return true;
            }
            return a === b;
        });
    }
    push2ExpArgs(astNodeStr, position_i) {
        let self = this
        if (astNodeStr) {
            let v = str_2_val(astNodeStr, self.calcCell, position_i); // 核心方法
            if (((v === '=') && (self.last_arg === '>' || self.last_arg === '<')) || (self.last_arg === '<' && v === '>')) {
                self.args[self.args.length - 1] += v;
            } else {
                self.args.push(v);
            }
            self.last_arg = v;
            //console.log(self.id, '-->', v);
        }
    };

    calcLastArg(arg){
        if (typeof (arg.solveExpression) !== 'function' || arg.cellStatus === FORMULA_STATUS.solved) {
            /**
             * @type {CalcCell} arg
             */
            return arg.cellObj.v;
        } else {
            let res = arg.solveExpression()
            return convertToCellV(res); // 确保返回的都是封装过的值
        }
    }

    solveExpression() { // 核心方法
        let self = this;
        let args = self.args.concat(); // 应该使用来做个浅复制
        this.dealAllRefValue()
        // 以下是依次执行各个运算符，最优先的运算符在最上面
        this.exec_minus(args); // 执行负号运算
        this.exec_plus(args); // 执行第一个加号
        this.exeAllTwoArgOperator(args, self);
        if (args.length === 1) {
            return this.calcLastArg(args[0]) // 计算最后一个值; 返回的都是CellV
        }
    };

    update_cell_value() { // 这个方法是用来更新cellObj.v，而solve_expression只会获取运算结果而不会赋值
        let self = this;
        let curCellObj = this.calcCell.cellObj;
        try {
            if (Array.isArray(self.args) // 不合法的参数； 何时会出现这种情况？
              && self.args.length === 1
              && self.args[0] instanceof Range) {
                throw errorObj.ERROR_VALUE;
            }
            curCellObj.v = self.solveExpression(); // 计算数值

            if (typeof (curCellObj.v) === 'string') {
                curCellObj.t = 's';
            } else if (typeof (curCellObj.v) === 'number') {
                curCellObj.t = 'n';
            }
        } catch (e) {
            if (errorMsgArr.indexOf(e.message) !== -1) {
                curCellObj.t = 'e';
                curCellObj.w = e.message; // todo: 把.w 属性改为  .text属性， cell使用calcCell实例而不是单纯的obj
                curCellObj.v = e.message; // 出错的话，v属性应该没有用了把
            } else {
                throw e;
            }
        }
    }
}

