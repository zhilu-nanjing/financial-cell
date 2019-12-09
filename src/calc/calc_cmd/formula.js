import { createDefaultFnCollection } from '../calc_data_proxy/calc_workbook';

let defaultFnColl = createDefaultFnCollection()
export const allFnObj = defaultFnColl.getAllFnObj()
export const emptyWorkbook = {sheets: {sheet1: {A1: {}}}}
