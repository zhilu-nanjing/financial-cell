
export const MS_PER_DAY = 86400000; // 24 * 60 * 60 * 1000
export const common_operations = { // todo: 需要把这个常数放到config里面
  '*': 'multiply',
  '+': 'plus',
  '-': 'subtractDays',
  '/': 'divide',
  '^': 'power',
  '&': 'concat',
  '<': 'lt',
  '>': 'gt',
  '=': 'eq'
};

export const FORMULA_STATUS = {
  new: "new",
  working: "working",
  done: "done"
}
