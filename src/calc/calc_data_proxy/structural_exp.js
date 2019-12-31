"use strict";
import { CellVTypeObj, FORMULA_STATUS, MARK_OBJ } from '../calc_utils/config';
import { RawValue } from './syntax_unit_raw_value.js';
import {SUnitRefValue} from './syntax_unit_ref_value';
import { SUnitRangeRef } from './syntax_unit_range.js';
import { errorMsgArr, errorObj, ERROR_SYNTAX } from '../calc_utils/error_config';
import {
    CellVArray,
    CellVDateTime,
    CellVEmpty, CellVNumber,
    convertToCellV
} from '../cell_value_type/cell_value';
import { TwoArgOperatorColl } from './operator_coll';
import {MatrixValue} from './matrix_math';
import {UserFnExecutor} from './exp_fn_executor';

let exp_id = 0; // 全局变量
/**
 * @property {CalcCell} calcCell
 */
export class StructuralExp {
    // 代表语法树上面的一个节点。这个几点的args是代表树枝，
    // 可以为RawValue，SUnitRefValue，LazyValue或字符或FormulaExp; 存在括号的时候，会把括号内的表达式构造为FormulaExp
    constructor(calcCell) {
        this.id = ++exp_id;   // id 是一个递增序列，其中root_exp的id为1
        this.args = []; // 一个表达式下面的多个平行的节点。例如“1+average(A1:A5)-23 * 123” 有4个平行节点
        this.name = 'Expression';
        this.calcCell = calcCell;
        this.last_arg = "";
        this.twoArgOperator = new TwoArgOperatorColl()
        this.isRoot = false
    }

    isEmpty(value) {
        return value === undefined || value === null || value === "";
    }

    hasCalcMethod(obj) {
        return typeof obj.solveExpression === 'function'
    }
    execCalcMethod(obj){
        if(this.hasCalcMethod(obj)){
            return obj.solveExpression()
        }
        else {
            throw errorObj.ERROR_SYNTAX
        }
    }

    exeOperatorForArrayAndSingle(a,b,op){ // 如果是矩阵参与运算做特殊处理
        let arg, newArg
        let hasMatrix = false
        for(arg of [a,b]) { // 有任何一个是矩阵，会执行矩阵运算
            if (arg instanceof Array || arg instanceof MatrixValue || arg instanceof CellVArray) {
                // newArg = new CellVArray(arg)
                hasMatrix = true
                break
            }
        }
        if(hasMatrix){
            return new CellVArray(a).exeElementOperator(new CellVArray(b), op) // 都转换为cellVArray
        }
        let theFunc = this.twoArgOperator.getFunc(op)
        let res = new UserFnExecutor(theFunc, [a,b]).solveExpression()
        return res// todo： 需要修改

    }

    execOperatorsWith2Args(operators, args) { // 优先级一样的运算符按照从左到右的顺序运算
        for (let i = 0; i < args.length; i++) {
            if (operators.includes(args[i])) {
                try {
                    let preSolution = this.execCalcMethod(args[i-1])
                    let postSolution = this.execCalcMethod(args[i+1])
                    let r = this.exeOperatorForArrayAndSingle(preSolution, postSolution,args[i]);// 这里存在递归
                    args.splice(i - 1, 3, new RawValue(r));
                    i--;
                } catch (e) { // 上面一旦出现错误，就直接跳出了
                    console.log(e);
                    throw e;
                }
            }
        }
    }

    exec_minus(args) { // =1.1^-12；=1.1*-12 在负号之前有其他运算符
        for (let i = args.length; i--;) {
            if (args[i] === '-') {
                // 首个字符就是负号或者在负号之前有其他运算符(args[i - 1] === 'string')
                if(i === 0 || (i > 0 && typeof args[i - 1] === 'string')) {
                    let nextSolution = this.execCalcMethod(args[i+1])
                    args.splice(i, 2, new RawValue( -nextSolution));// 替换2个原有arg
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
                if (args[i] instanceof SUnitRefValue) { // 属于引用的字符串
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

    // :,%这两个运算符在解析的时候就执行了
    exeAllTwoArgOperator(args) { // 根据优先级顺序来计算
        this.execOperatorsWith2Args(['^'], args);
        this.execOperatorsWith2Args(['/',"*"], args);
        this.execOperatorsWith2Args(['+','-'], args);
        this.execOperatorsWith2Args(['&'], args);
        this.execOperatorsWith2Args(['<','>','>=','<=','<>','='], args);
    }

    calcLastArg(arg){
        if(typeof arg === "string"){ // 所有的operator都已经处理完毕，因此这里arg不应该存在string 类型
            return  new Error(ERROR_SYNTAX)
        }
        if (typeof (arg.solveExpression) !== 'function' || arg.cellStatus === FORMULA_STATUS.solved) {
            /**
             * @type {CalcCell} arg
             */
            return arg.cellObj.v;
        } else {
            let res = arg.solveExpression()
            return this.convertToFinalValue(res)
        }
    }

    convertToFinalValue(res){
        let res2 = convertToCellV(res); // 确保返回的都是封装过的值
        // 最终单元格返回的值中需要转化CellVEmpty
        if(this.isRoot === true && res2.cellVTypeName === CellVTypeObj.CellVEmpty){
            res2 = new CellVNumber(0)
        }
        return res2
    }

    solveExpression() { // 核心方法
        let self = this;
        let args = self.args.concat(); // 应该使用来做个浅复制
        this.dealAllRefValue()
        // 以下是依次执行各个运算符，最优先的运算符在最上面
        this.exec_minus(args); // 执行负号运算
        this.exec_plus(args); // 执行第一个加号
        this.exeAllTwoArgOperator(args); // 负号在这一步会有问题
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
              && self.args[0] instanceof SUnitRangeRef) {
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

