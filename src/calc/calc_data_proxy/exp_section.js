import { RawValue } from './raw_value';
import { Range } from './range_ref';
import { RefValue } from './ref_value';

export function str_2_val(astNodeStr, formula, position_i) { // astNodeStr 在这里是但一个字符串表达式
  let v;
  if (!isNaN(astNodeStr)) {
    v = new RawValue(+astNodeStr);
  } else if (astNodeStr === 'TRUE') {
    v = new RawValue(1);
  } else if (typeof astNodeStr === 'string' && astNodeStr.trim()
    .replace(/\$/g, '')
    .match(/^[A-Z]+[0-9]+:[A-Z]+[0-9]+$/)) {

    v = new Range(astNodeStr.trim()
      .replace(/\$/g, ''), formula, position_i);
  } else if (typeof astNodeStr === 'string' && astNodeStr.trim()
    .replace(/\$/g, '')
    .match(/^[^!]+![A-Z]+[0-9]+:[A-Z]+[0-9]+$/)) {
    v = new Range(astNodeStr.trim()
      .replace(/\$/g, ''), formula, position_i);
  } else if (typeof astNodeStr === 'string' && astNodeStr.trim()
    .replace(/\$/g, '')
    .match(/^[A-Z]+:[A-Z]+$/)) {
    v = new Range(astNodeStr.trim()
      .replace(/\$/g, ''), formula, position_i);
  } else if (typeof astNodeStr === 'string' && astNodeStr.trim()
    .replace(/\$/g, '')
    .match(/^[^!]+![A-Z]+:[A-Z]+$/)) {
    v = new Range(astNodeStr.trim()
      .replace(/\$/g, ''), formula, position_i);
  } else if (typeof astNodeStr === 'string' && astNodeStr.trim()
    .replace(/\$/g, '')
    .match(/^[A-Z]+[0-9]+$/)) {
    v = new RefValue(astNodeStr.trim()
      .replace(/\$/g, ''), formula);
    v.end_pst = position_i; // 后面一个字符的位置
    v.buffer = astNodeStr;
    v.start_pst = position_i - astNodeStr.length;


  } else if (typeof astNodeStr === 'string' && astNodeStr.trim()
    .replace(/\$/g, '')
    .match(/^[^!]+![A-Z]+[0-9]+$/)) {
    v = new RefValue(astNodeStr.trim()
      .replace(/\$/g, ''), formula);
    v.end_pst = position_i; // 后面一个字符的位置
    v.buffer = astNodeStr;
    v.start_pst = position_i - astNodeStr.length;

  } else if (typeof astNodeStr === 'string' && !isNaN(astNodeStr.trim()
    .replace(/%$/, ''))) { // 处理公式中的百分号
    v = new RawValue(+(astNodeStr.trim()
      .replace(/%$/, '')) / 100.0);
  } else {
    v = astNodeStr;
    // v.end_pst = position_i // 后面一个字符的位置
  }
  return v;
}
