// 这里需要把公式解析做对
import assert from 'assert';
import { Calc } from '../../src/calc/calc_cmd/calc';
import { NewLocRefactorBhv, calc, UserMoveRefactorBhv } from '../../src/calc';
import { MS_PER_DAY } from '../../src/calc/calc_utils/config';
import { CellVDateTime, CellVNumber } from '../../src/calc/cell_value_type/cell_value';
import { compareFloat } from '../../src/calc/calc_utils/helper';
import { ERROR_DIV0, ERROR_NA } from '../../src/calc/calc_utils/error_config';
import { assertArrayEqual } from '../../src/utils/compare';

it('date', function () { // 检查符号的判定
  let dayNum = 400;
  let v = new CellVNumber(dayNum).toDate();
  console.log(v);
});

it('学习js中的date', function () { // 检查simple_expression的判定是否正确
  let d1900 = new Date(1900, 0, 1);
  let a1 = new Date(d1900.getTime() + (0 - 2) * MS_PER_DAY); // js 的date是从1970年开始的呀
  let a2 = new Date(d1900.getTime() + (1 - 2) * MS_PER_DAY);
  let a3 = new Date(d1900.getTime() + (61.5 - 2) * MS_PER_DAY);
  console.log(a1, a2, a3);
  let d18991230 = new Date(1989, 11, 30);
  let a4 = new Date(d18991230.getTime() + (61.5) * MS_PER_DAY);
  let a5 = new Date('1991/1s01/01');
  console.log(a1, a2, a3);

});

