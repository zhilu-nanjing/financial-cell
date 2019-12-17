import {tf} from '../locale/locale';
import {isNumber} from "../helper/dataproxy_helper";
import {isHave} from '../helper/check_value';

const formatStringRender = v => v;

const formatNumberRender = (v, fixed = 2) => {
    if(!isHave(v) || !isNumber(v)) {
        return v;
    }
    if (/^(-?\d*.?\d*)$/.test(v)) {
        const v1 = fixed === -1 ? v.toString() : Number(v).toFixed(fixed).toString();
        const [first, ...parts] = v1.split('\\.');
        let value = first.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1');
        return value === 'NaN' ? v : value;
    }

    return v === 'NaN' ? v : v;
};

const baseFormats = [
    {
        key: 'normal',
        title: tf('format.normal'),
        type: 'string',
        render: formatStringRender,
    },
    // {
    //     key: 'text',
    //     title: tf('format.text'),
    //     type: 'string',
    //     render: formatStringRender,
    // },
    {
        key: 'number',
        title: tf('format.number'),
        type: 'number',
        label: '1,000.12',
        render: formatNumberRender,
    },
    {
        key: 'percent',
        title: tf('format.percent'),
        type: 'number',
        label: '10.12%',
        render: (v) => {
            const a = multiply(v, 100);
            const a_s = `${a}`;
            return `${a_s}%`;
        },
    },
    {
        key: 'rmb',
        title: tf('format.rmb'),
        type: 'number',
        label: '￥10.00',
        render: v => `￥${formatNumberRender(v)}`,
    },
    // {
    //     key: 'usd',
    //     title: tf('format.usd'),
    //     type: 'number',
    //     label: '$10.00',
    //     render: v => `$${formatNumberRender(v)}`,
    // },
    {
        key: 'date',
        title: tf('format.date'),
        type: 'date',
        label: '2009-01-01',
        render: formatStringRender,
    },
    {
        key: 'datetime',
        title: tf('format.datetime'),
        type: 'datetime',
        label: '2009年01月01日',
        render: formatStringRender,
    },
    // {
    //     key: 'time',
    //     title: tf('format.time'),
    //     type: 'date',
    //     label: '15:59:00',
    //     render: formatStringRender,
    // },
    // {
    //     key: 'datetime',
    //     title: tf('format.datetime'),
    //     type: 'date',
    //     label: '26/09/2008 15:59:00',
    //     render: formatStringRender,
    // },
    // {
    //     key: 'duration',
    //     title: tf('format.duration'),
    //     type: 'date',
    //     label: '24:01:00',
    //     render: formatStringRender,
    // },
];

function isInteger(obj) {
    return Math.floor(obj) === obj;
}


// function add(a, b, digits) {
//     return operation(a, b, digits, 'add');
// }
//
// function subtract(a, b, digits) {
//     return operation(a, b, digits, 'subtract');
// }

export function multiply(a, b, digits) {
    return operation(a, b, digits, 'multiply');
}

function divide(a, b, digits) {
    return operation(a, b, digits, 'divide');
}

/*
 * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
 * @param floatNum {number} 小数
 * @return {object}
 *   {times:100, num: 314}
 */
function toInteger(floatNum) {
    const ret = {times: 1, num: 0};
    const isNegative = floatNum < 0;
    if (isInteger(floatNum)) {
        ret.num = floatNum;
        return ret;
    }
    const strfi = `${floatNum}`;
    const dotPos = strfi.indexOf('.');
    const len = strfi.substr(dotPos + 1).length;
    const times = Math.pow(10, len);
    let intNum = parseInt(Math.abs(floatNum) * times + 0.5, 10);
    ret.times = times;
    if (isNegative) {
        intNum = -intNum;
    }
    ret.num = intNum;
    return ret;
}

function operation(a, b, digits, op) {
    const o1 = toInteger(a);
    const o2 = toInteger(b);
    const n1 = o1.num;
    const n2 = o2.num;
    const t1 = o1.times;
    const t2 = o2.times;
    const max = t1 > t2 ? t1 : t2;
    let result = null;
    switch (op) {
        case 'add':
            if (t1 === t2) { // 两个小数位数相同
                result = n1 + n2;
            } else if (t1 > t2) { // o1 小数位 大于 o2
                result = n1 + n2 * (t1 / t2);
            } else { // o1 小数位 小于 o2
                result = n1 * (t2 / t1) + n2;
            }
            return result / max;
        case 'subtract':
            if (t1 === t2) {
                result = n1 - n2;
            } else if (t1 > t2) {
                result = n1 - n2 * (t1 / t2);
            } else {
                result = n1 * (t2 / t1) - n2;
            }
            return result / max;
        case 'multiply':
            result = (n1 * n2) / (t1 * t2);
            return result;
        case 'divide':
            result = (n1 / n2) * (t2 / t1);
            return result;
    }
}

// const formats = (ary = []) => {
//   const map = {};
//   baseFormats.concat(ary).forEach((f) => {
//     map[f.key] = f;
//   });
//   return map;
// };
const formatm = {};
baseFormats.forEach((f) => {
    formatm[f.key] = f;
});

export {
    formatm,
    baseFormats,
    formatNumberRender
};
