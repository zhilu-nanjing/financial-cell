// jobs: todo: 正则表达式可以统一放到utils/reg_pattern.js文件中去
export const logicOperator = "([(-\\/,+*，=^&])";
export const blankOperator = "(^\\s*)|(\\s*$)";
export const letterOperator = "^[A-Z]+\\d+$";
export const letterOperatorIgnoreBracket = "^[A-Z]+\\d+$";
export const letterOperatorWithDollor = "^\\$[A-Z]+\\$\\d+$";
export const letterAndLetterOperator = "^[A-Za-z]+\\d+:[A-Za-z]+\\d+$";
export const letterOperatorWithDollorEnd = "^[A-Z]+\\$\\d+$";
export const letterOperatorWithDollorPrex = "^\\$[A-Z]+\\d+$";

export const datePattern = ["^(\\d{4})[-\/](\\d{1,2})[-\/](\\d{1,2})$", "^(\\d{4})年(\\d{1,2})月(\\d{1,2})日$"];
export const datePattern2 = ((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))

export function str2Re(str) {
    let re = new RegExp(str, 'g');

    return re;
}
