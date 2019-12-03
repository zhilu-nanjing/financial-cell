/**
 formulas:
 key
 title
 render
 */
import {tf} from '../locale/locale';
import XLSX_CALC from "../calc"
let formulajs = require('../calc/expression_fn/normal_fn'); // jobs: todo: 这里为何又多出3个函数？似乎应该统一放到formulajs中解决。
const baseFormulas = [
    {
        key: 'MD.WLAND',
        title: tf('cellFormulaProxy.wland'),
        render: ary => ary.join(''),
    },
    {
        key: 'MD.WFR',
        title: tf('cellFormulaProxy.wfr'),
        render: ary => ary.join(''),
    },
    {
        key: 'MD.RTD',
        title: tf('cellFormulaProxy.rtd'),
        render: ary => ary.join(''),
    },
];

let formulas = deepCopy(baseFormulas);

const formulaCalc = () => {
    XLSX_CALC.import_functions(formulajs);
    let xlsx_Fx = XLSX_CALC.xlsx_Fx;
    formulas = deepCopy(baseFormulas);
    Object.keys(xlsx_Fx).forEach(i => {
        let args = {
            key: i,
            title: i,
            render: xlsx_Fx[i]
        };
        formulas.push(args);
    });


    return XLSX_CALC;
};

function deepCopy(obj) {
    let result = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                result[key] = deepCopy(obj[key]);
            } else {
                result[key] = obj[key];
            }
        }
    }
    return result;
}

// const formulas = (formulaAry = []) => {
//   const formulaMap = {};
//   baseFormulas.concat(formulaAry).forEach((f) => {
//     formulaMap[f.key] = f;
//   });
//   return formulaMap;
// };
const formulam = {};
baseFormulas.forEach((f) => {
    formulam[f.key] = f;
});

export {
    formulam,
    formulas,
    baseFormulas,
    formulaCalc,
};
