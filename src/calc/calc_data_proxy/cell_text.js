// todo: 需要对Date与Number类型输出的字符串进行格式化处理。

class CellText{
  constructor(cellV){
    this.cellV = cellV
  }
  toAutoFormattedText(){ // 没有指定格式，输出text
    return this.cellV.toString()

  }

  toFormattedText(format = "YYYY-MM-DD"){ // 指定格式，输出text; 可以参考Excel的Text函数

  }
}
