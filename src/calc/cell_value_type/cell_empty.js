// 代表一个空值，空值在运算的时候可以转化为0，或一个空字符串，或者在average中不进入计算

export class CellEmpty{
  constructor(){
  }

  toString(){
    return ""
  }

  toNumber(){
    return 0
  }
}
