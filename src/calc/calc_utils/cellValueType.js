const cf = require("./config")

export const d1900 = new Date(1900, 0, 1);


export function stamp2DayNum(timeStamp) {
  let addOn = (timeStamp > -2203891200000)?2:1;
  return (timeStamp - d1900) / cf.MS_PER_DAY + addOn;
}

export class CellDate extends Date{ // 单元格值的值属性
  addDays(days){ // 加法, 加入天数
    console.assert(typeof days == "number")
    this.setDate(this.getDate()+ days)
  };

  subtractOther(other){
    // 两个日期之间的差
    console.assert( other instanceof Date)
    return this.toNumber() - other.toNumber()
  }
  toString(format = "YYYY-MM-DD"){ // todo: 适配各种时间样式
    return this.toLocaleDateString("Chinese")
  }
  toNumber(){ // 转化为数字，逻辑与Excel保持一致
    let diff = (this - d1900) + ((d1900.getTimezoneOffset() - this.getTimezoneOffset()) * 60 * 1000);
    return diff / cf.MS_PER_DAY + 2;
  }
}
