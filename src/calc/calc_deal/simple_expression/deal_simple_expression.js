import { StructuralExp } from '../../calc_data_proxy/structural_exp';


class SimpleExpression{
  constructor(formulaProxy){
    this.formulaProxy = formulaProxy
  }

}

export class SimpleExpressionBuilder { // 解析不含等号的那些表达式
  /**
   *
   * @param {CellFormulaProxy} cellFormulaProxy
   */
  constructor(cellFormulaProxy) {
    this.cellFormulaProxy = cellFormulaProxy;
    this.multiCollFn = this.cellFormulaProxy.workbookProxy.multiCollExpFn;
    this.exp_obj = this.root_exp = new StructuralExp(formulaProxy);  // 封装公式实例

  }

  parseExpression() {

  }

}
