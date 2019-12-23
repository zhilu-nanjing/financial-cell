export const allFnObj = ["abs","add"]
export const emptyWorkbook = {sheets: {sheet1: {A1: {}}}}
export const fnNameArrayWithKey = Object.getOwnPropertyNames(allFnObj).map(f => {return {key: f, title: f}}) // 公式说明

export class MockCalc { // 测试用
  constructor() {
  }

  /**
   * @param {Rows} rows
   * @param {PreAction} preAction
   * @return {undefined}
   */
  calculateRows(rows, preAction) {
    return null
  }
}
