import {
    blankOperator,
    letterAndLetterOperator,
    letterOperator,
    letterOperatorWithDollor,
    letterOperatorWithDollorEnd,
    letterOperatorWithDollorPrex,
    logicOperator,
    str2Re
} from "../utils/reg_pattern.js";

const operator = [
    "+", "-", "*", "/", "&", "^", "(", ",", "=", " ", " ", "，"
];

const operator3 = [
    "+", "-", "*", "/", "&", "^", "(", ",", "=", " ", "，"
];

const operator2 = [
    "+", "-", "*", "/", "&", "^", "(", ",", "=", ")", "，"
];


const operation = (s) => {
    for (let i = 0; i < operator.length; i++) {
        if (operator[i] === s) {
            return 1;
        }
    }
    return 0;
};

// 存在的原因是 不过滤 空格
const operation3 = (s) => {
    for (let i = 0; i < operator.length; i++) {
        if (operator3[i] === s) {
            return 1;
        }
    }
    return 0;
};

const operation2 = (s) => {
    for (let i = 0; i < operator2.length; i++) {
        if (operator2[i] === s) {
            return 1;
        }
    }
    return 0;
};


const value2absolute = (str) => {
    let s1 = "", enter = false;
    for (let i = 0; i < str.length; i++) {
        if (enter === false && str[i] * 1 >= 0 && str[i] * 1 <= 9) {
            s1 += "$";
            enter = true;
        }
        s1 += str[i];
    }

    return {
        s1: s1,
        s2: "$" + str,
        s3: "$" + s1
    }
};

const cutStr = (str, filter = false, f = false) => {
    str = str + "";
    str = str.toUpperCase();
    if (str[0] !== "=") {
        return [];
    }

    // 把空格去除的原因是因为 => A   1 这种情况不应该被包含在内
    // str = str.replace(/\s/g, "");
    let arr = str.split(str2Re(logicOperator));

    // 去除字符串两端的空格
    for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].replace(str2Re(blankOperator), "");
    }
    let express = [];
    let index = 0;
    arr.filter(i => {
        let enter = true;
        if (arr.length > index + 1) {
            let s2 = arr[index + 1];
            if (s2.indexOf("(") !== -1) {
                enter = false;
            }
        }

        // console.log(ri.search(str2Re(letterOperatorIgnoreBracket)), ri)
        // if(ri.search(str2Re(letterOperatorIgnoreBracket)) === -1) {
        if (f && enter) {
            i = i.replace(/\$/g, '');
            if (i.search(str2Re(letterOperator)) !== -1
                || i.search(str2Re(letterAndLetterOperator)) !== -1)
                if (express.indexOf(i) === -1)
                    express.push(i);
        } else if (enter) {
            if (i.search(str2Re(letterOperator)) !== -1 || i.search(str2Re(letterOperatorWithDollor)) !== -1
                || i.search(str2Re(letterOperatorWithDollorEnd)) !== -1 || i.search(str2Re(letterOperatorWithDollorPrex)) !== -1) {
                if (express.indexOf(i) === -1 || filter === true)
                    express.push(i);
            } else {
                let is = i.replace(/\$/g, "");
                if (is.search(str2Re(letterAndLetterOperator)) !== -1) {
                    express.push(i);
                }
            }
        }
        // }
        index = index + 1;
    });

    return express;
};

// A1 => A1:A1
function changeFormula(cut) {
    for (let i = 0; i < cut.length; i++) {
        let c = cut[i];
        if (c.search(/^[A-Za-z]+\d+:[A-Za-z]+\d+$/) === -1) {
            cut[i] = `${c}:${c}`;
        }
    }
    return cut;
}

export function isLegal(str) {
    const left = 0;
    const right = 1;
    const other = 2;
    //判断括号是左边还是右边，或者其他
    let verifyFlag = function (char) {
        if (char === "(" || char === "[" || char === "{" || char === "/*") {
            return left;
        } else if (char === ")" || char === "]" || char === "}" || char === "*/") {
            return right;
        } else {
            return other;
        }
    };
    //判断左右括号是否匹配
    let matches = function (char1, char2) {
        return (char1 === "(" && char2 === ")")
            || (char1 === "{" && char2 === "}")
            || (char1 === "[" && char2 === "]")
            || (char1 === "/*" && char2 === "*/");
    };
    //入口
    let leftStack = [];
    if (str !== null || str !== "" || str !== undefined) {
        for (let i = 0; i < str.length; i++) {
            //处理字符
            let char = str.charAt(i);
            if (verifyFlag(char) === left) {
                leftStack.push(char);
            } else if (verifyFlag(char) === right) {
                //如果不匹配，或者左括号栈已经为空，则匹配失败
                if (leftStack.length === 0 || !matches(leftStack.pop(), char)) {
                    return false;
                }
            } else {
            }
        }
        //循环结束，如果左括号栈还有括号，也是匹配失败

        return leftStack.length === 0;
    }
}

const cutFirst = (str) => {
    let s = "";
    for (let i = 0; i < str.length; i++) {
        if (operation2(str[i])) {
            return s;
        }
        s += str[i];
    }
    return s;
};


const cuttingByPos = (str, pos, space = true) => {
    let value = "";
    let end = false;
    for (let i = pos - 1; i > 0 && end === false; i--) {
        if (space === false) {
            end = operation3(str[i]) === 1;
        } else {
            end = operation(str[i]) === 1;
        }
        if (end === false) {
            value += str[i];
        }
    }
    if (space)
        value = value.replace(/\s/g, "");
    value = value.split('').reverse().join('');
    return value.toUpperCase();
};

const cuttingByPos2 = (str, pos, space = true) => {
    let value = "";
    let end = false;
    for (let i = pos - 1; i > 0 && end === false; i--) {
        if (space === false) {
            end = operation3(str[i]) === 1;
        } else {
            end = operation(str[i]) === 1;
        }
        if (end === false) {
            value += str[i];
        }
    }
    if (space)
        value = value.replace(/\s/g, "");
    value = value.split('').reverse().join('');
    return value;
};


const cuttingByPosEnd = (str, pos) => {
    let value = "";
    let end = false;
    for (let i = pos - 1; i < str.length && end === false; i++) {
        end = operation(str[i]) === 1;
        if (end === false && str[i] !== ')') {
            value += str[i];
        }
    }
    return value.toUpperCase();
};

const cuttingByPosEnd2 = (str, pos) => {
    let value = "";
    for (let i = pos - 1; i < str.length; i++) {
        value += str[i];
    }
    return value;
};

export function distinct(arr) {
    return [...new Set(arr)];
}

const cutting = (str) => {
    let express = [];
    for (let i = 0; i < str.length; i++) {
        if (str[i]) {
            express.push(str[i]);
        }
    }
    return express;
};


