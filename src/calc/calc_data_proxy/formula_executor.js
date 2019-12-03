"use strict";

import { FnCollection, MultiCollExpFn } from './fn_collection';
import { fnObjArray } from '../expression_fn/normal_fn';
import * as rawFnObj from '../expression_fn/raw_fn';
import { StructuralExpressionBuilder } from '../expression/expression_builder';

function createDefaultFnCollection(){ // 创建默认的exp_fn collection类
    let normal_fn_coll = new FnCollection()
    normal_fn_coll.addFnObjArray(fnObjArray)
    let normalFnObj = normal_fn_coll.fnObj // 从expression_fn/normal_fn获取normalFnObj

    let raw_fn_coll = new FnCollection()
    raw_fn_coll.addFnObj(rawFnObj)
    let resRawFnObj = raw_fn_coll.fnObj // 从expression_fn/raw_fn获取rawFnObj

    let multiCollExpFn = new MultiCollExpFn(normal_fn_coll, raw_fn_coll)
    return multiCollExpFn
}

export class FormulaExecutor{ // 一个执行函数
    constructor(multiCollExpFn){
        if(typeof multiCollExpFn === "undefined"){
            multiCollExpFn = createDefaultFnCollection() // 默认参数
        }
        this.multiCollExpFn = multiCollExpFn
    }

    buildExp(formulaProxy) {
        let exp_builder = new StructuralExpressionBuilder(formulaProxy, this.multiCollExpFn);
        return exp_builder.parseExpression();
    }

    execFormula(formulaProxy){
        // console.log(formulaProxy.cell.f)
        let root_exp = this.buildExp(formulaProxy);
        root_exp.update_cell_value();
    }
}
