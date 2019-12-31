import { AA, RANG_REF, SINGLE_REF } from '../calc_utils/config';
import {
  AARangeRefer,
  RangeRefer,
  SingleCellRefer
} from './syntax_builder_for_ref';
import { BaseSyntaxUnitProxy } from './syntax_builder_core';

/**
 * @property {BigInt} pstID 第几个语法单元
 * @property {String} wholeStr
 */
export class ExpSyntaxUnitProxy extends BaseSyntaxUnitProxy {
  getParser() {
    let aParser;
    if (this.typeArray.isIncludeType(SINGLE_REF)) { // 更精细的解析
      aParser = new SingleCellRefer(this.wholeStr, this.typeArray);
    } else if (this.typeArray.isMarchTypeArray([RANG_REF, AA])) {
      aParser = new AARangeRefer(this.wholeStr, this.typeArray);
    } else if (this.typeArray.isIncludeType(RANG_REF)) {
      aParser = new RangeRefer(this.wholeStr, this.typeArray);
    } else {
      return null;
    }
    aParser.parseRefString();
    return aParser;
  }

  /**
   * 判定是否是一个引用单元
   * @return {Boolean}
   */
  isReferUnit(){
    return this.typeArray.isIncludeType(SINGLE_REF) ||  this.typeArray.isIncludeType(RANG_REF)
  }
}