const helpFormula = { // jobs: todo: 这个配置好长，放到utils/help_formula.js文件里面把
    "MD.RTD": { // jobs: todo: MD.RTD函数还在维护么？有用么？  (好像没用了)
        "title": [
            {
                "name": "MD.RTD(",
                "editor": false
            },
            {

                "name": "value1",
                "editor": false
            },
            {

                "name": "，",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {

                "name": "，",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            }
        ],
        "example": [
            {
                "name": "MD.RTD(",
                "editor": false
            },
            {

                "name": "\"SINA\"",
                "editor": false
            },
            {

                "name": "，",
                "editor": false
            },
            {
                "name": "600519",
                "editor": false
            },
            {

                "name": "，",
                "editor": false
            },
            {
                "name": "\"NOW\"",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            }
        ],
        "content": {
            "abstract": "股市查询。",
            "value1": "第一个参数。",
            "value2": "第二个参数。",
            "value3": "第三个参数。",
        }
    },
    "ADD": {    // 函数名称， 必须要大写， 是一个对象
        "title": [    // 是一个数组， 需要把 （）内的解析出来
            //  ADD(value1, value2)  就被解析成如下所示
            {
                "name": "ADD(",
                "editor": false    // 下面有介绍该字段
            },
            {

                "name": "value1",
                "editor": false
            },
            {

                "name": "，",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            }
        ],
        "example": [               // 同title
            {
                "name": "ADD(",
                "editor": false
            },
            {

                "name": "2",
                "editor": false
            },
            {

                "name": "，",
                "editor": false
            },
            {
                "name": "3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            }
        ],
        "content": {             // 这部分是内容说明。
            "abstract": "返回两个数值之和。相当于 + 运算符。",
            "value1": "第一个加数。",
            "value2": "第二个加数。",
        }
    },
    "IRR": {
        "title": [
            {
                "name": "IRR(",
                "editor": false
            },
            {
                "name": "values",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "guess",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            }
        ],
        "example": [               // 同title
            {
                "name": "IRR(",
                "editor": false
            },
            {

                "name": "A1:A10",
                "editor": false
            },
            {

                "name": ",",
                "editor": false
            },
            {
                "name": "0.1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            }
        ],
        "content": {
            "abstract": "返回由数值代表的一组现金流的内部收益率。这些现金流不必为均衡的，但作为年金，它们必须按固定的间隔产生，如按月或按年。内部收益率为投资的回收利率，其中包含定期支付（负值）和定期收入（正值）。",
            "values": "为数组或单元格的引用，包含用来计算返回的内部收益率的数字。至少各含一个正值和一个负值",
            "guess": "对函数 IRR 计算结果的估计值，默认为0.1",
        }
    },
    "SUM": {
        "title": [
            {
                "name": "SUM(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {

                "name": "，",
                "editor": false
            },
            {
                "name": "[value2, ...]",
                "editor": true,                 // 像这种情况 [value2, ...]，
                //        editor就是true,   index 为3 是 因为从( 索引为3
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            }
        ],
        "example": [
            {
                "name": "SUM(",
                "editor": false
            },
            {
                "name": "A2:A100",
                "editor": false
            },
            {

                "name": ",",
                "editor": false
            },
            {
                "name": "101",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            }
        ],
        "content": {
            "abstract": "返回一组数值和/或单元格的总和。",
            "value1": "要相加的第一个数值或范围。",
            "value2": "要与“value1”相加的其他数值或范围。",
        }
    },
    "ABS": {
        "title": [
            {
                "name": "ABS(",
                "editor": false    // 下面有介绍该字段
            },
            {

                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            }
        ],
        "example": [               // 同title
            {
                "name": "ABS(",
                "editor": false
            },
            {
                "name": "-2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            }
        ],
        "content": {             // 这部分是内容说明。
            "abstract": "返回数字的绝对值。绝对值没有符号。",
            "value": "需要计算其绝对值的实数。",
        }
    },
    "SQRT": {
        "title": [
            {
                "name": "SQRT(",
                "editor": false    // 下面有介绍该字段
            },
            {

                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            }
        ],
        "example": [               // 同title
            {
                "name": "SQRT(",
                "editor": false
            },
            {
                "name": "4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            }
        ],
        "content": {             // 这部分是内容说明。
            "abstract": "返回正平方根。",
            "value": "要计算平方根的数。",
        }
    },
    "CEILING": {
        "title": [
            {
                "name": "CEILING(",
                "editor": false
            },
            {
                "name": "number",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "significance",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            }
        ],
        "example": [
            {
                "name": "CEILING(",
                "editor": false
            },
            {
                "name": "10.4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            }
        ],
        "content": {             // 这部分是内容说明。
            "abstract": "将参数 Number 向上舍入（沿绝对值增大的方向）为最接近的 significance 的倍数。",
            "number": "所要四舍五入的数值。",
            "significance": "用以进行舍入计算的倍数。",
        }
    },
    "CONCATENATE": {
        "title": [
            {
                "name": "CONCATENATE(",
                "editor": false
            },
            {
                "name": "text1",
                "editor": false
            },
            {

                "name": "，",
                "editor": false
            },
            {
                "name": "[text2, ...]",
                "editor": true,                 // 像这种情况 [value2, ...]，
                //        editor就是true,   index 为3 是 因为从( 索引为3
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            }
        ],
        "example": [
            {
                "name": "CONCATENATE(",
                "editor": false
            },
            {
                "name": "文本1",
                "editor": false
            },
            {
                "name": "，",
                "editor": false
            },
            {
                "name": "文本2",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            }
        ],
        "content": {
            "abstract": "将两个或多个文本字符串合并为一个文本字符串。",
            "text1": "待合并文本字符串",
            "text2": "要与“text1”合并的其他待合并文本字符串。",
        }
    },
    "PMT": {
        "title": [
            {
                "name": "PMT(",
                "editor": false
            },
            {
                "name": "rate",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "nper",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "pv",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "fv",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "type",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            }
        ],
        "example": [
            {
                "name": "PMT(",
                "editor": false
            },
            {
                "name": "0.1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "120",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1000",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "0",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "0",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            }
        ],
        "content": {             // 这部分是内容说明。
            "abstract": "基于固定利率及等额分期付款方式，返回贷款的每期付款额。",
            "rate": "贷款利率。",
            "nper": "该项贷款的付款期数。",
            "pv": "现值，或一系列未来付款的当前值的累积和，也称为本金。",
            "fv": "为未来值，或在最后一次付款后希望得到的现金余额，如果省略 fv，则假设其值为零，也就是一笔贷款的未来值为零。",
            "type": "指定各期的付款时间是在期初还是期末。0或者省略为期初，1为期末",
        }
    },
    "COUNTA": {
        "title": [
            {
                "name": "COUNTA(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {

                "name": "，",
                "editor": false
            },
            {
                "name": "[value2, ...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            }
        ],
        "example": [
            {
                "name": "COUNTA(",
                "editor": false
            },
            {
                "name": "A1",
                "editor": false
            },
            {

                "name": "，",
                "editor": false
            },
            {
                "name": "A5",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            }
        ],
        "content": {
            "abstract": "返回参数列表中非空值的单元格个数。",
            "value1": "要计数的单元格",
            "value2": "要计数的单元格",
        }
    },
    "STDEV": {
        "title": [
            {
                "name": "STDEV(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "STDEV(",
                "editor": false
            },
            {
                "name": "A2:A11",
                "editor": false
            },
            // {
            //     "name":",",
            //     "editor":false
            // },
            // {
            //     "name":"[value2,...]",
            //     "editor":true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "估算基于样本的标准偏差",
            "value1": "对应于总体样本的第一个数值参数",
            "value2": "对应于总体样本的 2 到 255 个数值参数。也可以用单一数组或对某个数组的引用来代替用逗号分隔的参数"
        }
    },
    "AVERAGE": {
        "title": [
            {
                "name": "AVERAGE(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            }
        ],
        "example": [{
            "name": "AVERAGE(",
            "editor": false
        },
            {
                "name": "A2:A6",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "5",
                "editor": true,
                "index": 3
            }],
        "content": {
            "abstract": "返回参数的平均值 (算术平均值)",
            "value1": "要计算平均值的第一个数字、单元格引用或单元格区域",
            "value2": "要计算平均值的其他数字、单元格引用或单元格区域，最多可包含 255 个"
        }
    },
    "EXP": {
        "title": [
            {
                "name": "Exp(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            }
        ],
        "example": [
            {
                "name": "Exp(",
                "editor": false
            },
            {
                "name": "1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            }
        ],
        "content": {
            "abstract": "返回 e 的 n 次幂",
            "value1": "底数 e 的指数"
        }
    },
    "LN": {
        "title": [
            {
                "name": "LN(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            }
        ],
        "example": [
            {
                "name": "LN(",
                "editor": false
            },
            {
                "name": "86",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            }
        ],
        "content": {
            "abstract": "返回一个数的自然对数",
            "value1": "想要计算其自然对数的正实数"
        }
    },
    "TRIM": {
        "title": [
            {
                "name": "TRIM(",
                "editor": false
            },
            {
                "name": "text",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },

        ],
        "example": [
            {
                "name": "TRIM(",
                "editor": false
            },
            {
                "name": "(' First Quarter Earnings  ')",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "除了单词之间的单个空格外，清除文本中所有的空格",
            "text": "需要删除其中空格的文本"
        }
    },
    "HYPERLINK": {
        "title": [
            {
                "name": "HYPERLINK(",
                "editor": false,
            },
            {
                "name": "网址",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[链接标签]",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "HYPERLINK(",
                "editor": false,
            },
            {
                "name": '"http://www.google.com/"',
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "\"Google\"",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "在单元格内创建一个超链接。",
            "url": "以引号括住的链接位置的完整网址，或对包含这种网址的单元格的引用。",
            "linktag": "用引号括住的要在单元格中作为链接显示的文字，或对包含此类标签的单元格的引用。"
        }
    },
    "LEN": {
        "title": [
            {
                "name": "LEN(",
                "editor": false
            },
            {
                "name": "text",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "LEN(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回文本字符串中的字符数",
            "text": "要查找其长度的文本,也可为单元格引用。空格将作为字符进行计数"
        }
    },
    "ISBLANK": {
        "title": [
            {
                "name": "ISBLANK(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ISBLANK(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "检验指定值并根据参数取值返回 TRUE 或 FALSE",
            "value1": "要检验的值。参数 value 可以是空白（空单元格）、错误值、逻辑值、文本、数字、引用值，或者引用要检验的以上任意值的名称"
        }
    },
    "ACCRINT": {
        "title": [
            {
                "name": "ACCRINT(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "利率",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "票面值",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "年付息次数",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ACCRINT(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A6",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A7",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回定期付息证券的应计利息",
            "date1": "证券的发行日",
            "date2": "证券的首次计息日",
            "date3": "证券的结算日。证券结算日是在发行日期之后，证券卖给购买者的日期",
            "rate": "证券的年息票利率",
            "price": "证券的票面值。如果省略此参数，则 ACCRINT 使用 ￥1,000",
            "frequency": "年付息次数。如果按年支付，frequency = 1；按半年期支付，frequency = 2；按季支付，frequency = 4"
        }
    },
    "ACCRINTM": {
        "title": [
            {
                "name": "ACCRINTM(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "利率",
                "editor": false
            },
            {
                "name": "'",
                "editor": false
            },
            {
                "name": "票面值",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ACCRINTM(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": "'",
                "editor": false
            },
            {
                "name": "A5",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回到期一次性付息有价证券的应计利息",
            "date1": "证券的发行日",
            "date2": "证券的到期日",
            "rate": "证券的年息票利率",
            "price": "证券的票面值。如果省略此参数，则 ACCRINTM 使用 ￥1,000"
        }
    },
    "ACOS": {
        "title": [
            {
                "name": "ACOS(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ACOS(",
                "editor": false
            },
            {
                "name": "-0.5",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回数字的反余弦值",
            "value1": "所需的角度余弦值，必须介于 -1 到 1 之间"
        }
    },
    "ACOSH": {
        "title": [
            {
                "name": "ACOSH(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ACOSH(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回 value1 参数的反双曲余弦值",
            "value1": "大于等于 1 的任意实数"
        }
    },
    "ACOT": {
        "title": [
            {
                "name": "ACOT(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ACOT(",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回数字的反余切值的主值",
            "value1": "value1 为所需角度的余切值。 此值必须是实数"
        }
    },
    "ACOTH": {
        "title": [
            {
                "name": "ACOTH(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ACOTH(",
                "editor": false
            },
            {
                "name": "6",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回数字的反双曲余切值",
            "value1": "value1 的绝对值必须大于 1"
        }
    },
    "AMORDEGRC": {
        "title": [
            {
                "name": "AMORDEGRC(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "折旧率",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "AMORDEGRC(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A6",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A7",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回每个结算期间的折旧值",
            "value1": "资产原值",
            "date1": "购入资产的日期",
            "date2": "第一个期间结束时的日期",
            "value2": "资产在使用寿命结束时的残值",
            "value3": "期间",
            "depreciationrate": "折旧率"
        }
    },
    "AMORLINC": {
        "title": [
            {
                "name": "AMORLINC(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "期间",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "折旧率",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "AMORLINC(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "期间",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "折旧率",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回每个结算期间的折旧值，该函数为法国会计系统提供。如果某项资产是在结算期间的中期购入的，则按线性折旧法计算",
            "value1": "资产原值",
            "date1": "购入资产的日期",
            "date2": "第一个期间结束时的日期",
            "value2": "资产在使用寿命结束时的残值",
            "period": "期间",
            "depreciationrate": "折旧率"
        }
    },
    "AND": {
        "title": [
            {
                "name": "AND(",
                "editor": false
            },
            {
                "name": "逻辑值1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[逻辑值2,...]",
                "editor": true,
                "index": 3
            },
        ],
        "example": [
            {
                "name": "AND(",
                "editor": false
            },
            {
                "name": "A2>1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A2<100",
                "editor": true,
                "index": 3
            },
        ],
        "content": {
            "abstract": "所有参数的计算结果为 TRUE 时，AND 函数返回 TRUE；只要有一个参数的计算结果为 FALSE，即返回 FALSE",
            "logic1": "第一个想要测试且计算结果可为 TRUE 或 FALSE 的条件",
            "logic2": "其他想要测试且计算结果可为 TRUE 或 FALSE 的条件（最多 255 个条件）"
        }
    },
    "ARABIC": {
        "title": [
            {
                "name": "ARABIC(",
                "editor": false
            },
            {
                "name": "text",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ARABIC(",
                "editor": false
            },
            {
                "name": "'LVII'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将罗马数字转换为阿拉伯数字",
            "text": "用引号引起的字符串、空字符串 ('') 或对包含文本的单元格的引用"
        }
    },
    "ASC": {
        "title": [
            {
                "name": "ASC(",
                "editor": false
            },
            {
                "name": "text",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ASC(",
                "editor": false
            },
            {
                "name": "'EXCEL' ",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "对于双字节字符集 (DBCS) 语言，将全角（双字节）字符更改为半角（单字节）字符",
            "text": "文本或对包含要更改的文本的单元格的引用。如果文本中不包含任何全角字母，则文本不会更改"
        }
    },
    "ASIN": {
        "title": [
            {
                "name": "ASIN(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ASIN(",
                "editor": false
            },
            {
                "name": "-0.5",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回参数的反正弦值",
            "value": "所需的角度正弦值，必须介于 -1 到 1 之间"
        }
    },
    "ASINH": {
        "title": [
            {
                "name": "ASINH(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ASINH(",
                "editor": false
            },
            {
                "name": "-2.5",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回参数的反双曲正弦值",
            "value": "任意实数"
        }
    },
    "ATAN": {
        "title": [
            {
                "name": "ATAN(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ATAN(",
                "editor": false
            },
            {
                "name": "1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回反正切值",
            "value": "所需的角度正切值"
        }
    },
    "ATAN2": {
        "title": [
            {
                "name": "ATAN2(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ATAN2(",
                "editor": false
            },
            {
                "name": "-1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "-1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回给定的 X 及 Y 坐标值的反正切值",
            "value1": "点的 x 坐标",
            "value2": "点的 y 坐标"
        }
    },
    "ATANH": {
        "title": [
            {
                "name": "ATANH(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ATANH(",
                "editor": false
            },
            {
                "name": "-0.1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回参数的反双曲正切值，参数必须介于 -1 到 1 之间（除去 -1 和 1）",
            "value": "-1 到 1 之间的任意实数"
        }
    },
    "AVEDEV": {
        "title": [
            {
                "name": "AVEDEV(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "AVEDEV(",
                "editor": false
            },
            {
                "name": "A2:A8",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2,...]",
            //     "editor": true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回一组数据与其均值的绝对偏差的平均值，AVEDEV 用于评测这组数据的离散度",
            "value1": "任意实数",
            "value2": "用于计算绝对偏差平均值的一组参数，参数的个数可以为 1 到 255 个"
        }
    },
    "AVERAGEA": {
        "title": [
            {
                "name": "AVERAGEA(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "AVERAGEA(",
                "editor": false
            },
            {
                "name": "A2:A6",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2,...]",
            //     "editor": true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "计算参数列表中数值的平均值",
            "value1": "任意实数",
            "value2": "需要计算平均值的 1 到 255 个单元格、单元格区域或值"
        }
    },
    "AVERAGEIF": {
        "title": [
            {
                "name": "AVERAGEIF(",
                "editor": false
            },
            {
                "name": "引用范围",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "标准条件",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },

        ],
        "example": [
            {
                "name": "AVERAGEIF(",
                "editor": false
            },
            {
                "name": "B2:B5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'<23000'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回某个区域内满足给定条件的所有单元格的平均值（算术平均值）",
            "referencearea": "要计算平均值的一个或多个单元格，其中包括数字或包含数字的名称、数组或引用",
            "standardcondition": "数字、表达式、单元格引用或文本形式的条件，用于定义要对哪些单元格计算平均值"
        }

    },
    "AVERAGEIFS": {
        "title": [
            {
                "name": "AVERAGEIFS(",
                "editor": false
            },
            {
                "name": "引用范围",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "标准条件_适用范围1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "标准条件1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[标准条件_适用范围2,标准条件2,...]",
                "editor": true,
                "index": 7
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "AVERAGEIFS(",
                "editor": false
            },
            {
                "name": "B2:B7",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "C2:C7",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "毕尔褔",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "D2:D7",
                "editor": false,
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'>2'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "E2:E7",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'是'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回满足多重条件的所有单元格的平均值（算术平均值）",
            "referencearea": "要计算平均值的一个或多个单元格，其中包括数字或包含数字的名称、数组或引用",
            "standardcondition_area1": "要计算平均值的实际单元格集",
            "standardcondition1": "定义要对适用范围1中的哪些单元格计算平均值",
            "standardcondition_area2": "适用范围及其对应的标准条件"
        }
    },
    "BAHTTEXT": {
        "title": [
            {
                "name": "BAHTTEXT(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "BAHTTEXT(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将数字转换为泰语文本并添加后缀“泰铢”",
            "value": "要转换成文本的数字、对包含数字的单元格的引用或结果为数字的公式"
        }
    },
    "BASE": {
        "title": [
            {
                "name": "BASE(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "基",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[最小长度]",
                "editor": true,
                "index": 6
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "BASE(",
                "editor": false
            },
            {
                "name": "15",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "10",
                "editor": true,
                "index": 6
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将数字转换为具备给定基数的文本表示",
            "value": "要转换的数字。 必须是大于或等于0且小于 2 ^ 53 的整数",
            "basic": "要将数字转换为的基础基数。 必须是大于或等于2且小于或等于36的整数",
            "minlength": "返回的字符串的最小长度。 必须是大于或等于0的整数"
        }
    },
    "BESSELI": {
        "title": [
            {
                "name": "BESSELI(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "BESSELI(",
                "editor": false
            },
            {
                "name": "1.5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回修正 Bessel 函数值，它与用纯虚数参数运算时的 Bessel 函数值相等",
            "value1": "用来进行函数计算的数值",
            "value2": "Bessel 函数的阶数。如果 n 不是整数，则截尾取整"
        }
    },
    "BESSELJ": {
        "title": [
            {
                "name": "BESSELJ(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "BESSELJ(",
                "editor": false
            },
            {
                "name": "1.9",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回 Bessel 函数值",
            "value1": "用来进行函数计算的数值",
            "value2": "Bessel 函数的阶数。如果 n 不是整数，则截尾取整"
        }
    },
    "BESSELK": {
        "title": [
            {
                "name": "BESSELK(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "BESSELK(",
                "editor": false
            },
            {
                "name": "1.5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回修正 Bessel 函数值，它与用纯虚数参数运算时的 Bessel 函数值相等",
            "value1": "用来进行函数计算的数值",
            "value2": "Bessel 函数的阶数。如果 n 不是整数，则截尾取整"
        }
    },
    "BESSELY": {
        "title": [
            {
                "name": "BESSELY(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "BESSELY(",
                "editor": false
            },
            {
                "name": "2.5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回 Bessel 函数值，也称为 Weber 函数或 Neumann 函数",
            "value1": "用来进行函数计算的数值",
            "value2": "Bessel 函数的阶数。如果 n 不是整数，则截尾取整"
        }
    },
    "BETA.DIST": {
        "title": [
            {
                "name": "BETA.DIST(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "逻辑值",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[下界]",
                "editor": true,
                "index": 10
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[上界]",
                "editor": true,
                "index": 12
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "BETA.DIST(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "True",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A5",
                "editor": true,
                "index": 10
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A6",
                "editor": true,
                "index": 12
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回 Beta 分布",
            "value1": "介于 A 和 B 之间用来进行函数计算的值",
            "value2": "分布参数",
            "value3": "分布参数",
            "logic": "决定函数形式的逻辑值。如果 cumulative 为 TRUE，BETA.DIST 返回累积分布函数；如果为 FALSE，则返回概率密度函数",
            "lowbound": "value1所属区间的下界",
            "upbound": "value1所属区间的上界"
        }
    },
    "BETA.INV": {
        "title": [
            {
                "name": "BETA.INV(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[下界]",
                "editor": true,
                "index": 8
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[上界]",
                "editor": true,
                "index": 10
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "BETA.INV(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A5",
                "editor": true,
                "index": 8
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A6",
                "editor": true,
                "index": 10
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回 Beta 累积概率密度函数 (BETA.DIST) 的反函数",
            "value1": "与 beta 分布相关的概率",
            "value2": "分布参数",
            "value3": "分布参数",
            "lowbound": "value1所属区域的下界",
            "upbound": "value1所属区域的上界"
        }
    },
    "BIN2DEC": {
        "title": [
            {
                "name": "BIN2DEC(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "BIN2DEC(",
                "editor": false
            },
            {
                "name": "1100100",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将二进制数转换为十进制数",
            "value": "希望转换的二进制数"
        }
    },
    "BIN2HEX": {
        "title": [
            {
                "name": "BIN2HEX(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "BIN2HEX(",
                "editor": false
            },
            {
                "name": "11111011",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将二进制数转换为十六进制数",
            "value1": "希望转换的二进制数",
            "value2": "要使用的字符数"
        }
    },
    "BIN2OCT": {
        "title": [
            {
                "name": "BIN2OCT(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "BIN2OCT(",
                "editor": false
            },
            {
                "name": "1001",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将二进制数转换为八进制数",
            "value1": "希望转换的二进制数",
            "value2": "要使用的字符数"
        }
    },
    "BINOM.DIST": {
        "title": [
            {
                "name": "BINOM.DIST(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "BINOM.DIST(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "FALSE",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回二项式分布的概率",
            "value1": "试验成功的次数",
            "value2": "独立试验的次数",
            "value3": "每次试验中成功的概率",
            "value4": "决定函数形式的逻辑值"
        }
    },
    "BINOM.INV": {
        "title": [
            {
                "name": "BINOM.INV(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "BINOM.INV(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回使累积二项式分布大于等于临界值的最小值",
            "value1": "伯努利试验次数",
            "value2": "每次试验中成功的概率",
            "value3": "临界值"
        }
    },
    "BITAND": {
        "title": [
            {
                "name": "BITAND(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "BITAND(",
                "editor": false
            },
            {
                "name": "13",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "25",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回两个数的按位“与”",
            "value1": "必须为十进制格式且大于等于 0",
            "value2": "必须为十进制格式且大于等于 0"
        }
    },
    "BITLSHIFT": {
        "title": [
            {
                "name": "BITLSHIFT(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "BITLSHIFT(",
                "editor": false
            },
            {
                "name": "4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回向左移动指定位数后的数值",
            "value1": "必须是大于或等于0的整数",
            "value2": "必须是整数"
        }
    },
    "BITOR": {
        "title": [
            {
                "name": "BITOR(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "BITOR(",
                "editor": false
            },
            {
                "name": "23",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "10",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回两个数的按位“或”",
            "value1": "必须为十进制格式且大于等于 0",
            "value2": "必须为十进制格式且大于等于 0"
        }
    },
    "BITRSHIFT": {
        "title": [
            {
                "name": "BITRSHIFT(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "BITRSHIFT(",
                "editor": false
            },
            {
                "name": "13",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回向右移动指定位数后的数值",
            "value1": "必须是大于或等于0的整数",
            "value2": "必须是整数"
        }
    },
    "BITXOR": {
        "title": [
            {
                "name": "BITXOR(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "BITXOR(",
                "editor": false
            },
            {
                "name": "5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回两个数值的按位“异或”结果",
            "value1": "必须大于或等于 0",
            "value2": "必须大于或等于 0"
        }
    },
    "CEILING.MATH": {
        "title": [
            {
                "name": "CEILING.MATH(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 3
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value3]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "CEILING.MATH(",
                "editor": false
            },
            {
                "name": "-5.5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": true,
                "index": 3
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "-1",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将数字向上舍入为最接近的整数或最接近的指定基数的倍数",
            "value1": "必须小于 9.99 E + 307 且大于-2.229 E-308",
            "value2": "要将数字舍入到的倍数",
            "value3": "对于负数, 控制数字是舍入还是远离零"
        }
    },
    "CEILING.PRECISE": {
        "title": [
            {
                "name": "CEILING.PRECISE(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "CEILING.PRECISE(",
                "editor": false
            },
            {
                "name": "4.3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回一个数字，该数字向上舍入为最接近的整数或最接近的有效位的倍数",
            "value1": "要进行舍入的值",
            "value2": "要将数字舍入的倍数,如果省略，则其默认值为 1"
        }
    },
    "CELL": {
        "title": [
            {
                "name": "CELL(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "CELL(",
                "editor": false
            },
            {
                "name": "“row”",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A20",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回有关单元格的格式、位置或内容的信息",
            "value1": "一个文本值，指定要返回的单元格信息的类型",
            "value2": "需要其相关信息的单元格。如果省略，则将 value1 参数中指定的信息返回给最后更改的单元格。如果参数 value2 是某一单元格区域，则函数只将该信息返回给该区域左上角的单元格"
        }
    },
    "CHAR": {
        "title": [
            {
                "name": "CHAR(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "CHAR(",
                "editor": false
            },
            {
                "name": "65",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回对应于数字代码的字符",
            "value": "介于 1 到 255 之间用于指定所需字符的数字"
        }
    },
    "CHIDIST": {
        "title": [
            {
                "name": "CHIDIST(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "CHIDIST(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回 χ2 分布的右尾概率",
            "value1": "用来计算分布的值",
            "value2": "自由度的数值"
        }
    },
    "CHIINV": {
        "title": [
            {
                "name": "CHIINV(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "CHIINV(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回 χ2 分布的右尾概率的反函数",
            "value1": "与 χ2 分布相关的概率",
            "value2": "自由度的数值"
        }
    },
    "CHISQ.DIST": {
        "title": [
            {
                "name": "CHISQ.DIST(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "CHISQ.DIST(",
                "editor": false
            },
            {
                "name": "0.5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "TRUE",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回 χ2 分布",
            "value1": "用来计算分布的值",
            "value2": "自由度数",
            "value3": "决定函数形式的逻辑值。如果为 TRUE，则返回累积分布函数；如果为 FALSE，则返回概率密度函数"
        }
    },
    "CHISQ.INV": {
        "title": [
            {
                "name": "CHISQ.INV(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "CHISQ.INV(",
                "editor": false
            },
            {
                "name": "0.93",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回 χ2 分布的左尾概率的反函数",
            "value1": "与 χ2 分布相关联的概率",
            "value2": "自由度数"
        }
    },
    "CHISQ.TEST": {
        "title": [
            {
                "name": "CHISQ.TEST(",
                "editor": false
            },
            {
                "name": "区域1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "区域2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "CHISQ.TEST(",
                "editor": false
            },
            {
                "name": "A2:B4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A6:B8",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回独立性检验值",
            "area1": "包含观察值的数据区域，用于检验预期值",
            "area2": "包含行列汇总的乘积与总计值之比率的数据区域"
        }
    },
    "CHOOSE": {
        "title": [
            {
                "name": "CHOOSE(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value3,...]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "CHOOSE(",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value3,...]",
            //     "editor": true,
            //     "index":5
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "使用 value1 返回数值参数列表中的数值",
            "value1": "指定所选定的值参数。value1 必须为 1 到 254 之间的数字，或者为公式或对包含 1 到 254 之间某个数字的单元格的引用",
            "value2": "value2 是必需的，后续值是可选的。可以为数字、单元格引用、已定义名称、公式、函数或文本",
            "value3": "可以为数字、单元格引用、已定义名称、公式、函数或文本"
        }
    },
    "CLEAN": {
        "title": [
            {
                "name": "CLEAN(",
                "editor": false
            },
            {
                "name": "text",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "CLEAN(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "删除文本中不能打印的字符",
            "text": "要从中删除非打印字符的任何工作表信息"
        }
    },
    "CODE": {
        "title": [
            {
                "name": "CODE(",
                "editor": false
            },
            {
                "name": "text",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "CODE(",
                "editor": false
            },
            {
                "name": "“A”",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回文本字符串中第一个字符的数字代码",
            "text": "需要得到其第一个字符代码的文本"
        }
    },
    "COLUMN": {
        "title": [
            {
                "name": "COLUMN(",
                "editor": false
            },
            {
                "name": "[数值]",
                "editor": true,
                "index": 1
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "COLUMN(",
                "editor": false
            },
            {
                "name": "C10",
                "editor": true,
                "index": 1
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回指定单元格引用的列号",
            "value": "要返回其列号的单元格或单元格区域"
        }
    },
    "COLUMNS": {
        "title": [
            {
                "name": "COLUMNS(",
                "editor": false
            },
            {
                "name": "array",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "COLUMNS(",
                "editor": false
            },
            {
                "name": "array",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回数组或引用的列数",
            "array": "需要得到其列数的数组、数组公式或对单元格区域的引用"
        }
    },
    "COMBIN": {
        "title": [
            {
                "name": "COMBIN(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "COMBIN(",
                "editor": false
            },
            {
                "name": "8",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "计算从给定数目的对象集合中提取若干对象的组合数",
            "value1": "项目的数量",
            "value2": "每一组合中项目的数量"
        }

    },
    "COMBINA": {
        "title": [
            {
                "name": "COMBINA(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "COMBINA(",
                "editor": false
            },
            {
                "name": "4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回给定数目的项的组合数（包含重复）",
            "value1": "必须大于或等于 0 并大于或等于 Number_chosen。 非整数值将被截尾取整",
            "value2": "必须大于或等于 0。 非整数值将被截尾取整"
        }

    },
    "COMPLEX": {
        "title": [
            {
                "name": "COMPLEX(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[后缀]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "COMPLEX(",
                "editor": false
            },
            {
                "name": "3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "“j”",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将实系数及虚系数转换为 x+yi 或 x+yj 形式的复数",
            "value1": "复数的实部",
            "value2": "复数的虚部",
            "suffix": "复数中虚部的后缀，如果省略，则认为它为 i"
        }
    },
    "CONFIDENCE": {
        "title": [
            {
                "name": "CONFIDENCE(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "CONFIDENCE(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "使用正态分布返回总体平均值的置信区间",
            "value1": "用于计算置信度的显著水平参数",
            "value2": "数据区域的总体标准偏差,假设为已知",
            "value3": "样本容量"
        }
    },
    "CONVERT": {
        "title": [
            {
                "name": "CONVERT(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "单位1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "单位2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "CONVERT(",
                "editor": false
            },
            {
                "name": "1.0",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'lbm'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'kg'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将数字从一个度量系统转换到另一个度量系统中",
            "value": "以单位1为单位的需要进行转换的数值",
            "unit1": "数值的单位",
            "unit2": "结果的单位"
        }
    },
    "CORREL": {
        "title": [
            {
                "name": "CORREL(",
                "editor": false
            },
            {
                "name": "array1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "array2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "CORREL(",
                "editor": false
            },
            {
                "name": "A2:A6",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "B2:B6",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回单元格区域 array1 和 array2 之间的相关系数",
            "array1": "第一组数值单元格区域",
            "array2": "第二组数值单元格区域"
        }
    },
    "COS": {
        "title": [
            {
                "name": "COS(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "COS(",
                "editor": false
            },
            {
                "name": "1.047",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回给定角度的余弦值",
            "value": "想要求余弦的角度，以弧度表示"
        }
    },
    "COTH": {
        "title": [
            {
                "name": "COTH(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },

        ],
        "example": [
            {
                "name": "COTH(",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回一个双曲角度的双曲余切值",
            "value": "想要求双曲余弦值的角度值"
        }
    },
    "COUNT": {
        "title": [
            {
                "name": "COUNT(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "COUNT(",
                "editor": false
            },
            {
                "name": "A2:A8",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2,...]",
            //     "editor": true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "计算包含数字的单元格以及参数列表中数字的个数",
            "value1": "要计算其中数字的个数的第一个项、单元格引用或区域",
            "value2": "要计算其中数字的个数的其他项、单元格引用或区域，最多可包含 255 个"
        }
    },
    "COUNTBLANK": {
        "title": [
            {
                "name": "COUNTBLANK(",
                "editor": false
            },
            {
                "name": "区域",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "COUNTBLANK(",
                "editor": false
            },
            {
                "name": "A2:B5",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "计算指定单元格区域中空白单元格的个数",
            "area": "需要计算其中空白单元格个数的区域"
        }
    },
    "COUNTIF": {
        "title": [
            {
                "name": "COUNTIF(",
                "editor": false
            },
            {
                "name": "区域",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "标准条件",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "COUNTIF(",
                "editor": false
            },
            {
                "name": "A2:A7",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'?果'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "对区域中满足单个指定条件的单元格进行计数",
            "area": "要对其进行计数的一个或多个单元格，其中包括数字或名称、数组或包含数字的引用。空值和文本值将被忽略",
            "standardcondition": "用于定义将对哪些单元格进行计数的数字、表达式、单元格引用或文本字符串"
        }
    },
    "COUNTIFS": {
        "title": [
            {
                "name": "COUNTIFS(",
                "editor": false
            },
            {
                "name": "区域1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "标准条件1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[区域2,标准条件2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "COUNTIFS(",
                "editor": false
            },
            {
                "name": "B2:D2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'=是'",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[区域2,标准条件2,...]",
            //     "editor": true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将条件应用于跨多个区域的单元格，并计算符合所有条件的次数",
            "area1": "在其中计算关联条件的第一个区域",
            "standardcondition1": "条件的形式为数字、表达式、单元格引用或文本，可用来定义将对哪些单元格进行计数",
            "standardcondition2": "附加的区域及其关联条件。最多允许 127 个区域/条件对"
        }
    },
    "COUPDAYBS": {
        "title": [
            {
                "name": "COUPDAYBS(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "COUPDAYBS(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回从付息期开始到结算日的天数",
            "date1": "证券的结算日",
            "date2": "证券的到期日",
            "value": "年付息次数。如果按年支付，数值 = 1；按半年期支付，数值 = 2；按季支付，数值 = 4"
        }
    },
    "COUPDAYS": {
        "title": [
            {
                "name": "COUPDAYS(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "COUPDAYS(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回结算日所在的付息期的天数",
            "date1": "证券的结算日",
            "date2": "证券的到期日",
            "value": "年付息次数。如果按年支付，数值 = 1；按半年期支付，数值 = 2；按季支付，数值 = 4"
        }
    },
    "COUPDAYSNC": {
        "title": [
            {
                "name": "COUPDAYSNC(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "COUPDAYSNC(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回从结算日到下一付息日之间的天数",
            "date1": "证券的结算日",
            "date2": "证券的到期日",
            "value": "年付息次数。如果按年支付，数值 = 1；按半年期支付，数值 = 2；按季支付，数值 = 4"
        }
    },
    "COUPNCD": {
        "title": [
            {
                "name": "COUPNCD",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "COUPNCD",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回一个表示在结算日之后下一个付息日的数字",
            "date1": "证券的结算日",
            "date2": "证券的到期日",
            "value": "年付息次数。如果按年支付，数值 = 1；按半年期支付，数值 = 2；按季支付，数值 = 4"
        }
    },
    "COUPNUM": {
        "title": [
            {
                "name": "COUPNUM(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "COUPNUM(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回在结算日和到期日之间的付息次数，向上舍入到最近的整数",
            "date1": "证券的结算日",
            "date2": "证券的到期日",
            "value": "年付息次数。如果按年支付，数值 = 1；按半年期支付，数值 = 2；按季支付，数值 = 4"
        }
    },
    "COUPPCD": {
        "title": [
            {
                "name": "COUPPCD(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "COUPPCD(",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A5",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回表示结算日之前的上一个付息日的数字",
            "date1": "证券的结算日",
            "date2": "证券的到期日",
            "value": "年付息次数。如果按年支付，数值 = 1；按半年期支付，数值 = 2；按季支付，数值 = 4"
        }
    },
    "COVAR": {
        "title": [
            {
                "name": "COVAR(",
                "editor": false
            },
            {
                "name": "array1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "array2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "COVAR(",
                "editor": false
            },
            {
                "name": "A2:A6",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "B2:B6",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回协方差，即两个数据集中每对数据点的偏差乘积的平均数",
            "array1": "第一个所含数据为整数的单元格区域",
            "array2": "第二个所含数据为整数的单元格区域"
        }
    },
    "COVARIANCE.P": {
        "title": [
            {
                "name": "COVARIANCE.P(",
                "editor": false
            },
            {
                "name": "array1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "array2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "COVARIANCE.P(",
                "editor": false
            },
            {
                "name": "A2:A6",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "B2:B6",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回总体协方差，即两个数据集中每对数据点的偏差乘积的平均数",
            "array1": "第一个所含数据为整数的单元格区域",
            "array2": "第二个所含数据为整数的单元格区域"
        }
    },
    "COVARIANCE.S": {
        "title": [
            {
                "name": "COVARIANCE.S(",
                "editor": false
            },
            {
                "name": "array1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "array2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "COVARIANCE.S(",
                "editor": false
            },
            {
                "name": "A3:A5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "B3:B5",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回样本协方差，即两个数据集中每对数据点的偏差乘积的平均值",
            "array1": "整数的第一个单元格区域",
            "array2": "整数的第二个单元格区域"
        }
    },
    "CSC": {
        "title": [
            {
                "name": "CSC(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "CSC(",
                "editor": false
            },
            {
                "name": "15",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回角度的余割值，以弧度表示",
            "value": "要求余割值的角度值"
        }
    },
    "CSCH": {
        "title": [
            {
                "name": "CSCH(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "CSCH(",
                "editor": false
            },
            {
                "name": "1.5",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回角度的双曲余割值，以弧度表示",
            "value": "要求双曲余割值的角度值"
        }
    },
    "CUMIPMT": {
        "title": [
            {
                "name": "CUMIPMT(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value6",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "CUMIPMT(",
                "editor": false
            },
            {
                "name": "A2/12",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3*12",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "13",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "24",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "0",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回一笔贷款在给定的 value4 到 value5 期间累计偿还的利息数额",
            "value1": "利率",
            "value2": "总付款期数",
            "value3": "现值",
            "value4": "计算中的首期。 付款期数从 1 开始计数",
            "value5": "计算中的末期",
            "value6": "付款时间类型"
        }
    },
    "CUMPRINC": {
        "title": [
            {
                "name": "CUMPRINC(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value6",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "CUMPRINC(",
                "editor": false
            },
            {
                "name": "A2/12",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3*12",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "13",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "24",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "0",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回一笔贷款在给定的 start_period 到 end_period 期间累计偿还的本金数额",
            "value1": "利率",
            "value2": "总付款期数",
            "value3": "现值",
            "value4": "计算中的首期。 付款期数从 1 开始计数",
            "value5": "计算中的末期",
            "value6": "付款时间类型"
        }
    },
    "DATE": {
        "title": [
            {
                "name": "DATE(",
                "editor": false
            },
            {
                "name": "年",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "月",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DATE(",
                "editor": false
            },
            {
                "name": "2008",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回表示特定日期的连续序列号",
            "year": "年",
            "month": "月",
            "day": "日"
        }
    },
    "DATEVALUE": {
        "title": [
            {
                "name": "DATEVALUE(",
                "editor": false
            },
            {
                "name": "text",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DATEVALUE(",
                "editor": false
            },
            {
                "name": "'8/22/2008'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "可将存储为文本的日期转换为 Excel 识别为日期的序列号",
            "text": "表示 Excel 日期格式的日期的文本，或者是对表示 Excel 日期格式的日期的文本所在单元格的单元格引用"
        }
    },
    "DAVERAGE": {
        "title": [
            {
                "name": "DAVERAGE(",
                "editor": false
            },
            {
                "name": "区域1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "函数适用列",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "区域2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DAVERAGE(",
                "editor": false
            },
            {
                "name": "A4:E10",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4:E10",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "对列表或数据库中满足指定条件的记录字段（列）中的数值求平均值",
            "area1": "构成列表或数据库的单元格区域",
            "funccolumn": "指定函数所使用的列",
            "area2": "是包含所指定条件的单元格区域"
        }
    },
    "DAY": {
        "title": [
            {
                "name": "DAY(",
                "editor": false
            },
            {
                "name": "日期",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DAY(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回以序列号表示的某日期的天数，用整数 1 到 31 表示",
            "date": "要查找的那一天的日期"
        }
    },
    "DAYS": {
        "title": [
            {
                "name": "DAYS(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DAYS(",
                "editor": false
            },
            {
                "name": "'2011-3-15'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'2011-2-1'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回两个日期之间的天数",
            "date1": "用于计算期间天数的起始日期",
            "date2": "用于计算期间天数的终止日期"
        }
    },
    "DAYS360": {
        "title": [
            {
                "name": "DAYS360(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DAYS360(",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "按照一年 360 天的算法（每个月以 30 天计，一年共计 12 个月），返回两日期间相差的天数，这在一些会计计算中将会用到",
            "date1": "要计算期间天数的起始日期",
            "date2": "要计算期间天数的终止日期"
        }
    },
    "DB": {
        "title": [
            {
                "name": "DB(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value5]",
                "editor": true,
                "index": 10
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DB(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "7",
                "editor": true,
                "index": 10
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "使用固定余额递减法，计算一笔资产在给定期间内的折旧值",
            "value1": "资产原值",
            "value2": "资产在折旧期末的价值",
            "value3": "资产的折旧期数",
            "value4": "需要计算折旧值的期间",
            "value5": "第一年的月份数，如省略，则假设为 12"
        }
    },
    "DBCS": {
        "title": [
            {
                "name": "DBCS(",
                "editor": false
            },
            {
                "name": "text",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DBCS(",
                "editor": false
            },
            {
                "name": "EXCEL",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将字符串中的半角（单字节）字母转换为全角（双字节）字符",
            "text": "文本或包含要转换的文本的单元格的引用"
        }
    },
    "DCOUNT": {
        "title": [
            {
                "name": "DCOUNT(",
                "editor": false
            },
            {
                "name": "区域1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "函数适用列",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "区域2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DCOUNT(",
                "editor": false
            },
            {
                "name": "A4:E10",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'Age'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A1:F2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回列表或数据库中满足指定条件的记录字段（列）中包含数字的单元格的个数",
            "area1": "构成列表或数据库的单元格区域",
            "funccolumn": "指定函数所使用的列",
            "area2": "包含所指定条件的单元格区域"
        }
    },
    "DCOUNTA": {
        "title": [
            {
                "name": "DCOUNTA(",
                "editor": false
            },
            {
                "name": "区域1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "函数适用列",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "区域2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DCOUNTA(",
                "editor": false
            },
            {
                "name": "A4:E10",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'Profit'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A1:F2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回列表或数据库中满足指定条件的记录字段（列）中的非空单元格的个数",
            "area1": "构成列表或数据库的单元格区域",
            "funccolumn": "指定函数所使用的列",
            "area2": "包含所指定条件的单元格区域"
        }
    },
    "DDB": {
        "title": [
            {
                "name": "DDB(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value5]",
                "editor": true,
                "index": 9
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DDB(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1.5",
                "editor": true,
                "index": 9
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "使用双倍余额递减法或其他指定方法，计算一笔资产在给定期间内的折旧值",
            "value1": "资产原值",
            "value2": "资产在折旧期末的价值（有时也称为资产残值）。此值可以是 0",
            "value3": "资产的折旧期数",
            "value4": "需要计算折旧值的期间",
            "value5": "余额递减速率"
        }
    },
    "DEC2BIN": {
        "title": [
            {
                "name": "DEC2BIN(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DEC2BIN(",
                "editor": false
            },
            {
                "name": "9",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "4",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将十进制数转换为二进制数",
            "value1": "待转换的十进制整数",
            "value2": "要使用的字符数"
        }
    },
    "DEC2HEX": {
        "title": [
            {
                "name": "DEC2HEX(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DEC2HEX(",
                "editor": false
            },
            {
                "name": "100",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "4",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将十进制数转换为十六进制数",
            "value1": "待转换的十进制整数",
            "value2": "要使用的字符数"
        }
    },
    "DEC2OCT": {
        "title": [
            {
                "name": "DEC2OCT(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DEC2OCT(",
                "editor": false
            },
            {
                "name": "58",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "3",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将十进制数转换为八进制数",
            "value1": "待转换的十进制整数",
            "value2": "要使用的字符数"
        }
    },
    "DECIMAL": {
        "title": [
            {
                "name": "DECIMAL(",
                "editor": false
            },
            {
                "name": "text",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "数制",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DECIMAL(",
                "editor": false
            },
            {
                "name": "'FF'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "16",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "按给定基数将数字的文本表示形式转换成十进制数",
            "text": "所要转换的文本",
            "numtype": "转换所用的数制,必须是整数"
        }
    },
    "DEGREES": {
        "title": [
            {
                "name": "DEGREES(",
                "editor": false
            },
            {
                "name": "弧度角",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DEGREES(",
                "editor": false
            },
            {
                "name": "PI()",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将弧度转换为度",
            "arctangle": "待转换的弧度角"
        }
    },
    "DELTA": {
        "title": [
            {
                "name": "DELTA(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DELTA(",
                "editor": false
            },
            {
                "name": "5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "4",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "测试两个数值是否相等",
            "value1": "第一个数字",
            "value2": "第二个数字。如果省略，假设 Number2 的值为零"
        }
    },
    "DEVSQ": {
        "title": [
            {
                "name": "DEVSQ(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DEVSQ(",
                "editor": false
            },
            {
                "name": "A2:A8",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2,...]",
            //     "editor": true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回数据点与各自样本平均值偏差的平方和",
            "value1": "必需",
            "value2": "参数的个数可以为 1 到 255 个"
        }
    },
    "DGET": {
        "title": [
            {
                "name": "DGET(",
                "editor": false
            },
            {
                "name": "区域1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "函数适用列",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "区域2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DGET(",
                "editor": false
            },
            {
                "name": "A4:E10",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'Yield'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A1:A3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "从列表或数据库的列中提取符合指定条件的单个值",
            "area1": "构成列表或数据库的单元格区域",
            "funccolumn": "指定函数所使用的列",
            "area2": "包含所指定条件的单元格区域"
        }
    },
    "DISC": {
        "title": [
            {
                "name": "DISC(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DISC(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A5",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回有价证券的贴现率",
            "date1": "有价证券的结算日",
            "date2": "有价证券的到期日",
            "value1": "有价证券的价格（按面值为 ￥100 计算）",
            "value2": "有价证券的兑换值（按面值为 ￥100 计算）"

        }
    },
    "DMAX": {
        "title": [
            {
                "name": "DMAX(",
                "editor": false
            },
            {
                "name": "区域1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "函数适用列",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "区域2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DMAX(",
                "editor": false
            },
            {
                "name": "A5:E11",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'利润'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A1:F3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回列表或数据库中满足指定条件的记录字段（列）中的最大数字",
            "area1": "构成列表或数据库的单元格区域",
            "funccolumn": "指定函数所使用的列",
            "area2": "包含所指定条件的单元格区域"
        }
    },
    "DMIN": {
        "title": [
            {
                "name": "DMIN(",
                "editor": false
            },
            {
                "name": "区域1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "函数适用列",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "区域2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DMIN(",
                "editor": false
            },
            {
                "name": "A4:E10",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'Profit'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A1:B2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回列表或数据库中满足指定条件的记录字段（列）中的最小数字",
            "area1": "构成列表或数据库的单元格区域",
            "funccolumn": "指定函数所使用的列",
            "area2": "包含所指定条件的单元格区域"
        }
    },
    "DOLLAR": {
        "title": [
            {
                "name": "DOLLAR(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DOLLAR(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将数字转换为货币格式使用小数位数舍入到您指定的位数的文本",
            "value1": "数字、对包含数字的单元格的引用或是计算结果为数字的公式",
            "value2": "数值小数点右边的位数"
        }
    },
    "DOLLARDE": {
        "title": [
            {
                "name": "DOLLARDE(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DOLLARDE(",
                "editor": false
            },
            {
                "name": "1.02",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "16",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将以整数部分和分数部分表示的价格（例如 1.02）转换为以小数部分表示的价格",
            "value1": "以整数部份和分数部分表示的数字，用小数点隔开",
            "value2": "用作分数中的分母的整数"
        }
    },
    "DPRODUCT": {
        "title": [
            {
                "name": "DPRODUCT(",
                "editor": false
            },
            {
                "name": "区域1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "函数适用列",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "区域2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DPRODUCT(",
                "editor": false
            },
            {
                "name": "A5:E11",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'产量'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A1:F3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回列表或数据库中满足指定条件的记录字段（列）中的数值的乘积",
            "area1": "构成列表或数据库的单元格区域",
            "funccolumn": "指定函数所使用的列",
            "area2": "包含所指定条件的单元格区域"
        }
    },
    "DSTDEV": {
        "title": [
            {
                "name": "DSTDEV(",
                "editor": false
            },
            {
                "name": "区域1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "函数适用列",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "区域2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DSTDEV(",
                "editor": false
            },
            {
                "name": "A5:E11",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'产量'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A1:A3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回利用列表或数据库中满足指定条件的记录字段（列）中的数字作为一个样本估算出的总体标准偏差",
            "area1": "构成列表或数据库的单元格区域",
            "funccolumn": "指定函数所使用的列",
            "area2": "包含所指定条件的单元格区域"
        }
    },
    "DSTDEVP": {
        "title": [
            {
                "name": "DSTDEVP(",
                "editor": false
            },
            {
                "name": "区域1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "函数适用列",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "区域2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DSTDEVP(",
                "editor": false
            },
            {
                "name": "A5:E11",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'产量'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A1:A3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回利用列表或数据库中满足指定条件的记录字段（列）中的数字作为样本总体计算出的总体标准偏差",
            "area1": "构成列表或数据库的单元格区域",
            "funccolumn": "指定函数所使用的列",
            "area2": "包含所指定条件的单元格区域"
        }
    },
    "DSUM": {
        "title": [
            {
                "name": "DSUM(",
                "editor": false
            },
            {
                "name": "区域1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "函数适用列",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "区域2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DSUM(",
                "editor": false
            },
            {
                "name": "A4:E10",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'利润'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A1:F3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回列表或数据库中满足指定条件的记录字段（列）中的数字之和",
            "area1": "构成列表或数据库的单元格区域",
            "funccolumn": "指定函数所使用的列",
            "area2": "包含所指定条件的单元格区域"
        }
    },
    "DURATION": {
        "title": [
            {
                "name": "DURATION(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DURATION(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A6",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回假设面值为 ￥ 100 的 Macauley 工期",
            "date1": "有价证券的结算日",
            "date2": "有价证券的到期日",
            "value1": "有价证券的年息票利率",
            "returnrate": "有价证券的年收益率",
            "frequency": "年付息次数"
        }
    },
    "DVAR": {
        "title": [
            {
                "name": "DVAR(",
                "editor": false
            },
            {
                "name": "区域1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "函数适用列",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "区域2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DVAR(",
                "editor": false
            },
            {
                "name": "A4:E10",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'产量",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A1:A3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回利用列表或数据库中满足指定条件的记录字段（列）中的数字作为一个样本估算出的总体方差",
            "area1": "构成列表或数据库的单元格区域",
            "funccolumn": "指定函数所使用的列",
            "area2": "包含所指定条件的单元格区域"
        }
    },
    "DVARP": {
        "title": [
            {
                "name": "DVARP(",
                "editor": false
            },
            {
                "name": "区域1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "函数适用列",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "区域2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "DVARP(",
                "editor": false
            },
            {
                "name": "A4:E10",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'产量",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A1:A3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "通过使用列表或数据库中满足指定条件的记录字段（列）中的数字计算样本总体的样本总体方差",
            "area1": "构成列表或数据库的单元格区域",
            "funccolumn": "指定函数所使用的列",
            "area2": "包含所指定条件的单元格区域"
        }
    },
    "EDATE": {
        "title": [
            {
                "name": "EDATE(",
                "editor": false
            },
            {
                "name": "日期",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "EDATE(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回表示某个日期的序列号，该日期与指定日期 (start_date) 相隔（之前或之后）指示的月份数",
            "date": "一个代表开始日期的日期",
            "value": "日期之前或之后的月份数"
        }
    },
    "EFFECT": {
        "title": [
            {
                "name": "EFFECT(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "EFFECT(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "利用给定的名义年利率和每年的复利期数，计算有效的年利率",
            "value1": "名义利率",
            "value2": "每年的复利期数"
        }
    },
    "EOMONTH": {
        "title": [
            {
                "name": "EOMONTH(",
                "editor": false
            },
            {
                "name": "日期",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "EOMONTH(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回某个月份最后一天的序列号，该月份与 日期 相隔（之后或之后）指示的月份数",
            "date": "表示开始日期的日期",
            "value": "日期 之前或之后的月份数"
        }
    },
    "ERF": {
        "title": [
            {
                "name": "ERF(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ERF(",
                "editor": false
            },
            {
                "name": "0.745",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "value2",
            //     "editor": false
            // },
            {
                "name": ")",
                "editor": false
            }
        ],
        "content": {
            "abstract": "返回误差函数在上下限之间的积分",
            "value1": "函数的积分下限",
            "value2": "函数的积分上限。 如果省略，ERF 积分将在零到 lower_limit 之间"
        }
    },
    "ERFCPRECISE": {
        "title": [
            {
                "name": "ERFCPRECISE(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ERFCPRECISE(",
                "editor": false
            },
            {
                "name": "1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回从 数值 到无穷大积分的互补 ERF 函数",
            "value": "函数的积分下限"
        }
    },
    "ERROR.TYPE": {
        "title": [
            {
                "name": "ERROR.TYPE(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ERROR.TYPE(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回对应于 Microsoft Excel 中的错误值之一的数字或返回“#N/A”错误（如果不存在错误）",
            "value": "要查找其标识号的错误值"
        }
    },
    "EVEN": {
        "title": [
            {
                "name": "EVEN(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "EVEN(",
                "editor": false
            },
            {
                "name": "1.5",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回数字向上舍入到的最接近的偶数",
            "value": "要舍入的值"
        }
    },
    "EXACT": {
        "title": [
            {
                "name": "EXACT(",
                "editor": false
            },
            {
                "name": "文本1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "文本2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "EXACT(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "B2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "比较两个文本字符串，如果它们完全相同，则返回 TRUE，否则返回 FALSE",
            "text1": "第一个文本字符串",
            "text2": "第二个文本字符串"
        }
    },
    "EXPON.DIST": {
        "title": [
            {
                "name": "EXPON.DIST(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "EXPON.DIST(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "TRUE",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回指数分布",
            "value1": "函数值",
            "value2": "参数值",
            "value3": "逻辑值，用于指定指数函数的形式"
        }
    },
    "F.DIST": {
        "title": [
            {
                "name": "F.DIST(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "F.DIST(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "TRUE",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回 F 概率分布函数的函数值",
            "value1": "用来计算函数的值",
            "value2": "分子自由度",
            "value3": "分母自由度",
            "value4": "决定函数形式的逻辑值"
        }
    },
    "F.INV": {
        "title": [
            {
                "name": "F.INV(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "F.INV(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回 F 概率分布函数的反函数值",
            "value1": "F 累积分布的概率值",
            "value2": "分子自由度",
            "value3": "分母自由度"
        }
    },
    "F.TEST": {
        "title": [
            {
                "name": "F.TEST(",
                "editor": false
            },
            {
                "name": "array1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "array2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "F.TEST(",
                "editor": false
            },
            {
                "name": "A2:A6",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "B2:B6",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "判断两个样本的方差是否不同",
            "array1": "第一个数组或数据区域",
            "array2": "第二个数组或数据区域"
        }
    },
    "FACT": {
        "title": [
            {
                "name": "FACT(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "FACT(",
                "editor": false
            },
            {
                "name": "5",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回某数的阶乘",
            "value": "要计算其阶乘的非负数"
        }
    },
    "FACTDOUBLE": {
        "title": [
            {
                "name": "FACTDOUBLE(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "FACTDOUBLE(",
                "editor": false
            },
            {
                "name": "6",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回数字的双倍阶乘",
            "value": "要计算其双倍阶乘的数值"
        }
    },
    "FALSE": {
        "title": [
            {
                "name": "FALSE(",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "FALSE(",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回逻辑值 FALSE"
        }
    },
    "F.DIST.RT": {
        "title": [
            {
                "name": "F.DIST.RT(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "F.DIST.RT(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回两个数据集的（右尾）F 概率分布（变化程度）",
            "value1": "用来计算函数的值",
            "value2": "分子自由度",
            "value3": "分母自由度"
        }
    },
    "FIND": {
        "title": [
            {
                "name": "FIND(",
                "editor": false
            },
            {
                "name": "文本1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "文本2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[数值]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "FIND(",
                "editor": false
            },
            {
                "name": "'M'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[数值]",
            //     "editor": true,
            //     "index":5
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "用于在文本2中定位文本1，并返回文本1的起始位置的值，该值从文本2的第一个字符算起",
            "text1": "要查找的文本",
            "text2": "包含要查找文本的文本"
        }
    },
    "F.INV.RT": {
        "title": [
            {
                "name": "F.INV.RT(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "F.INV.RT(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回（右尾）F 概率分布函数的反函数值",
            "value1": "F 累积分布的概率值",
            "value2": "分子自由度",
            "value3": "分母自由度"
        }
    },
    "FISHER": {
        "title": [
            {
                "name": "FISHER(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "FISHER(",
                "editor": false
            },
            {
                "name": "0.75",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回 x 的 Fisher 变换值",
            "value": "要对其进行变换的数值"
        }
    },
    "FISHERINV": {
        "title": [
            {
                "name": "FISHERINV(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "FISHERINV(",
                "editor": false
            },
            {
                "name": "0.972955",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回 Fisher 逆变换值",
            "value": "要对其进行逆变换的数值"
        }
    },
    "FIXED": {
        "title": [
            {
                "name": "FIXED(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value3]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "FIXED(",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "-1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "TRUE",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将数字舍入到指定的小数位数，使用句点和逗号，以十进制数格式对该数进行格式设置，并以文本形式返回结果",
            "value1": "要进行舍入并转换为文本的数字",
            "value2": "小数点右边的位数",
            "value3": "一个逻辑值，如果为 TRUE，则会禁止 FIXED 在返回的文本中包含逗号"
        }
    },
    "FLOOR": {
        "title": [
            {
                "name": "FLOOR(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "FLOOR(",
                "editor": false
            },
            {
                "name": "3.7",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将参数 value1 向下舍入（沿绝对值减小的方向）为最接近的 value2 的倍数",
            "value1": "要舍入的数值",
            "value2": "要舍入到的倍数"
        }
    },
    "FLOOR.MATH": {
        "title": [
            {
                "name": "FLOOR.MATH(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 3
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value3]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "FLOOR.MATH(",
                "editor": false
            },
            {
                "name": "-5.5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "-1",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将数字向下舍入为最接近的整数或最接近的指定基数的倍数",
            "value1": "要向下舍入的数字",
            "value2": "要舍入到的倍数",
            "value3": "舍入负数的方向（接近或远离 0）"
        }
    },
    "FLOOR.PRECISE": {
        "title": [
            {
                "name": "FLOOR.PRECISE(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "FLOOR.PRECISE(",
                "editor": false
            },
            {
                "name": "-3.2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "-1",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回一个数字，该数字向下舍入为最接近的整数或最接近的 value2 的倍数",
            "value1": "要进行舍入的值",
            "value2": "要将数字舍入的倍数。如果省略,则其默认值为 1"
        }
    },
    "FORECAST": {
        "title": [
            {
                "name": "FORECAST(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "区域1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "区域2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "FORECAST(",
                "editor": false
            },
            {
                "name": "30",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A2:A6",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "B2:B6",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "根据现有值计算或预测未来值",
            "value": "需要进行值预测的数据点",
            "area1": "相关数组或数据区域",
            "area2": "独立数组或数据区域"
        }
    },
    "FREQUENCY": {
        "title": [
            {
                "name": "FREQUENCY(",
                "editor": false
            },
            {
                "name": "array1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "array2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "FREQUENCY(",
                "editor": false
            },
            {
                "name": "A2:A10",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "B2:B4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "函数计算值在某个范围内出现的频率, 然后返回一个垂直的数字数组",
            "array1": " 要对其频率进行计数的一组数值或对这组数值的引用",
            "array2": " 要将 array1 中的值插入到的间隔数组或对间隔的引用"
        }
    },
    "FV": {
        "title": [
            {
                "name": "FV(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value4]",
                "editor": true,
                "index": 7
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value5]",
                "editor": true,
                "index": 9
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "FV(",
                "editor": false
            },
            {
                "name": "A2/12",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A5",
                "editor": true,
                "index": 7
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A6",
                "editor": true,
                "index": 9
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "用于根据固定利率计算投资的未来值",
            "value1": "各期利率",
            "value2": "年金的付款总期数",
            "value3": "各期所应支付的金额，在整个年金期间保持不变",
            "value4": " 现值，或一系列未来付款的当前值的累积和。 如果省略 value4，则假定其值为 0",
            "value5": "数字 0 或 1，用以指定各期的付款时间是在期初还是期末。如果省略 value5，则假定其值为 0"
        }
    },
    "FVSCHEDULE": {
        "title": [
            {
                "name": "FVSCHEDULE(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "array",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "FVSCHEDULE(",
                "editor": false
            },
            {
                "name": "1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "{0.09,0.11,0.1}",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回应用一系列复利率计算的初始本金的未来值",
            "value": "现值",
            "array": "要应用的利率数组"
        }
    },
    "GAMMA": {
        "title": [
            {
                "name": "GAMMA(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "GAMMA(",
                "editor": false
            },
            {
                "name": "2.5",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回 gamma 函数值",
            "value": "返回一个数字"
        }
    },
    "GAMMA.DIST": {
        "title": [
            {
                "name": "GAMMA.DIST(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "GAMMA.DIST(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "FALSE",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回伽玛分布函数的函数值",
            "value1": "用来计算分布的数值",
            "value2": "分布参数",
            "value3": "分布参数",
            "value4": "决定函数形式的逻辑值"
        }
    },
    "GAMMA.INV": {
        "title": [
            {
                "name": "GAMMA.INV(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "GAMMA.INV(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回伽玛累积分布函数的反函数值",
            "value1": "伽玛分布相关的概率",
            "value2": "分布参数",
            "value3": "分布参数"
        }
    },
    "GAMMALN": {
        "title": [
            {
                "name": "GAMMALN(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "GAMMALN(",
                "editor": false
            },
            {
                "name": "4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回伽玛函数的自然对数",
            "value": "要计算其 GAMMALN 的数值"
        }
    },
    "GAMMALN.PRECISE": {
        "title": [
            {
                "name": "GAMMALN.PRECISE(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "GAMMALN.PRECISE(",
                "editor": false
            },
            {
                "name": "4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回伽玛函数的自然对数",
            "value": "要计算其 GAMMALN.PRECISE 的数值"
        }
    },
    "GAUSS": {
        "title": [
            {
                "name": "GAUSS(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "GAUSS(",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "计算标准正态总体的成员处于平均值与平均值的 z 倍标准偏差之间的概率",
            "value": "返回一个数字"
        }
    },
    "GCD": {
        "title": [
            {
                "name": "GCD(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "GCD(",
                "editor": false
            },
            {
                "name": "24",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "36",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回两个或多个整数的最大公约数",
            "value1": "任意实数",
            "value2": "任意实数,个数介于 1 和 255 之间"
        }
    },
    "GEOMEAN": {
        "title": [
            {
                "name": "GEOMEAN(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "GEOMEAN(",
                "editor": false
            },
            {
                "name": "A2:A8",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2,...]",
            //     "editor": true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回一组正数数据或正数数据区域的几何平均值",
            "value1": "任意实数",
            "value2": "任意实数,个数介于1到255之间"
        }
    },
    "GESTEP": {
        "title": [
            {
                "name": "GESTEP(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "GESTEP(",
                "editor": false
            },
            {
                "name": "5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "5",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "可以使用此函数来筛选一组值",
            "value1": "要针对步骤进行测试的值",
            "value2": "如果省略，则 GESTEP 使用零"
        }
    },
    "GROWTH": {
        "title": [
            {
                "name": "GROWTH(",
                "editor": false
            },
            {
                "name": "集合1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[集合2]",
                "editor": true,
                "index": 3
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value1]",
                "editor": true,
                "index": 5
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 7
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "GROWTH(",
                "editor": false
            },
            {
                "name": "B2:B7",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A2:A7",
                "editor": true,
                "index": 3
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value1]",
            //     "editor": true,
            //     "index":5
            // },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2]",
            //     "editor": true,
            //     "index":7
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "使用现有数据计算预测的指数等比",
            "set1": "关系表达式 y = b*m^x 中已知的 y 值集合",
            "set2": "关系表达式 y=b*m^x 中已知的 x 值集合",
            "value1": " 需要 GROWTH 返回对应 y 值的新 x 值",
            "value2": " 一个逻辑值，用于指定是否将常量 b 强制设为 1"
        }
    },
    "HARMEAN": {
        "title": [
            {
                "name": "HARMEAN(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "HARMEAN(",
                "editor": false
            },
            {
                "name": "A2:A8",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2,...]",
            //     "editor": true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回一组数据的调和平均值",
            "value1": "任意实数",
            "value2": "任意实数,个数介于1到255之间"
        }
    },
    "HEX2BIN": {
        "title": [
            {
                "name": "HEX2BIN(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "HEX2BIN(",
                "editor": false
            },
            {
                "name": "'F'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "8",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将十六进制数转换为二进制数",
            "value1": "要转换的十六进制数",
            "value2": "要使用的字符数"
        }
    },
    "HEX2DEC": {
        "title": [
            {
                "name": "HEX2DEC(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "HEX2DEC(",
                "editor": false
            },
            {
                "name": "'FFFFFFFF5B'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将十六进制数转换为十进制数",
            "value": "要转换的十六进制数",
        }
    },
    "HEX2OCT": {
        "title": [
            {
                "name": "HEX2OCT(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "HEX2OCT(",
                "editor": false
            },
            {
                "name": "'F'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "3",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将十六进制数转换为八进制数",
            "value1": "要转换的十六进制数",
            "value2": "要使用的字符数"
        }
    },
    "HLOOKUP": {
        "title": [
            {
                "name": "HLOOKUP(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "array1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value3]",
                "editor": true,
                "index": 7
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "HLOOKUP(",
                "editor": false
            },
            {
                "name": "'B'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A1:C1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "TRUE",
                "editor": true,
                "index": 7
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "在表格的首行或数值数组中搜索值，然后返回表格或数组中指定行的所在列中的值",
            "value1": "要在表格的第一行中查找的值",
            "array1": "在其中查找数据的信息表",
            "value2": "array1 中将返回匹配值的行号",
            "value3": "一个逻辑值，指定希望 HLOOKUP 查找精确匹配值还是近似匹配值"
        }
    },
    "HOUR": {
        "title": [
            {
                "name": "HOUR(",
                "editor": false
            },
            {
                "name": "时间",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "HOUR(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回时间值的小时数",
            "time": "时间值，其中包含要查找的小时数"
        }
    },
    "HYPGEOM.DIST": {
        "title": [
            {
                "name": "HYPGEOM.DIST(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ".",
                "editor": false
            },
            {
                "name": "value4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value5",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "HYPGEOM.DIST(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ".",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "TRUE",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回超几何分布",
            "value1": "样本中成功的次数",
            "value2": "样本量",
            "value3": "总体中成功的次数",
            "value4": "总体大小",
            "value5": "决定函数形式的逻辑值"
        }
    },
    "IF": {
        "title": [
            {
                "name": "IF(",
                "editor": false
            },
            {
                "name": "条件",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IF(",
                "editor": false
            },
            {
                "name": "A2>B2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'超出预算'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'正常'",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "如果条件为真，该函数将返回一个值；如果条件为假，函数将返回另一个值",
            "conditon": "要测试的条件",
            "value1": "条件的结果为 TRUE 时，您希望返回的值",
            "value2": "条件的结果为 FALSE 时，您希望返回的值"
        }
    },
    "IFERROR": {
        "title": [
            {
                "name": "IFERROR(",
                "editor": false
            },
            {
                "name": "值1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "值2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IFERROR(",
                "editor": false
            },
            {
                "name": "A2/B2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'计算中有错误'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "可以使用 IFERROR 函数捕获和处理公式中的错误",
            "value1": "检查是否存在错误的参数",
            "value2": "公式计算错误时返回的值"
        }
    },
    "IFNA": {
        "title": [
            {
                "name": "IFNA(",
                "editor": false
            },
            {
                "name": "参数",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IFNA(",
                "editor": false
            },
            {
                "name": 'VLOOKUP("Seattle",$A$5:$B$10,0)',
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'Not found'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "如果公式返回错误值 #N/A，则结果返回您指定的值；否则返回公式的结果",
            "param": "用于检查错误值 #N/A 的参数",
            "value": "公式计算结果为错误值 #N/A 时要返回的值"
        }
    },
    "IFS": {
        "title": [
            {
                "name": "IFS(",
                "editor": false
            },
            {
                "name": "条件1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "值1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[条件2,值2,...]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IFS(",
                "editor": false
            },
            {
                "name": "A2>89",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'A'",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[条件2,值2,...]",
            //     "editor": true,
            //     "index":5
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "函数检查是否满足一个或多个条件，且返回符合第一个 TRUE 条件的值",
            "condition1": "计算结果为 TRUE 或 FALSE 的条件",
            "value": "当 条件1 的计算结果为 TRUE 时要返回结果。 可以为空。",
            "condition2": "其他参数对"
        }
    },
    "IMABS": {
        "title": [
            {
                "name": "IMABS(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IMABS(",
                "editor": false
            },
            {
                "name": "'5+12i'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回以 x+yi 或 x+yj 文本格式表示的复数的绝对值",
            "value": "需要计算其绝对值的复数"
        }
    },
    "IMAGINARY": {
        "title": [
            {
                "name": "IMAGINARY(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IMAGINARY(",
                "editor": false
            },
            {
                "name": "'3+4i'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回以 x+yi 或 x+yj 文本格式表示的复数的虚系数",
            "value": "需要计算其虚系数的复数"
        }
    },
    "IMARGUMENT": {
        "title": [
            {
                "name": "IMARGUMENT(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IMARGUMENT(",
                "editor": false
            },
            {
                "name": "'3+4i'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回参数  θ (theta)，即以弧度表示的角",
            "value": "需要计算其参数  θ 的复数"
        }
    },
    "IMCONJUGATE": {
        "title": [
            {
                "name": "IMCONJUGATE(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": "",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IMCONJUGATE(",
                "editor": false
            },
            {
                "name": "'3+4i'",
                "editor": false
            },
            {
                "name": "",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回以 x+yi 或 x+yj 文本格式表示的复数的共轭复数",
            "value": "需要计算其共轭数的复数"
        }
    },
    "IMCOS": {
        "title": [
            {
                "name": "IMCOS(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IMCOS(",
                "editor": false
            },
            {
                "name": "'1+i'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回以 x+yi 或 x+yj 文本格式表示的复数的余弦",
            "value": "需要计算其余弦的复数"
        }
    },
    "IMCOSH": {
        "title": [
            {
                "name": "IMCOSH",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IMCOSH",
                "editor": false
            },
            {
                "name": "'4+3i'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回以 x+yi 或 x+yj 文本格式表示的复数的双曲余弦值",
            "value": "需要计算其双曲余弦值的复数"
        }
    },
    "IMCOT": {
        "title": [
            {
                "name": "IMCOT(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IMCOT(",
                "editor": false
            },
            {
                "name": "'4+3i'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回以 x+yi 或 x+yj 文本格式表示的复数的余切值",
            "value": "要对其余切值的复数"
        }
    },
    "IMCSC": {
        "title": [
            {
                "name": "IMCSC(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IMCSC(",
                "editor": false
            },
            {
                "name": "'4+3i'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回以 x+yi 或 x+yj 文本格式表示的复数的余割值",
            "value": "要对其余割值的复数"
        }
    },
    "IMCSCH": {
        "title": [
            {
                "name": "IMCSCH(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IMCSCH(",
                "editor": false
            },
            {
                "name": "'4+3i'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回以 x+yi 或 x+yj 文本格式表示的复数的双曲余割值",
            "value": "需要计算其双曲余割值的复数"
        }
    },
    "IMDIV": {
        "title": [
            {
                "name": "IMDIV(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IMDIV(",
                "editor": false
            },
            {
                "name": "'-238+240i'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'10+24i'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回以 x+yi 或 x+yj 文本格式表示的两个复数的商",
            "value1": "复数分子或被除数",
            "value2": "复数分母或除数"
        }
    },
    "IMEXP": {
        "title": [
            {
                "name": "IMEXP(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IMEXP(",
                "editor": false
            },
            {
                "name": "'4+3i'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回以 x+yi 或 x+yj 文本格式表示的复数的指数",
            "value": "需要计算其指数的复数"
        }
    },
    "IMLN": {
        "title": [
            {
                "name": "IMLN(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IMLN(",
                "editor": false
            },
            {
                "name": "'4+3i'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回以 x+yi 或 x+yj 文本格式表示的复数的自然对数",
            "value": "需要计算其自然对数的复数"
        }
    },
    "IMLOG2": {
        "title": [
            {
                "name": "IMLOG2(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IMLOG2(",
                "editor": false
            },
            {
                "name": "'4+3i'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返返回以 x+yi 或 x+yj 文本格式表示的复数的以 2 为底数的对数",
            "value": "需要计算以 2 为底数的对数的复数"
        }
    },
    "IMLOG10": {
        "title": [
            {
                "name": "IMLOG10(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IMLOG10(",
                "editor": false
            },
            {
                "name": "'4+3i'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回以 x + yi 或 x + yj 文本格式表示的复数的常用对数（以 10 为底数）",
            "value": "需要计算其常用对数的复数"
        }
    },
    "IMPOWER": {
        "title": [
            {
                "name": "IMPOWER(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IMPOWER(",
                "editor": false
            },
            {
                "name": "'4+3i'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回以 x+yi 或 x+yj 文本格式表示的复数的 n 次幂",
            "value1": "需要计算其幂值的复数",
            "value2": "需要对复数应用的幂次"
        }
    },
    "IMPRODUCT": {
        "title": [
            {
                "name": "IMPRODUCT(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IMPRODUCT(",
                "editor": false
            },
            {
                "name": "'1+2i'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "30",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回以 x+yi 或 x+yj 文本格式表示的 1 至 255 个复数的乘积",
            "value1": "任意复数",
            "value2": "任意复数,个数介于1到255之间"
        }
    },
    "IMREAL": {
        "title": [
            {
                "name": "IMREAL(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IMREAL(",
                "editor": false
            },
            {
                "name": "'4+3i'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回以 x+yi 或 x+yj 文本格式表示的复数的实系数",
            "value": "需要计算其实系数的复数"
        }
    },
    "IMSEC": {
        "title": [
            {
                "name": "IMSEC(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IMSEC(",
                "editor": false
            },
            {
                "name": "'4+3i'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回以 x+yi 或 x+yj 文本格式表示的复数的正割值",
            "value": "需要计算其正割值的复数"
        }
    },
    "IMSECH": {
        "title": [
            {
                "name": "IMSECH(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IMSECH(",
                "editor": false
            },
            {
                "name": "'4+3i'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回以 x+yi 或 x+yj 文本格式表示的复数的双曲正割值",
            "value": "需要计算其双曲正割值的复数"
        }
    },
    "IMSIN": {
        "title": [
            {
                "name": "IMSIN(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IMSIN(",
                "editor": false
            },
            {
                "name": "'4+3i'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回以 x+yi 或 x+yj 文本格式表示的复数的正弦值",
            "value": "需要计算其正弦的复数"
        }
    },
    "IMSINH": {
        "title": [
            {
                "name": "IMSINH(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IMSINH(",
                "editor": false
            },
            {
                "name": "'4+3i'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回以 x + yi 或 x + yj 文本格式的复数的双曲正弦值",
            "value": "要对其双曲正弦值的复数"
        }
    },
    "IMSQRT": {
        "title": [
            {
                "name": "IMSQRT(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IMSQRT(",
                "editor": false
            },
            {
                "name": "'4+3i'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回以 x+yi 或 x+yj 文本格式表示的复数的平方根",
            "value": "需要计算其平方根的复数"
        }
    },
    "IMSUB": {
        "title": [
            {
                "name": "IMSUB(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IMSUB(",
                "editor": false
            },
            {
                "name": "'13+4i'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'5+3i",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回以 x+yi 或 x+yj 文本格式表示的两个复数的差",
            "value1": "从（复）数中减去 value2",
            "value2": "从 value1 中减（复）数"
        }
    },
    "IMSUM": {
        "title": [
            {
                "name": "IMSUM(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IMSUM(",
                "editor": false
            },
            {
                "name": "'3+4i'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'5-3i'",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回以 x+yi 或 x+yj 文本格式表示的两个或多个复数的和",
            "value1": "任意复数",
            "value2": "任意复数,个数介于1到255之间"
        }
    },
    "IMTAN": {
        "title": [
            {
                "name": "IMTAN(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IMTAN(",
                "editor": false
            },
            {
                "name": "'4+3i'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回以 x+yi 或 x+yj 文本格式表示的复数的正切值",
            "value": "要对其进行切线的复数"
        }
    },
    "INDEX": {
        "title": [
            {
                "name": "INDEX(",
                "editor": false
            },
            {
                "name": "array",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "函数适用行",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[函数适用列]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "INDEX(",
                "editor": false
            },
            {
                "name": "A2:B3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "函数返回表格或区域中的值或值的引用",
            "array": "单元格区域或数组常量",
            "funcrow": "选择数组中的某行，函数从该行返回数值",
            "funccolum": "选择数组中的某列，函数从该列返回数值"
        }
    },
    "INFO": {
        "title": [
            {
                "name": "INFO(",
                "editor": false
            },
            {
                "name": "text",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "INFO(",
                "editor": false
            },
            {
                "name": "'numfile'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回有关当前操作环境的信息",
            "text": "用于指定要返回的信息类型的文本"
        }
    },
    "INT": {
        "title": [
            {
                "name": "INT(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "INT(",
                "editor": false
            },
            {
                "name": "8.9",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将数字向下舍入到最接近的整数",
            "value": "需要进行向下舍入取整的实数"
        }
    },
    "INTERCEPT": {
        "title": [
            {
                "name": "INTERCEPT(",
                "editor": false
            },
            {
                "name": "集合1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "集合2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "INTERCEPT(",
                "editor": false
            },
            {
                "name": "A2:A6",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "B2:B6",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "利用已知的 x 值与 y 值计算直线与 y 轴交叉点",
            "set1": "因变的观察值或数据的集合",
            "set2": "自变的观察值或数据的集合"
        }
    },
    "INTRATE": {
        "title": [
            {
                "name": "INTRATE(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "INTRATE(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A5",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回完全投资型证券的利率",
            "date1": "有价证券的结算日",
            "date2": "有价证券的到期日",
            "value1": "有价证券的投资额",
            "value2": "有价证券到期时的兑换值"
        }
    },
    "IPMT": {
        "title": [
            {
                "name": "IPMT(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value5]",
                "editor": true,
                "index": 9
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value6]",
                "editor": true,
                "index": 11
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "IPMT(",
                "editor": false
            },
            {
                "name": "A2/12",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4*12",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A5",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value5]",
            //     "editor": true,
            //     "index":9
            // },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value6]",
            //     "editor": true,
            //     "index":11
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "基于固定利率及等额分期付款方式，返回给定期数内对投资的利息偿还额",
            "value1": "各期利率",
            "value2": "用于计算其利息数额的期数，必须在 1 到 value3 之间",
            "value3": "年金的付款总期数",
            "value4": "现值，或一系列未来付款的当前值的累积和",
            "value5": "未来值，或在最后一次付款后希望得到的现金余额",
            "value6": "数字 0 或 1，用以指定各期的付款时间是在期初还是期末。 如果省略 value6，则假定其值为 0"
        }
    },
    "ISERR": {
        "title": [
            {
                "name": "ISERR(",
                "editor": false
            },
            {
                "name": "值",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ISERR(",
                "editor": false
            },
            {
                "name": "A6",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "检验是否存在错误情形",
            "value": "值为任意错误值（除去 #N/A）,则返回TRUE"
        }
    },
    "ISERROR": {
        "title": [
            {
                "name": "ISERROR(",
                "editor": false
            },
            {
                "name": "值",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ISERROR(",
                "editor": false
            },
            {
                "name": "A6",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "检验是否存在错误情形",
            "value": "值为任意错误值,则返回TRUE"
        }
    },
    "ISEVEN": {
        "title": [
            {
                "name": "ISEVEN(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ISEVEN(",
                "editor": false
            },
            {
                "name": "A6",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "如果参数 数值 为偶数，返回 TRUE，否则返回 FALSE",
            "value": "要测试的值"
        }
    },
    "ISFORMULA": {
        "title": [
            {
                "name": "ISFORMULA(",
                "editor": false
            },
            {
                "name": "引用",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ISFORMULA(",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "检查是否存在包含公式的单元格引用，然后返回 TRUE 或 FALSE",
            "reference": "引用是对要测试单元格的引用"
        }
    },
    "ISLOGICAL": {
        "title": [
            {
                "name": "ISLOGICAL(",
                "editor": false
            },
            {
                "name": "值",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ISLOGICAL(",
                "editor": false
            },
            {
                "name": "TRUE",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "判断是否为逻辑值",
            "value": "如果为逻辑值返回TRUE,否则返回FALSE"
        }
    },
    "ISNA": {
        "title": [
            {
                "name": "ISNA(",
                "editor": false
            },
            {
                "name": "值",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ISNA(",
                "editor": false
            },
            {
                "name": "#N/A",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "判断是否为#N/A",
            "value": "如果为#N/A返回TRUE,否则返回FALSE"
        }
    },
    "ISNONTEXT": {
        "title": [
            {
                "name": "ISNONTEXT(",
                "editor": false
            },
            {
                "name": "值",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ISNONTEXT(",
                "editor": false
            },
            {
                "name": "#N/A",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "判断是否为非文本的任意项",
            "value": "如果为非文本的任意项返回TRUE,否则返回FALSE"
        }
    },
    "ISNUMBER": {
        "title": [
            {
                "name": "ISNUMBER(",
                "editor": false
            },
            {
                "name": "值",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ISNUMBER(",
                "editor": false
            },
            {
                "name": "6",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "判断是否为数字",
            "value": "如果为数字返回TRUE,否则返回FALSE"
        }
    },
    "ISO.CEILING": {
        "title": [
            {
                "name": "ISO.CEILING(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ISO.CEILING(",
                "editor": false
            },
            {
                "name": "4.3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回一个数字，该数字向上舍入为最接近的整数或最接近的有效位的倍数",
            "value1": "要进行舍入的值",
            "value2": "要将数字舍入的可选倍数。如果省略，则其默认值为 1"
        }
    },
    "ISODD": {
        "title": [
            {
                "name": "ISODD(",
                "editor": false
            },
            {
                "name": "值",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ISODD(",
                "editor": false
            },
            {
                "name": "6",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "判断是否为奇数",
            "value": "如果为奇数返回TRUE,否则返回FALSE"
        }
    },
    "ISOWEEKNUM": {
        "title": [
            {
                "name": "ISOWEEKNUM(",
                "editor": false
            },
            {
                "name": "日期",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ISOWEEKNUM(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回给定日期在全年中的 ISO 周数",
            "date": "日期是 Excel 用于日期和时间计算的日期-时间代码"
        }
    },
    "ISPMT": {
        "title": [
            {
                "name": "ISPMT(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ISPMT(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A5",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "计算付薪 (或投资) 指定期间内 (甚至本金付款) 支付的利息 (或接收)",
            "value1": "投资的利率",
            "value2": "要查找其利息的期间, 并且必须介于1和 value3 之间",
            "value3": "投资的总支付期数",
            "value4": "投资的现值"
        }
    },
    "ISREF": {
        "title": [
            {
                "name": "ISREF(",
                "editor": false
            },
            {
                "name": "值",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ISREF(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "判断是否为引用",
            "value": "如果为引用返回TRUE,否则返回FALSE"
        }
    },
    "KURT": {
        "title": [
            {
                "name": "KURT(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "KURT(",
                "editor": false
            },
            {
                "name": "A2:A11",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2,...]",
            //     "editor": true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回一组数据的峰值",
            "value1": "任意值",
            "value2": "任意值,个数介于1到255之间"
        }
    },
    "LARGE": {
        "title": [
            {
                "name": "LARGE(",
                "editor": false
            },
            {
                "name": "区域",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "LARGE(",
                "editor": false
            },
            {
                "name": "A2:B6",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回数据集中第 k 个最大值",
            "area": "需要确定第 数值 个最大值的数组或数据区域",
            "value": "返回值在数组或数据单元格区域中的位置（从大到小排）"
        }
    },
    "LCM": {
        "title": [
            {
                "name": "KURT(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "LCM(",
                "editor": false
            },
            {
                "name": "A2:A11",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2,...]",
            //     "editor": true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回整数的最小公倍数",
            "value1": "任意整数",
            "value2": "任意整数,个数介于1到255之间"
        }
    },
    "LEFT": {
        "title": [
            {
                "name": "LEFT(",
                "editor": false
            },
            {
                "name": "text",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value1]",
                "editor": true,
                "index": 3
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "LEFT(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "4",
                "editor": true,
                "index": 3
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2]",
            //     "editor": true,
            //     "index":5
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "从文本字符串的第一个字符开始返回指定个数的字符",
            "text": "包含要提取的字符的文本字符串",
            "value1": "指定要由 LEFT 提取的字符的数量",
            "value2": "按字节指定要由 LEFTB 提取的字符的数量"
        }
    },
    "LINEST": {
        "title": [
            {
                "name": "LINEST(",
                "editor": false
            },
            {
                "name": "集合1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[集合2]",
                "editor": true,
                "index": 3
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value1]",
                "editor": true,
                "index": 5
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 7
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "LINEST(",
                "editor": false
            },
            {
                "name": "A2:A5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "B2:B5",
                "editor": true,
                "index": 3
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "FALSE",
                "editor": true,
                "index": 5
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2]",
            //     "editor": true,
            //     "index":7
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "使用最小二乘法计算与现有数据最佳拟合的直线，来计算某直线的统计值，然后返回描述此直线的数组",
            "set1": "关系表达式 y = mx + b 中已知的 y 值集合",
            "set2": "关系表达式 y = mx + b 中已知的 x 值集合",
            "value1": "一个逻辑值，用于指定是否将常量 b 强制设为 0",
            "value2": "一个逻辑值，用于指定是否返回附加回归统计值"
        }
    },
    "LOG": {
        "title": [
            {
                "name": "LOG(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "LOG(",
                "editor": false
            },
            {
                "name": "8",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "根据指定底数返回数字的对数",
            "value1": "想要计算其对数的正实数",
            "value2": "对数的底数。 如果省略，则假定其值为 10"
        }
    },
    "LOG10": {
        "title": [
            {
                "name": "LOG10(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "LOG10(",
                "editor": false
            },
            {
                "name": "86",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回数字以 10 为底的对数",
            "value": "想要计算其以 10 为底的对数的正实数"
        }
    },
    "LOGEST": {
        "title": [
            {
                "name": "LOGEST(",
                "editor": false
            },
            {
                "name": "集合1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[集合2]",
                "editor": true,
                "index": 3
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value1]",
                "editor": true,
                "index": 5
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 7
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "LOGEST(",
                "editor": false
            },
            {
                "name": "B2:B7",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A2:A7",
                "editor": true,
                "index": 3
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "TRUE",
                "editor": true,
                "index": 5
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "FALSE",
                "editor": true,
                "index": 7
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "计算适合您的数据的指数曲线, 并返回描述该曲线的值数组",
            "set1": "关系表达式 y = b*m^x 中已知的 y 值集合",
            "set2": "关系表达式 y=b*m^x 中已知的 x 值集合",
            "value1": "一个逻辑值，用于指定是否将常量 b 强制设为 1",
            "value2": "一个逻辑值，用于指定是否返回附加回归统计值"
        }
    },
    "LOGINV": {
        "title": [
            {
                "name": "LOGINV(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "LOGINV(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回 x 的对数累积分布函数的反函数值，此处的 ln(x) 是服从 value2 和 value3 的正态分布",
            "value1": "与对数分布相关的概率",
            "value2": "ln(x) 的平均值",
            "value3": "ln(x) 的标准偏差"
        }
    },
    "LOGNORM.DIST": {
        "title": [
            {
                "name": "LOGNORM.DIST(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "LOGNORM.DIST(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "TRUE",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回 x 的对数分布函数，此处的 ln(x) 是含有 value2 与 value3 参数的正态分布",
            "value1": "用来计算函数的值",
            "value2": "ln(x) 的平均值",
            "value3": "ln(x) 的标准偏差",
            "value4": "决定函数形式的逻辑值"
        }
    },
    "LOGNORM.INV": {
        "title": [
            {
                "name": "LOGNORM.INV(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "LOGNORM.INV(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回 x 的对数累积分布函数的反函数值，此处的 ln(x) 是服从参数 value2 和 value3 的正态分布",
            "value1": "与对数分布相关的概率",
            "value2": "ln(x) 的平均值",
            "value3": "ln(x) 的标准偏差"
        }
    },
    "LOWER": {
        "title": [
            {
                "name": "LOWER(",
                "editor": false
            },
            {
                "name": "text",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "LOWER(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将一个文本字符串中的所有大写字母转换为小写字母",
            "text": "要转换为小写字母的文本"
        }
    },
    "MATCH": {
        "title": [
            {
                "name": "MATCH(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "区域",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "MATCH(",
                "editor": false
            },
            {
                "name": "39",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "B2:B5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "在 范围 单元格中搜索特定的项，然后返回该项在此区域中的相对位置",
            "value1": "要在 区域 中匹配的值",
            "area": "要搜索的单元格区域",
            "value2": "数字 -1、0 或 1"
        }
    },
    "MAX": {
        "title": [
            {
                "name": "MAX(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "MAX(",
                "editor": false
            },
            {
                "name": "A2:A6",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2,...]",
            //     "editor": true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回一组值中的最大值",
            "value1": "任意实数",
            "value2": "任意实数,个数介于1到255之间"
        }
    },
    "MDETERM": {
        "title": [
            {
                "name": "MDETERM(",
                "editor": false
            },
            {
                "name": "array",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "MDETERM(",
                "editor": false
            },
            {
                "name": "A2:D5",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回一个数组的矩阵行列式的值",
            "array": "行数和列数相等的数值数组"
        }
    },
    "MDURATION": {
        "title": [
            {
                "name": "MDURATION(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "MDURATION(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回假设面值 ￥100 的有价证券的 Macauley 修正期限",
            "date1": "有价证券的结算日",
            "date2": "有价证券的到期日",
            "value1": "有价证券的年息票利率",
            "value2": "有价证券的年收益率",
            "value3": "年付息次数"
        }
    },
    "MEDIAN": {
        "title": [
            {
                "name": "MEDIAN(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "MEDIAN(",
                "editor": false
            },
            {
                "name": "A2:A6",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2,...]",
            //     "editor": true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回一组已知数字的中值",
            "value1": "任意实数",
            "value2": "任意实数,个数介于1到255之间"
        }
    },
    "MID": {
        "title": [
            {
                "name": "MID(",
                "editor": false
            },
            {
                "name": "text",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "MID(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回文本字符串中从指定位置开始的特定数目的字符，该数目由用户指定",
            "text": "包含要提取字符的文本字符串",
            "value1": "文本中要提取的第一个字符的位置",
            "value2": "指定希望 MID 从文本中返回字符的个数"
        }
    },
    "MIN": {
        "title": [
            {
                "name": "MIN(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "MIN(",
                "editor": false
            },
            {
                "name": "A2:A6",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2,...]",
            //     "editor": true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回一组值中的最小值",
            "value1": "任意实数",
            "value2": "任意实数,个数介于1到255之间"
        }
    },
    "MINA": {
        "title": [
            {
                "name": "MINA(",
                "editor": false
            },
            {
                "name": "值1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[值2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "MINA(",
                "editor": false
            },
            {
                "name": "A2:A6",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[值2,...]",
            //     "editor": true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回参数列表中的最小值",
            "value1": "任意值",
            "value2": "任意值,个数介于1到255之间"
        }
    },
    "MINUTE": {
        "title": [
            {
                "name": "MINUTE(",
                "editor": false
            },
            {
                "name": "时间",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "MINUTE(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回时间值中的分钟。 分钟是一个介于 0 到 59 之间的整数",
            "time": "一个时间值，其中包含要查找的分钟"
        }
    },
    "MINVERSE": {
        "title": [
            {
                "name": "MINVERSE(",
                "editor": false
            },
            {
                "name": "array",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "MINVERSE(",
                "editor": false
            },
            {
                "name": "A2:B3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回数组中存储的矩阵的逆矩阵",
            "array": "行数和列数相等的数值数组"
        }
    },
    "MIRR": {
        "title": [
            {
                "name": "MIRR(",
                "editor": false
            },
            {
                "name": "array",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "MIRR(",
                "editor": false
            },
            {
                "name": "A2:A7",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A8",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A9",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回一系列定期现金流的已修改内部收益率",
            "array": "数组或对包含数字的单元格的引用",
            "value1": "现金流中使用的资金支付的利率",
            "value2": "将现金流再投资的收益率"
        }
    },
    "MMULT": {
        "title": [
            {
                "name": "MMULT(",
                "editor": false
            },
            {
                "name": "array1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "array2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "MMULT(",
                "editor": false
            },
            {
                "name": "A2:B3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A5:B6",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回两个数组的矩阵乘积",
            "array1": "要进行矩阵乘法运算的第一个数组",
            "array2": "要进行矩阵乘法运算的第二个数组"
        }
    },
    "MOD": {
        "title": [
            {
                "name": "MOD(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "MOD(",
                "editor": false
            },
            {
                "name": "3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回两数相除的余数",
            "value1": "要计算余数的被除数",
            "value2": "除数"
        }
    },
    "MODE": {
        "title": [
            {
                "name": "MODE(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "MODE(",
                "editor": false
            },
            {
                "name": "A2:A7",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2,...]",
            //     "editor": true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "回的数组或数据区域中出现频率最高或重复出现",
            "value1": "任意实数",
            "value2": "任意实数,个数介于1到255之间"
        }
    },
    "MODE.MULT": {
        "title": [
            {
                "name": "MODE.MULT(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "MODE.MULT(",
                "editor": false
            },
            {
                "name": "A2:A13",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2,...]",
            //     "editor": true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回一组数据或数据区域中出现频率最高或重复出现的数值的垂直数组",
            "value1": "任意实数",
            "value2": "任意实数,个数介于1到255之间"
        }
    },
    "MODE.SNGL": {
        "title": [
            {
                "name": "MODE.SNGL(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "MODE.SNGL(",
                "editor": false
            },
            {
                "name": "A2:A13",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2,...]",
            //     "editor": true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回一组数据或数据区域中出现频率最高或重复出现的数值的垂直数组",
            "value1": "任意实数",
            "value2": "任意实数,个数介于1到255之间"
        }
    },
    "MONTH": {
        "title": [
            {
                "name": "MONTH(",
                "editor": false
            },
            {
                "name": "日期",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "MONTH(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回日期（以序列数表示）中的月份。 月份是介于 1（一月）到 12（十二月）之间的整数",
            "date": "您尝试查找的月份的日期"
        }
    },
    "MROUND": {
        "title": [
            {
                "name": "MROUND(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "MROUND(",
                "editor": false
            },
            {
                "name": "5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "-2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回舍入到所需倍数的数字",
            "value1": "要舍入的值",
            "value2": "要舍入到的倍数"
        }
    },
    "MULTINOMIAL": {
        "title": [
            {
                "name": "MULTINOMIAL(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },

        ],
        "example": [
            {
                "name": "MULTINOMIAL(",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "3",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回参数和的阶乘与各参数阶乘乘积的比值",
            "value1": "任意实数",
            "value2": "任意实数,个数介于1到255之间"
        }
    },
    "MUNIT": {
        "title": [
            {
                "name": "MUNIT(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "MUNIT(",
                "editor": false
            },
            {
                "name": "3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回指定维度的单位矩阵",
            "value": "指定要返回的单位矩阵的维度"
        }
    },
    "N": {
        "title": [
            {
                "name": "N(",
                "editor": false
            },
            {
                "name": "值",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "N(",
                "editor": false
            },
            {
                "name": "7",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回转化为数值后的值",
            "value": "要转换的值"
        }
    },
    "NA": {
        "title": [
            {
                "name": "NA(",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "NA(",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回 #N/A. 的错误值",
        }
    },
    "NEGBINOM.DIST": {
        "title": [
            {
                "name": "NEGBINOM.DIST(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "NEGBINOM.DIST(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "TRUE",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回负二项式分布",
            "value1": "失败的次数",
            "value2": "成功次数的阈值",
            "value3": "成功的概率",
            "value4": "决定函数形式的逻辑值"
        }
    },
    "NETWORKDAYS": {
        "title": [
            {
                "name": "NETWORKDAYS(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value3]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "NETWORKDAYS(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回参数 value1 和 value2 之间完整的工作日数值",
            "value1": " 一个代表开始日期的日期",
            "value2": " 一个代表终止日期的日期",
            "value3": "不在工作日历中的一个或多个日期所构成的可选区域"
        }
    },
    "NETWORKDAYS.INTL": {
        "title": [
            {
                "name": "NETWORKDAYS.INTL(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[数值]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "NETWORKDAYS.INTL(",
                "editor": false
            },
            {
                "name": "DATE(2006,1,1)",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "DATE(2006,1,31)",
                "editor": false,
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[数值]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回两个日期之间的所有工作日数，使用参数指示哪些天是周末，以及有多少天是周末",
            "date1": "一个代表开始日期的日期",
            "date2": "一个代表终止日期的日期",
            "value": "表示介于 日期1 和 日期2 之间但又不包括在所有工作日数中的周末日"
        }
    },
    "NOMINAL": {
        "title": [
            {
                "name": "NOMINAL(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "NOMINAL(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "基于给定的实际利率和年复利期数，返回名义年利率",
            "value1": "实际利率",
            "value2": "每年的复利期数"
        }
    },
    "NORM.DIST": {
        "title": [
            {
                "name": "NORM.DIST(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "NORM.DIST(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "TRUE",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回指定平均值和标准偏差的正态分布函数",
            "value1": "需要计算其分布的数值",
            "value2": "分布的算术平均值",
            "value3": "分布的标准偏差",
            "value4": "确定函数形式的逻辑值"
        }
    },
    "NORM.INV": {
        "title": [
            {
                "name": "NORM.INV(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "NORM.INV(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回指定平均值和标准偏差的正态累积分布函数的反函数值",
            "value1": "对应于正态分布的概率",
            "value2": "分布的算术平均值",
            "value3": "分布的标准偏差"
        }
    },
    "NORM.S.DIST": {
        "title": [
            {
                "name": "NORM.S.DIST(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "NORM.S.DIST(",
                "editor": false
            },
            {
                "name": "1.333333",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "TRUE",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回标准正态分布函数",
            "value1": "需要计算其分布的数值",
            "value2": "决定函数形式的逻辑值"
        }
    },
    "NOT": {
        "title": [
            {
                "name": "NOT(",
                "editor": false
            },
            {
                "name": "逻辑函数",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "NOT(",
                "editor": false
            },
            {
                "name": "A2>100",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "函数会对其参数的值进行求反",
            "logicfunc": "计算结果为 TRUE 或 FALSE 的任何值或表达式"
        }
    },
    "NOW": {
        "title": [
            {
                "name": "NOW(",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "NOW(",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回当前日期和时间的序列号",
        }
    },
    "NPER": {
        "title": [
            {
                "name": "NPER(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value4]",
                "editor": true,
                "index": 7
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value5]",
                "editor": true,
                "index": 9
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "NPER(",
                "editor": false
            },
            {
                "name": "A2/12",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A5",
                "editor": true,
                "index": 7
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "TRUE",
                "editor": true,
                "index": 9
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "基于固定利率及等额分期付款方式，返回某项投资的总期数",
            "value1": "各期利率",
            "value2": "各期所应支付的金额，在整个年金期间保持不变",
            "value3": "现值，或一系列未来付款的当前值的累积和",
            "value4": "未来值，或在最后一次付款后希望得到的现金余额",
            "value5": "数字 0 或 1，用以指定各期的付款时间是在期初还是期末"
        }
    },
    "NPV": {
        "title": [
            {
                "name": "NPV(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "值1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[值2,...]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "NPV(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "使用贴现率和一系列未来支出（负值）和收益（正值）来计算一项投资的净现值",
            "value": "某一期间的贴现率",
            "value1": "任意实数",
            "value2": "任意实数,个数介于1到255之间"
        }
    },
    "NUMBERVALUE": {
        "title": [
            {
                "name": "NUMBERVALUE(",
                "editor": false
            },
            {
                "name": "text",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[字符1]",
                "editor": true,
                "index": 3
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[字符2]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "NUMBERVALUE(",
                "editor": false
            },
            {
                "name": "'2.500,27'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "','",
                "editor": true,
                "index": 3
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'.'",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "以与区域设置无关的方式将文本转换为数字",
            "text": "要转换为数字的文本",
            "character1": "用于分隔结果的整数和小数部分的字符",
            "character2": " 用于分隔数字分组的字符"
        }
    },
    "OCT2DEC": {
        "title": [
            {
                "name": "OCT2DEC(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "OCT2DEC(",
                "editor": false
            },
            {
                "name": "54",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将八进制数转换为十进制数",
            "value": "要转换的八进制数"
        }
    },
    "OCT2BIN": {
        "title": [
            {
                "name": "OCT2BIN(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "OCT2BIN(",
                "editor": false
            },
            {
                "name": "3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "3",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将八进制数转换为二进制数",
            "value1": "要转换的八进制数",
            "value2": "要使用的字符数"
        }
    },
    "OCT2HEX": {
        "title": [
            {
                "name": "OCT2HEX(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "OCT2HEX(",
                "editor": false
            },
            {
                "name": "100",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "4",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将八进制数转换为十六进制数",
            "value1": "要转换的八进制数",
            "value2": "要使用的字符数"
        }
    },
    "ODD": {
        "title": [
            {
                "name": "ODD(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ODD(",
                "editor": false
            },
            {
                "name": "1.5",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回数字向上舍入到的最接近的奇数",
            "value": "要舍入的值"
        }
    },
    "ODDFPRICE": {
        "title": [
            {
                "name": "ODDFPRICE(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期4",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ODDFPRICE(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A5",
                "editor": false
            },
            {
                "name": "A6",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A7",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A8",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A9",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回首期付息日不固定（长期或短期）的面值 ￥100 的有价证券价格",
            "date1": "有价证券的结算日",
            "date2": "有价证券的到期日",
            "date3": "有价证券的发行日",
            "date4": "有价证券的首期付息日",
            "value1": "有价证券的利率",
            "value2": "有价证券的年收益率",
            "value3": "面值 ￥100 的有价证券的清偿价值",
            "value4": "年付息次数"
        }
    },
    "ODDFYIELD": {
        "title": [
            {
                "name": "ODDFYIELD(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期4",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ODDFYIELD(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A5",
                "editor": false
            },
            {
                "name": "A6",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A7",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A8",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A9",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回首期付息日不固定（长期或短期）的面值 ￥100 的有价证券价格",
            "date1": "有价证券的结算日",
            "date2": "有价证券的到期日",
            "date3": "有价证券的发行日",
            "date4": "有价证券的首期付息日",
            "value1": "有价证券的利率",
            "value2": "有价证券的价格",
            "value3": "面值 ￥100 的有价证券的清偿价值",
            "value4": "年付息次数"
        }
    },
    "ODDLPRICE": {
        "title": [
            {
                "name": "ODDLPRICE(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ODDLPRICE(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A6",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A7",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A8",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回末期付息日不固定的面值 ￥100 的有价证券（长期或短期）的价格",
            "date1": "有价证券的结算日",
            "date2": "有价证券的到期日",
            "date3": "有价证券的末期付息日",
            "value1": "有价证券的利率",
            "value2": "有价证券的年收益率",
            "value3": "面值 ￥100 的有价证券的清偿价值",
            "value4": "年付息次数"
        }
    },
    "ODDLYIELD": {
        "title": [
            {
                "name": "ODDLYIELD(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ODDLYIELD(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A6",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A7",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A8",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回末期付息日不固定的面值 ￥100 的有价证券（长期或短期）的价格",
            "date1": "有价证券的结算日",
            "date2": "有价证券的到期日",
            "date3": "有价证券的末期付息日",
            "value1": "有价证券的利率",
            "value2": "有价证券的价格",
            "value3": "面值 ￥100 的有价证券的清偿价值",
            "value4": "年付息次数"
        }
    },
    "OR": {
        "title": [
            {
                "name": "OR(",
                "editor": false
            },
            {
                "name": "条件1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[条件2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "OR(",
                "editor": false
            },
            {
                "name": "A2>1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A2<100",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "函数的任意参数计算为 TRUE，则其返回 TRUE；如果其所有参数均计算机为 FALSE，则返回 FALSE",
            "condition1": "第一个想要测试且计算结果可为 TRUE 或 FALSE 的条件",
            "condition2": "其他想要测试且计算结果可为 TRUE 或 FALSE 的条件（最多 255 个条件）"
        }
    },
    "PDURATION": {
        "title": [
            {
                "name": "PDURATION(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "PDURATION(",
                "editor": false
            },
            {
                "name": "2.5%",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2000",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2200",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回投资到达指定值所需的期数",
            "value1": "费率是指每期的利率",
            "value2": "投资的现值",
            "value3": "所需投资的未来值"
        }
    },
    "PEARSON": {
        "title": [
            {
                "name": "PEARSON(",
                "editor": false
            },
            {
                "name": "array1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "array2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "PEARSON(",
                "editor": false
            },
            {
                "name": "A3:A7",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "B3:B7",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回皮尔生(Pearson)乘积矩相关系数 r，这是一个范围在 -1.0 到 1.0 之间（包括 -1.0 和 1.0 在内）的无量纲指数，反映了两个数据集合之间的线性相关程度",
            "array": "自变量集合",
            "array2": "因变量集合"
        }
    },
    "PERCENTILE": {
        "title": [
            {
                "name": "PERCENTILE(",
                "editor": false
            },
            {
                "name": "array",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "PERCENTILE(",
                "editor": false
            },
            {
                "name": "E2:E5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "0.3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回区域中数值的第 k 个百分点的值",
            "array": "定义相对位置的数组或数据区域",
            "value": "0 到 1 之间的百分点值，包含 0 和 1"
        }
    },
    "PERCENTILE.EXC": {
        "title": [
            {
                "name": "PERCENTILE.EXC(",
                "editor": false
            },
            {
                "name": "array",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "PERCENTILE.EXC(",
                "editor": false
            },
            {
                "name": "E2:E5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "0.3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回区域中数值的第 K 个百分点的值，其中 k 为 0 到 1 之间的值，不包含 0 和 1",
            "array": "定义相对位置的数组或数据区域",
            "value": "0 到 1 之间的百分点值，包含 0 和 1"
        }
    },
    "PERCENTILE.INC": {
        "title": [
            {
                "name": "PERCENTILE.INC(",
                "editor": false
            },
            {
                "name": "array",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "PERCENTILE.INC(",
                "editor": false
            },
            {
                "name": "E2:E5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "0.3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回区域中数值的第 K 个百分点的值，K 为 0 到 1 之间的百分点值，包含 0 和 1",
            "array": "定义相对位置的数组或数据区域",
            "value": "0 到 1 之间的百分点值，包含 0 和 1"
        }
    },
    "PERCENTRANK": {
        "title": [
            {
                "name": "PERCENTRANK(",
                "editor": false
            },
            {
                "name": "array",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "PERCENTRANK(",
                "editor": false
            },
            {
                "name": "A2:A11",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2]",
            //     "editor": true,
            //     "index":5
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将某个数值在数据集中的排位作为数据集的百分比值返回，此处的百分比值的范围为 0 到 1",
            "array": "定义相对位置的数值数组或数值数据区域",
            "value1": "需要得到其排位的值",
            "value2": "用于标识返回的百分比值的有效位数的值"
        }
    },
    "PERCENTRANK.EXC": {
        "title": [
            {
                "name": "PERCENTRANK.EXC(",
                "editor": false
            },
            {
                "name": "array",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "PERCENTRANK.EXC(",
                "editor": false
            },
            {
                "name": "A2:A11",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2]",
            //     "editor": true,
            //     "index":5
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回某个数值在一个数据集中的百分比（0 到 1，不包括 0 和 1）排位",
            "array": "定义相对位置的数值数组或数值数据区域",
            "value1": "需要得到其排位的值",
            "value2": "用于标识返回的百分比值的有效位数的值"
        }
    },
    "PERCENTRANK.INC": {
        "title": [
            {
                "name": "PERCENTRANK.INC(",
                "editor": false
            },
            {
                "name": "array",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "PERCENTRANK.INC(",
                "editor": false
            },
            {
                "name": "A2:A11",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2]",
            //     "editor": true,
            //     "index":5
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将某个数值在数据集中的排位作为数据集的百分比值返回，此处的百分比值的范围为 0 到 1（含 0 和 1）",
            "array": "定义相对位置的数值数组或数值数据区域",
            "value1": "需要得到其排位的值",
            "value2": "用于标识返回的百分比值的有效位数的值"
        }
    },
    "PERMUT": {
        "title": [
            {
                "name": "PERMUT(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "PERMUT(",
                "editor": false
            },
            {
                "name": "3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回可从数字对象中选择的给定数目对象的排列数",
            "value1": "表示对象个数的整数",
            "value2": "表示每个排列中对象个数的整数"
        }
    },
    "PERMUTATIONA": {
        "title": [
            {
                "name": "PERMUTATIONA(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "PERMUTATIONA(",
                "editor": false
            },
            {
                "name": "3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回可从对象总数中选择的给定数目对象（含重复）的排列数",
            "value1": "表示对象总数的整数",
            "value2": "表示每个排列中对象数目的整数"
        }
    },
    "PHI": {
        "title": [
            {
                "name": "PHI(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "PHI(",
                "editor": false
            },
            {
                "name": "0.75",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回标准正态分布的密度函数值",
            "value": "所需的标准正态分布密度值"
        }
    },
    "PI": {
        "title": [
            {
                "name": "PI(",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "PI(",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回数字 3.14159265358979（数学常量 pi），精确到 15 个数字",
        }
    },
    "POISSON": {
        "title": [
            {
                "name": "POISSON(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "POISSON(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "TRUE",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回泊松分布",
            "value1": "事件数",
            "value2": "期望值",
            "value3": "一逻辑值，确定所返回的概率分布的形式"
        }
    },
    "POISSON.DIST": {
        "title": [
            {
                "name": "POISSON.DIST(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "POISSON.DIST(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "TRUE",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回泊松分布",
            "value1": "事件数",
            "value2": "期望值",
            "value3": "一逻辑值，确定所返回的概率分布的形式"
        }
    },
    "POWER": {
        "title": [
            {
                "name": "POWER(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "POWER(",
                "editor": false
            },
            {
                "name": "5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回数字乘幂的结果",
            "value1": "基数。 可为任意实数",
            "value2": "基数乘幂运算的指数"
        }
    },
    "PPMT": {
        "title": [
            {
                "name": "PPMT(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            }, {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value5]",
                "editor": true,
                "index": 9
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "PPMT(",
                "editor": false
            },
            {
                "name": "A11",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A12",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            }, {
                "name": "10",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A13",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value5]",
            //     "editor": true,
            //     "index":9
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回根据定期固定付款和固定利率而定的投资在已知期间内的本金偿付额",
            "value1": "各期利率",
            "value2": "指定期数，该值必须在 1 到 value3 范围内",
            "value3": "年金的付款总期数",
            "value4": "现值即一系列未来付款当前值的总和",
            "value5": "数字 0 或 1，用以指定各期的付款时间是在期初还是期末"
        }
    },
    "PRICE": {
        "title": [
            {
                "name": "PRICE(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "PRICE(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A6",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A7",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回定期付息的面值 ￥100 的有价证券的价格",
            "date1": "有价证券的结算日",
            "date2": "有价证券的到期日",
            "value1": "有价证券的年息票利率",
            "value2": "有价证券的年收益率",
            "value3": "面值 ￥100 的有价证券的清偿价值",
            "value4": "年付息次数"
        }
    },
    "PRICEDISC": {
        "title": [
            {
                "name": "PRICEDISC(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "PRICEDISC(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A5",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回折价发行的面值 ￥100 的有价证券的价格",
            "date1": "有价证券的结算日",
            "date2": "有价证券的到期日",
            "value1": "有价证券的贴现率",
            "value2": "面值 ￥100 的有价证券的清偿价值"
        }
    },
    "PRICEMAT": {
        "title": [
            {
                "name": "PRICEMAT(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "PRICEMAT(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A6",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A7",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回到期付息的面值 ￥100 的有价证券的价格",
            "date1": "有价证券的结算日",
            "date2": "有价证券的到期日",
            "date3": "有价证券的发行日，以时间序列号表示",
            "value1": "有价证券在发行日的利率",
            "value2": "有价证券的年收益率",
        }
    },
    "PROB": {
        "title": [
            {
                "name": "PROB(",
                "editor": false
            },
            {
                "name": "区域1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "array",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value1]",
                "editor": true,
                "index": 5
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 7
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "PROB(",
                "editor": false
            },
            {
                "name": "A3:A6",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "B3:B6",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": true,
                "index": 5
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value3]",
                "editor": true,
                "index": 7
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回区域中的数值落在指定区间内的概率",
            "area": "具有各自相应概率值的 x 数值区域",
            "array": "与 区域 中的值相关联的一组概率值",
            "value1": "要计算其概率的数值下界",
            "value2": "要计算其概率的可选数值上界"
        }
    },
    "PRODUCT": {
        "title": [
            {
                "name": "PRODUCT(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "PRODUCT(",
                "editor": false
            },
            {
                "name": "A2:A4",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2,...]",
            //     "editor": true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "函数将以参数形式给出的所有数字相乘, 并返回该产品",
            "value1": "要相乘的第一个数字或范围",
            "value2": "要相乘的其他数字或单元格区域，最多可以使用 255 个参数"
        }
    },
    "PROPER": {
        "title": [
            {
                "name": "PROPER(",
                "editor": false
            },
            {
                "name": "text",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "PROPER(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将文本字符串的首字母以及文字中任何非字母字符之后的任何其他字母转换成大写",
            "text": "用引号括起来的文本、返回文本值的公式，或者对包含要进行部分大写转换文本的单元格的引用"
        }
    },
    "PV": {
        "title": [
            {
                "name": "PV(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value4]",
                "editor": true,
                "index": 7
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value5]",
                "editor": true,
                "index": 9
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "PV(",
                "editor": false
            },
            {
                "name": "A3/12",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "12*A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            // {
            //     "name": "[value4]",
            //     "editor": true,
            //     "index":7
            // },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "0",
                "editor": true,
                "index": 9
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "用于根据固定利率计算贷款或投资的现值",
            "value1": "各期利率",
            "value2": "年金的付款总期数",
            "value3": "每期的付款金额，在年金周期内不能更改",
            "value4": "未来值，或在最后一次付款后希望得到的现金余额",
            "value5": "数字 0 或 1，用以指定各期的付款时间是在期初还是期末"
        }
    },
    "QUARTILE": {
        "title": [
            {
                "name": "QUARTILE(",
                "editor": false
            },
            {
                "name": "array",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "QUARTILE(",
                "editor": false
            },
            {
                "name": "A2:A9",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回一组数据的四分位点",
            "array": "要求得四分位数值的数组或数字型单元格区域",
            "value": "指定返回哪一个值"
        }
    },
    "QUARTILE.EXC": {
        "title": [
            {
                "name": "QUARTILE.EXC(",
                "editor": false
            },
            {
                "name": "array",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "QUARTILE.EXC(",
                "editor": false
            },
            {
                "name": "A2:A9",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "基于 0 到 1 之间（不包括 0 和 1）的百分点值返回数据集的四分位数",
            "array": "要求得四分位数值的数组或数字型单元格区域",
            "value": "指定返回哪一个值"
        }
    },
    "QUARTILE.INC": {
        "title": [
            {
                "name": "QUARTILE.INC(",
                "editor": false
            },
            {
                "name": "array",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "QUARTILE.INC(",
                "editor": false
            },
            {
                "name": "A2:A9",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "根据 0 到 1 之间的百分点值（包含 0 和 1）返回数据集的四分位数",
            "array": "要求得四分位数值的数组或数字型单元格区域",
            "value": "指定返回哪一个值"
        }
    },
    "QUOTIENT": {
        "title": [
            {
                "name": "QUOTIENT(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "QUOTIENT(",
                "editor": false
            },
            {
                "name": "5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回除法的整数部分",
            "value1": "被除数",
            "value2": "除数"
        }
    },
    "RADIANS": {
        "title": [
            {
                "name": "RADIANS(",
                "editor": false
            },
            {
                "name": "角度",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "RADIANS(",
                "editor": false
            },
            {
                "name": "270",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将度数转换为弧度",
            "tangle": "要转换的以度数表示的角度"
        }
    },
    "RAND": {
        "title": [
            {
                "name": "RAND(",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "RAND(",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回了一个大于等于 0 且小于 1 的平均分布的随机实数",
        }
    },
    "RANDBETWEEN": {
        "title": [
            {
                "name": "RANDBETWEEN(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "RANDBETWEEN(",
                "editor": false
            },
            {
                "name": "1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "100",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回位于两个指定数之间的一个随机整数。 每次计算工作表时都将返回一个新的随机整数",
            "value1": "将返回的最小整数",
            "value2": "将返回的最大整数"
        }
    },
    "RANK": {
        "title": [
            {
                "name": "RANK(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "array",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "RANK(",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A2:A6",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回一列数字的数字排位。 数字的排位是其相对于列表中其他值的大小",
            "value1": "要找到其排位的数字",
            "array": "数字列表的数组，对数字列表的引用",
            "value2": "一个指定数字排位方式的数字"
        }
    },
    "RANK.AVG": {
        "title": [
            {
                "name": "RANK.AVG(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "array",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "RANK.AVG(",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A2:A6",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回一列数字的数字排位：数字的排位是其大小与列表中其他值的比值；如果多个值具有相同的排位，则将返回平均排位",
            "value1": "要找到其排位的数字",
            "array": "数字列表的数组，对数字列表的引用",
            "value2": "一个指定数字排位方式的数字"
        }
    },
    "RANK.EQ": {
        "title": [
            {
                "name": "RANK.EQ(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "array",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "RANK.EQ(",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A2:A6",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回一列数字的数字排位。 其大小与列表中其他值相关；如果多个值具有相同的排位，则返回该组值的最高排位",
            "value1": "要找到其排位的数字",
            "array": "数字列表的数组，对数字列表的引用",
            "value2": "一个指定数字排位方式的数字"
        }
    },
    "RATE": {
        "title": [
            {
                "name": "RATE(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value4]",
                "editor": true,
                "index": 7
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value5]",
                "editor": true,
                "index": 9
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "RATE(",
                "editor": false
            },
            {
                "name": "A2*12",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value4]",
            //     "editor": true,
            //     "index":7
            // },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value5]",
            //     "editor": true,
            //     "index":9
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回每期年金的利率",
            "value1": "年金的付款总期数",
            "value2": "每期的付款金额，在年金周期内不能更改",
            "value3": "现值即一系列未来付款当前值的总和",
            "value4": "未来值，或在最后一次付款后希望得到的现金余额",
            "value5": "数字 0 或 1，用以指定各期的付款时间是在期初还是期末"
        }
    },
    "RECEIVED": {
        "title": [
            {
                "name": "RECEIVED(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "RECEIVED(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A5",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回一次性付息的有价证券到期收回的金额",
            "date1": "有价证券的结算日",
            "date2": "有价证券的到期日",
            "value1": "有价证券的投资额",
            "value2": "有价证券的贴现率"
        }
    },
    "REPLACE": {
        "title": [
            {
                "name": "REPLACE(",
                "editor": false
            },
            {
                "name": "文本1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "文本2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "REPLACE(",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'*'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "根据指定的字符数，REPLACE 将部分文本字符串替换为不同的文本字符串",
            "text1": "要替换其部分字符的文本",
            "value1": "文本1中要替换为 文本2 的字符位置",
            "value2": "文本1 中希望 REPLACE 使用 文本2 来进行替换的字符数",
            "text2": "将替换 文本1 中字符的文本"
        }
    },
    "REPT": {
        "title": [
            {
                "name": "REPT(",
                "editor": false
            },
            {
                "name": "text",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "REPT(",
                "editor": false
            },
            {
                "name": "'*_'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将文本重复一定次数",
            "text": "需要重复显示的文本",
            "value": "用于指定文本重复次数的正数"
        }
    },
    "RIGHT": {
        "title": [
            {
                "name": "RIGHT(",
                "editor": false
            },
            {
                "name": "text",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[数值]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "RIGHT(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "5",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "根据所指定的字符数返回文本字符串中最后一个或多个字符",
            "text": "包含要提取字符的文本字符串",
            "value": "指定希望 RIGHT 提取的字符数"
        }
    },
    "ROMAN": {
        "title": [
            {
                "name": "ROMAN(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ROMAN(",
                "editor": false
            },
            {
                "name": "499",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "0",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将阿拉伯数字转换为文字形式的罗马数字",
            "value1": "需要转换的阿拉伯数字",
            "value2": "一个数字, 指定所需的罗马数字类型"
        }
    },
    "ROUND": {
        "title": [
            {
                "name": "ROUND(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ROUND(",
                "editor": false
            },
            {
                "name": "2.15",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "函数将数字四舍五入到指定的位数",
            "value1": "要四舍五入的数字",
            "value2": "要进行四舍五入运算的位数"
        }
    },
    "ROUNDDOWN": {
        "title": [
            {
                "name": "ROUNDDOWN(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ROUND(",
                "editor": false
            },
            {
                "name": "3.2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "0",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "朝着零的方向将数字进行向下舍入",
            "value1": "要四舍五入的数字",
            "value2": "要进行四舍五入运算的位数"
        }
    },
    "ROUNDUP": {
        "title": [
            {
                "name": "ROUNDUP(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ROUNDUP(",
                "editor": false
            },
            {
                "name": "2.15",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "朝着远离 0（零）的方向将数字进行向上舍入",
            "value1": "要四舍五入的数字",
            "value2": "要进行四舍五入运算的位数"
        }
    },
    "ROW": {
        "title": [
            {
                "name": "ROW(",
                "editor": false
            },
            {
                "name": "区域",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ROW(",
                "editor": false
            },
            {
                "name": "C10",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回引用的行号",
            "area": "需要得到其行号的单元格或单元格区域"
        }
    },
    "ROWS": {
        "title": [
            {
                "name": "ROWS(",
                "editor": false
            },
            {
                "name": "array",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "ROW(",
                "editor": false
            },
            {
                "name": "C1:E4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回引用或数组的行数",
            "area": "需要得到其行数的数组、数组公式或对单元格区域的引用"
        }
    },
    "RRI": {
        "title": [
            {
                "name": "RRI(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "RRI(",
                "editor": false
            },
            {
                "name": "96",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "10000",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "11000",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回投资增长的等效利率",
            "value1": "投资的总期数",
            "value2": "投资的现值",
            "value3": "投资的未来值"
        }
    },
    "RSQ": {
        "title": [
            {
                "name": "RSQ(",
                "editor": false
            },
            {
                "name": "区域1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "区域2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "RSQ(",
                "editor": false
            },
            {
                "name": "A3:A9",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "B3:B9",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "通过 known_y's 和 known_x's 中的数据点返回皮尔生乘积矩相关系数的平方",
            "area1": "数组或数据点区域",
            "area2": "数组或数据点区域"
        }
    },
    "SEARCH": {
        "title": [
            {
                "name": "SEARCH(",
                "editor": false
            },
            {
                "name": "文本1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "文本2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[数值]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "SEARCH(",
                "editor": false
            },
            {
                "name": "'e'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "6",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "可在第二个文本字符串中查找第一个文本字符串，并返回第一个文本字符串的起始位置的编号，该编号从第二个文本字符串的第一个字符算起",
            "text1": "要查找的文本",
            "text2": "要在其中搜索 文本1 参数的值的文本",
            "value": "文本2 参数中从之开始搜索的字符编号"
        }
    },
    "SEC": {
        "title": [
            {
                "name": "SEC(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "SEC(",
                "editor": false
            },
            {
                "name": "45",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回角度的正割值",
            "value": "需要对其进行正割的角度 "
        }
    },
    "SECH": {
        "title": [
            {
                "name": "SECH(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "SECH(",
                "editor": false
            },
            {
                "name": "45",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回角度的双曲正割值",
            "value": "对应所需双曲正割值的角度，以弧度表示"
        }
    },
    "SECOND": {
        "title": [
            {
                "name": "SECOND(",
                "editor": false
            },
            {
                "name": "时间",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "SECOND(",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回时间值的秒数。 秒数是 0（零）到 59 范围内的整数",
            "time": "一个时间值，其中包含要查找的秒数"
        }
    },
    "SERIESSUM": {
        "title": [
            {
                "name": "SERIESSUM(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "array",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "SERIESSUM(",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "0",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4:A7",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回基于SERIES公式的幂级数之和",
            "value1": "幂级数的输入值",
            "value2": "value1 的首项乘幂",
            "value3": "级数中每一项的乘幂 n 的步长增加值",
            "array": "与 value1 的每个连续乘幂相乘的一组系数"
        }
    },
    "SHEET": {
        "title": [
            {
                "name": "SHEET(",
                "editor": false
            },
            {
                "name": "[值]",
                "editor": true,
                "index": 1
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [{
            "name": "SHEET(",
            "editor": false
        },
            {
                "name": "Table1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },],
        "content": {
            "abstract": "返回引用工作表的工作表编号",
            "value": "需要工作表编号的工作表或引用的名称"
        }
    },
    "SHEETS": {
        "title": [
            {
                "name": "SHEETS(",
                "editor": false
            },
            {
                "name": "[引用]",
                "editor": true,
                "index": 1
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "SHEETS(",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回引用中的工作表数",
            "reference": "引用是要了解其包含的工作表数的引用"
        }
    },
    "SIGN": {
        "title": [
            {
                "name": "SIGN(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "SIGN(",
                "editor": false
            },
            {
                "name": "10",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "确定数字的符号",
            "value": "任意实数"
        }
    },
    "SIN": {
        "title": [
            {
                "name": "SIN(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "SIN(",
                "editor": false
            },
            {
                "name": "PI()",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回已知角度的正弦",
            "value": "需要求正弦的角度，以弧度表示"
        }
    },
    "SINH": {
        "title": [
            {
                "name": "SINH(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "SINH(",
                "editor": false
            },
            {
                "name": "0.0342*1.03",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回数字的双曲正弦",
            "value": "任意实数"
        }
    },
    "SKEW": {
        "title": [
            {
                "name": "SKEW(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "SKEW(",
                "editor": false
            },
            {
                "name": "A2:A11",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2,...]",
            //     "editor": true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回分布的偏斜度",
            "value1": "任意实数",
            "value2": "任意实数,个数介于1到255之间"
        }
    },
    "SKEW.P": {
        "title": [
            {
                "name": "SKEW.P(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "SKEW(",
                "editor": false
            },
            {
                "name": "A2:A11",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2,...]",
            //     "editor": true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回基于样本总体的分布不对称度：表明分布相对于平均值的不对称程度",
            "value1": "任意实数",
            "value2": "任意实数,个数介于1到255之间"
        }
    },
    "SLN": {
        "title": [
            {
                "name": "SLN(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "SLN(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回一个期间内的资产的直线折旧",
            "value1": "资产原值",
            "value2": "折旧末尾时的值",
            "value3": "资产的折旧期数"
        }
    },
    "SLOPE": {
        "title": [
            {
                "name": "SLOPE(",
                "editor": false
            },
            {
                "name": "集合1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "集合2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "SLOPE(",
                "editor": false
            },
            {
                "name": "A3:A9",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "B3:B9",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回通过 集合1 和 集合2 中数据点的线性回归线的斜率",
            "set1": "数字型因变量数据点数组或单元格区域",
            "set2": "自变量数据点集合"
        }
    },
    "SMALL": {
        "title": [
            {
                "name": "SMALL(",
                "editor": false
            },
            {
                "name": "区域",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "SMALL(",
                "editor": false
            },
            {
                "name": "A2:A10",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回数据集中的第 k 个最小值",
            "area": "需要找到第 k 个最小值的数组或数值数据区域",
            "value": "要返回的数据在数组或数据区域里的位置"
        }
    },
    "SQRTPI": {
        "title": [
            {
                "name": "SQRTPI(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "SQRTPI(",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回某数与 pi 的乘积的平方根",
            "value": "与 pi 相乘的数"
        }
    },
    "STANDARDIZE": {
        "title": [
            {
                "name": "STANDARDIZE(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "STANDARDIZE(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回由 value2 和 value3 表示的分布的规范化值",
            "value1": "需要进行正态化的数值",
            "value2": "分布的算术平均值",
            "value3": "分布的标准偏差"
        }
    },
    "STDEVA": {
        "title": [
            {
                "name": "STDEVA(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "STDEVA(",
                "editor": false
            },
            {
                "name": "A3:A12",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[值2,...]",
            //     "editor": true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "根据样本估计标准偏差",
            "value1": "任意实数",
            "value2": "任意实数,个数介于1到255之间"
        }
    },
    "STDEVP": {
        "title": [
            {
                "name": "STDEVP(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "STDEVP(",
                "editor": false
            },
            {
                "name": "A3:A12",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[值2,...]",
            //     "editor": true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "根据作为参数给定的整个总体计算标准偏差",
            "value1": "任意实数",
            "value2": "任意实数,个数介于1到255之间"
        }
    },
    "STDEVPA": {
        "title": [
            {
                "name": "STDEVPA(",
                "editor": false
            },
            {
                "name": "值1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[值2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "STDEVPA(",
                "editor": false
            },
            {
                "name": "A3:A12",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[值2,...]",
            //     "editor": true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "根据作为参数（包括文字和逻辑值）给定的整个总体计算标准偏差",
            "value1": "任意值",
            "value2": "任意值,个数介于1到255之间"
        }
    },
    "STEYX": {
        "title": [
            {
                "name": "STEYX(",
                "editor": false
            },
            {
                "name": "区域1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "区域2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "STEYX(",
                "editor": false
            },
            {
                "name": "A3:A9",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "B3:B9",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回通过线性回归法预测每个 x 的 y 值时所产生的标准误差",
            "area1": "因变量数据点数组或区域",
            "area2": "自变量数据点数组或区域"
        }
    },
    "SUBSTITUTE": {
        "title": [
            {
                "name": "SUBSTITUTE(",
                "editor": false
            },
            {
                "name": "文本1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "文本2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "文本3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[事件]",
                "editor": true,
                "index": 7
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "SUBSTITUTE(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'销售额'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'成本'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "3",
                "editor": true,
                "index": 7
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "在文本字符串中用 文本3 替换 文本2",
            "text1": "需要替换其中字符的文本，或对含有文本（需要替换其中字符）的单元格的引用",
            "text2": "需要替换的文本",
            "text3": "用于替换 文本2 的文本",
            "event": "指定要用 文本3 替换 文本2 的事件"
        }
    },
    "SUBTOTAL": {
        "title": [
            {
                "name": "SUBTOTAL(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "区域1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[区域2]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "SUBTOTAL(",
                "editor": false
            },
            {
                "name": "9",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A2:A5",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "区域2",
            //     "editor": true,
            //     "index":5
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回列表或数据库中的分类汇总",
            "value": "数字 1-11 或 101-111，用于指定要为分类汇总使用的函数",
            "area1": "要对其进行分类汇总计算的第一个命名区域或引用",
            "area2": "要对其进行分类汇总计算的第 2 个至第 254 个命名区域或引用"
        }
    },
    "SUMIF": {
        "title": [
            {
                "name": "SUMIF(",
                "editor": false
            },
            {
                "name": "区域1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "条件",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[区域2]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "SUMIF(",
                "editor": false
            },
            {
                "name": "A2:A5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'>160000'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "B2:B5",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "对 范围 中符合指定条件的值求和",
            "area1": "要按条件计算的单元格区域",
            "condition": "定义哪些单元格将被添加的数字、表达式、单元格引用、文本或函数形式的条件",
            "area2": "要添加的实际单元格 (如果要添加的单元格不在range参数中指定的单元格)"
        }
    },
    "SUMIFS": {
        "title": [
            {
                "name": "SUMIFS(",
                "editor": false
            },
            {
                "name": "区域1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "条件1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[区域2,条件2,...]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "SUMIFS(",
                "editor": false
            },
            {
                "name": "A2:A5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'>160000'",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "B2:B5",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "对 范围 中符合指定条件的值求和",
            "area1": "要按条件计算的单元格区域",
            "condition1": "定义哪些单元格将被添加的数字、表达式、单元格引用、文本或函数形式的条件",
            "condition2": "其他的区域,条件对"
        }
    },
    "SUMPRODUCT": {
        "title": [
            {
                "name": "SUMPRODUCT(",
                "editor": false
            },
            {
                "name": "array1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[array2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "SUMPRODUCT(",
                "editor": false
            },
            {
                "name": "A1:D1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A2:D2",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "对给定数组中的相应组件执行简单的算术运算, 并返回这些计算的和",
            "array1": "其相应元素需要进行相乘并求和的第一个数组参数",
            "array2": " 2 到 255 个数组参数，其相应元素需要进行相乘并求和"
        }
    },
    "SUMSQ": {
        "title": [
            {
                "name": "SUMSQ(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "SUMSQ(",
                "editor": false
            },
            {
                "name": "3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "4",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回参数的平方和",
            "value1": "任意实数",
            "value2": "任意实数,个数介于1到255之间"
        }
    },
    "SUMX2MY2": {
        "title": [
            {
                "name": "SUMX2MY2(",
                "editor": false
            },
            {
                "name": "区域1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "区域2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "SUMX2MY2(",
                "editor": false
            },
            {
                "name": "A2:A8",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "B2:B8",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回两数组中对应数值的平方差之和",
            "area1": " 第一个数组或数值区域",
            "area2": " 第而个数组或数值区域"
        }
    },
    "SUMX2PY2": {
        "title": [
            {
                "name": "SUMX2PY2(",
                "editor": false
            },
            {
                "name": "区域1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "区域2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "SUMX2PY2(",
                "editor": false
            },
            {
                "name": "A2:A8",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "B2:B8",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回两数组中对应值的平方和之和",
            "area1": " 第一个数组或数值区域",
            "area2": " 第而个数组或数值区域"
        }
    },
    "SUMXMY2": {
        "title": [
            {
                "name": "SUMXMY2(",
                "editor": false
            },
            {
                "name": "区域1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "区域2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "SUMXMY2(",
                "editor": false
            },
            {
                "name": "A2:A8",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "B2:B8",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回两数组中对应数值之差的平方和",
            "area1": " 第一个数组或数值区域",
            "area2": " 第而个数组或数值区域"
        }
    },
    "SWITCH": {
        "title": [
            {
                "name": "SWITCH(",
                "editor": false
            },
            {
                "name": "表达式",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "值1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "结果1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[值2,结果2,...]",
                "editor": true,
                "index": 7
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "SWITCH(",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'星期天'",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[值2,结果2,...]",
            //     "editor": true,
            //     "index":7
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "函数根据值列表计算一个值（称为表达式），并返回与第一个匹配值对应的结果",
            "formula": "用来比较的值",
            "value1": "任意值",
            "result1": "值1 与 表达式 匹配后返回的值",
            "result2": "其他值与结果对,最多125个"
        }
    },
    "SYD": {
        "title": [
            {
                "name": "SYD(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "SYD(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回在指定期间内资产按年限总和折旧法计算的折旧",
            "value1": "资产原值",
            "value2": "折旧末尾时的值",
            "value3": "资产的折旧期数",
            "value4": "期间，必须与 value3 使用相同的单位"
        }
    },
    "T": {
        "title": [
            {
                "name": "T(",
                "editor": false
            },
            {
                "name": "值",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "T(",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回值引用的文字",
            "value": "要测试的值"
        }
    },
    "TAN": {
        "title": [
            {
                "name": "TAN(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "TAN(",
                "editor": false
            },
            {
                "name": "0.785",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回已知角度的正切",
            "value": "要求正切的角度，以弧度表示"
        }
    },
    "TANH": {
        "title": [
            {
                "name": "TANH(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "TAN(",
                "editor": false
            },
            {
                "name": "-2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回数字的双曲正切",
            "value": "任意实数"
        }
    },
    "TBILLEQ": {
        "title": [
            {
                "name": "TBILLEQ(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "TBILLEQ(",
                "editor": false
            },
            {
                "name": "A1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回国库券的等效收益率",
            "date1": "国库券的结算日",
            "date2": "国库券的到期日",
            "value": "国库券的贴现率"
        }
    },
    "TBILLPRICE": {
        "title": [
            {
                "name": "TBILLPRICE(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "TBILLPRICE(",
                "editor": false
            },
            {
                "name": "A1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回面值 ￥100 的国库券的价格",
            "date1": "国库券的结算日",
            "date2": "国库券的到期日",
            "value": "国库券的贴现率"
        }
    },
    "TBILLYIELD": {
        "title": [
            {
                "name": "TBILLYIELD(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "TBILLYIELD(",
                "editor": false
            },
            {
                "name": "A1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回国库券的收益率",
            "date1": "国库券的结算日",
            "date2": "国库券的到期日",
            "value": "面值 ￥100 的国库券的价格"
        }
    },
    "T.DIST": {
        "title": [
            {
                "name": "T.DIST(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "T.DIST(",
                "editor": false
            },
            {
                "name": "60",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "TRUE",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回学生的左尾 t 分布。 t 分布用于小型样本数据集的假设检验",
            "value1": "需要计算分布的数值",
            "value2": "一个表示自由度数的整数",
            "value3": "决定函数形式的逻辑值"
        }
    },
    "T.DIST.RT": {
        "title": [
            {
                "name": "T.DIST.RT(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "T.DIST.RT(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "t 分布用于小型样本数据集的假设检验",
            "value1": "需要计算分布的数值",
            "value2": "一个表示自由度数的整数"
        }
    },
    "TEXT": {
        "title": [
            {
                "name": "TEXT(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "text",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [{
            "name": "TEXT(",
            "editor": false
        },
            {
                "name": "1234.567",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "'$#,##0.00'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },],
        "content": {
            "abstract": "函数可通过格式代码向数字应用格式，进而更改数字的显示方式",
            "value": "要转换为文本的数值",
            "text": "一个文本字符串，定义要应用于所提供值的格式"
        }
    },
    "TIME": {
        "title": [
            {
                "name": "TIME(",
                "editor": false
            },
            {
                "name": "时",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "分",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "秒",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "TIME(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "B2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "C2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回特定时间的十进制数字",
            "hour": "0（零）到 32767 之间的数字，代表小时",
            "minute": " 0 到 32767 之间的数字，代表分钟",
            "second": "0 到 32767 之间的数字，代表秒"
        }
    },
    "TIMEVALUE": {
        "title": [
            {
                "name": "TIMEVALUE(",
                "editor": false
            },
            {
                "name": "text",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "TIMEVALUE(",
                "editor": false
            },
            {
                "name": "'2:24 AM'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回由文本字符串表示的时间的十进制数字",
            "text": "一个文本字符串，代表以任一 Microsoft Excel 时间格式表示的时间"
        }
    },
    "T.INV": {
        "title": [
            {
                "name": "T.INV(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "T.INV(",
                "editor": false
            },
            {
                "name": "0.75",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回学生的 t 分布的左尾反函数",
            "value1": "与学生的 t 分布相关的概率",
            "value2": "与学生的 t 分布相关的概率"
        }
    },
    "TODAY": {
        "title": [
            {
                "name": "TODAY(",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "TODAY(",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回当前日期的序列号",
        }
    },
    "TRANSPOSE": {
        "title": [
            {
                "name": "TRANSPOSE(",
                "editor": false
            },
            {
                "name": "array",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "TRANSPOSE(",
                "editor": false
            },
            {
                "name": "A1:F6",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "可返回转置单元格区域，即将行单元格区域转置成列单元格区域，反之亦然",
            "array": "要转置的工作表上的数组或单元格区域"
        }
    },
    "TREND": {
        "title": [
            {
                "name": "TREND(",
                "editor": false
            },
            {
                "name": "集合1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[集合2]",
                "editor": true,
                "index": 3
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value1]",
                "editor": true,
                "index": 5
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 7
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "TREND(",
                "editor": false
            },
            {
                "name": "E2:E13",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "D2:D13",
                "editor": true,
                "index": 3
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value1]",
            //     "editor": true,
            //     "index":5
            // },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2]",
            //     "editor": true,
            //     "index":7
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "函数返回沿线性趋势的值",
            "set1": "关系 y = mx + b 中已知道的 y 值集",
            "set2": "在关系 y = mx + b 中可能已经知道的一组可选 x 值",
            "value1": "要返回其趋势的新 x 值返回对应的 y 值",
            "value2": "一个逻辑值, 指定是否强制常量 b 等于0"
        }
    },
    "TRIMMEAN": {
        "title": [
            {
                "name": "TRIMMEAN(",
                "editor": false
            },
            {
                "name": "array",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "TRIMMEAN(",
                "editor": false
            },
            {
                "name": "A2:A12",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "0.2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回数据集的内部平均值",
            "array": "需要进行整理并求平均值的数组或数值区域",
            "value": "从计算中排除数据点的分数"
        }
    },
    "TRUE": {
        "title": [
            {
                "name": "TRUE(",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "TRUE(",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回逻辑值 TRUE",
        }
    },
    "TRUNC": {
        "title": [
            {
                "name": "TRUNC(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "TRUNC(",
                "editor": false
            },
            {
                "name": "8.9",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2]",
            //     "editor": true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将数字的小数部分截去，返回整数",
            "value1": "需要截尾取整的数字",
            "value2": "用于指定取整精度的数字,默认为零"
        }
    },
    "T.TEST": {
        "title": [
            {
                "name": "T.TEST(",
                "editor": false
            },
            {
                "name": "数据集1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "数据集2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "T.TEST(",
                "editor": false
            },
            {
                "name": "A2:A10",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "B2:B10",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回与学生 t-检验相关的概率",
            "dataset1": "第一个数据集",
            "dataset2": "第二个数据集",
            "value1": "指定分布尾数",
            "value2": "要执行的 t 检验的类型"
        }
    },
    "TYPE": {
        "title": [
            {
                "name": "TYPE(",
                "editor": false
            },
            {
                "name": "值",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "TYPE(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回数值的类型",
            "value": "需要返回值类型的值"
        }
    },
    "UNICHAR": {
        "title": [
            {
                "name": "UNICHAR(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "UNICHAR(",
                "editor": false
            },
            {
                "name": "32",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回给定数值引用的 Unicode 字符",
            "value": "代表字符的 Unicode 数字"
        }
    },
    "UNICODE": {
        "title": [
            {
                "name": "UNICODE(",
                "editor": false
            },
            {
                "name": "text",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "UNICODE(",
                "editor": false
            },
            {
                "name": "'B'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回对应于文本的第一个字符的数字（代码点）",
            "text": "要获得其 Unicode 值的字符"
        }
    },
    "UNIQUE": {
        "title": [
            {
                "name": "UNIQUE(",
                "editor": false
            },
            {
                "name": "array",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value1]",
                "editor": true,
                "index": 3
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "UNIQUE(",
                "editor": false
            },
            {
                "name": "D2:D11",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value1]",
            //     "editor": true,
            //     "index":3
            // },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2]",
            //     "editor": true,
            //     "index":5
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "函数返回列表或范围中的一系列唯一值",
            "array": "要从其中返回唯一值的范围或数组",
            "value1": "为逻辑值，用于指示比较方式；By row = FALSE 或省略；By column = TRUE",
            "value2": "为逻辑值：仅返回出现一次的唯一值 = TRUE；包含所有唯一值 = FALSE 或省略"
        }
    },
    "UPPER": {
        "title": [
            {
                "name": "UPPER(",
                "editor": false
            },
            {
                "name": "text",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "UPPER(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将文本转换为大写字母",
            "text": "要转换为大写字母的文本。 文本可以是引用或文本字符串"
        }
    },
    "VALUE": {
        "title": [
            {
                "name": "VALUE(",
                "editor": false
            },
            {
                "name": "text",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "VALUE(",
                "editor": false
            },
            {
                "name": "'$1,000'",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "将表示数字的文本字符串转换为数字",
            "text": "用引号括起来的文本或包含要转换文本的单元格的引用"
        }
    },
    "VAR": {
        "title": [
            {
                "name": "VAR(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "VAR(",
                "editor": false
            },
            {
                "name": "A2:A11",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2,...]",
            //     "editor": true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "计算基于给定样本的方差",
            "value1": "对应于总体样本的第一个数值参数",
            "value2": "对应于总体样本的 2 到 255 个数值参数"
        }
    },
    "VAR.P": {
        "title": [
            {
                "name": "VAR.P(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "VAR.P(",
                "editor": false
            },
            {
                "name": "A2:A11",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2,...]",
            //     "editor": true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "计算基于整个样本总体的方差（忽略样本总体中的逻辑值和文本）",
            "value1": "对应于总体样本的第一个数值参数",
            "value2": "对应于总体样本的 2 到 255 个数值参数"
        }
    },
    "VARA": {
        "title": [
            {
                "name": "VARA(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "VARA(",
                "editor": false
            },
            {
                "name": "A2:A11",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2,...]",
            //     "editor": true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "计算基于给定样本的方差",
            "value1": "对应于总体样本的第一个数值参数",
            "value2": "对应于总体样本的 2 到 255 个数值参数"
        }
    },
    "VAR.S": {
        "title": [
            {
                "name": "VAR.S(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "VAR.S(",
                "editor": false
            },
            {
                "name": "A2:A11",
                "editor": false
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2,...]",
            //     "editor": true,
            //     "index":3
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "估算基于样本的方差",
            "value1": "对应于总体样本的第一个数值参数",
            "value2": "对应于总体样本的 2 到 255 个数值参数"
        }
    },
    "VDB": {
        "title": [
            {
                "name": "VDB(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value4]",
                "editor": true,
                "index": 11
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value5]",
                "editor": true,
                "index": 13
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "VDB(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "0",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "0.875",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "1.5",
                "editor": true,
                "index": 11
            },
            // {
            //     "name": ",",
            //     "editor": false
            // },
            // {
            //     "name": "[value2]",
            //     "editor": true,
            //     "index":13
            // },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "使用双倍余额递减法或其他指定方法，返回一笔资产在给定期间（包括部分期间）内的折旧值",
            "value1": "资产原值",
            "value2": "折旧末尾时的值",
            "value3": "资产的折旧期数",
            "date1": "您要计算折旧的起始时期",
            "date2": "您要计算折旧的终止时期",
            "value4": "余额递减速率",
            "value5": "逻辑值，指定当折旧值大于余额递减计算值时，是否转用直线折旧法"
        }
    },
    "VLOOKUP": {
        "title": [
            {
                "name": "VLOOKUP(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "区域1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value3]",
                "editor": true,
                "index": 7
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "VLOOKUP(",
                "editor": false
            },
            {
                "name": "B3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "B2:E7",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "FALSE",
                "editor": true,
                "index": 7
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "在表格或区域中按行查找项目",
            "value1": "要查找的值",
            "area1": "搜索 value1 和返回值的单元格区域",
            "value2": "包含返回值的列号",
            "value3": "一个逻辑值，该值指定希望 VLOOKUP 查找近似匹配还是精确匹配"
        }
    },
    "WEEKDAY": {
        "title": [
            {
                "name": "WEEKDAY(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "WEEKDAY(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "3",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回对应于某个日期的一周中的第几天",
            "value1": "一个序列号，代表尝试查找的那一天的日期",
            "value2": "用于确定返回值类型的数字"
        }
    },
    "WEEKNUM": {
        "title": [
            {
                "name": "WEEKNUM(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "WEEKNUM(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "3",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回特定日期的周数",
            "value1": "代表一周中的日期",
            "value2": "一数字，确定星期从哪一天开始"
        }
    },
    "WEIBULL": {
        "title": [
            {
                "name": "WEIBULL(",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "WEIBULL(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "TRUE",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回 Weibull 分布",
            "value1": "用来计算函数的值",
            "value2": "分布参数",
            "value3": "分布参数",
            "value4": "确定函数的形式"
        }
    },
    "WORKDAY": {
        "title": [
            {
                "name": "WORKDAY(",
                "editor": false
            },
            {
                "name": "日期",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[数组]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "WORKDAY(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4:A6",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回在某日期（起始日期）之前或之后、与该日期相隔指定工作日的某一日期的日期值",
            "date": "一个代表开始日期的日期",
            "value": "日期 之前或之后不含周末及节假日的天数",
            "array": "一个可选列表，其中包含需要从工作日历中排除的一个或多个日期，例如各种省/市/自治区和国家/地区的法定假日及非法定假日"
        }
    },
    "WORKDAY.INTL": {
        "title": [
            {
                "name": "WORKDAY.INTL(",
                "editor": false
            },
            {
                "name": "日期",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[数组]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "WORKDAY.INTL(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4:A6",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回指定的若干个工作日之前或之后的日期的序列号（使用自定义周末参数）",
            "date": "开始日期",
            "value": "日期 之前或之后不含周末及节假日的天数",
            "array": "指示一周中属于周末的日子和不作为工作日的日子"
        }
    },
    "XIRR": {
        "title": [
            {
                "name": "XIRR(",
                "editor": false
            },
            {
                "name": "array1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "array2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[数值]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "XIRR(",
                "editor": false
            },
            {
                "name": "A3:A7",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "B3:B7",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "0.1",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回一组不一定定期发生的现金流的内部收益率",
            "array1": "与 array2 中的支付时间相对应的一系列现金流",
            "array2": "与现金流支付相对应的支付日期表",
            "value": "对函数 XIRR 计算结果的估计值"
        }
    },
    "XNPV": {
        "title": [
            {
                "name": "XNPV(",
                "editor": false
            },
            {
                "name": "value",
                "editor": false,
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "array1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "array2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "XNPV(",
                "editor": false
            },
            {
                "name": ".09",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "B3:B7",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A2:A6",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回一组现金流的净现值，这些现金流不一定定期发生",
            "value": "对函数 XIRR 计算结果的估计值",
            "array1": "与 array2 中的支付时间相对应的一系列现金流",
            "array2": "与现金流支付相对应的支付日期表",
        }
    },
    "XOR": {
        "title": [
            {
                "name": "XOR(",
                "editor": false
            },
            {
                "name": "条件1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[条件2,...]",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "XOR(",
                "editor": false
            },
            {
                "name": "(3>0",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "2<9",
                "editor": true,
                "index": 3
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回所有参数的逻辑异或",
            "condition1": "计算值为TRUE或FALSE",
            "condition2": "要检验的 1 至 254 个条件，可为 TRUE 或 FALSE，且可为逻辑值、数组或引用"
        }
    },
    "YEAR": {
        "title": [
            {
                "name": "YEAR(",
                "editor": false
            },
            {
                "name": "日期",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "YEAR(",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回对应于某个日期的年份",
            "date": "要查找的年份的日期"
        }
    },
    "YEARFRAC": {
        "title": [
            {
                "name": "YEARFRAC(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "YEARFRAC(",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "可计算两个日期（日期1 和 日期2）之间的天数",
            "date1": "一个代表开始日期的日期",
            "date2": "一个代表终止日期的日期"
        }
    },
    "YIELD": {
        "title": [
            {
                "name": "YIELD(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value4",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "YIELD(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A6",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A7",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回定期支付利息的债券的收益",
            'date1': "有价证券的结算日",
            "date2": "有价证券的到期日",
            "value1": "有价证券的年息票利率",
            "value2": "有价证券的价格",
            "value3": "面值 ￥100 的有价证券的清偿价值",
            "value4": "年付息次数"
        }
    },
    "YIELDDISC": {
        "title": [
            {
                "name": "YIELDDISC(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "YIELDDISC(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A5",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回折价发行的有价证券的年收益率",
            "date1": "有价证券的结算日",
            "date2": "有价证券的到期日",
            "value1": "有价证券的价格（按面值为 ￥100 计算）",
            "value2": "面值 ￥100 的有价证券的清偿价值",
        }
    },
    "YIELDMAT": {
        "title": [
            {
                "name": "YIELDMAT(",
                "editor": false
            },
            {
                "name": "日期1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "日期3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value2",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "YIELDMAT(",
                "editor": false
            },
            {
                "name": "A2",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A3",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A5",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "A6",
                "editor": false
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回到期付息的有价证券的年收益率",
            "date1": "有价证券的结算日",
            "date2": "有价证券的到期日",
            "date3": "有价证券的发行日，以时间序列号表示",
            "value1": "有价证券在发行日的利率",
            "value2": "有价证券的价格"
        }
    },
    "Z.TEST": {
        "title": [
            {
                "name": "Z.TEST(",
                "editor": false
            },
            {
                "name": "区域",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "value1",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "[value2]",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "example": [
            {
                "name": "Z.TEST(",
                "editor": false
            },
            {
                "name": "A2:A11",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "4",
                "editor": false
            },
            {
                "name": ",",
                "editor": false
            },
            {
                "name": "6",
                "editor": true,
                "index": 5
            },
            {
                "name": ")",
                "editor": false
            },
        ],
        "content": {
            "abstract": "返回 z 检验的单尾 P 值",
            "area": "用来检验 x 的数组或数据区域",
            "value1": "要测试的值",
            "value2": "总体（已知）标准偏差。 如果省略，则使用样本标准偏差"
        }
    },
};


const isSheetVale = (str) => {
    str = str.toUpperCase();
    if (str.search(/[\u4E00-\u9FA50-9a-zA-Z]+![A-Za-z]+\$\d+/) !== -1)
        return true;
    if (str.search(/[\u4E00-\u9FA50-9a-zA-Z]+!\$[A-Za-z]+\d+/) !== -1)
        return true;
    if (str.search(/[\u4E00-\u9FA50-9a-zA-Z]+!\$[A-Za-z]+\$\d+/) !== -1)
        return true;
    // if (str.search(/[\u4E00-\u9FA50-9a-zA-Z]+![A-Za-z]+\d+/) !== -1)
    //     return true;
    return str.search(/[\u4E00-\u9FA50-9a-zA-Z]+![A-Za-z]+\d+/) !== -1;
};


function angleFunc(start, end) {
    let diff_x = end.x - start.x,
        diff_y = end.y - start.y;
    return 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
}

const positionAngle = (x1, x2, y1, y2) => {
    let angle = 0;
    let af = Math.abs(angleFunc({x: x1, y: y1}, {x: x2, y: y2}));

    if (x1 < x2 && y1 < y2) {
        angle = 1;
    } else if (x1 > x2 && y1 < y2) {
        angle = 2;
    } else if (x1 < x2 && y1 > y2) {
        angle = 3;
    } else if (x1 > x2 && y1 > y2) {
        angle = 4;
    }

    if (angle === 1 && af < 45) {
        angle = 3;
        return angle;
    } else if (angle === 2 && af > 30) {
        angle = 1;
        return angle;
    } else if (angle === 3 && af > 30) {
        angle = 4;
        return angle;
    } else if (angle === 4 && af < 45) {
        angle = 2;
        return angle;
    }

    // if (angle === 2) {
    //     let s1 = h('div', '').css('border', '1px solid').css('height', '1px').css('width', '1px');
    //     let s2 = h('div', '').css('border', '1px solid').css('height', '1px').css('width', '1px');
    //     document.body.appendChild(s1.el);
    //     document.body.appendChild(s2.el);
    //     debugger
    // }
    return angle;
};

const isAbsoluteValue = (str, rule = 1) => {
    str = str.toUpperCase();
    if (rule === 1) {
        if (str.search(/^\$[A-Z]+\$\d+$/) !== -1)
            return 3;
        if (str.search(/^\$[A-Z]+\d+$/) !== -1)
            return 1;
        if (str.search(/^[A-Z]+\$\d+$/) !== -1)
            return 2;
        return false;
    } else if (rule === 3) {
        if (str.search(/^\$[A-Z]+\$\d+$/) !== -1)
            return true;
        if (str.search(/^[A-Z]+\d+$/) !== -1)
            return true;
        if (str.search(/^\$[A-Z]+\d+$/) !== -1)
            return true;

        return str.search(/^[A-Z]+\$\d+$/) !== -1;
    } else if (rule === 4) {
        if (str.search(/^[A-Za-z]+\d+:[A-Za-z]+\d+$/) !== -1)
            return true;
    } else if (rule === 5) {
        if (str.search(/^[A-Z]+\d+:\$[A-Z]+\d+$/) !== -1) {
            return 8;
        }
        if (str.search(/^[A-Z]+\d+:[A-Z]+\$\d+$/) !== -1) {
            return 9;
        }
        if (str.search(/^[A-Z]+\$\d+:[A-Z]+\d+$/) !== -1) {
            return 10;
        }
        if (str.search(/^\$[A-Z]+\d+:[A-Z]+\d+$/) !== -1) {
            return 11;
        }
        if (str.search(/^\$[A-Z]+\$\d+$/) !== -1)
            return 3;
        if (str.search(/^[A-Z]+\d+$/) !== -1)
            return 12;
        if (str.search(/^[A-Z]+\d+:[A-Z]+\d+$/) !== -1)
            return 13;
        if (str.search(/^\$[A-Z]+\d+$/) !== -1)
            return 1;
        if (str.search(/^[A-Z]+\$\d+$/) !== -1)
            return 2;
        if (str.search(/^[A-Z]+\$\d+:[A-Z]+\$\d+$/) !== -1) {
            return 4;
        }
        if (str.search(/^[A-Z]+\$\d+:\$[A-Z]+\d+$/) !== -1) {
            return 5;
        }
        if (str.search(/^\$[A-Z]+\d+:[A-Z]+\$\d+$/) !== -1) {
            return 6;
        }
        if (str.search(/^\$[A-Z]+\d+:\$[A-Z]+\d+$/) !== -1) {
            return 7;
        }
        return false
    } else if (rule === 6) {
        str = str.replace(/\$/g, '');
        return str.search(/^[A-Za-z]+\d+:[A-Za-z]+\d+$/) !== -1;
    } else {
        if (str.search(/^[A-Za-z]+\d+$/) !== -1)
            return true;

        return str.search(/^[A-Za-z]+\d+:[A-Za-z]+\d+$/) !== -1;
    }
};

const splitStr = (str) => {
    let arr = str.split(/([(-\/,+，*\s=^&])/);
    let arr2 = [];
    for (let i = 0; i < arr.length; i++) {
        let enter = 1;
        if (arr.length > i + 1) {
            let s2 = arr[i + 1];
            if (arr[i] === "(") {
                enter = 3;
            } else if (s2.indexOf("(") !== -1) {
                enter = 2;
            }
        }

        if (enter !== 3) {
            if (enter === 2) {
                arr2.push(arr[i] + "(");
            } else {
                arr2.push(arr[i]);
            }
        }
    }


    return arr2;
};

const cutting2 = (str) => {
    let arr = str.split(/([(-\/,+，*\s=^&])/);

    let color = 0;
    let express = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i]) {
            express.push(arr[i]);
        }
    }

    let colors = [];
    for (let i = 0; i < express.length; i++) {
        let s = express[i].toUpperCase();
        let enter = true;
        if (express.length > i + 1) {
            let s2 = express[i + 1];
            if (s2.indexOf("(") !== -1) {
                enter = false;
            }
        }

        if ((s.search(/^[A-Z]+\d+$/) !== -1
                || s.search(/^\$[A-Z]+\$\d+$/) !== -1
                || s.search(/^[A-Z]+\$\d+$/) !== -1 || s.search(/^\$[A-Z]+\d+$/) !== -1
                || s.search(/^[A-Za-z]+\d+:[A-Za-z]+\d+$/) !== -1) && enter) {
            for (let i2 = 0; i2 < express[i].length; i2++)
                colors.push({
                    "code": color,
                    "data": express[i][i2],
                });
            color = color + 1;
        } else {
            let sc = s.replace(/\$/g, "");
            if (sc.search(/^[A-Za-z]+\d+:[A-Za-z]+\d+$/) !== -1 && enter) {
                for (let i2 = 0; i2 < express[i].length; i2++)
                    colors.push({
                        "code": color,
                        "data": express[i][i2],
                    });
                color = color + 1;
            } else {
                for (let i2 = 0; i2 < express[i].length; i2++)
                    colors.push({
                        "code": -1,
                        "data": express[i][i2],
                    });
            }
        }

    }

    return colors;
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

export {
    operator,
    operation,
    cutStr,
    cutting,
    cutting2,
    isAbsoluteValue,
    cuttingByPos,
    helpFormula,
    cutFirst,
    operation3,
    cuttingByPosEnd,
    changeFormula,
    value2absolute,
    splitStr,
    isSheetVale,
    cuttingByPosEnd2,
    cuttingByPos2,
    positionAngle,
    deepCopy,
}
