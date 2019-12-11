// 这里需要把公式解析做对
import assert from 'assert'
import { Calc } from '../../src/calc/calc_cmd/calc';
import {MS_PER_DAY} from '../../src/calc/calc_utils/config';

function compareFloat(a, b){
  return Math.abs(a-b) < 0.001
}
describe('新的解析算法', function() {
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

  it('SimpleExpression', function() { // 检查simple_expression的判定是否正确 ==> OK!!!
    let workbook = {};
    workbook.Sheets = {};
    workbook.Sheets.Sheet1 = {};
    workbook.Sheets.Sheet1.A1 = {f:""} // 空字符串，看对不对
    workbook.Sheets.Sheet1.A2 = {f:"'2019/1/1 12:12:12.12"}; // 强制字符串
    workbook.Sheets.Sheet1.A3 = {f:'2019/1/1 12:12:12.12'};
    workbook.Sheets.Sheet1.A4 = {f:'00001,123,123.56e12'};
    workbook.Sheets.Sheet1.A5 = {f:'$  123,123e12'};
    workbook.Sheets.Sheet1.A6 = {f:'   123,123e12  %  '};
    workbook.Sheets.Sheet1.A7 = {f:'   123,123123e12  %  '}; // 无法解析



    let calc = new Calc()
    calc.calculateWorkbook(workbook);
    assert.equal(workbook.Sheets.Sheet1.A1.v.toNumber(), 0);
    assert.equal(workbook.Sheets.Sheet1.A2.v.toString(), "2019/1/1 12:12:12.12");
    assert.equal(compareFloat(workbook.Sheets.Sheet1.A3.v.toNumber()  , 43466.5084736111), true);
    assert.equal(workbook.Sheets.Sheet1.A4.v.toNumber(), 1123123.56e12);
    assert.equal(workbook.Sheets.Sheet1.A5.v.toNumber(), 1.23123e17);
    assert.equal(workbook.Sheets.Sheet1.A6.v.toNumber(), 1231230000000000);
    assert.equal(workbook.Sheets.Sheet1.A7.v.toString(), '   123,123123e12  %  ');
    console.log(workbook.Sheets.Sheet1)


    // assert.equal(workbook.Sheets.Sheet1.H614.v, "asdf-as");
  });

  it('minus', function() { // 检查符号的判定
      let workbook = {};
      workbook.Sheets = {};
      workbook.Sheets.Sheet1 = {};
      workbook.Sheets.Sheet1.B1 = {f: '=FLOOR.MATH(-8.1,2)'}; // 负号运算符
      workbook.Sheets.Sheet1.A1 = {f: 'asdfasf'}; // 没有带等号的
      workbook.Sheets.Sheet1.A2 = {f: 'asdf-as'}; // 没有带等号，有减号
      workbook.Sheets.Sheet1.A3 = {f: 'asdf+as'}; // 没有带等号，有加号
      let calc = new Calc()
      calc.calculateWorkbook(workbook);
      console.log(workbook.Sheets.Sheet1.H614.v);
      assert.equal(workbook.Sheets.Sheet1.H614.v, "asdf-as");
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
