const RawValue = require('./RawValue.js');
const RefValue = require('./RefValue.js');
const Range = require('./Range.js');

module.exports = function str_2_val(buffer, formula, position_i) { // buffer 在这里是但一个字符串表达式
    var v;
    if (!isNaN(buffer)) {
        v = new RawValue(+buffer);
    }
    else if (buffer === 'TRUE') {
        v = new RawValue(1);
    }
    else if (typeof buffer === 'string' && buffer.trim().replace(/\$/g, '').match(/^[A-Z]+[0-9]+:[A-Z]+[0-9]+$/)) {

        v = new Range(buffer.trim().replace(/\$/g, ''), formula, position_i);
    }
    else if (typeof buffer === 'string' && buffer.trim().replace(/\$/g, '').match(/^[^!]+![A-Z]+[0-9]+:[A-Z]+[0-9]+$/)) {
        v = new Range(buffer.trim().replace(/\$/g, ''), formula, position_i);
    }
    else if (typeof buffer === 'string' && buffer.trim().replace(/\$/g, '').match(/^[A-Z]+:[A-Z]+$/)) {
        v = new Range(buffer.trim().replace(/\$/g, ''), formula, position_i);
    }
    else if (typeof buffer === 'string' && buffer.trim().replace(/\$/g, '').match(/^[^!]+![A-Z]+:[A-Z]+$/)) {
        v = new Range(buffer.trim().replace(/\$/g, ''), formula, position_i);
    }
    else if (typeof buffer === 'string' && buffer.trim().replace(/\$/g, '').match(/^[A-Z]+[0-9]+$/)) {
        v = new RefValue(buffer.trim().replace(/\$/g, ''), formula);
        v.end_pst = position_i // 后面一个字符的位置
        v.buffer = buffer
        v.start_pst = position_i - buffer.length


    }
    else if (typeof buffer === 'string' && buffer.trim().replace(/\$/g, '').match(/^[^!]+![A-Z]+[0-9]+$/)) {
        v = new RefValue(buffer.trim().replace(/\$/g, ''), formula);
        v.end_pst = position_i // 后面一个字符的位置
        v.buffer = buffer
        v.start_pst = position_i - buffer.length

    }
    else if (typeof buffer === 'string' && !isNaN(buffer.trim().replace(/%$/, ''))) {
        v = new RawValue(+(buffer.trim().replace(/%$/, '')) / 100.0);
    }
    else {
        v = buffer;
        v.end_pst = position_i // 后面一个字符的位置
    }
    return v;
};
