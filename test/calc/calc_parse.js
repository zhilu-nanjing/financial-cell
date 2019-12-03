// 这里需要把公式解析做对
import * as formulajs from '../../src/calc/expression_fn/normal_fn';
import { Calc, calc } from '../../src/calc';
import assert from 'assert'
describe('expression_fn integration', function() {
  describe('calculateWorkBook.import_functions()', function() {
    it('minus', function() {
      calc.import_functions(formulajs);
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.B1 = {f: '=FLOOR.MATH(-8.1,2)'}; // 负号运算符
      workbook.Sheets.Sheet1.A1 = {f: 'asdfasf'}; // 没有带等号的
      workbook.Sheets.Sheet1.A2 = {f: 'asdf-as'}; // 没有带等号，有减号
      workbook.Sheets.Sheet1.A3 = {f: 'asdf+as'}; // 没有带等号，有加号
      calc.calculateWorkBook(workbook);
      console.log(workbook.Sheets.Sheet1.H614.v);
      assert.equal(workbook.Sheets.Sheet1.H614.v, "asdf-as");
    });
  });
  it('circular', function() { // 应该出现循环依赖的错误
    let workbook = {};
    workbook.Sheets = {};
    workbook.Sheets.Sheet1 = {};
    workbook.Sheets.Sheet1.A29 = {v: 10};
    workbook.Sheets.Sheet1.A30 = {v: 9};
    workbook.Sheets.Sheet1.A31 = {v: 27};
    workbook.Sheets.Sheet1.A32 = {v: 2};
    workbook.Sheets.Sheet1.A5 = {f: '=AVERAGE($A$28:$A$32)'};
    workbook.Sheets.Sheet1.A28 = {f: '=A5+A29'}; // formula的计算顺序与初次赋值时间从晚向前
    let calc = new Calc()
    calc.calculateWorkbook(workbook);
    assert.equal(workbook.Sheets.Sheet1.A5.w, "#CIRCULA!");
  });

});