describe('新的解析算法', function () {
  it('数组公式报错', function () { // structuralExpression 在去掉空格之前的解析逻辑
    let workbook = {};
    workbook.Sheets = {};
    workbook.Sheets.Sheet1 = {};
    workbook.Sheets.Sheet1.A1 = { f: '={average(A1:A2)}' }; // 不支持数组公式
    // workbook.Sheets.Sheet1.B1 = {f: '=FLOOR.MATH(-8.1,2)'}; // 负号运算符
    let calc = new Calc();
    calc.calculateWorkbook(workbook);
    assert.equal(workbook.Sheets.Sheet1.A1.v.toString(), '#SYNTAX');
  });

  it('minus', function () { // 检查符号的判定
    let workbook = {};
    workbook.Sheets = {};
    workbook.Sheets.Sheet1 = {};
    let calc = new Calc();
    calc.calculateWorkbook(workbook);

    workbook.Sheets.Sheet1.B1 = { f: '=FLOOR.MATH(-8.1,2)' }; // 负号运算符
    workbook.Sheets.Sheet1.B2 = { f: '=B1+1' }; // 负号运算符

    let updatedRes = calc.updateByMultiSheetObj(workbook.Sheets);
    assert.equal(updatedRes.Sheet1.B1.v.toNumber(), -10);
  });


  it('SimpleExpression', function () { // 检查simple_expression的判定是否正确 ==> OK!!!
    let workbook = {};
    workbook.Sheets = {};
    workbook.Sheets.Sheet1 = {};
    // workbook.Sheets.Sheet1.A1 = {f:""} // 空字符串，看对不对
    // workbook.Sheets.Sheet1.A2 = {f:"'2019/1/10 12:12:12.12"}; // 强制字符串
    workbook.Sheets.Sheet1.A3 = { f: '2019/1/12 12:12:12.12' };
    workbook.Sheets.Sheet1.B3 = { f: '2019年1月10日 12:12:12.12' };
    workbook.Sheets.Sheet1.A4 = { f: '00001,123,123.56e12' };
    workbook.Sheets.Sheet1.A5 = { f: '$  123,123e12' };
    workbook.Sheets.Sheet1.A6 = { f: '   123,123e12  %  ' };
    workbook.Sheets.Sheet1.A7 = { f: '   123,123123e12  %  ' }; // 无法解析
    workbook.Sheets.Sheet1.A8 = { f: 'trUe' }; // 转化为true
    workbook.Sheets.Sheet1.A9 = { f: '75.91%' }; // 无法解析


    let calc = new Calc();
    calc.calculateWorkbook(workbook);
    // assert.equal(workbook.Sheets.Sheet1.A1.v.toNumber(), 0);
    // assert.equal(workbook.Sheets.Sheet1.A2.v.toString(), "2019/1/10 12:12:12.12");
    assert(compareFloat(workbook.Sheets.Sheet1.A3.v.toNumber(), 43477.5084736));
    assert(compareFloat(workbook.Sheets.Sheet1.B3.v.toNumber(), 43475.508472222));
    assert.equal(workbook.Sheets.Sheet1.A4.v.toNumber(), 1123123.56e12);
    assert.equal(workbook.Sheets.Sheet1.A5.v.toNumber(), 1.23123e17);
    assert.equal(workbook.Sheets.Sheet1.A6.v.toNumber(), 1231230000000000);
    assert.equal(workbook.Sheets.Sheet1.A7.v.toString(), '   123,123123e12  %  ');
    assert.equal(workbook.Sheets.Sheet1.A8.v.toNumber(), 1);
    assert.equal(workbook.Sheets.Sheet1.A9.v.toNumber(), 0.7591);


    console.log(workbook.Sheets.Sheet1);
    // assert.equal(workbook.Sheets.Sheet1.H614.v, "asdf-as");
  });

  it('负号优先计算', function () { // 检查符号的判定
    let workbook = {};
    workbook.Sheets = {};
    workbook.Sheets.Sheet1 = {};
    // workbook.Sheets.Sheet1.B1 = {f: '=FLOOR.MATH(-25-8.1*2,2)'}; // 负号运算符
    workbook.Sheets.Sheet1.B6 = { f: '1' }; // 负号运算符
    workbook.Sheets.Sheet1.C6 = { f: '2' }; // 负号运算符
    workbook.Sheets.Sheet1.B2 = { f: '=-(1+B6)^C6' }; // 负号运算符优先计算结果为4
    workbook.Sheets.Sheet1.B3 = { f: '=-((1+B6)^C6)' }; // 为-4


    let calc = new Calc();
    calc.calculateWorkbook(workbook);
    // console.log(workbook.Sheets.Sheet1.B1.v);
    // assert.equal(workbook.Sheets.Sheet1.B1.v, -42);
    assert.equal(workbook.Sheets.Sheet1.B2.v, 4);
    assert.equal(workbook.Sheets.Sheet1.B3.v, -4);

  });
  it('连续双引号', function () { // 检查连续双引号的判定; done
    let workbook = {};
    workbook.Sheets = {};
    workbook.Sheets.Sheet1 = {};
    workbook.Sheets.Sheet1.B1 = { f: '=""""""' };
    workbook.Sheets.Sheet1.B2 = { f: '="""we"""' };

    let calc = new Calc();
    calc.calculateWorkbook(workbook);
    console.log(workbook.Sheets.Sheet1.B1.v);
    assert.equal(workbook.Sheets.Sheet1.B1.v.toString(), '""');
    assert.equal(workbook.Sheets.Sheet1.B2.v.toString(), '"we"');
  });
  it('数组计算', function () { // todo: 直接输入数组，要能够解析出来
    let workbook = {};
    workbook.Sheets = {};
    workbook.Sheets.Sheet1 = {};
    // workbook.Sheets.Sheet1.A1 = {f: '=AVERAGE({1,3}+{3,2})'};
    // workbook.Sheets.Sheet1.A2 = {f: '=AVERAGE({1,3}  +  {3,2} * {1,3})'};
    // workbook.Sheets.Sheet1.A3 = {f: '=AVERAGE({1,3}  +  {3,2} * 2)'};
    workbook.Sheets.Sheet1.A4 = { f: '=average({1,2;3,4}*2)' };


    let calc = new Calc();
    calc.calculateWorkbook(workbook);
    // assert.equal(workbook.Sheets.Sheet1.A1.v.toNumber(), 4.5);
    // assert.equal(workbook.Sheets.Sheet1.A2.v.toNumber(), 6.5);
    // assert.equal(workbook.Sheets.Sheet1.A3.v.toNumber(), 7);
    assert.equal(workbook.Sheets.Sheet1.A4.v.toNumber(), 5);
  });
  it('average忽略非数字', function () {
    let workbook = {};
    workbook.Sheets = {};
    workbook.Sheets.Sheet1 = {};
    workbook.Sheets.Sheet1.A1 = {f: '8'};
    workbook.Sheets.Sheet1.A2 = {f: '9'};
    workbook.Sheets.Sheet1.A3 = {f: '10'};
    workbook.Sheets.Sheet1.A4 = {f: 'afsf'};
    workbook.Sheets.Sheet1.A5 = {f: 'true'};
    workbook.Sheets.Sheet1.B1 = { f: '=average(A:A)' };


    let aCalc = new Calc();
    aCalc.calculateWorkbook(workbook);
    assert.equal(workbook.Sheets.Sheet1.B1.v.toNumber(), 9);
  });
// 强制替换公式中的引用，绝对引用会发生变化。例如本单元格引用的某个单元格被移动
  it('引用替换-newLoc', function () {
    let workbook = {};
    workbook.Sheets = {};
    workbook.Sheets.Sheet1 = {};
    workbook.Sheets.Sheet1.B2 = { f: '=average(C:$F)&"A:A"+A1+average($A1:B1)' };


    let aCalc = new Calc();
    aCalc.calculateWorkbook(workbook);
    assert.equal(workbook.Sheets.Sheet1.B2.v.toString(), ERROR_DIV0);
    let aRefactor = new NewLocRefactorBhv( [[0, 6]],[0,2],[[0,2],[3,8]])
    let theCell =  aCalc.calcWorkbookProxy.getCellByName("Sheet1", "B2")
    let refUnitArray = theCell.getRefSyntaxUnitArray()
    let expectedArray = ["C:$F","A1","$A1:B1"]
    // refUnitArray.map((val, index)=> assert.equal(val.wholeStr,expectedArray[index]))
    assertArrayEqual(refUnitArray.map(f=>f.wholeStr), expectedArray) // 比较两个数组
    let resString2 = theCell.getFormulaStringByRefactor(aRefactor)
    assert.equal(resString2, 'average(A:$G)&"A:A"+A3+average($A4:C9)')
  });
// 提供公式中的引用，绝对引用不发生变化。例如本单元格被剪切黏贴
  it('引用替换-shift', function () {
    let workbook = {};
    workbook.Sheets = {};
    workbook.Sheets.Sheet1 = {};
    workbook.Sheets.Sheet1.B2 = { f: '=average(C:$F)&"A:A" + $A$1 + A$1 + average(A1:$B1)' };
    let aCalc = new Calc();
    aCalc.calculateWorkbook(workbook);
    assert.equal(workbook.Sheets.Sheet1.B2.v.toString(), ERROR_DIV0);
    let aRefactor = new UserMoveRefactorBhv( [[1, 1]],[1,1],[[1,1],[1,1]])
    let resString2 = aCalc.calcWorkbookProxy.getCellByName("Sheet1", "B2").getFormulaStringByRefactor(aRefactor)
    assert.equal(resString2, 'average(D:$F)&"A:A"+ $A$1 + B$1 +  average(B2:$B2)')
  });


  it('circular', function () { // 检查循环依赖的判定;
    let workbook = {};
    workbook.Sheets = {};
    workbook.Sheets.Sheet1 = {};
    workbook.Sheets.Sheet1.A29 = { v: 10 };
    workbook.Sheets.Sheet1.A30 = { v: 9 };
    workbook.Sheets.Sheet1.A31 = { v: 27 };
    workbook.Sheets.Sheet1.A32 = { v: 2 };
    workbook.Sheets.Sheet1.A5 = { f: '=AVERAGE($A$28:$A$32)' };
    workbook.Sheets.Sheet1.A28 = { f: '=A5+A29' }; // formula的计算顺序与初次赋值时间从晚向前
    let calc = new Calc();
    calc.calculateWorkbook(workbook);
    assert.equal(workbook.Sheets.Sheet1.A5.w, '#CIRCULA!');
  });

  it('IF - VLOOKUP', function() {
    let calc = new Calc()
    let workbook = {};
    workbook.Sheets = {};
    workbook.Sheets.Sheet1 = {};
    workbook.Sheets.Sheet1.A811 = {f: '101'};
    workbook.Sheets.Sheet1.A812 = {f: '102'};
    workbook.Sheets.Sheet1.A813 = {f: '103'};
    workbook.Sheets.Sheet1.A814 = {f: '104'};
    workbook.Sheets.Sheet1.A815 = {f: '105'};
    workbook.Sheets.Sheet1.A816 = {f: '106'};

    workbook.Sheets.Sheet1.B811 = {f: '康'};
    workbook.Sheets.Sheet1.B812 = {f: '袁'};
    workbook.Sheets.Sheet1.B813 = {f: '牛'};
    workbook.Sheets.Sheet1.B814 = {f: '宋'};
    workbook.Sheets.Sheet1.B815 = {f: '谢'};
    workbook.Sheets.Sheet1.B816 = {f: '廖'};

    workbook.Sheets.Sheet1.C811 = {f: '霓'};
    workbook.Sheets.Sheet1.C812 = {f: '洛'};
    workbook.Sheets.Sheet1.C813 = {f: '娇'};
    workbook.Sheets.Sheet1.C814 = {f: '臻'};
    workbook.Sheets.Sheet1.C815 = {f: '德'};
    workbook.Sheets.Sheet1.C816 = {f: '磊'};

    workbook.Sheets.Sheet1.D811 = {f: '销售代表'};
    workbook.Sheets.Sheet1.D812 = {f: '销售副总裁'};
    workbook.Sheets.Sheet1.D813 = {f: '销售代表'};
    workbook.Sheets.Sheet1.D814 = {f: '销售代表'};
    workbook.Sheets.Sheet1.D815 = {f: '销售经理'};
    workbook.Sheets.Sheet1.D816 = {f: '销售代表'};

    workbook.Sheets.Sheet1.E811 = {f: '1968/12/8'};
    workbook.Sheets.Sheet1.E812 = {f: '1962/2/19'};
    workbook.Sheets.Sheet1.E813 = {f: '1963/8/30'};
    workbook.Sheets.Sheet1.E814 = {f: '1958/9/19'};
    workbook.Sheets.Sheet1.E815 = {f: '1955/3/4'};
    workbook.Sheets.Sheet1.E816 = {f: '1953/7/2'};
    workbook.Sheets.Sheet1.A11 = {f: '=IF(VLOOKUP(103,A811:E816,2,FALSE)="夏","是夏","不是夏")'};
    calc.calculateWorkbook(workbook);
    console.log(workbook.Sheets.Sheet1.A11.v)
    assert.equal(workbook.Sheets.Sheet1.A11.v, "不是夏");
  });

});
