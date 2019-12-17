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
