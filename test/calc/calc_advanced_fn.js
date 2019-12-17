import assert from 'assert'
import { Calc } from '../../src/calc/calc_cmd/calc';
// todo: 除了旺旺那边的20个函数以外，其他的函数都应该写对
describe('expression_fn integration', function() {
  describe('calculateWorkbook.import_functions()', function() {
    it('xlfn', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A11 = {f: '=_XLFN.FLOOR.MATH(6.7)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v);
      assert.equal(workbook.Sheets.Sheet1.A11.v, 6);
    });
    it('COUPDAYBS', function() {

      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A185 = {v: 40568};
      workbook.Sheets.Sheet1.A186 = {v: 40862};
      workbook.Sheets.Sheet1.A187 = {v: 2};
      workbook.Sheets.Sheet1.A188 = {v: 1};
      workbook.Sheets.Sheet1.A11 = {f: '=COUPDAYBS(A185,A186,A187,A188)'};
      let calc = new Calc()
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v);
      assert.equal(workbook.Sheets.Sheet1.A11.v, 71);
    });
    it('COUPDAYS', function() {

      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A185 = {v: 40568};
      workbook.Sheets.Sheet1.A186 = {v: 40862};
      workbook.Sheets.Sheet1.A187 = {v: 2};
      workbook.Sheets.Sheet1.A188 = {v: 1};
      workbook.Sheets.Sheet1.A11 = {f: '=COUPDAYS(A185,A186,A187,A188)'};
      let calc = new Calc()
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v);
      assert.equal(workbook.Sheets.Sheet1.A11.v, 181);
    });
    it('COUPDAYSNC', function() {

      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A185 = {v: 40568};
      workbook.Sheets.Sheet1.A186 = {v: 40862};
      workbook.Sheets.Sheet1.A187 = {v: 2};
      workbook.Sheets.Sheet1.A188 = {v: 1};
      workbook.Sheets.Sheet1.A11 = {f: '=COUPDAYSNC(A185,A186,A187,A188)'};
      let calc = new Calc()
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v);
      assert.equal(workbook.Sheets.Sheet1.A11.v, 110);
    });

    it('FLOOR.MATH', function() { // todo: 修复其中减法的错误
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A11 = {f: '=FLOOR.MATH(24.3,5)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v);
      assert.equal(workbook.Sheets.Sheet1.A11.v, 20);
      workbook.Sheets.Sheet1.A11 = {f: '=FLOOR.MATH(6.7)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v);
      assert.equal(workbook.Sheets.Sheet1.A11.v, 6);
      workbook.Sheets.Sheet1.A11 = {f: '=FLOOR.MATH(-8.1,2)'}; // 有负号
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v);
      assert.equal(workbook.Sheets.Sheet1.A11.v, -10);
      workbook.Sheets.Sheet1.A11 = {f: '=FLOOR.MATH(-5.5,2,-1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v);
      assert.equal(workbook.Sheets.Sheet1.A11.v, -4);
    });
    it('SUMIFS', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet2 = {};
      workbook.Sheets.Sheet1.A731 = {v: 5};
      workbook.Sheets.Sheet1.A732 = {v: 4};
      workbook.Sheets.Sheet1.A733 = {v: 15};
      workbook.Sheets.Sheet1.A734 = {v: 3};
      workbook.Sheets.Sheet1.A735 = {v: 22};
      workbook.Sheets.Sheet1.A736 = {v: 1.2};
      workbook.Sheets.Sheet1.A737 = {v: 10};
      workbook.Sheets.Sheet1.A738 = {v: 33};

      workbook.Sheets.Sheet1.B731 = {v: "苹果"};
      workbook.Sheets.Sheet1.B732 = {v: "苹果"};
      workbook.Sheets.Sheet1.B733 = {v: "香梨"};
      workbook.Sheets.Sheet1.B734 = {v:  "香梨"};
      workbook.Sheets.Sheet1.B735 = {v:  "香蕉"};
      workbook.Sheets.Sheet1.B736 = {v:  "香蕉"};
      workbook.Sheets.Sheet1.B737 = {v:  "胡萝卜"};
      workbook.Sheets.Sheet1.B738 = {v:  "胡萝卜"};

      workbook.Sheets.Sheet1.C731 = {v: "卢宁"};
      workbook.Sheets.Sheet1.C732 = {v: "Sarah"};
      workbook.Sheets.Sheet1.C733 = {v: "卢宁"};
      workbook.Sheets.Sheet1.C734 = {v:  "Sarah"};
      workbook.Sheets.Sheet1.C735 = {v: "卢宁"};
      workbook.Sheets.Sheet1.C736 = {v: "Sarah"};
      workbook.Sheets.Sheet1.C737 = {v: "卢宁"};
      workbook.Sheets.Sheet1.C738 = {v:  "Sarah"};
      workbook.Sheets.Sheet1.A11 = {f: '=SUMIFS(A730:A737, B730:B737, "=香*", C730:C737, "卢宁")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 37);
    });

    it('IF', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet2 = {};
      workbook.Sheets.Sheet1.A11 = {f: '=IF(1,2,3)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 2);
      workbook.Sheets.Sheet1.A11 = {f: '=IFERROR(ADD(1,grfe),"计算中有错误")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      workbook.Sheets.Sheet1.A11 = {f: '=IF("牛"="夏","位置","未找到")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, "未找到");
    });



    it('VLOOKUP', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet2 = {};
      workbook.Sheets.Sheet1.A811 = {v: '101'};
      workbook.Sheets.Sheet1.A812 = {v: '102'};
      workbook.Sheets.Sheet1.A813 = {v: '103'};
      workbook.Sheets.Sheet1.A814 = {v: '104'};
      workbook.Sheets.Sheet1.A815 = {v: '105'};
      workbook.Sheets.Sheet1.A816 = {v: '106'};

      workbook.Sheets.Sheet1.B811 = {v: '康'};
      workbook.Sheets.Sheet1.B812 = {v: '袁'};
      workbook.Sheets.Sheet1.B813 = {v: '牛'};
      workbook.Sheets.Sheet1.B814 = {v: '宋'};
      workbook.Sheets.Sheet1.B815 = {v: '谢'};
      workbook.Sheets.Sheet1.B816 = {v: '廖'};

      workbook.Sheets.Sheet1.C811 = {v: '霓'};
      workbook.Sheets.Sheet1.C812 = {v: '洛'};
      workbook.Sheets.Sheet1.C813 = {v: '娇'};
      workbook.Sheets.Sheet1.C814 = {v: '臻'};
      workbook.Sheets.Sheet1.C815 = {v: '德'};
      workbook.Sheets.Sheet1.C816 = {v: '磊'};

      workbook.Sheets.Sheet1.D811 = {v: '销售代表'};
      workbook.Sheets.Sheet1.D812 = {v: '销售副总裁'};
      workbook.Sheets.Sheet1.D813 = {v: '销售代表'};
      workbook.Sheets.Sheet1.D814 = {v: '销售代表'};
      workbook.Sheets.Sheet1.D815 = {v: '销售经理'};
      workbook.Sheets.Sheet1.D816 = {v: '销售代表'};

      workbook.Sheets.Sheet1.E811 = {v: '1968/12/8'};
      workbook.Sheets.Sheet1.E812 = {v: '1962/2/19'};
      workbook.Sheets.Sheet1.E813 = {v: '1963/8/30'};
      workbook.Sheets.Sheet1.E814 = {v: '1958/9/19'};
      workbook.Sheets.Sheet1.E815 = {v: '1955/3/4'};
      workbook.Sheets.Sheet1.E816 = {v: '1953/7/2'};
      workbook.Sheets.Sheet1.A11 = {f: '=VLOOKUP(B812,B811:E816,2,FALSE)'};
      calc.calculateWorkbook(workbook);
      assert.equal(workbook.Sheets.Sheet1.A11.v, '洛');
      console.log(workbook.Sheets.Sheet1.A11.v)
      workbook.Sheets.Sheet1.A11 = {f: '=VLOOKUP(102,A811:C816,2,FALSE)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, '袁');
      workbook.Sheets.Sheet1.A11 = {f: '=IF(VLOOKUP(103,A811:E816,2,FALSE)="夏","位置","未找到")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, '未找到');
    });


    it('ACCRINT', function() {//js-spreadsheet调用
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      // name2SheetProxy.Sheets.Sheet1.A5 = {f: '=ACCRINT(39508,39691,39569,0.1,1000,2,0)'};
      // solveExpression.calculateWorkbook(name2SheetProxy);
      // console.log(name2SheetProxy.Sheets.Sheet1.A5.v)
      // assert(Math.abs(name2SheetProxy.Sheets.Sheet1.A5.v-16.666667)<0.00001);
      workbook.Sheets.Sheet1.A5 = {f: '=ACCRINT(DATE(2008,3,5),39691,39569,0.1,1000,2,0,FALSE)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.A5.v-15.555556)<0.00001);
      workbook.Sheets.Sheet1.A5 = {f: '=ACCRINT(DATE(2008, 4, 5),39691,39569,0.1,1000,2,0, TRUE)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.A5.v-7.2222222)<0.00001);
    });

    it('ACCRINTM', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A5 = {f: '=ACCRINTM(39539,39614,0.1,1000,3)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.A5.v-20.54794521)<0.00001);
    });

    it('ACOS', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A5 = {f: '=ACOS(-0.5)'};
      calc.calculateWorkbook(workbook);
      // console.log(name2SheetProxy.Sheets.Sheet1.A5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.A5.v-2.094395102)<0.00001);
      workbook.Sheets.Sheet1.A5 = {f: '=ACOS(-0.5)*180/PI()'};
      calc.calculateWorkbook(workbook);
      // console.log(name2SheetProxy.Sheets.Sheet1.A5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.A5.v-120)<0.00001);
      workbook.Sheets.Sheet1.A5 = {f: '=DEGREES(ACOS(-0.5))'};
      calc.calculateWorkbook(workbook);
      // console.log(name2SheetProxy.Sheets.Sheet1.A5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.A5.v-120)<0.00001);
    });


    it('AGGREGATE', function() {//未实现
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A13 = {v: '#DIV/0!'};
      workbook.Sheets.Sheet1.A14 = {v: 72};
      workbook.Sheets.Sheet1.A15 = {v: '大约'};
      workbook.Sheets.Sheet1.A16 = {v: '#NUM!'};
      workbook.Sheets.Sheet1.A17 = {v: '之前'};
      workbook.Sheets.Sheet1.A18 = {v: 96};
      workbook.Sheets.Sheet1.A19 = {v: 32};
      workbook.Sheets.Sheet1.A20 = {v: 81};
      workbook.Sheets.Sheet1.A21 = {v: 33};
      workbook.Sheets.Sheet1.A22 = {v: 53};
      workbook.Sheets.Sheet1.A23 = {v: 34};
      workbook.Sheets.Sheet1.B13 = {v: 82};
      workbook.Sheets.Sheet1.B14 = {v: 65};
      workbook.Sheets.Sheet1.B15 = {v: 95};
      workbook.Sheets.Sheet1.B16 = {v: 63};
      workbook.Sheets.Sheet1.B17 = {v: 53};
      workbook.Sheets.Sheet1.B18 = {v: 71};
      workbook.Sheets.Sheet1.B19 = {v: 55};
      workbook.Sheets.Sheet1.B20 = {v: 83};
      workbook.Sheets.Sheet1.B21 = {v: 100};
      workbook.Sheets.Sheet1.B22 = {v: 91};
      workbook.Sheets.Sheet1.B23 = {v: 89};
      // name2SheetProxy.Sheets.Sheet1.A5 = {f: '=AGGREGATE(14, 6, $A$13:$A$23, 3)'};
      // solveExpression.calculateWorkbook(name2SheetProxy);
      // console.log(name2SheetProxy.Sheets.Sheet1.A5.v)
      // assert.equal(name2SheetProxy.Sheets.Sheet1.A5.v, 72);
      // name2SheetProxy.Sheets.Sheet1.A5 = {f: '=AGGREGATE(4, 6, $A$13:$A$23)'};
      // solveExpression.calculateWorkbook(name2SheetProxy);
      // console.log(name2SheetProxy.Sheets.Sheet1.A5.v)
      // assert.equal(name2SheetProxy.Sheets.Sheet1.A5.v, 96);
      workbook.Sheets.Sheet1.A5 = {f: '=AGGREGATE(15, 6, $A$13:$A$23)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      workbook.Sheets.Sheet1.A5 = {f: '=AGGREGATE(12, 6, $A$13:$A$23, $B$13:$B$23)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert.equal(workbook.Sheets.Sheet1.A5.v, 71.5);
      workbook.Sheets.Sheet1.A5 = {f: '=MAX($A$13:$A$14)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert.equal(workbook.Sheets.Sheet1.A5.v, '#DIV/0!');
    });


    it('AMORDEGRC', function() {//未实现
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A5 = {f: '=AMORDEGRC(2400,39679,39813,300,1,0.15,1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert.equal(workbook.Sheets.Sheet1.A5.v, 776);
    });

    it('ARABIC', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A25 = {v: 'MCXII'};
      workbook.Sheets.Sheet1.A5 = {f: '=ARABIC($A$25)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert.equal(workbook.Sheets.Sheet1.A5.v, 1112);
    });

    it('ASC', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A5 = {f: '=ASC(EXCEL)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert.equal(workbook.Sheets.Sheet1.A5.v, "EXCEL");
      workbook.Sheets.Sheet1.A5 = {f: '=ASC(23423)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert.equal(workbook.Sheets.Sheet1.A5.v, "23423");
    });
    it('AVERAGE', function() {//计算错误
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A28 = {v: 10};
      workbook.Sheets.Sheet1.B28 = {v: 15};
      workbook.Sheets.Sheet1.C28 = {v: 32};
      workbook.Sheets.Sheet1.A29 = {v: 7};
      workbook.Sheets.Sheet1.A30 = {v: 9};
      workbook.Sheets.Sheet1.A31 = {v: 27};
      workbook.Sheets.Sheet1.A32 = {v: 2};
      workbook.Sheets.Sheet1.A5 = {f: '=AVERAGE($A$28:$A$32)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert.equal(workbook.Sheets.Sheet1.A5.v, 11);
      workbook.Sheets.Sheet1.A5 = {f: '=AVERAGE($A$28:$A$32, 5)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert.equal(workbook.Sheets.Sheet1.A5.v, 10);
      workbook.Sheets.Sheet1.A5 = {f: '=AVERAGE($A$28:$C$28)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert.equal(workbook.Sheets.Sheet1.A5.v, 19);
    });
    it('AVERAGEA', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A35 = {v: 4};
      workbook.Sheets.Sheet1.A36 = {v: 2};
      workbook.Sheets.Sheet1.A37 = {v: 0};
      workbook.Sheets.Sheet1.A38 = {v: 10};
      workbook.Sheets.Sheet1.A40 = {v: 10};
      workbook.Sheets.Sheet1.A5 = {f: '=AVERAGEA($A$35:$A$39)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert.equal(workbook.Sheets.Sheet1.A5.v, 4);
      workbook.Sheets.Sheet1.A5 = {f: '=AVERAGEA($A$35:$A$38,$A$40)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert.equal(workbook.Sheets.Sheet1.A5.v, 5.2);
    });
    it('AVERAGEIF', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A42 = {v: 100000};
      workbook.Sheets.Sheet1.A43 = {v: 200000};
      workbook.Sheets.Sheet1.A44 = {v: 300000};
      workbook.Sheets.Sheet1.A45 = {v: 400000};
      workbook.Sheets.Sheet1.A48 = {v: '东部'};
      workbook.Sheets.Sheet1.A49 = {v: '西部'};
      workbook.Sheets.Sheet1.A50 = {v: '北部'};
      workbook.Sheets.Sheet1.A51 = {v: '南部（新办事处）'};
      workbook.Sheets.Sheet1.A52 = {v: '中西部'};
      workbook.Sheets.Sheet1.B48 = {v: 45678};
      workbook.Sheets.Sheet1.B49 = {v: 23789};
      workbook.Sheets.Sheet1.B50 = {v: -4789};
      workbook.Sheets.Sheet1.B51 = {v: 0};
      workbook.Sheets.Sheet1.B52 = {v: 9678};
      workbook.Sheets.Sheet1.A5 = {f: '=AVERAGEIF($A$42:$A$45,"<95000")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      workbook.Sheets.Sheet1.A5 = {f: '=AVERAGEIF($A$48:$A$52,"=*西部",$B$48:$B$52)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert.equal(workbook.Sheets.Sheet1.A5.v, '16733.5');
      workbook.Sheets.Sheet1.A5 = {f: '=AVERAGEIF($A$48:$A$52,"<>*（新办事处）",$B$48:$B$52)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert.equal(workbook.Sheets.Sheet1.A5.v, '18589');
    });

    it('AVERAGEIFS', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.B55 = {v: '小测验'};
      workbook.Sheets.Sheet1.B56 = {v: '成绩'};
      workbook.Sheets.Sheet1.B57 = {v: 75};
      workbook.Sheets.Sheet1.B58 = {v: 94};
      workbook.Sheets.Sheet1.D55 = {v: '小测验'};
      workbook.Sheets.Sheet1.D56 = {v: '成绩'};
      workbook.Sheets.Sheet1.D57 = {v: 87};
      workbook.Sheets.Sheet1.D58 = {v: 88};

      workbook.Sheets.Sheet1.B63 = {v: 230000};
      workbook.Sheets.Sheet1.B64 = {v: 197000};
      workbook.Sheets.Sheet1.B65 = {v: 345678};
      workbook.Sheets.Sheet1.B66 = {v: 321900};
      workbook.Sheets.Sheet1.B67 = {v: 450000};
      workbook.Sheets.Sheet1.B68 = {v: 395000};
      workbook.Sheets.Sheet1.C63 = {v: '辽阳'};
      workbook.Sheets.Sheet1.C64 = {v: '邯郸'};
      workbook.Sheets.Sheet1.C65 = {v: '邯郸'};
      workbook.Sheets.Sheet1.C66 = {v: '辽阳'};
      workbook.Sheets.Sheet1.C67 = {v: '邯郸'};
      workbook.Sheets.Sheet1.C68 = {v: '邯郸'};
      workbook.Sheets.Sheet1.D63 = {v: 3};
      workbook.Sheets.Sheet1.D64 = {v: 2};
      workbook.Sheets.Sheet1.D65 = {v: 4};
      workbook.Sheets.Sheet1.D66 = {v: 2};
      workbook.Sheets.Sheet1.D67 = {v: 5};
      workbook.Sheets.Sheet1.D68 = {v: 4};
      workbook.Sheets.Sheet1.E63 = {v: '否'};
      workbook.Sheets.Sheet1.E64 = {v: '是'};
      workbook.Sheets.Sheet1.E65 = {v: '是'};
      workbook.Sheets.Sheet1.E66 = {v: '是'};
      workbook.Sheets.Sheet1.E67 = {v: '是'};
      workbook.Sheets.Sheet1.E68 = {v: '否'};
      workbook.Sheets.Sheet1.A5 = {f: '=AVERAGEIFS($B$55:$B$58, $B$55:$B$58, ">70", $B$55:$B$58, "<90")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert.equal(workbook.Sheets.Sheet1.A5.v, 75);
      workbook.Sheets.Sheet1.A5 = {f: '=AVERAGEIFS($C$55:$C$58, $C$55:$C$58, ">95")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      workbook.Sheets.Sheet1.A5 = {f: '=AVERAGEIFS($D$55:$D$58, $D$55:$D$58, "<>INCOMPLETE", $D$55:$D$58, ">80")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert.equal(workbook.Sheets.Sheet1.A5.v, 87.5);
      workbook.Sheets.Sheet1.A5 = {f: '=AVERAGEIFS($B$63:$B$68, $C$63:$C$68, "邯郸", $D$63:$D$68, ">2",$E$63:$E$68, "是")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert.equal(workbook.Sheets.Sheet1.A5.v, 397839);
      workbook.Sheets.Sheet1.A5 = {f: '=AVERAGEIFS($B$63:$B$68, $C$63:$C$68, "辽阳", $D$63:$D$68, "<=3",$E$63:$E$68, "否")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert.equal(workbook.Sheets.Sheet1.A5.v, 230000);
    });

    it('BAHTTEXT', function() {//未实现
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A5 = {f: '=BAHTTEXT(1234)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert.equal(workbook.Sheets.Sheet1.A5.v, '#DIV/0!');
    });

    it('BETA.DIST', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A5 = {f: '=BETA.DIST(2,8,10,FALSE,1,3)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.A5.v-1.4837646)<0.00001);
    });

    it('BINOM.DIST', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A5 = {f: '=BINOM.DIST(6,10,0.5,FALSE)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.A5.v-0.2050781)<0.00001);
    });

    it('BINOMDIST', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A5 = {f: '=BINOMDIST(6,10,0.5,FALSE)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.A5.v-0.2050781)<0.00001);
    });

    it('CEILING', function() {//计算错误
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A5 = {f: '=CEILING(-2.5, -2)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert.equal(workbook.Sheets.Sheet1.A5.v, -4);
    });

    it('CELL', function() {//未实现
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A107 = {v: 75};
      workbook.Sheets.Sheet1.A5 = {f: '=CELL("ROW", $A$107)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert.equal(workbook.Sheets.Sheet1.A5.v, 107);
    });

    it('CHIDIST', function() {//计算错误
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A5 = {f: '=CHIDIST(18.307,10)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.A5.v-0.050000589)<0.00001);
    });

    it('CHIINV', function() {//计算错误
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A5 = {f: '=CHIINV(0.050001,10)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.A5.v-18.306973)<0.00001);
    });

    it('CHOOSE', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A5 = {f: '=CHOOSE(3,"WIDE",115,"WORLD",8)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert.equal(workbook.Sheets.Sheet1.A5.v, 'WORLD');
    });

    it('COLUMN', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=COLUMN()'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 6);
    });

    it('COLUMNS', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=COLUMNS({1,2,3;4,5,6})'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 3);
      workbook.Sheets.Sheet1.F5 = {f: '=COLUMNS($C$1:$E$4)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 3);
    });


    it('COMPLEX', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=COMPLEX(3,4,"J")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '3+4j');
    });


    it('CONCATENATE', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A138 = {v: 'brook trout'};
      workbook.Sheets.Sheet1.A139 = {v: 'species'};
      workbook.Sheets.Sheet1.A140 = {v: '32'};
      workbook.Sheets.Sheet1.F5 = {f: '=CONCATENATE("Stream population for ", A138, " ", A139, " is ", A140, "/mile")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v);
      assert.equal(workbook.Sheets.Sheet1.F5.v, 'Stream population for brook trout species is 32/mile');
    });

    it('CONCATE', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A138 = {v: 'brook trout'};
      workbook.Sheets.Sheet1.A139 = {v: 'species'};
      workbook.Sheets.Sheet1.A140 = {v: '32'};
      workbook.Sheets.Sheet1.F5 = {f: '=CONCATE("dfsd","aaa")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v);
      assert.equal(workbook.Sheets.Sheet1.F5.v, 'dfsdaaa');
    });

    it('CONVERT', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=CONVERT(1, "LBM", "KG")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-0.4535924)<0.00001);//CONVERT(68, "F", "C")
      workbook.Sheets.Sheet1.F5 = {f: '=CONVERT(68, "F", "C")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 20);
      workbook.Sheets.Sheet1.F5 = {f: '=CONVERT(2.5, "FT", "SEC")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      workbook.Sheets.Sheet1.F5 = {f: '=CONVERT(CONVERT(100,"FT","M"),"FT","M")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-9.290304)<0.00001);
    });

    it('COUNT', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A2 = {v: 3};
      workbook.Sheets.Sheet1.A3 = {v: 2};
      workbook.Sheets.Sheet1.A4 = {v: 4};
      workbook.Sheets.Sheet1.A5 = {v: 5};
      workbook.Sheets.Sheet1.A6 = {v: 6};
      workbook.Sheets.Sheet1.A7 = {v: ''};
      workbook.Sheets.Sheet1.F5 = {f: '=COUNT($A$2:$A$7)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 5);
      workbook.Sheets.Sheet1.F5 = {f: '=COUNT($A$5:$A$7)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 2);
      workbook.Sheets.Sheet1.F5 = {f: '=COUNT($A$2:$A$7,2)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 6);
      workbook.Sheets.Sheet1.F5 = {f: '=COUNT($A$2:$A$7,2)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 6);
    });

    it('COUNTA', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A2 = {v: 3};
      workbook.Sheets.Sheet1.A3 = {v: 2};
      workbook.Sheets.Sheet1.A4 = {v: 4};
      workbook.Sheets.Sheet1.A5 = {v: 5};
      workbook.Sheets.Sheet1.A6 = {v: 6};
      workbook.Sheets.Sheet1.A7 = {v: ''};
      workbook.Sheets.Sheet1.F5 = {f: '=COUNTA(A2:A7)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 5);
    });

    it('COUNTBLANK', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A160 = {v: 6};
      workbook.Sheets.Sheet1.A161 = {v: ''};
      workbook.Sheets.Sheet1.A162 = {v: 4};
      workbook.Sheets.Sheet1.B160 = {v: ''};
      workbook.Sheets.Sheet1.B161 = {v: ''};
      workbook.Sheets.Sheet1.B162 = {v: ''};
      workbook.Sheets.Sheet1.F5 = {f: '=COUNTBLANK($A$160:$B$162)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 4);
    });

    it('COUNTIF', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A165 = {v: '苹果'};
      workbook.Sheets.Sheet1.A166 = {v: '橙子'};
      workbook.Sheets.Sheet1.A167 = {v: '桃子'};
      workbook.Sheets.Sheet1.A168 = {v: '苹果'};
      workbook.Sheets.Sheet1.B165 = {v: 32};
      workbook.Sheets.Sheet1.B166 = {v: 54};
      workbook.Sheets.Sheet1.B167 = {v: 75};
      workbook.Sheets.Sheet1.B168 = {v: 86};
      workbook.Sheets.Sheet1.F5 = {f: '=COUNTIF($B$165:$B$168)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      workbook.Sheets.Sheet1.F5 = {f: '=COUNTIF($B$165:$B$168,"<>"&$B$167)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 3);
      workbook.Sheets.Sheet1.F5 = {f: '=COUNTIF($A$165:$A$168,"*")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 4);
    });

    it('COUNTIFS', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      // name2SheetProxy.Sheets.Sheet1.B171 = {v: '是'};
      // name2SheetProxy.Sheets.Sheet1.B172 = {v: '是'};
      // name2SheetProxy.Sheets.Sheet1.B173 = {v: '是'};
      // name2SheetProxy.Sheets.Sheet1.B174 = {v: '否'};
      // name2SheetProxy.Sheets.Sheet1.C171 = {v: '否'};
      // name2SheetProxy.Sheets.Sheet1.C172 = {v: '是'};
      // name2SheetProxy.Sheets.Sheet1.C173 = {v: '是'};
      // name2SheetProxy.Sheets.Sheet1.C174 = {v: '是'};
      // name2SheetProxy.Sheets.Sheet1.D171 = {v: '否'};
      // name2SheetProxy.Sheets.Sheet1.D172 = {v: '否'};
      // name2SheetProxy.Sheets.Sheet1.D173 = {v: '是'};
      // name2SheetProxy.Sheets.Sheet1.D174 = {v: '是'};
      // name2SheetProxy.Sheets.Sheet1.F5 = {f: '=COUNTIFS(B171:D171,"=是")'};
      // solveExpression.calculateWorkbook(name2SheetProxy);
      // console.log(name2SheetProxy.Sheets.Sheet1.F5.v)
      // assert.equal(name2SheetProxy.Sheets.Sheet1.F5.v, 0);
      // name2SheetProxy.Sheets.Sheet1.F5 = {f: '=COUNTIFS(B171:B174,"=是",C171:C174,"=是")'};
      // solveExpression.calculateWorkbook(name2SheetProxy);
      // console.log(name2SheetProxy.Sheets.Sheet1.F5.v)
      // assert.equal(name2SheetProxy.Sheets.Sheet1.F5.v, 2);
      // name2SheetProxy.Sheets.Sheet1.F5 = {f: '=COUNTIFS(B174:D174,"=是",B172:D172,"=是")'};
      // solveExpression.calculateWorkbook(name2SheetProxy);
      // console.log(name2SheetProxy.Sheets.Sheet1.F5.v)
      // assert.equal(name2SheetProxy.Sheets.Sheet1.F5.v, 1);
      workbook.Sheets.Sheet1.A177 = {v: 1};
      workbook.Sheets.Sheet1.A178 = {v: 2};
      workbook.Sheets.Sheet1.A179 = {v: 3};
      workbook.Sheets.Sheet1.A180 = {v: 4};
      workbook.Sheets.Sheet1.A181 = {v: 5};
      workbook.Sheets.Sheet1.A182 = {v: 6};
      workbook.Sheets.Sheet1.B177 = {v: 40664};
      workbook.Sheets.Sheet1.B178 = {v: 40665};
      workbook.Sheets.Sheet1.B179 = {v: 40666};
      workbook.Sheets.Sheet1.B180 = {v: 40667};
      workbook.Sheets.Sheet1.B181 = {v: 40668};
      workbook.Sheets.Sheet1.B182 = {v: 40669};
      workbook.Sheets.Sheet1.F5 = {f: '=COUNTIFS(A177:A182, "<5",B177:B182,"<5/3/2011")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 0);
      workbook.Sheets.Sheet1.F5 = {f: '=COUNTIFS(A177:A182, "<" & A181,B177:B182,"<" & B179)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 2);
    });

    it('COUPDAYBS', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A185 = {v: 40568};
      workbook.Sheets.Sheet1.A186 = {v: 40862};
      workbook.Sheets.Sheet1.A187 = {v: 2};
      workbook.Sheets.Sheet1.A188 = {v: 1};
      workbook.Sheets.Sheet1.F5 = {f: '=COUPDAYBS(A185,A186,A187,A188)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 71);
    });

    it('COVARIANCE.P', function() {//调用问题
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A191 = {v: 3};
      workbook.Sheets.Sheet1.A192 = {v: 2};
      workbook.Sheets.Sheet1.A193 = {v: 4};
      workbook.Sheets.Sheet1.A194 = {v: 2};
      workbook.Sheets.Sheet1.A195 = {v: 5};
      workbook.Sheets.Sheet1.B191 = {v: 9};
      workbook.Sheets.Sheet1.B192 = {v: 7};
      workbook.Sheets.Sheet1.B193 = {v: 1.2};
      workbook.Sheets.Sheet1.B194 = {v: 15};
      workbook.Sheets.Sheet1.B195 = {v: 17};
      workbook.Sheets.Sheet1.F5 = {f: '=COVARIANCE.P(A191:A195, B191:B195)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      workbook.Sheets.Sheet1.F5 = {f: '=_XLFN.COVARIANCE.P(A191:A195, B191:B195)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 5.2);
    });

    it('COVARIANCE.S', function() {//调用问题
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=COVARIANCE.S({2,4,8},{5,11,12})'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-9.666667)<0.00001);
    });


    it('DATE', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=DATE(2012,3,14)'};
      workbook.Sheets.Sheet1.F6 = {f: '=F5+1'};
      workbook.Sheets.Sheet1.F7 = {f: '=F5-1'};
      // name2SheetProxy.Sheets.Sheet1.F8 = {f: '=-2^2+11*(1-1)'};



      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v);
      assert.equal(workbook.Sheets.Sheet1.F5.v.toLocaleDateString(), "2012-3-14");
      assert.equal(workbook.Sheets.Sheet1.F7.v, 40981.000497685185);
    });


    it('DATEVALUE', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=DATEVALUE("2011-8-22")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 40777.003969907404);
    });




    it('DAYS360', function() {//jsspreadsheet
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=DAYS360("2011/1/31","2011/2/1")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 1);
      workbook.Sheets.Sheet1.F5 = {f: '=DAYS360("2011-1-1","2011-12-31")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 360);
    });

    it('DAY', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=DAY("2011-4-15")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 15);
      workbook.Sheets.Sheet1.F5 = {f: '=MONTH("2011-4-15")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 4);
    });

    it('DB', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A214 = {v: 10000000};
      workbook.Sheets.Sheet1.A215 = {v: 1000000};
      workbook.Sheets.Sheet1.A216 = {v: 6};
      workbook.Sheets.Sheet1.F5 = {f: '=DB(A214,A215,A216,1,7)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-1860833.33333333)<0.00001);
      workbook.Sheets.Sheet1.F5 = {f: '=DB(A214,A215,A216,2,7)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-2596394.16666667)<0.00001);
      workbook.Sheets.Sheet1.F5 = {f: '=DB(A214,A215,A216,3,7)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-1768144.4275)<0.00001);
      workbook.Sheets.Sheet1.F5 = {f: '=DB(A214,A215,A216,5,7)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-819996.427841828)<0.00001);
      workbook.Sheets.Sheet1.F5 = {f: '=DB(A214,A215,A216,6,7)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-558417.567360285)<0.00001);
      // name2SheetProxy.Sheets.Sheet1.F5 = {f: '=DB(A214,A215,A216,7,7)'};
      // solveExpression.calculateWorkbook(name2SheetProxy);
      // console.log(name2SheetProxy.Sheets.Sheet1.F5.v)
      // assert(Math.abs(name2SheetProxy.Sheets.Sheet1.F5.v-158450.984738481)<0.00001);
    });

    it('DDB', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A219 = {v: 24000};
      workbook.Sheets.Sheet1.A220 = {v: 3000};
      workbook.Sheets.Sheet1.A221 = {v: 10};
      workbook.Sheets.Sheet1.F5 = {f: '=DDB(A219,A220,A221*365,1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-13.15)<0.1);
      workbook.Sheets.Sheet1.F5 = {f: '=DDB(A219,A220,A221*12,1,2)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-400)<0.1);
      workbook.Sheets.Sheet1.F5 = {f: '=DDB(A219,A220,A221,1,2)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-4800)<0.1);
      workbook.Sheets.Sheet1.F5 = {f: '=DDB(A219,A220,A221,2,1.5)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-3060)<0.1);
      workbook.Sheets.Sheet1.F5 = {f: '=DDB(A219,A220,A221,10)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-221.23)<0.1);
    });

    it('DEC2BIN', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A219 = {v: 24000};
      workbook.Sheets.Sheet1.A220 = {v: 3000};
      workbook.Sheets.Sheet1.A221 = {v: 10};
      workbook.Sheets.Sheet1.F5 = {f: '=DEC2BIN(-100)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-1110011100)<0.1);
    });

    it('DEC2HEX', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A219 = {v: 24000};
      workbook.Sheets.Sheet1.A220 = {v: 3000};
      workbook.Sheets.Sheet1.A221 = {v: 10};
      workbook.Sheets.Sheet1.F5 = {f: '=DEC2HEX(-54)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 'ffffffffca');
    });

    it('DEC2OCT', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A219 = {v: 24000};
      workbook.Sheets.Sheet1.A220 = {v: 3000};
      workbook.Sheets.Sheet1.A221 = {v: 10};
      workbook.Sheets.Sheet1.F5 = {f: '=DEC2OCT(-100)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 7777777634);
    });

    it('DISC', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=DISC("2018/07/01","2038/01/01",97.975,100,1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-0.00103819082377477)<0.0001);
    });

    it('DOLLAR', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=DOLLAR(1234.567,2)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '$1,234.57');
      workbook.Sheets.Sheet1.F5 = {f: '=DOLLAR(-1234.567,3)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '($1,234.567)');
      workbook.Sheets.Sheet1.F5 = {f: '=DOLLAR(-0.123,4)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '($0.1230)');
      workbook.Sheets.Sheet1.F5 = {f: '=DOLLAR(99.888)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '$99.89');
    });
    it('D', function() {//计算错误
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=DOLLAR(1234.567,2)'};
      workbook.Sheets.Sheet1.A202 = {v: '树种'};
      workbook.Sheets.Sheet1.A203 = {v: '=苹果树'};
      workbook.Sheets.Sheet1.A204 = {v: '=梨树'};
      workbook.Sheets.Sheet1.B202 = {v: '高度'};
      workbook.Sheets.Sheet1.B203 = {v: '>10'};
      workbook.Sheets.Sheet1.E202 = {v: '高度'};
      workbook.Sheets.Sheet1.E203 = {v: '<16'};
      workbook.Sheets.Sheet1.A205 = {v: '树种'};
      workbook.Sheets.Sheet1.A206 = {v: '苹果树'};
      workbook.Sheets.Sheet1.A207 = {v: '梨树'};
      workbook.Sheets.Sheet1.A208 = {v: '樱桃树'};
      workbook.Sheets.Sheet1.A209 = {v: '苹果树'};
      workbook.Sheets.Sheet1.A210 = {v: '梨树'};
      workbook.Sheets.Sheet1.A211 = {v: '苹果树'};
      workbook.Sheets.Sheet1.B205 = {v: '高度'};
      workbook.Sheets.Sheet1.B206 = {v: 18};
      workbook.Sheets.Sheet1.B207 = {v: 12};
      workbook.Sheets.Sheet1.B208 = {v: 13};
      workbook.Sheets.Sheet1.B209 = {v: 14};
      workbook.Sheets.Sheet1.B210 = {v: 9};
      workbook.Sheets.Sheet1.B211 = {v: 8};
      workbook.Sheets.Sheet1.C205 = {v: '年数'};
      workbook.Sheets.Sheet1.C206 = {v: 20};
      workbook.Sheets.Sheet1.C207 = {v: 12};
      workbook.Sheets.Sheet1.C208 = {v: 14};
      workbook.Sheets.Sheet1.C209 = {v: 15};
      workbook.Sheets.Sheet1.C210 = {v: 8};
      workbook.Sheets.Sheet1.C211 = {v: 9};
      workbook.Sheets.Sheet1.D205 = {v: '产量'};
      workbook.Sheets.Sheet1.D206 = {v: 14};
      workbook.Sheets.Sheet1.D207 = {v: 10};
      workbook.Sheets.Sheet1.D208 = {v: 9};
      workbook.Sheets.Sheet1.D209 = {v: 10};
      workbook.Sheets.Sheet1.D210 = {v: 8};
      workbook.Sheets.Sheet1.D211 = {v: 6};
      workbook.Sheets.Sheet1.F5 = {f: '=DPRODUCT(A205:D211, "产量", A202:E204)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 800);
      workbook.Sheets.Sheet1.F5 = {f: '=DSTDEV(A205:D211, "产量", A202:A204)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-2.96647939483826)<0.0001);
      workbook.Sheets.Sheet1.F5 = {f: '=DSTDEVP(A205:D211, "产量", A202:A204)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-2.65329983228432)<0.0001);//=DSUM(A205:D211,"产量",A202:A203)
      workbook.Sheets.Sheet1.F5 = {f: '=DSUM(A205:D211,"产量",A202:A203)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 30);
      workbook.Sheets.Sheet1.F5 = {f: '=DSUM(A205:D211,"产量",A202:A204)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 48);
      workbook.Sheets.Sheet1.F5 = {f: '=DVAR(A205:D211, "产量", A202:A204)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 8.8);
      workbook.Sheets.Sheet1.F5 = {f: '=DVARP(A205:D211,"产量",A202:A204)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 7.040000000000001);
      workbook.Sheets.Sheet1.F5 = {f: '=DMAX(A205:D211, "产量", A202:E203)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 10);
      workbook.Sheets.Sheet1.F5 = {f: '=DMIN(A205:D211, "产量", A202:E203)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 10);
      workbook.Sheets.Sheet1.F5 = {f: '=DGET(A205:D211, "产量", A202:E203)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 10);
      workbook.Sheets.Sheet1.F5 = {f: '=DGET(A205:D211, "产量", A202:A204)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '#NUM!');
      workbook.Sheets.Sheet1.F5 = {f: '=DCOUNTA(A205:D211, "产量", A202:E203)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 1);
      workbook.Sheets.Sheet1.F5 = {f: '=DCOUNT(A205:D211, "年数",A202:E203)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 1);
      workbook.Sheets.Sheet1.F5 = {f: '=DAVERAGE(A205:E211,"产量",A202:E203)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 10);
      workbook.Sheets.Sheet1.F5 = {f: '=DAVERAGE(A206:E211, 3, A206:E211)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 11.6);
    });

    it('DURATION', function() {// 未实现
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=DURATION("2018/07/01","2048/01/01",0.08,0.09,2,1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '10.9');

    });

    it('ERFCPRECISE', function() {//jsspreadsheet
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=ERFCPRECISE(1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '0.1572992070502851');
      workbook.Sheets.Sheet1.F5 = {f: '=ERFPRECISE(0.745)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '0.7079289200957377');
      workbook.Sheets.Sheet1.F5 = {f: '=ERFPRECISE(1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '0.8427007929497149');
    });


    it('EDATE', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=EDATE("2011-1-15",1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '40589.003969907404');
      workbook.Sheets.Sheet1.F5 = {f: '=EDATE("2011-1-15",-1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '40527.003969907404');
    });

    it('EVEN', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=EVEN(1.5)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 2);
      workbook.Sheets.Sheet1.F5 = {f: '=EVEN(3)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 4);
      workbook.Sheets.Sheet1.F5 = {f: '=EVEN(-1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, -2);
    });


    it('ERFPRECISE', function() {//jsspreadsheet
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=ERFPRECISE(1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-0.84270079)<0.0001);
      workbook.Sheets.Sheet1.F5 = {f: '=ERFPRECISE(0.745)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-0.70792892)<0.0001);
    });

    it('ERROR.TYPE', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A256 = {v: '#NULL!'};
      workbook.Sheets.Sheet1.F5 = {f: '=ERROR.TYPE(A256)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 1);
    });


    it('EXPON.DIST', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=EXPON.DIST(0.2,10,FALSE)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-1.35335283236613)<0.0001);
    });

    it('F.TEST', function() {//计算错误
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A269 = {v: '数据1'};
      workbook.Sheets.Sheet1.A270 = {v: 6};
      workbook.Sheets.Sheet1.A271 = {v: 7};
      workbook.Sheets.Sheet1.A272 = {v: 9};
      workbook.Sheets.Sheet1.A273 = {v: 15};
      workbook.Sheets.Sheet1.A274 = {v: 21};
      workbook.Sheets.Sheet1.B269 = {v: '数据2'};
      workbook.Sheets.Sheet1.B270 = {v: 20};
      workbook.Sheets.Sheet1.B271 = {v: 28};
      workbook.Sheets.Sheet1.B272 = {v: 31};
      workbook.Sheets.Sheet1.B273 = {v: 38};
      workbook.Sheets.Sheet1.B274 = {v: 40};
      workbook.Sheets.Sheet1.F5 = {f: '=F.TEST(A270:A274,B270:B274)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-0.64831785)<0.0001);
    });

    it('FACT', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=FACT(-1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
    });

    it('FDIST', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=FDIST(15.20686486,6,4)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
    });

    it('FIND', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=FIND("m","MIRIAM mCGOVERN")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 8);
      workbook.Sheets.Sheet1.F5 = {f: '=FIND("M","MIRIAM MCGOVERN",3)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 6);
    });
    it('FINV', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=FINV(0.01,6,4)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 15.206864861157555);
    });


    it('FIXED(A288, 1)', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A288 = {v: 1234.567};
      workbook.Sheets.Sheet1.A289 = {v: -1234.567};
      workbook.Sheets.Sheet1.A290 = {v: 44.332};
      workbook.Sheets.Sheet1.F5 = {f: '=FIXED(A288, 1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '1,234.6');
      workbook.Sheets.Sheet1.F5 = {f: '=FIXED(A288, -1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '1,230');
      workbook.Sheets.Sheet1.F5 = {f: '=FIXED(A289, -1, TRUE)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '-1230');
      workbook.Sheets.Sheet1.F5 = {f: '=FIXED(A290)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '44.33');
    });

    it('FLOOR', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=FLOOR(3.7,2)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 2);
      workbook.Sheets.Sheet1.F5 = {f: '=FLOOR(-2.5,-2)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, -2);
      workbook.Sheets.Sheet1.F5 = {f: '=FLOOR(-8.5,-2)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, -8);
      workbook.Sheets.Sheet1.F5 = {f: '=FLOOR(2.5,-2)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      workbook.Sheets.Sheet1.F5 = {f: '=FLOOR(1.58,0.1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 1.5);
      workbook.Sheets.Sheet1.F5 = {f: '=FLOOR(0.234,0.01)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 0.23);
      workbook.Sheets.Sheet1.F5 = {f: '=FLOORMATH(24.3,5)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 20);
      workbook.Sheets.Sheet1.F5 = {f: '=FLOORMATH(-8.1,2)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, -10);
      workbook.Sheets.Sheet1.F5 = {f: '=FLOORMATH(-5.5,2,-1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, -4);
    });


    it('FVSCHEDULE', function() {//计算错误
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=FVSCHEDULE(1,{0.09,0.11,0.1})'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 1.3308900000000004);
    });

    it('GAMMA', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=GAMMA(-3.75)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-0.268)<0.1);
    });

    it('GAMMADIST', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=GAMMADIST(10.00001131,9,2,FALSE)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-0.0326391304182863)<0.1);
    });

    it('GESTEP', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=GESTEP(-4, -5)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-1)<0.1);
      workbook.Sheets.Sheet1.F5 = {f: '=GESTEP(-1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-0)<0.1);
    });

    it('HOUR', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=HOUR(0.75)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 18);
      workbook.Sheets.Sheet1.D354 = {v: '2011/7/18  7:45:00'};
      workbook.Sheets.Sheet1.F5 = {f: '=HOUR(D354)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      workbook.Sheets.Sheet1.D354 = {v: 40742.3229166667};
      workbook.Sheets.Sheet1.F5 = {f: '=HOUR(D354)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-7)<0.1);
      workbook.Sheets.Sheet1.F5 = {f: '=HOUR(2012-4-21)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-0)<0.1);
      // name2SheetProxy.Sheets.Sheet1.F5 = {f: '=HOUR("2012-4-21")'};
      // solveExpression.calculateWorkbook(name2SheetProxy);
      // console.log(name2SheetProxy.Sheets.Sheet1.F5.v)
      // assert(Math.abs(name2SheetProxy.Sheets.Sheet1.F5.v-0)<0.1);
    });

    it('HLOOKUP', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A354 = {v: '车轴'};
      workbook.Sheets.Sheet1.A355 = {v: 4};
      workbook.Sheets.Sheet1.A356 = {v: 5};
      workbook.Sheets.Sheet1.A357 = {v: 6};
      workbook.Sheets.Sheet1.B354 = {v: '轴承'};
      workbook.Sheets.Sheet1.B355 = {v: 4};
      workbook.Sheets.Sheet1.B356 = {v: 7};
      workbook.Sheets.Sheet1.B357 = {v: 8};
      workbook.Sheets.Sheet1.C354 = {v: '螺栓'};
      workbook.Sheets.Sheet1.C355 = {v: 9};
      workbook.Sheets.Sheet1.C356 = {v: 10};
      workbook.Sheets.Sheet1.C357 = {v: 11};
      workbook.Sheets.Sheet1.F5 = {f: '=HLOOKUP("车轴", A354:C357, 2, TRUE)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 4);
      workbook.Sheets.Sheet1.F5 = {f: '=HLOOKUP("轴承", A354:C357, 3, FALSE)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 7);
      workbook.Sheets.Sheet1.F5 = {f: '=HLOOKUP("B", A354:C357, 3, TRUE)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      workbook.Sheets.Sheet1.F5 = {f: '=HLOOKUP("螺栓", A354:C357, 4,FALSE)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 11);
      workbook.Sheets.Sheet1.F5 = {f: '=HLOOKUP(3, {1,2,3;"a","b","c";"d","e","f"}, 2, TRUE)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 'c');
    });

    it('HYPGEOM.DIST', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A360 = {v: 1};
      workbook.Sheets.Sheet1.A361 = {v: 4};
      workbook.Sheets.Sheet1.A362 = {v: 8};
      workbook.Sheets.Sheet1.A363 = {v: 20};
      workbook.Sheets.Sheet1.F5 = {f: '=HYPGEOM.DIST(A360,A361,A362,A363,TRUE)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-0.4654)<0.0001);
      workbook.Sheets.Sheet1.F5 = {f: '=HYPGEOM.DIST(A360,A361,A362,A363,FALSE)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-0.3633)<0.0001);
      workbook.Sheets.Sheet1.F5 = {f: '=HYPGEOMDIST(A360,A361,A362,A363)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-0.4654)<0.0001);
    });

    it('IM', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=IMABS("5+12I")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 13);
      workbook.Sheets.Sheet1.F5 = {f: '=IMAGINARY("3+4I")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 4);
      workbook.Sheets.Sheet1.F5 = {f: '=IMAGINARY("0-J")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, -1);
      workbook.Sheets.Sheet1.F5 = {f: '=IMAGINARY(4)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 0);
      workbook.Sheets.Sheet1.F5 = {f: '=IMARGUMENT("3+4I")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v-0.92729522)<0.0001);
      workbook.Sheets.Sheet1.F5 = {f: '=IMCONJUGATE("3+4I")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '3-4i');
      workbook.Sheets.Sheet1.F5 = {f: '=IMCONJUGATE("3+4I")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '3-4i');
      workbook.Sheets.Sheet1.F5 = {f: '=IMCOS("1+I")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '0.8337300251311491-0.9888977057628651i');
      workbook.Sheets.Sheet1.F5 = {f: '=IMCOSH("4+3I")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '-27.034945603074224+3.851153334811777i');
      workbook.Sheets.Sheet1.F5 = {f: '=IMCOT("4+3I")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '0.0049011823943044056-0.9992669278059017i');
      workbook.Sheets.Sheet1.F5 = {f: 'IMCSC("4+3I")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '-0.0754898329158637+0.0648774713706355i');
      workbook.Sheets.Sheet1.F5 = {f: '=IMCSCH("4+3I")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '-0.03627588962862602-0.005174473184019398i');
      workbook.Sheets.Sheet1.F5 = {f: '=IMDIV("-238+240I","10+24I")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '5+12i');
      workbook.Sheets.Sheet1.F5 = {f: '=IMEXP("1+I")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '1.4686939399158851+2.2873552871788423i');
    });
    it('IN', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=INDEX({1,2;3,4},0,2)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 2);

      // name2SheetProxy.Sheets.Sheet1.F5 = {f: '=INFO("NUMFILE")'};
      // solveExpression.calculateWorkbook(name2SheetProxy);
      // console.log(name2SheetProxy.Sheets.Sheet1.F5.v)
      // assert.equal(name2SheetProxy.Sheets.Sheet1.F5.v, 2);
      workbook.Sheets.Sheet1.F5 = {f: '=INT(-8.9)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, -9);
      workbook.Sheets.Sheet1.F5 = {f: '=19.5-INT(19.5)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 0.5);
    });

    it('IFNA', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A2 = {v: 3};
      workbook.Sheets.Sheet1.A3 = {v: 2};
      workbook.Sheets.Sheet1.A4 = {v: 4};
      workbook.Sheets.Sheet1.A5 = {v: 5};
      workbook.Sheets.Sheet1.A6 = {v: 6};
      workbook.Sheets.Sheet1.B2 = {v: 9};
      workbook.Sheets.Sheet1.B3 = {v: 7};
      workbook.Sheets.Sheet1.B4 = {v:  1.2};
      workbook.Sheets.Sheet1.B5 = {v:  15};
      workbook.Sheets.Sheet1.B6 = {v:  17};
      workbook.Sheets.Sheet1.F5 = {f: '=IFNA(VLOOKUP("Seattle",$A$2:$B$7,0),"Not found")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, "Not found");
    });
    it('IRR', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A419 = {v: -700000};
      workbook.Sheets.Sheet1.A420 = {v: 120000};
      workbook.Sheets.Sheet1.A421 = {v: 150000};
      workbook.Sheets.Sheet1.F5 = {f: '=IRR(A419:A421,-10%)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, -0.4435069413347406);
    });

    it('IMPOWER', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=IMPOWER("2+3i", 3)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '-45.99999999999999+9.000000000000007i');
      workbook.Sheets.Sheet1.F5 = {f: '=IMPRODUCT("3+4i","5-3i")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '27+11i');
      workbook.Sheets.Sheet1.F5 = {f: '=IMPRODUCT("1+2i",30)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '30+60i');
      workbook.Sheets.Sheet1.F5 = {f: '=IMSUB("13+4i","5+3i")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '8+i');
      workbook.Sheets.Sheet1.F5 = {f: '=IMSUM("3+4i","5-3i")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '8+i');
      workbook.Sheets.Sheet1.F5 = {f: '=IMTAN("4+3i")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '0.004908258067495992+1.000709536067233i');
    });
    //todo
    it('INTRATE', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A406 = {v: 39493};
      workbook.Sheets.Sheet1.A407 = {v: 39583};
      workbook.Sheets.Sheet1.A408 = {v: 10000000};
      workbook.Sheets.Sheet1.A409 = {v: 10144200};
      workbook.Sheets.Sheet1.A410 = {v: 2};
      workbook.Sheets.Sheet1.A413 = {v: 0.1};
      workbook.Sheets.Sheet1.A414 = {v: 1};
      workbook.Sheets.Sheet1.A415 = {v: 3};
      workbook.Sheets.Sheet1.A416 = {v: 80000};
      // name2SheetProxy.Sheets.Sheet1.F5 = {f: '=INTRATE(A406,A407,A408,A409,A410)'};
      // solveExpression.calculateWorkbook(name2SheetProxy);
      // console.log(name2SheetProxy.Sheets.Sheet1.F5.v)
      // assert(Math.abs(name2SheetProxy.Sheets.Sheet1.F5.v-0.05768)<0.0001);
      workbook.Sheets.Sheet1.F5 = {f: '=IPMT(A413/12, A414, A415*12, A416)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert(Math.abs(workbook.Sheets.Sheet1.F5.v+666.6666666666666)<0.0001);
    });


    it('IS', function() { //js-spreadsheet
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.G8 = {v: '111'};
      workbook.Sheets.Sheet1.D417 = {v: '#NUM!'};
      workbook.Sheets.Sheet1.A431 = {v: '#N/A'};
      workbook.Sheets.Sheet1.D422 = {f: '=TODAY()'};
      workbook.Sheets.Sheet1.D428 = {f: 'Region1'};
      workbook.Sheets.Sheet1.F5 = {f: '=ISERR(D417)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, true);
      workbook.Sheets.Sheet1.F5 = {f: '=ISEVEN(-1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, false);
      workbook.Sheets.Sheet1.F5 = {f: '=ISFORMULA(D422)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, true);
      workbook.Sheets.Sheet1.F5 = {f: '=ISLOGICAL(TRUE)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, true);
      workbook.Sheets.Sheet1.F5 = {f: '=ISLOGICAL("TRUE")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, false);
      workbook.Sheets.Sheet1.F5 = {f: '=ISREF(G8)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, true);
      workbook.Sheets.Sheet1.F5 = {f: '=ISREF(XYZ1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, false);
      workbook.Sheets.Sheet1.F5 = {f: '=ISNA(A431)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, true);
      workbook.Sheets.Sheet1.F5 = {f: '=ISNONTEXT(A428)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, true);
    });

    it('LEFT', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=LEFT("HELLO WORLD", 20)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 'HELLO WORLD');
    });

    it('Log', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=LOG(10)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 1);
      workbook.Sheets.Sheet1.F5 = {f: '=LOGNORM.DIST(4,3.5,1.2,FALSE)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 0.01761759668181924);
      workbook.Sheets.Sheet1.F5 = {f: '=LOGNORMDIST(4,3.5,1.2)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 0.0390835557068005);
    });

    it('MATCH', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.B481 = {v: 25};
      workbook.Sheets.Sheet1.B482 = {v: 38};
      workbook.Sheets.Sheet1.B483 = {v: 40};
      workbook.Sheets.Sheet1.B484 = {v: 41};
      workbook.Sheets.Sheet1.F5 = {f: '=MATCH(39,B481:B484,1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 2);
      workbook.Sheets.Sheet1.F5 = {f: '=MATCH(41,B481:B484,0)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 4);
      workbook.Sheets.Sheet1.F5 = {f: '=MATCH(40,B481:B484,-1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
    });

    it('MDETERM', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A495 = {v: 1};
      workbook.Sheets.Sheet1.A496 = {v: 1};
      workbook.Sheets.Sheet1.A497 = {v: 1};
      workbook.Sheets.Sheet1.A498 = {v: 7};
      workbook.Sheets.Sheet1.B495 = {v: 3};
      workbook.Sheets.Sheet1.B496 = {v: 3};
      workbook.Sheets.Sheet1.B497 = {v: 1};
      workbook.Sheets.Sheet1.B498 = {v: 3};
      workbook.Sheets.Sheet1.C495 = {v: 8};
      workbook.Sheets.Sheet1.C496 = {v: 6};
      workbook.Sheets.Sheet1.C497 = {v: 1};
      workbook.Sheets.Sheet1.C498 = {v: 10};
      workbook.Sheets.Sheet1.D495 = {v: 5};
      workbook.Sheets.Sheet1.D496 = {v: 1};
      workbook.Sheets.Sheet1.D497 = {v: 0};
      workbook.Sheets.Sheet1.D498 = {v: 2};
      workbook.Sheets.Sheet1.F5 = {f: '=MDETERM({3,6,1;1,1,0;3,10,2})'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 0.9999999999999998);
      workbook.Sheets.Sheet1.F5 = {f: '=MDETERM({3,6;1,1})'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, -3);
      workbook.Sheets.Sheet1.F5 = {f: '=MDETERM({1,3,8,5;1,3,6,1})'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      workbook.Sheets.Sheet1.F5 = {f: '=MDETERM(A495:D498)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 87.99999999999997);
    });

    it('MINUTE', function() {//js-spreadsheet
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.D515 = {v: 0.53125};
      workbook.Sheets.Sheet1.F5 = {f: '=MINUTE(D515)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 45);
    });

    it('MIRR', function() {//计算问题，与excel结果不同
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A521 = {v: -120000};
      workbook.Sheets.Sheet1.A522 = {v: 39000};
      workbook.Sheets.Sheet1.A523 = {v: 30000};
      workbook.Sheets.Sheet1.A524= {v: 21000};
      workbook.Sheets.Sheet1.A525 = {v: 37000};
      workbook.Sheets.Sheet1.A526 = {v: 46000};
      workbook.Sheets.Sheet1.A527 = {v: 0.1};
      workbook.Sheets.Sheet1.A528 = {v: 0.12};
      workbook.Sheets.Sheet1.F5 = {f: '=MIRR(A521:A526, A527, A528)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 0.13);
      workbook.Sheets.Sheet1.F5 = {f: '=MIRR(A521:A524, A527, A528)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, -0.05);
      workbook.Sheets.Sheet1.F5 = {f: '=MIRR(A521:A526, A527, 14%)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 0.1260941303659051);
    });
    it('MODEMULT', function() {//多值函数
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.E510 = {v: 1};
      workbook.Sheets.Sheet1.E511 = {v: 2};
      workbook.Sheets.Sheet1.E512 = {v: 3};
      workbook.Sheets.Sheet1.E513 = {v: 4};
      workbook.Sheets.Sheet1.E514 = {v: 3};
      workbook.Sheets.Sheet1.E515 = {v: 2};
      workbook.Sheets.Sheet1.E516 = {v: 1};
      workbook.Sheets.Sheet1.E517 = {v: 2};
      workbook.Sheets.Sheet1.E518 = {v: 3};
      workbook.Sheets.Sheet1.E519 = {v: 5};
      workbook.Sheets.Sheet1.E520 = {v: 6};
      workbook.Sheets.Sheet1.E521 = {v: 1};
      workbook.Sheets.Sheet1.F5 = {f: '=MODEMULT(E510:E521)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      // assert.equal(name2SheetProxy.Sheets.Sheet1.F5.v, 2);
    });
    it('MDURATION', function() {//未实现
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A501 = {v: 39448};
      workbook.Sheets.Sheet1.A502 = {v: 42370};
      workbook.Sheets.Sheet1.A503 = {v: 0};
      workbook.Sheets.Sheet1.A504 = {v: 0};
      workbook.Sheets.Sheet1.A505 = {v: 2};
      workbook.Sheets.Sheet1.A506 = {v: 1};
      workbook.Sheets.Sheet1.F5 = {f: '=MDURATION(A501,A502,A503,A504,A505,A506)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 6);
    });

    it('MI', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.D501 = {v: "Fluid Flow"};
      workbook.Sheets.Sheet1.D515 = {v: 0.53125};
      workbook.Sheets.Sheet1.C509 = {v: 10};
      workbook.Sheets.Sheet1.C510 = {v: 7};
      workbook.Sheets.Sheet1.C511 = {v: 9};
      workbook.Sheets.Sheet1.C512 = {v: 7};
      workbook.Sheets.Sheet1.C513 = {v: 2};
      workbook.Sheets.Sheet1.F5 = {f: '=MID(D501,7,20)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 'Flow');
      workbook.Sheets.Sheet1.F5 = {f: '=MIN(C509:C513)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 2);
    });

    it('N', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A535 = {v: 7};
      workbook.Sheets.Sheet1.A536 = {v: 'EVEN'};
      workbook.Sheets.Sheet1.A537 = {v: 'True'};
      workbook.Sheets.Sheet1.A538 = {v: 40650};
      workbook.Sheets.Sheet1.F5 = {f: '=N(A535)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 7);
      workbook.Sheets.Sheet1.F5 = {f: '=N(A536)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 0);
      workbook.Sheets.Sheet1.F5 = {f: '=N(A537)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 1);
      workbook.Sheets.Sheet1.F5 = {f: '=N(A538)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 40650);
      workbook.Sheets.Sheet1.F5 = {f: '=N("7")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 0);
    });

    it('NETWORKDAYS', function() {//js-spreadsheet
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.E525 = {v: 41183};
      workbook.Sheets.Sheet1.E526 = {v: 41334};
      workbook.Sheets.Sheet1.E527 = {v: 41235};
      workbook.Sheets.Sheet1.E528 = {v: 41247};
      workbook.Sheets.Sheet1.E529 = {v: 41295};
      // name2SheetProxy.Sheets.Sheet1.F5 = {f: '=NETWORKDAYS(E525,E526)'};
      // solveExpression.calculateWorkbook(name2SheetProxy);
      // console.log(name2SheetProxy.Sheets.Sheet1.F5.v)
      // assert.equal(name2SheetProxy.Sheets.Sheet1.F5.v, 110);
      // name2SheetProxy.Sheets.Sheet1.F5 = {f: '=NETWORKDAYS(E525,E526,E527)'};
      // solveExpression.calculateWorkbook(name2SheetProxy);
      // console.log(name2SheetProxy.Sheets.Sheet1.F5.v)
      // assert.equal(name2SheetProxy.Sheets.Sheet1.F5.v, 109);
      // name2SheetProxy.Sheets.Sheet1.F5 = {f: '=NETWORKDAYS(E525,E526,E527:E529)'};
      // solveExpression.calculateWorkbook(name2SheetProxy);
      // console.log(name2SheetProxy.Sheets.Sheet1.F5.v)
      // assert.equal(name2SheetProxy.Sheets.Sheet1.F5.v, 107);
      workbook.Sheets.Sheet1.F5 = {f: '=NETWORKDAYSINTL(DATE(2006,1,1),DATE(2006,1,31))'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 22);
      workbook.Sheets.Sheet1.F5 = {f: '=NETWORKDAYSINTL(DATE(2006,2,28),DATE(2006,1,31))'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, -21);
      workbook.Sheets.Sheet1.F5 = {f: '=NETWORKDAYSINTL(DATE(2006,1,1),DATE(2006,2,1),7,{"2006/1/2","2006/1/16"})'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 22);
      workbook.Sheets.Sheet1.F5 = {f: '=NETWORKDAYSINTL(DATE(2006,1,1),DATE(2006,2,1),"0010001",{"2006/1/2","2006/1/16"})'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 20);
    });

    it('NORM.DIST', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A541 = {v: 42};
      workbook.Sheets.Sheet1.A542 = {v: 40};
      workbook.Sheets.Sheet1.A543 = {v: 1.5};
      workbook.Sheets.Sheet1.F5 = {f: '=NORM.DIST(A541,A542,A543,FALSE)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 0.10934004978399574);
    });

    it('NORMSDIST', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=NORMSDIST(1.333333)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 0.9087887256040951);
    });
    it('NOW', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      // name2SheetProxy.Sheets.Sheet1.F5 = {f: '=NOW()'};
      // solveExpression.calculateWorkbook(name2SheetProxy);
      // console.log(name2SheetProxy.Sheets.Sheet1.F5.v)
      // name2SheetProxy.Sheets.Sheet1.F5 = {f: '=TODAY()'};
      // solveExpression.calculateWorkbook(name2SheetProxy);
      // console.log(name2SheetProxy.Sheets.Sheet1.F5.v)
      workbook.Sheets.Sheet1.F5 = {f: '=NOW()-0.5'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
    });

    it('NPER', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A546 = {v:0.12};
      workbook.Sheets.Sheet1.A547 = {v: -100};
      workbook.Sheets.Sheet1.A548 = {v: -1000};
      workbook.Sheets.Sheet1.A549 = {v: 10000};
      workbook.Sheets.Sheet1.F5 = {f: '=NPER(A546/12, A547, A548, A549, 1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 59.67386567429457);
    });
    it('NUMBERVALUE', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=NUMBERVALUE("3.5%")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 0.035);
    });
    it('OCT2BIN', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=OCT2BIN(7777777000)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 1000000000);
    });

    it('ODD', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=ODD(-1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, -1);
      workbook.Sheets.Sheet1.F5 = {f: '=ODD(-2)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, -3);
    });

    it('ODDFPRICE', function() {//未实现
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A561 = {v: 39763};
      workbook.Sheets.Sheet1.A562 = {v: 44256};
      workbook.Sheets.Sheet1.A563 = {v: 39736};
      workbook.Sheets.Sheet1.A564 = {v: 39873};
      workbook.Sheets.Sheet1.A565 = {v: 0.0785};
      workbook.Sheets.Sheet1.A566 = {v: 0.0625};
      workbook.Sheets.Sheet1.A567 = {v: 100};
      workbook.Sheets.Sheet1.A568 = {v: 2};
      workbook.Sheets.Sheet1.A569 = {v: 1};
      workbook.Sheets.Sheet1.F5 = {f: '=ODDFPRICE(A561, A562, A563, A564, A565, A566, A567, A568, A569)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, -1);
    });

    it('PERCENTILE', function() {//计算问题
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.C582 = {v: 1};
      workbook.Sheets.Sheet1.C583 = {v: 2};
      workbook.Sheets.Sheet1.C584 = {v: 3};
      workbook.Sheets.Sheet1.C585 = {v: 4};
      workbook.Sheets.Sheet1.F5 = {f: '=PERCENTILE(C582:C585,0.3)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 1.9);
    });

    it('=POISSON', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=POISSON(2,5,FALSE)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 0.08422433748856833);
      workbook.Sheets.Sheet1.F5 = {f: '=POISSONDIST(2,5,FALSE)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 0.08422433748856833);
    });

    it('PROPER', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A624 = {v: 'this is a TITLE'};
      workbook.Sheets.Sheet1.A625 = {v: '2-way street'};
      workbook.Sheets.Sheet1.A626 = {v: '76BudGet'};
      workbook.Sheets.Sheet1.F5 = {f: '=PROPER(A624)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 'This Is A Title');
      workbook.Sheets.Sheet1.F5 = {f: '=PROPER(A625)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '2-way Street');
      workbook.Sheets.Sheet1.F5 = {f: '=PROPER(A626)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '76budget');
    });
    it('PV', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.B624 = {v: 5000};
      workbook.Sheets.Sheet1.B625 = {v: 0.08};
      workbook.Sheets.Sheet1.B626 = {v: 20};
      workbook.Sheets.Sheet1.F5 = {f: '=PV(B625/12, 12*B626, B624, , 0)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, -597771.4585118783);
    });
    it('ADD', function() {//计算问题。。未考虑百分比
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.D6 = {v: '10%'};
      workbook.Sheets.Sheet1.F5 = {f: '=ADD(1, D6)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 1.1);
    });
    it('PRICE', function() {//未实现
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A607 = {v: 39493};
      workbook.Sheets.Sheet1.A608 = {v: 43054};
      workbook.Sheets.Sheet1.A609 = {v: 0};
      workbook.Sheets.Sheet1.A610 = {v: 0.065};
      workbook.Sheets.Sheet1.A611 = {v: 100};
      workbook.Sheets.Sheet1.A612 = {v: 2};
      workbook.Sheets.Sheet1.A613 = {v: 0};
      workbook.Sheets.Sheet1.F5 = {f: '=PRICE(A607,A608,A609,A610,A611,A612,A613)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 0);
    });
    it('PRICEDISC', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.C607 = {v: 39494};
      workbook.Sheets.Sheet1.C608 = {v: 39508};
      workbook.Sheets.Sheet1.C609 = {v: 0.0525};
      workbook.Sheets.Sheet1.C610 = {v: 1000};
      workbook.Sheets.Sheet1.C611 = {v: 2};
      workbook.Sheets.Sheet1.F5 = {f: '=PRICEDISC(C607,C608,C609,C610,C611)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 997.9583333333334);
    });
    it('PRICEMAT', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A616 = {v: 39493};
      workbook.Sheets.Sheet1.A617 = {v: 39551};
      workbook.Sheets.Sheet1.A618 = {v: 39397};
      workbook.Sheets.Sheet1.A619 = {v: 0.061};
      workbook.Sheets.Sheet1.A620 = {v: 0.061};
      workbook.Sheets.Sheet1.A621 = {v: 0};
      workbook.Sheets.Sheet1.F5 = {f: '=PRICEMAT(A616,A617,A618,A619,A620,A621)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 99.9841690643986);
    });

    it('QUOTIENT', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=QUOTIENT(-10, 3)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, -3);
    });

    it('=REPLACE', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.D649 = {v: '2009'};
      workbook.Sheets.Sheet1.F5 = {f: '=REPLACE(D649,3,2,"10")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 2010);
    });
    it('RATE', function() {//计算问题  0.007 excel直接舍到1%
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.C643 = {v: 4};
      workbook.Sheets.Sheet1.C644 = {v: -200};
      workbook.Sheets.Sheet1.C645 = {v: 8000};
      workbook.Sheets.Sheet1.F5 = {f: '=RATE(C643*12, C644, C645)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '1%');
      workbook.Sheets.Sheet1.F5 = {f: '=RATE(C643*12, C644, C645)*12'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, '0.09241767008436517');
    });
    it('RECEIVED', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A648 = {v: 39493};
      workbook.Sheets.Sheet1.A649 = {v: 39522};
      workbook.Sheets.Sheet1.A650 = {v: 10000000};
      workbook.Sheets.Sheet1.A651 = {v: 0.0575};
      workbook.Sheets.Sheet1.A652 = {v: 2};
      workbook.Sheets.Sheet1.F5 = {f: '=RECEIVED(A648,A649,A650,A651,A652)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 10046534.991941841);
    });
    //todo 对简明版不是很了解
    it('=ROMAN', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      // name2SheetProxy.Sheets.Sheet1.F5 = {f: '=ROMAN(499,0)'};
      // solveExpression.calculateWorkbook(name2SheetProxy);
      // console.log(name2SheetProxy.Sheets.Sheet1.F5.v)
      // assert.equal(name2SheetProxy.Sheets.Sheet1.F5.v, 'CDXCIX');
      workbook.Sheets.Sheet1.F5 = {f: '=ROMAN(499,1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 'LDVLIV');
      workbook.Sheets.Sheet1.F5 = {f: '=ROMAN(499,2)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 'XDIX');
      workbook.Sheets.Sheet1.F5 = {f: '=ROMAN(499,3)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 'VDIV');
      workbook.Sheets.Sheet1.F5 = {f: '=ROMAN(499,4)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 'ID');
    });

    it('ROUND', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=ROUND(-1.475, 2)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, -1.48);
    });


    it('SEARCH', function() {//函数中有""""目前处理是报错
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A668 = {v: 'Statements'};
      workbook.Sheets.Sheet1.A669 = {v: 'Profit Margin'};
      workbook.Sheets.Sheet1.A670 = {v: 'margin'};
      workbook.Sheets.Sheet1.A671 = {v: 'The "boss" is here.'};
      workbook.Sheets.Sheet1.F5 = {f: '=SEARCH(A670,A669)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 8);
      workbook.Sheets.Sheet1.F5 = {f: '=REPLACE(A669,SEARCH(A670,A669),6,"Amount")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 'Profit Amount');
      workbook.Sheets.Sheet1.F5 = {f: '=MID(A669,SEARCH(" ",A669)+1, 4)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 'Marg');
      workbook.Sheets.Sheet1.F5 = {f: '=SEARCH("""",A671)'};//函数中有""""目前处理是报错
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 5);
      workbook.Sheets.Sheet1.F5 = {f: '=MID(A671,SEARCH("""",A671)+1,SEARCH("""",A671,SEARCH("""",A671)+1)-SEARCH("""",A671)-1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 'boss');
    });
    it('SECOND', function() {//计算问题
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A675 = {v: 0.200208333333333};
      workbook.Sheets.Sheet1.A676 = {v: 0.2};
      workbook.Sheets.Sheet1.F5 = {f: '=SECOND(A675)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 18);
      workbook.Sheets.Sheet1.F5 = {f: '=SECOND(A676)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 0);
    });

    it('SERIESSUM', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A680 = {v: 0.785398163};
      workbook.Sheets.Sheet1.A681 = {v: 1};
      workbook.Sheets.Sheet1.A682 = {v: -0.5};
      workbook.Sheets.Sheet1.A683 = {v: 0.041666667};
      workbook.Sheets.Sheet1.A684 = {v: -0.001388889};
      workbook.Sheets.Sheet1.F5 = {f: '=SERIESSUM(A680,0,2,A681:A684)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 0.7071032152046538);
    });

    it('SHEET', function() {//未实现
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=SHEET("SHEET1")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 1);
      workbook.Sheets.Sheet1.F5 = {f: '=SHEETS()'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 0);
    });

    it('SQRT', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=SQRT(-16)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
    });

    it('SLOPE', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A705 = {v: 2};
      workbook.Sheets.Sheet1.A706 = {v: 3};
      workbook.Sheets.Sheet1.A707 = {v: 9};
      workbook.Sheets.Sheet1.A708 = {v: 1};
      workbook.Sheets.Sheet1.A709 = {v: 8};
      workbook.Sheets.Sheet1.A710 = {v: 7};
      workbook.Sheets.Sheet1.A711 = {v: 5};
      workbook.Sheets.Sheet1.B705 = {v: 6};
      workbook.Sheets.Sheet1.B706 = {v: 5};
      workbook.Sheets.Sheet1.B707 = {v: 11};
      workbook.Sheets.Sheet1.B708 = {v: 7};
      workbook.Sheets.Sheet1.B709 = {v: 5};
      workbook.Sheets.Sheet1.B710 = {v: 4};
      workbook.Sheets.Sheet1.B711 = {v: 4};
      workbook.Sheets.Sheet1.F5 = {f: '=SLOPE(A705:A711,B705:B711)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 0.3055555555555556);
    });
    it('SUMXMY2', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.F5 = {f: '=SUMXMY2({2,3,9,1,8,7,5}, {6,5,11,7,5,4,4})'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 79);
    });

    it('STDEV', function() {//计算问题
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.C703 = {v: 1345};
      workbook.Sheets.Sheet1.C704 = {v: 1301};
      workbook.Sheets.Sheet1.C705 = {v: 1368};
      workbook.Sheets.Sheet1.C706 = {v: 1322};
      workbook.Sheets.Sheet1.C707 = {v: 1310};
      workbook.Sheets.Sheet1.C708 = {v: 1370};
      workbook.Sheets.Sheet1.C709 = {v: 1318};
      workbook.Sheets.Sheet1.C710 = {v: 1350};
      workbook.Sheets.Sheet1.C711 = {v: 1303};
      workbook.Sheets.Sheet1.C712 = {v: 1299};
      workbook.Sheets.Sheet1.F5 = {f: '=STDEV(C703:C712)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 27.46391571984349);
      workbook.Sheets.Sheet1.F5 = {f: '=STDEVA(C703:C712)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 27.46391571984349);
      workbook.Sheets.Sheet1.F5 = {f: '=STDEVP(C703:C712)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 26.054558142482477);
      workbook.Sheets.Sheet1.F5 = {f: '=STDEVPA(C703:C712)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 26.054558142482477);
      workbook.Sheets.Sheet1.F5 = {f: '=STDEVS(C703:C712)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 27.46391571984349);
    });

    it('SUBTOTAL', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.D705 = {v: 120};
      workbook.Sheets.Sheet1.D706 = {v: 10};
      workbook.Sheets.Sheet1.D707 = {v: 150};
      workbook.Sheets.Sheet1.D708 = {v: 23};
      workbook.Sheets.Sheet1.F5 = {f: '=SUBTOTAL(1,D705:D708)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 75.75);
    });

    it('SUMIF', function() {//计算错误
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A725 = {v: 1000000};
      workbook.Sheets.Sheet1.A726 = {v: 2000000};
      workbook.Sheets.Sheet1.A727 = {v: 3000000};
      workbook.Sheets.Sheet1.A728 = {v: 4000000};
      workbook.Sheets.Sheet1.B725 = {v: 70000};
      workbook.Sheets.Sheet1.B726 = {v: 140000};
      workbook.Sheets.Sheet1.B727 = {v: 210000};
      workbook.Sheets.Sheet1.B728 = {v: 280000};
      workbook.Sheets.Sheet1.C725 = {v: 2500000};
      workbook.Sheets.Sheet1.F5 = {f: '=SUMIF(A725:A728,">1600000",B725:B728)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 630000);
      workbook.Sheets.Sheet1.F5 = {f: '=SUMIF(A725:A728,3000000,B725:B728)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 210000);
      workbook.Sheets.Sheet1.F5 = {f: '=SUMIF(A725:A728,">" & C725,B725:B728)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.F5.v)
      assert.equal(workbook.Sheets.Sheet1.F5.v, 490000);
    });


    it('SUMX2MY2', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A11 = {f: '=SUMX2MY2({2,3,9,1,8,7,5}, {6,5,11,7,5,4,4})'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, -55);
      workbook.Sheets.Sheet1.A11 = {f: '=SUMX2PY2({2,3,9,1,8,7,5}, {6,5,11,7,5,4,4})'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 521);
    });

    it('SWITCH', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.C741 = {v: 2};
      workbook.Sheets.Sheet1.C742 = {v: 99};
      workbook.Sheets.Sheet1.C745 = {v: 3};
      workbook.Sheets.Sheet1.A11 = {f: '=SWITCH(C741,1,"星期天",2,"星期一",3,"星期二","无匹配")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, "星期一");
      workbook.Sheets.Sheet1.A11 = {f: '=SWITCH(C742,1,"星期天",2,"星期一",3,"星期二")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      workbook.Sheets.Sheet1.A11 = {f: '=SWITCH(C745,1,"星期天",2,"星期一",3,"星期二","无匹配")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, "星期二");
    });

    it('T', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.D737 = {v: 19};
      workbook.Sheets.Sheet1.D738 = {v: 'TRUE'};
      workbook.Sheets.Sheet1.A11 = {f: '=T(D737)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, "");
      workbook.Sheets.Sheet1.A11 = {f: '=T(D738)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, "");
    });

    it('TD', function() {//计算错误
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A761 = {v: 1.959999998};
      workbook.Sheets.Sheet1.A762 = {v: 60};
      workbook.Sheets.Sheet1.A11 = {f: '=TDIST(A761,A762,2)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 0.05984790660355124);
      workbook.Sheets.Sheet1.A11 = {f: '=TDIST(A761,A762,1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 0.0273224649879605);
      workbook.Sheets.Sheet1.A11 = {f: '=TDISTRT(A761,A762)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 0.027322);
    });
    it('TEXT', function() {//jsspreadsheet
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A11 = {f: '=TEXT(1234.567,"$#,##0.00")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      workbook.Sheets.Sheet1.A11 = {f: '=TEXT(0.285,"0.0%")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      workbook.Sheets.Sheet1.A11 = {f: '=TEXT(4.34,"# ?/?")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      workbook.Sheets.Sheet1.A11 = {f: '=TRIM(TEXT(0.34,"# ?/?"))'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      workbook.Sheets.Sheet1.A11 = {f: '=TEXT(1234567898,"[<=9999999]###-####;(###) ###-####")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, '(123) 456-7898');
      workbook.Sheets.Sheet1.A11 = {f: '=TEXT(1234,"0000000")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      workbook.Sheets.Sheet1.A11 = {f: '=TEXT(TODAY(),"YY/MM/DD")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      workbook.Sheets.Sheet1.A11 = {f: '=TEXT(TODAY(),"DDDD")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      workbook.Sheets.Sheet1.A11 = {f: '=TEXT(NOW(),"HH:MM AM/PM")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      workbook.Sheets.Sheet1.A11 = {f: '=TEXT(4.34,"# ?/?")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, '4 1/3');
      workbook.Sheets.Sheet1.A11 = {f: '=TRIM(TEXT(0.34,"# ?/?"))'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, '1/3');
      workbook.Sheets.Sheet1.A11 = {f: '=TEXT(12200000,"0.00E+00")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, '1.22E+07');
      workbook.Sheets.Sheet1.A11 = {f: '=TEXT(1234,"0000000")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, '0001234');
      workbook.Sheets.Sheet1.A11 = {f: '=TEXT(123456,"##0° 00\' 00\'\'")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, '12° 34\' 56\'\'');
    });
    it('a4', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A4 = {v: ''};
      workbook.Sheets.Sheet1.A11 = {f: '=A5'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A5.v)
      assert.equal(workbook.Sheets.Sheet1.A5.v, '0');
    });
    it('"', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A11 = {f: '=""""'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, '"');
    });

    it('TIME', function() {//jsspreadsheet
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A765 = {v: 12};
      workbook.Sheets.Sheet1.A766 = {v: 16};
      workbook.Sheets.Sheet1.B765 = {v: 0};
      workbook.Sheets.Sheet1.B766 = {v: 48};
      workbook.Sheets.Sheet1.C765 = {v: 0};
      workbook.Sheets.Sheet1.C766 = {v: 10};
      workbook.Sheets.Sheet1.A11 = {f: '=TIME(A765,B765,C765)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 0.5);
      workbook.Sheets.Sheet1.A11 = {f: '=TIME(A766,B766,C766)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 0.7001157407407408);
      workbook.Sheets.Sheet1.A11 = {f: '=TIMEVALUE("2:24 AM")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 0.1);
      workbook.Sheets.Sheet1.A11 = {f: '=TIMEVALUE("2011-8-22 6:35")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 0.2743055555555556);
    });

    it('TINV', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A11 = {f: '=TINV(0.05464,60)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 1.9600411623931224);
    });

    it('TTest', function() {//计算有误
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A788 = {v: 3};
      workbook.Sheets.Sheet1.A789 = {v: 4};
      workbook.Sheets.Sheet1.A790 = {v: 5};
      workbook.Sheets.Sheet1.A791 = {v: 8};
      workbook.Sheets.Sheet1.A792 = {v: 9};
      workbook.Sheets.Sheet1.A793 = {v: 1};
      workbook.Sheets.Sheet1.A794 = {v: 2};
      workbook.Sheets.Sheet1.A795 = {v: 4};
      workbook.Sheets.Sheet1.A796 = {v: 5};
      workbook.Sheets.Sheet1.B788 = {v: 6};
      workbook.Sheets.Sheet1.B789 = {v: 19};
      workbook.Sheets.Sheet1.B790 = {v: 3};
      workbook.Sheets.Sheet1.B791 = {v: 2};
      workbook.Sheets.Sheet1.B792 = {v: 14};
      workbook.Sheets.Sheet1.B793 = {v: 4};
      workbook.Sheets.Sheet1.B794 = {v: 5};
      workbook.Sheets.Sheet1.B795 = {v: 17};
      workbook.Sheets.Sheet1.B796 = {v: 1};
      workbook.Sheets.Sheet1.A11 = {f: '=TTEST(A788:A796,B788:B796,2,1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 0.196);
    });

    it('TREND', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet2 = {};
      workbook.Sheets.Sheet1.A774 = {v: 1};
      workbook.Sheets.Sheet1.A775 = {v: 2};
      workbook.Sheets.Sheet1.A776 = {v: 3};
      workbook.Sheets.Sheet1.A777 = {v: 4};
      workbook.Sheets.Sheet1.A778 = {v: 5};
      workbook.Sheets.Sheet1.A779 = {v: 6};
      workbook.Sheets.Sheet1.A780 = {v: 7};
      workbook.Sheets.Sheet1.A781 = {v: 8};
      workbook.Sheets.Sheet1.A782 = {v: 9};
      workbook.Sheets.Sheet1.A783 = {v: 10};
      workbook.Sheets.Sheet1.A784 = {v: 11};
      workbook.Sheets.Sheet1.A785 = {v: 12};
      workbook.Sheets.Sheet1.B774 = {v: 133890};
      workbook.Sheets.Sheet1.B775 = {v: 135000};
      workbook.Sheets.Sheet1.B776 = {v: 135790};
      workbook.Sheets.Sheet1.B777 = {v: 137300};
      workbook.Sheets.Sheet1.B778 = {v: 138130};
      workbook.Sheets.Sheet1.B779 = {v: 139100};
      workbook.Sheets.Sheet1.B780 = {v: 139900};
      workbook.Sheets.Sheet1.B781 = {v: 141120};
      workbook.Sheets.Sheet1.B782 = {v: 141890};
      workbook.Sheets.Sheet1.B783 = {v: 143230};
      workbook.Sheets.Sheet1.B784 = {v: 144000};
      workbook.Sheets.Sheet1.B785 = {v: 145290};
      workbook.Sheets.Sheet1.C774 = {v: 13};
      workbook.Sheets.Sheet1.C775 = {v: 14};
      workbook.Sheets.Sheet1.C776 = {v: 15};
      workbook.Sheets.Sheet1.C777 = {v: 16};
      workbook.Sheets.Sheet1.C778 = {v: 17};
      workbook.Sheets.Sheet1.A11 = {f: '=TREND($B$774:$B$785,$A$774:$A$785,C774)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 146171.51515151517);
      workbook.Sheets.Sheet1.A11 = {f: '=TREND($B$774:$B$785,$A$774:$A$785,C775)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 147189.69696969696);
      workbook.Sheets.Sheet1.A11 = {f: '=TREND($B$774:$B$785,$A$774:$A$785,C776)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 148207.87878787878);
      workbook.Sheets.Sheet1.A11 = {f: '=TREND($B$774:$B$785,$A$774:$A$785,C777)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 149226.0606060606);
      workbook.Sheets.Sheet1.A11 = {f: '=TREND($B$774:$B$785,$A$774:$A$785,C778)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 150244.24242424243);
    });

    it('TRANSPOSE', function() {//多值函数
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet2 = {};
      workbook.Sheets.Sheet1.A768 = {v: 1};
      workbook.Sheets.Sheet1.A769 = {v: 2};
      workbook.Sheets.Sheet1.A770 = {v: 3};
      workbook.Sheets.Sheet1.A771 = {v: 4};
      workbook.Sheets.Sheet1.B768 = {v: 100};
      workbook.Sheets.Sheet1.B769 = {v: 200};
      workbook.Sheets.Sheet1.B770 = {v: 150};
      workbook.Sheets.Sheet1.B771 = {v: 300};
      workbook.Sheets.Sheet1.A11 = {f: '=TRANSPOSE(A768:B771)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
    });
    it('TBILLYIELD', function() {//jisuan
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet2 = {};
      workbook.Sheets.Sheet1.A756 = {v: 39538};
      workbook.Sheets.Sheet1.A757 = {v: 39600};
      workbook.Sheets.Sheet1.A758 = {v: 98.45};
      workbook.Sheets.Sheet1.A11 = {f: '=TBILLYIELD(A756,A757,A758)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 0.09141696292534264);
    });


    it('TYPE', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.C788 = {v: 'Smith'};
      workbook.Sheets.Sheet1.A11 = {f: '=TYPE(C788)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 2);
      workbook.Sheets.Sheet1.A11 = {f: '=TYPE("MR. "&C788)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 2);
      workbook.Sheets.Sheet1.A11 = {f: '=TYPE(2+C788)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
    });

    it('UNICHAR', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A11 = {f: '=UNICHAR(0)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
    });

    it('VALUE', function() {//计算错误，应该是时间格式问题
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A11 = {f: '=VALUE("$1000")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 1000);
      workbook.Sheets.Sheet1.A11 = {f: '=VALUE("16:48:00")-VALUE("12:00:00")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 0.19999999999999996);
    });

    it('VAR.P', function() {//计算错误
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet2 = {};
      workbook.Sheets.Sheet1.A799 = {v: 1345};
      workbook.Sheets.Sheet1.A800 = {v: 1301};
      workbook.Sheets.Sheet1.A801 = {v: 1368};
      workbook.Sheets.Sheet1.A802 = {v: 1322};
      workbook.Sheets.Sheet1.A803 = {v: 1310};
      workbook.Sheets.Sheet1.A804 = {v: 1370};
      workbook.Sheets.Sheet1.A805 = {v: 1318};
      workbook.Sheets.Sheet1.A806 = {v: 1350};
      workbook.Sheets.Sheet1.A807 = {v: 1303};
      workbook.Sheets.Sheet1.A808 = {v: 1299};
      workbook.Sheets.Sheet1.A11 = {f: '=VAR(A799:A808)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 754.2666666666665);
      workbook.Sheets.Sheet1.A11 = {f: '=VAR.P(A799:A808)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 678.8399999999999);
      workbook.Sheets.Sheet1.A11 = {f: '=VAR.S(A799:A808)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 754.2666666666665);
      workbook.Sheets.Sheet1.A11 = {f: '=VARA(A799:A808)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 754.2666666666665);
      workbook.Sheets.Sheet1.A11 = {f: '=VARP(A799:A808)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 678.8399999999999);
      workbook.Sheets.Sheet1.A11 = {f: '=VARPA(A799:A808)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 678.8399999999999);
      workbook.Sheets.Sheet1.A11 = {f: '=VARS(A799:A808)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 754.2666666666665);
    });
    it('YIELDMAT', function() {//未实现
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet2 = {};
      workbook.Sheets.Sheet1.A844 = {v: 39522};
      workbook.Sheets.Sheet1.A845 = {v: 39755};
      workbook.Sheets.Sheet1.A846 = {v: 39394};
      workbook.Sheets.Sheet1.A847 = {v: 0.0625};
      workbook.Sheets.Sheet1.A848 = {v: 100.0123};
      workbook.Sheets.Sheet1.A849 = {v: 0};
      workbook.Sheets.Sheet1.A11 = {f: '=YIELDMAT(A844,A845,A846,A847,A848,A849)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 754.27);
    });
    it('YEAR', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A11 = {f: '=YEAR("2010-7-5")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, '2010');
      workbook.Sheets.Sheet1.A11 = {f: '=YEAR("2008-7-5")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, '2008');
    });
    it('YIELD', function() {//未实现
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet2 = {};
      workbook.Sheets.Sheet1.A835 = {v: 39493};
      workbook.Sheets.Sheet1.A836 = {v: 42689};
      workbook.Sheets.Sheet1.A837 = {v: 0.0575};
      workbook.Sheets.Sheet1.A838 = {v: 95.04287};
      workbook.Sheets.Sheet1.A839 = {v: 100};
      workbook.Sheets.Sheet1.A840 = {v: 2};
      workbook.Sheets.Sheet1.A841 = {v: 0};
      workbook.Sheets.Sheet1.A11 = {f: '=YIELD(A835,A836,A837,A838,A839,A840,A841)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 754.27);
    });

    it('YEARFRAC', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet2 = {};
      workbook.Sheets.Sheet1.A831 = {v: 40909};
      workbook.Sheets.Sheet1.A832 = {v: 41120};
      workbook.Sheets.Sheet1.A11 = {f: '=YEARFRAC(A831,A832)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 0.5805555555555556);
    });

    it('MODESNGL', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet2 = {};
      workbook.Sheets.Sheet1.D518 = {v: 5.6};
      workbook.Sheets.Sheet1.D519 = {v: 4};
      workbook.Sheets.Sheet1.D520 = {v: 4};
      workbook.Sheets.Sheet1.D521 = {v: 3};
      workbook.Sheets.Sheet1.D522 = {v: 2};
      workbook.Sheets.Sheet1.D523 = {v: 4};
      workbook.Sheets.Sheet1.A11 = {f: '=MODESNGL(D518:D523)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 4);
    });
    it('YIELDDISC', function() {//未实现
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet2 = {};
      workbook.Sheets.Sheet1.C835 = {v: 39494};
      workbook.Sheets.Sheet1.C836 = {v: 39508};
      workbook.Sheets.Sheet1.C837 = {v: 99.795};
      workbook.Sheets.Sheet1.C838 = {v: 100};
      workbook.Sheets.Sheet1.C839 = {v: 2};
      workbook.Sheets.Sheet1.A11 = {f: '=YIELDDISC(C835,C836,C837,C838,C839)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 754.27);
    });
    it('YIELDMAT', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet2 = {};
      workbook.Sheets.Sheet1.A844 = {v: 39522};
      workbook.Sheets.Sheet1.A845 = {v: 39755};
      workbook.Sheets.Sheet1.A846 = {v: 39394};
      workbook.Sheets.Sheet1.A847 = {v: 0.0625};
      workbook.Sheets.Sheet1.A848 = {v: 100.0123};
      workbook.Sheets.Sheet1.A849 = {v: 0};
      workbook.Sheets.Sheet1.A11 = {f: '=YIELDMAT(A844,A845,A846,A847,A848,A849)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 754.27);
    });

    it('VDB', function() {//计算错误
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet2 = {};
      workbook.Sheets.Sheet1.B799 = {v: 2400};
      workbook.Sheets.Sheet1.B800 = {v: 300};
      workbook.Sheets.Sheet1.B801 = {v: 10};
      workbook.Sheets.Sheet1.A11 = {f: '=VDB(B799, B800, B801*365, 0, 1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 1.31506849315068);
      workbook.Sheets.Sheet1.A11 = {f: '=VDB(B799, B800, B801*12, 0, 1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 40);
      workbook.Sheets.Sheet1.A11 = {f: '=VDB(B799, B800, B801, 0, 1)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 480);
      workbook.Sheets.Sheet1.A11 = {f: '=VDB(B799, B800, B801*12, 6, 18)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 396.306053264751);
      workbook.Sheets.Sheet1.A11 = {f: '=VDB(B799, B800, B801*12, 6, 18, 1.5)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 311.808936658234);
      workbook.Sheets.Sheet1.A11 = {f: '=VDB(B799, B800, B801, 0, 0.875, 1.5)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 315);


    });
    it('W', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet2 = {};
      workbook.Sheets.Sheet1.A817 = {v: 105};
      workbook.Sheets.Sheet1.A818 = {v: 20};
      workbook.Sheets.Sheet1.A819 = {v: 100};
      workbook.Sheets.Sheet1.A11 = {f: '=WEIBULL(A817,A818,A819,TRUE)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 0.9295813900692769);
      workbook.Sheets.Sheet1.A11 = {f: '=WEIBULL(A817,A818,A819,FALSE)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 0.03558886402450435);
      workbook.Sheets.Sheet1.A11 = {f: '=WEIBULLDIST(A817,A818,A819,TRUE)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 0.9295813900692769);
      workbook.Sheets.Sheet1.A11 = {f: '=WEIBULLDIST(A817,A818,A819,FALSE)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 0.03558886402450435);
    });
    it('WORKDAY', function() {//jsspreadsheet
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet2 = {};
      workbook.Sheets.Sheet1.A824 = {v: 39722};
      workbook.Sheets.Sheet1.A825 = {v: 151};
      workbook.Sheets.Sheet1.A826 = {v: 39778};
      workbook.Sheets.Sheet1.A827 = {v: 39786};
      workbook.Sheets.Sheet1.A828 = {v: 39834};
      workbook.Sheets.Sheet1.A11 = {f: '=WORKDAY(A824,A825)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 39933);
      workbook.Sheets.Sheet1.A11 = {f: '=WORKDAY(A824,A825,A826:A828)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 39938);
      workbook.Sheets.Sheet1.A11 = {f: '=WORKDAYINTL(DATE(2012,1,1),30,0)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      workbook.Sheets.Sheet1.A11 = {f: '=WORKDAYINTL(DATE(2012,1,1),90,11)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      workbook.Sheets.Sheet1.A11 = {f: '=TEXT(WORKDAYINTL(DATE(2012,1,1),30,17),"m/dd/yyyy")'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, '12/31/2011');
    });


    it('CHISQ.DIST', function() {
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A11 = {f: '=CHISQ.DIST(2,3,FALSE)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 0.20755374871029836);
    });

    it('ZTEST', function() {//计算错误
      let calc = new Calc()
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.A852 = {v: 3};
      workbook.Sheets.Sheet1.A853 = {v: 6};
      workbook.Sheets.Sheet1.A854 = {v: 7};
      workbook.Sheets.Sheet1.A855 = {v: 8};
      workbook.Sheets.Sheet1.A856 = {v: 6};
      workbook.Sheets.Sheet1.A857 = {v: 5};
      workbook.Sheets.Sheet1.A858 = {v: 4};
      workbook.Sheets.Sheet1.A859 = {v: 2};
      workbook.Sheets.Sheet1.A860 = {v: 1};
      workbook.Sheets.Sheet1.A861 = {v: 9};
      workbook.Sheets.Sheet1.A11 = {f: '=Z.TEST(A852:A861,4)'};
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.A11.v)
      assert.equal(workbook.Sheets.Sheet1.A11.v, 0.09057419685136381);
    });

  });
});
