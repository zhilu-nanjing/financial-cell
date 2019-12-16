export class ColIndexProxy { // 处理列标号的格式转换
  constructor(colStrOrInt) {
    if (typeof colStrOrInt === 'number') {
      this.colNum = colStrOrInt;
      this.colStr = this.colNum2Str();
    } else {
      this.colStr = colStrOrInt;
      this.colNum = this.colStr2Num();
    }
  }

  colNum2Str() {
    let dividend = this.colNum + 1;
    let columnName = '';
    let modulo;
    let guard = 10;
    while (dividend > 0 && guard--) {
      modulo = (dividend - 1) % 26;
      columnName = String.fromCharCode(modulo + 65) + columnName;
      dividend = (dividend - modulo - 1) / 26;
    }
    return columnName;
  }

  colStr2Num() {
    let r = 0;
    let colStr = this.colStr.replace(/[0-9]+$/, '');
    for (let i = colStr.length; i--;) {
      r += Math.pow(26, colStr.length - i - 1) * (colStr.charCodeAt(i) - 64);
    }
    return r - 1;
  }

}
