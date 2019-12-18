// 这里需要把公式解析做对
import assert from 'assert';
import { Calc } from '../../src/calc/calc_cmd/calc';
import { MS_PER_DAY } from '../../src/calc/calc_utils/config';
import { CellVDateTime, CellVNumber } from '../../src/calc/cell_value_type/cell_value';
import { compareFloat } from '../../src/calc/calc_utils/helper';

it('date', function() { // 检查符号的判定
  let dayNum = 400
  let v = new CellVNumber(dayNum).toDate()
  console.log(v)
});

it('学习js中的date', function() { // 检查simple_expression的判定是否正确
  let d1900 = new Date(1900, 0, 1);
  let a1 = new Date(d1900.getTime() + (0 -2) * MS_PER_DAY) // js 的date是从1970年开始的呀
  let a2 = new Date(d1900.getTime() + (1 -2) * MS_PER_DAY)
  let a3 = new Date(d1900.getTime() + (61.5 -2) * MS_PER_DAY)
  console.log(a1, a2, a3)
  let d18991230 = new Date(1989, 11, 30);
  let a4 = new Date(d18991230.getTime() + (61.5) * MS_PER_DAY)
  let a5 = new Date("1991/1s01/01")
  console.log(a1, a2, a3)

});

describe('新的解析算法', function() {
  it('数组公式报错', function() { // structuralExpression 在去掉空格之前的解析逻辑
    let workbook = {};
    workbook.Sheets = {};
    workbook.Sheets.Sheet1 = {};
    workbook.Sheets.Sheet1.A1 = {f: '={average(A1:A2)}'}; // 不支持数组公式
    // workbook.Sheets.Sheet1.B1 = {f: '=FLOOR.MATH(-8.1,2)'}; // 负号运算符
    let calc = new Calc()
    calc.calculateWorkbook(workbook);
    assert.equal(workbook.Sheets.Sheet1.A1.v.toString(), "#SYNTAX");
  });

  it('minus', function() { // 检查符号的判定
    let workbook = {};
    workbook.Sheets = {};
    workbook.Sheets.Sheet1 = {};
    let calc = new Calc()
    calc.calculateWorkbook(workbook);

    workbook.Sheets.Sheet1.B1 = {f: '=FLOOR.MATH(-8.1,2)'}; // 负号运算符
    workbook.Sheets.Sheet1.B2 = {f: '=B1+1'}; // 负号运算符

    let updatedRes = calc.updateByMultiSheetObj(workbook.Sheets)
    assert.equal(updatedRes.Sheet1.B1.v.toNumber(), -10);
  });


  it('SimpleExpression', function() { // 检查simple_expression的判定是否正确 ==> OK!!!
    let workbook = {};
    workbook.Sheets = {};
    workbook.Sheets.Sheet1 = {};
    // workbook.Sheets.Sheet1.A1 = {f:""} // 空字符串，看对不对
    // workbook.Sheets.Sheet1.A2 = {f:"'2019/1/10 12:12:12.12"}; // 强制字符串
    workbook.Sheets.Sheet1.A3 = {f:'2019/1/12 12:12:12.12'};
    workbook.Sheets.Sheet1.B3 = {f:'2019年1月10日 12:12:12.12'};
    workbook.Sheets.Sheet1.A4 = {f:'00001,123,123.56e12'};
    workbook.Sheets.Sheet1.A5 = {f:'$  123,123e12'};
    workbook.Sheets.Sheet1.A6 = {f:'   123,123e12  %  '};
    workbook.Sheets.Sheet1.A7 = {f:'   123,123123e12  %  '}; // 无法解析
    workbook.Sheets.Sheet1.A8 = {f:'trUe'}; // 转化为true
    workbook.Sheets.Sheet1.A9 = {f:'75.91%'}; // 无法解析



    let calc = new Calc()
    calc.calculateWorkbook(workbook);
    // assert.equal(workbook.Sheets.Sheet1.A1.v.toNumber(), 0);
    // assert.equal(workbook.Sheets.Sheet1.A2.v.toString(), "2019/1/10 12:12:12.12");
    assert(compareFloat(workbook.Sheets.Sheet1.A3.v.toNumber(), 43477.5084736));
    assert(compareFloat(workbook.Sheets.Sheet1.B3.v.toNumber()  , 43475.508472222));
    assert.equal(workbook.Sheets.Sheet1.A4.v.toNumber(), 1123123.56e12);
    assert.equal(workbook.Sheets.Sheet1.A5.v.toNumber(), 1.23123e17);
    assert.equal(workbook.Sheets.Sheet1.A6.v.toNumber(), 1231230000000000);
    assert.equal(workbook.Sheets.Sheet1.A7.v.toString(), '   123,123123e12  %  ');
    assert.equal(workbook.Sheets.Sheet1.A8.v.toNumber(), 1);
    assert.equal(workbook.Sheets.Sheet1.A9.v.toNumber(), 0.7591);


    console.log(workbook.Sheets.Sheet1)
    // assert.equal(workbook.Sheets.Sheet1.H614.v, "asdf-as");
  });

  it('负号优先计算', function() { // 检查符号的判定
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
    // workbook.Sheets.Sheet1.B1 = {f: '=FLOOR.MATH(-25-8.1*2,2)'}; // 负号运算符
    workbook.Sheets.Sheet1.B6 = {f: '1'}; // 负号运算符
    workbook.Sheets.Sheet1.C6 = {f: '2'}; // 负号运算符
    workbook.Sheets.Sheet1.B2 = {f: '=-(1+B6)^C6'}; // 负号运算符优先计算结果为4
    workbook.Sheets.Sheet1.B3 = {f: '=-((1+B6)^C6)'}; // 为-4


    let calc = new Calc()
      calc.calculateWorkbook(workbook);
      // console.log(workbook.Sheets.Sheet1.B1.v);
      // assert.equal(workbook.Sheets.Sheet1.B1.v, -42);
      assert.equal(workbook.Sheets.Sheet1.B2.v, 4);
    assert.equal(workbook.Sheets.Sheet1.B3.v, -4);

  });
  it('连续双引号', function() { // 检查连续双引号的判定; done
    let workbook = {};
    workbook.Sheets = {};
    workbook.Sheets.Sheet1 = {};
    workbook.Sheets.Sheet1.B1 = {f: '=""""""'};
    workbook.Sheets.Sheet1.B2 = {f: '="""we"""'};

    let calc = new Calc()
    calc.calculateWorkbook(workbook);
    console.log(workbook.Sheets.Sheet1.B1.v);
    assert.equal(workbook.Sheets.Sheet1.B1.v.toString(), '""');
    assert.equal(workbook.Sheets.Sheet1.B2.v.toString(), '"we"');
  });
  it('数组计算', function() { // todo: 直接输入数组，要能够解析出来
    let workbook = {};
    workbook.Sheets = {};
    workbook.Sheets.Sheet1 = {};
    // workbook.Sheets.Sheet1.A1 = {f: '=AVERAGE({1,3}+{3,2})'};
    // workbook.Sheets.Sheet1.A2 = {f: '=AVERAGE({1,3}  +  {3,2} * {1,3})'};
    // workbook.Sheets.Sheet1.A3 = {f: '=AVERAGE({1,3}  +  {3,2} * 2)'};
    workbook.Sheets.Sheet1.A4 = {f: '=average({1,2;3,4}*2)'};


    let calc = new Calc()
    calc.calculateWorkbook(workbook);
    // assert.equal(workbook.Sheets.Sheet1.A1.v.toNumber(), 4.5);
    // assert.equal(workbook.Sheets.Sheet1.A2.v.toNumber(), 6.5);
    // assert.equal(workbook.Sheets.Sheet1.A3.v.toNumber(), 7);
    assert.equal(workbook.Sheets.Sheet1.A4.v.toNumber(), 5);


  });



  it('circular', function() { // 检查循环依赖的判定;
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
