// 这里需要把公式解析做对

var formulajs = require('../../src/calc/expression_fn');
var {calc} = require('../../src/calc');
var assert = require('assert');
describe('expression_fn integration', function() {
  describe('calculateWorkBook.import_functions()', function() {
    it('minus', function() {
      calc.import_functions(formulajs);
      var workbook = {};
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
});
