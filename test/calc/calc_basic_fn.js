var formulajs = require('../../src/calc/expression_fn');
var {calc} = require('../../src/calc');
var assert = require('assert');
describe('expression_fn integration', function() {
  describe('calculateWorkBook.import_functions()', function() {
    it('AVERAGE', function() {
      calc.import_functions(formulajs);
      var workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A29 = {v: 10};
      workbook.Sheets.Sheet1.A30 = {v: 9};
      workbook.Sheets.Sheet1.A31 = {v: 27};
      workbook.Sheets.Sheet1.A32 = {v: 2};
      workbook.Sheets.Sheet1.A5 = {f: '=AVERAGE($A$28:$A$32)'};
      workbook.Sheets.Sheet1.A28 = {f: '=1+A29'}; // formula的计算顺序与初次赋值时间从晚向前

      calc.calculateWorkBook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v);
      assert.equal(workbook.Sheets.Sheet1.A5.v, 11.8);
    });
    it('AVERAGE_ERROR', function() { // 应该出现循环依赖的错误
      calc.import_functions(formulajs);
      var workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A29 = {v: 10};
      workbook.Sheets.Sheet1.A30 = {v: 9};
      workbook.Sheets.Sheet1.A31 = {v: 27};
      workbook.Sheets.Sheet1.A32 = {v: 2};
      workbook.Sheets.Sheet1.A5 = {f: '=AVERAGE($A$28:$A$32)'};
      workbook.Sheets.Sheet1.A28 = {f: '=A5+A29'}; // formula的计算顺序与初次赋值时间从晚向前
      calc.calculateWorkBook(workbook);
      assert.equal(workbook.Sheets.Sheet1.A5.w, "#CIRCULA!");
    });

    it('-', function() {
      calc.import_functions(formulajs);
      var workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.H614 = {f: '=2-1'};
      calc.calculateWorkBook(workbook);
      console.log(workbook.Sheets.Sheet1.H614.v);
    });
    it('COUPDAYBS', function() {
      calc.import_functions(formulajs);
      var workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A185 = {v: 40568};
      workbook.Sheets.Sheet1.A186 = {v: 40862};
      workbook.Sheets.Sheet1.A187 = {v: 2};
      workbook.Sheets.Sheet1.A188 = {v: 1};
      workbook.Sheets.Sheet1.A11 = {f: '=COUPDAYBS(A185,A186,A187,A188)'};
      calc.calculateWorkBook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v);
      assert.equal(workbook.Sheets.Sheet1.A11.v, 71);
    });
    it('COUPDAYS', function() {
      calc.import_functions(formulajs);
      var workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A185 = {v: 40568};
      workbook.Sheets.Sheet1.A186 = {v: 40862};
      workbook.Sheets.Sheet1.A187 = {v: 2};
      workbook.Sheets.Sheet1.A188 = {v: 1};
      workbook.Sheets.Sheet1.A11 = {f: '=COUPDAYS(A185,A186,A187,A188)'};
      calc.calculateWorkBook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v);
      assert.equal(workbook.Sheets.Sheet1.A11.v, 181);
    });
    it('COUPDAYSNC', function() {
      calc.import_functions(formulajs);
      var workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A185 = {v: 40568};
      workbook.Sheets.Sheet1.A186 = {v: 40862};
      workbook.Sheets.Sheet1.A187 = {v: 2};
      workbook.Sheets.Sheet1.A188 = {v: 1};
      workbook.Sheets.Sheet1.A11 = {f: '=COUPDAYSNC(A185,A186,A187,A188)'};
      calc.calculateWorkBook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v);
      assert.equal(workbook.Sheets.Sheet1.A11.v, 110);
    });
    it('COUPNCD', function() {
      calc.import_functions(formulajs);
      var workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A185 = {v: 40568};
      workbook.Sheets.Sheet1.A186 = {v: 40862};
      workbook.Sheets.Sheet1.A187 = {v: 2};
      workbook.Sheets.Sheet1.A188 = {v: 1};
      workbook.Sheets.Sheet1.A11 = {f: '=COUPNCD(A185,A186,A187,A188)'};
      calc.calculateWorkBook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v);
    });
    it('COUPNUM', function() {
      calc.import_functions(formulajs);
      var workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A185 = {v: 40568};
      workbook.Sheets.Sheet1.A186 = {v: 40862};
      workbook.Sheets.Sheet1.A187 = {v: 2};
      workbook.Sheets.Sheet1.A188 = {v: 1};
      workbook.Sheets.Sheet1.A11 = {f: '=COUPNUM(A185,A186,A187,A188)'};
      calc.calculateWorkBook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v);
      assert.equal(workbook.Sheets.Sheet1.A11.v, 2);
    });
    it('COUPPCD', function() {
      calc.import_functions(formulajs);
      var workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A185 = {v: 40568};
      workbook.Sheets.Sheet1.A186 = {v: 40862};
      workbook.Sheets.Sheet1.A187 = {v: 2};
      workbook.Sheets.Sheet1.A188 = {v: 1};
      workbook.Sheets.Sheet1.A11 = {f: '=COUPPCD(A185,A186,A187,A188)'};
      calc.calculateWorkBook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v);
    });
    it('VDB', function() {
      calc.import_functions(formulajs);
      var workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.B799 = {v: 2400};
      workbook.Sheets.Sheet1.B800 = {v: 300};
      workbook.Sheets.Sheet1.B801 = {v: 10};
      workbook.Sheets.Sheet1.H811 = {f: '=VDB(B799,B800,B801,0,0.875,1.5)'};
      calc.calculateWorkBook(workbook);
      console.log(workbook.Sheets.Sheet1.H811.v);
      assert.equal(workbook.Sheets.Sheet1.H811.v, 315);
    });
    it('YIELDDISC', function() {
      calc.import_functions(formulajs);
      var workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.C835 = {v: 39494};
      workbook.Sheets.Sheet1.C836 = {v: 39508};
      workbook.Sheets.Sheet1.C837 = {v: 99.795};
      workbook.Sheets.Sheet1.C838 = {v: 100};
      workbook.Sheets.Sheet1.C839 = {v: 2};
      workbook.Sheets.Sheet1.H845 = {f: '=YIELDDISC(C835,C836,C837,C838,C839)'};
      calc.calculateWorkBook(workbook);
      console.log(workbook.Sheets.Sheet1.H845.v);
      assert(Math.abs(workbook.Sheets.Sheet1.H845.v-0.0528)<0.01);
    });
    it('FACTORIAL', function() {
      calc.import_functions(formulajs);
      var workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.C835 = {v: 10};
      workbook.Sheets.Sheet1.H845 = {f: '=FACTORIAL(C835)'};
      calc.calculateWorkBook(workbook);
      console.log(workbook.Sheets.Sheet1.H845.v);
      assert.equal(workbook.Sheets.Sheet1.H845.v, 3628800);
    });
    it('PRICE', function() {
      calc.import_functions(formulajs);
      var workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A607 = {v: 39493};
      workbook.Sheets.Sheet1.A608 = {v: 43054};
      workbook.Sheets.Sheet1.A609 = {v: 0.0575};
      workbook.Sheets.Sheet1.A610 = {v: 0.065};
      workbook.Sheets.Sheet1.A611 = {v: 100};
      workbook.Sheets.Sheet1.A612 = {v: 2};
      workbook.Sheets.Sheet1.A613 = {v: 0};
      workbook.Sheets.Sheet1.H614 = {f: '=PRICE(A607,A608,A609,A610,A611,A612,A613)'};
      calc.calculateWorkBook(workbook);
      console.log(workbook.Sheets.Sheet1.H614.v);
    });
  });
});
