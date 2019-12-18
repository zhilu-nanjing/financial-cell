import assert from 'assert'
import { Calc } from '../../src/calc/calc_cmd/calc';
import {easyCalcWorkbook} from '../../src/calc/calc_cmd/calc';

// todo: 很多函数计算结果都有问题
describe('expression_fn integration', function() {
  describe('calculateWorkBook.import_functions()', function() {
    it('AVERAGE', function() {

      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A29 = {v: 10};
      workbook.Sheets.Sheet1.A30 = {v: 9};
      workbook.Sheets.Sheet1.A31 = {v: 27};
      workbook.Sheets.Sheet1.A32 = {v: 2};
      workbook.Sheets.Sheet1.A28 = {v: 11}; // formula的计算顺序与初次赋值时间从晚向前
      workbook.Sheets.Sheet1.A5 = {f: '=AVERAGE($A$28:$A$32)'};
      easyCalcWorkbook(workbook);
      assert.equal(workbook.Sheets.Sheet1.A5.v.toNumber(), 11.8);
    });

    it('带比分比的计算', function() {
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A1 = {f: '75.91%'};
      workbook.Sheets.Sheet1.A2 = {f: '=H7*$A$1'};
      workbook.Sheets.Sheet1.H7 = {f: '6753'};
      let calc = new Calc()
      calc.calculateWorkbook(workbook);
      assert.equal(workbook.Sheets.Sheet1.A2.v.toNumber(), 5126.2023);
    });
    it('COUPNCD', function() {

      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A185 = {v: 40568};
      workbook.Sheets.Sheet1.A186 = {v: 40862};
      workbook.Sheets.Sheet1.A187 = {v: 2};
      workbook.Sheets.Sheet1.A188 = {v: 1};
      workbook.Sheets.Sheet1.A11 = {f: '=COUPNCD(A185,A186,A187,A188)'};
      let calc = new Calc()
      calc.calculateWorkbook(workbook);
      // todo: 会报错，不number，可能要修改；对函数要归类，某些函数的所有参数都是数字，这些函数的值会实现转化为数值。
      // todo： 也可以使用类似flask的装饰器语法，来做字符转换
      // 其他函数处理不同类型的时候就要各区所需了
      assert.equal(workbook.Sheets.Sheet1.A11.v.toNumber(), 40678);
    });
    it('COUPNUM', function() {

      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A185 = {v: 40568};
      workbook.Sheets.Sheet1.A186 = {v: 40862};
      workbook.Sheets.Sheet1.A187 = {v: 2};
      workbook.Sheets.Sheet1.A188 = {v: 1};
      workbook.Sheets.Sheet1.A11 = {f: '=COUPNUM(A185,A186,A187,A188)'};
      let calc = new Calc()
      calc.calculateWorkbook(workbook);
      assert.equal(calc.calcWorkbookProxy.getCellPropertyByName("Sheet1","A11", "v").toNumber(), 2);
    });
    it('COUPPCD', function() {

      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A185 = {v: 40568};
      workbook.Sheets.Sheet1.A186 = {v: 40862};
      workbook.Sheets.Sheet1.A187 = {v: 2};
      workbook.Sheets.Sheet1.A188 = {v: 1};
      workbook.Sheets.Sheet1.A11 = {f: '=COUPPCD(A185,A186,A187,A188)'};
      let calc = new Calc()
      calc.calculateWorkbook(workbook);
      assert.equal(calc.calcWorkbookProxy.getCellPropertyByName("Sheet1","A11", "v").toNumber(), 40497);
    });
    it('VDB', function() {

      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.B799 = {v: 2400};
      workbook.Sheets.Sheet1.B800 = {v: 300};
      workbook.Sheets.Sheet1.B801 = {v: 10};
      workbook.Sheets.Sheet1.H811 = {f: '=VDB(B799,B800,B801,0,0.875,1.5)'};
      let calc = new Calc()
      calc.calculateWorkbook(workbook);
      assert.equal(calc.calcWorkbookProxy.getCellPropertyByName("Sheet1","H811", "v").toNumber(), 315);
    });
    it('YIELDDISC', function() {
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.C835 = {v: 39494};
      workbook.Sheets.Sheet1.C836 = {v: 39508};
      workbook.Sheets.Sheet1.C837 = {v: 99.795};
      workbook.Sheets.Sheet1.C838 = {v: 100};
      workbook.Sheets.Sheet1.C839 = {v: 2};
      workbook.Sheets.Sheet1.H845 = {f: '=YIELDDISC(C835,C836,C837,C838,C839)'};
      let calc = new Calc()
      calc.calculateWorkbook(workbook);
      assert.equal(Math.abs(calc.calcWorkbookProxy.getCellPropertyByName("Sheet1","H845", "v")-0.0528) < 0.01, true);

    });
    it('FACTORIAL', function() {

      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.C835 = {v: 10};
      workbook.Sheets.Sheet1.H845 = {f: '=FACTORIAL(C835)'};
      let calc = new Calc()
      calc.calculateWorkbook(workbook);
      assert.equal(workbook.Sheets.Sheet1.H845.v, 3628800);
      assert.equal(calc.calcWorkbookProxy.getCellPropertyByName("Sheet1","H845", "v"), 3628800);
    });
    it('ABS', function() {

      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A1 = {v: -10};
      workbook.Sheets.Sheet1.A2 = {f: '=ABS(A1)'};
      easyCalcWorkbook(workbook);
      assert.equal(workbook.Sheets.Sheet1.A2.v.toNumber(), 10);

    });

    it('PRICE', function() { // 等到旺旺修复

      let workbook = {};
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
      let calc = new Calc()
      calc.calculateWorkbook(workbook);
      assert.equal(Math.abs(calc.calcWorkbookProxy.getCellPropertyByName("Sheet1","H614", "v")-94.634361) < 0.01, true);
    });
  });
});
