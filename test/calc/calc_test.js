var formulajs = require('../../src/calc/formulajs');
var CALC = require('../../src/calc');
var assert = require('assert');
describe('formulajs integration', function() {
  describe('calculateWorkBook.import_functions()', function() {
    it('AVERAGE', function() {
      CALC.import_functions(formulajs);
      var workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A29 = {v: 10};
      workbook.Sheets.Sheet1.A30 = {v: 9};
      workbook.Sheets.Sheet1.A31 = {v: 27};
      workbook.Sheets.Sheet1.A32 = {v: 2, f: ""};
      workbook.Sheets.Sheet1.A5 = {f: '=AVERAGE($A$28:$A$32)'};
      workbook.Sheets.Sheet1.A28 = {f: '=1+A29'}; // formula的计算顺序与初次赋值时间从晚向前

      CALC.calculateWorkBook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v);
      assert.equal(workbook.Sheets.Sheet1.A5.v, 11.8);
    });
    it('AVERAGE_ERROR', function() { // 应该出现循环依赖的错误
      CALC.import_functions(formulajs);
      var workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A29 = {v: 10};
      workbook.Sheets.Sheet1.A30 = {v: 9};
      workbook.Sheets.Sheet1.A31 = {v: 27};
      workbook.Sheets.Sheet1.A32 = {v: 2};
      workbook.Sheets.Sheet1.A5 = {f: '=AVERAGE($A$28:$A$32)'};
      workbook.Sheets.Sheet1.A28 = {f: '=A5+A29'}; // formula的计算顺序与初次赋值时间从晚向前
      CALC.calculateWorkBook(workbook);
      assert.equal(workbook.Sheets.Sheet1.A5.w, "#CIRCULA!");
    });

    it('-', function() {
      CALC.import_functions(formulajs);
      var workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.H614 = {f: '=2-1'};
      CALC.calculateWorkBook(workbook);
      console.log(workbook.Sheets.Sheet1.H614.v);
    });
    it('COUPDAYBS', function() {
      CALC.import_functions(formulajs);
      var workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A185 = {v: 40568};
      workbook.Sheets.Sheet1.A186 = {v: 40862};
      workbook.Sheets.Sheet1.A187 = {v: 2};
      workbook.Sheets.Sheet1.A188 = {v: 1};
      workbook.Sheets.Sheet1.A11 = {f: '=COUPDAYBS(A185,A186,A187,A188)'};
      CALC.calculateWorkBook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v);
      assert.equal(workbook.Sheets.Sheet1.A11.v, 71);
    });
    it('COUPDAYS', function() {
      CALC.import_functions(formulajs);
      var workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A185 = {v: 40568};
      workbook.Sheets.Sheet1.A186 = {v: 40862};
      workbook.Sheets.Sheet1.A187 = {v: 2};
      workbook.Sheets.Sheet1.A188 = {v: 1};
      workbook.Sheets.Sheet1.A11 = {f: '=COUPDAYS(A185,A186,A187,A188)'};
      CALC.calculateWorkBook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v);
      assert.equal(workbook.Sheets.Sheet1.A11.v, 181);
    });
    it('COUPDAYSNC', function() {
      CALC.import_functions(formulajs);
      var workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A185 = {v: 40568};
      workbook.Sheets.Sheet1.A186 = {v: 40862};
      workbook.Sheets.Sheet1.A187 = {v: 2};
      workbook.Sheets.Sheet1.A188 = {v: 1};
      workbook.Sheets.Sheet1.A11 = {f: '=COUPDAYSNC(A185,A186,A187,A188)'};
      CALC.calculateWorkBook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v);
      assert.equal(workbook.Sheets.Sheet1.A11.v, 110);
    });
    it('COUPNCD', function() {
      CALC.import_functions(formulajs);
      var workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A185 = {v: 40568};
      workbook.Sheets.Sheet1.A186 = {v: 40862};
      workbook.Sheets.Sheet1.A187 = {v: 2};
      workbook.Sheets.Sheet1.A188 = {v: 1};
      workbook.Sheets.Sheet1.A11 = {f: '=COUPNCD(A185,A186,A187,A188)'};
      CALC.calculateWorkBook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v);
    });
    it('COUPNUM', function() {
      CALC.import_functions(formulajs);
      var workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A185 = {v: 40568};
      workbook.Sheets.Sheet1.A186 = {v: 40862};
      workbook.Sheets.Sheet1.A187 = {v: 2};
      workbook.Sheets.Sheet1.A188 = {v: 1};
      workbook.Sheets.Sheet1.A11 = {f: '=COUPNUM(A185,A186,A187,A188)'};
      CALC.calculateWorkBook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v);
      assert.equal(workbook.Sheets.Sheet1.A11.v, 2);
    });
    it('COUPPCD', function() {
      CALC.import_functions(formulajs);
      var workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A185 = {v: 40568};
      workbook.Sheets.Sheet1.A186 = {v: 40862};
      workbook.Sheets.Sheet1.A187 = {v: 2};
      workbook.Sheets.Sheet1.A188 = {v: 1};
      workbook.Sheets.Sheet1.A11 = {f: '=COUPPCD(A185,A186,A187,A188)'};
      CALC.calculateWorkBook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v);
    });
    it('VDB', function() {
      CALC.import_functions(formulajs);
      var workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.B799 = {v: 2400};
      workbook.Sheets.Sheet1.B800 = {v: 300};
      workbook.Sheets.Sheet1.B801 = {v: 10};
      workbook.Sheets.Sheet1.H811 = {f: '=VDB(B799,B800,B801,0,0.875,1.5)'};
      CALC.calculateWorkBook(workbook);
      console.log(workbook.Sheets.Sheet1.H811.v);
      assert.equal(workbook.Sheets.Sheet1.H811.v, 315);
    });
    it('YIELDDISC', function() {
      CALC.import_functions(formulajs);
      var workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.C835 = {v: 39494};
      workbook.Sheets.Sheet1.C836 = {v: 39508};
      workbook.Sheets.Sheet1.C837 = {v: 99.795};
      workbook.Sheets.Sheet1.C838 = {v: 100};
      workbook.Sheets.Sheet1.C839 = {v: 2};
      workbook.Sheets.Sheet1.H845 = {f: '=YIELDDISC(C835,C836,C837,C838,C839)'};
      CALC.calculateWorkBook(workbook);
      console.log(workbook.Sheets.Sheet1.H845.v);
      assert(Math.abs(workbook.Sheets.Sheet1.H845.v-0.0528)<0.01);
    });
    it('FACTORIAL', function() {
      CALC.import_functions(formulajs);
      var workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.C835 = {v: 10};
      workbook.Sheets.Sheet1.H845 = {f: '=FACTORIAL(C835)'};
      CALC.calculateWorkBook(workbook);
      console.log(workbook.Sheets.Sheet1.H845.v);
      assert.equal(workbook.Sheets.Sheet1.H845.v, 3628800);
    });
    it('PRICE', function() {
      CALC.import_functions(formulajs);
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
      CALC.calculateWorkBook(workbook);
      console.log(workbook.Sheets.Sheet1.H614.v);
    });
    it('subtractDays', function() {
      CALC.import_functions(formulajs);
      var workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A1 = {f: 'asdfasf'}; // 没有带等号的
      workbook.Sheets.Sheet1.A2 = {f: 'asdf-as'}; // 没有带等号，有减号
      workbook.Sheets.Sheet1.A3 = {f: 'asdf+as'}; // 没有带等号，有加号
      CALC.calculateWorkBook(workbook);
      console.log(workbook.Sheets.Sheet1.H614.v);
      assert.equal(workbook.Sheets.Sheet1.H614.v, "asdf-as");
    });
  });
});
